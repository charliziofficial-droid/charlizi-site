// functions/api/inquiry.ts
// Cloudflare Pages Function — 接收询盘表单提交
// 职责：校验 -> 写飞书多维表格 -> 写 JSON 备份(R2/KV 可选) -> 返回结果
//
// 环境变量（在 Cloudflare Pages 项目 Settings > Environment variables 配置）：
//   FEISHU_APP_ID       飞书应用 App ID
//   FEISHU_APP_SECRET   飞书应用 App Secret
//   FEISHU_BITABLE_APP  Bitable app_token   (J1aqbSMEKaL9ausJLBkcJncxnQe)
//   FEISHU_TABLE_ID     Bitable table_id    (tblezJ4xmsUfeFaS)
//   BACKUP_KV           可选，KV namespace 绑定，用于 JSON 备份

interface Env {
  FEISHU_APP_ID?: string;
  FEISHU_APP_SECRET?: string;
  FEISHU_BITABLE_APP?: string;
  FEISHU_TABLE_ID?: string;
  BACKUP_KV?: KVNamespace;
  INQUIRY_RATE_LIMIT?: KVNamespace;
  TURNSTILE_SECRET?: string;
}

const ALLOWED_ORIGINS = ['https://charlizi.com', 'https://www.charlizi.com'];

// --- Anti-abuse limits -------------------------------------------------------
const MAX_BODY_BYTES = 32 * 1024; // 32 KB cap, blocks oversized payloads
const RATE_WINDOW_SEC = 3600; // 1 hour
const RATE_MAX_PER_IP = 5; // max submissions per IP per hour
const RATE_MAX_PER_EMAIL = 3; // max submissions per email per hour
const MIN_FILL_MS = 2500; // humans take >2.5s to fill the form

function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || '0.0.0.0';
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Returns true when the caller is over the limit. Fails open on KV errors. */
async function isRateLimited(
  kv: KVNamespace | undefined,
  ip: string,
  email: string
): Promise<boolean> {
  if (!kv) return false;
  try {
    const ipKey = `rl:ip:${await sha256Hex(ip)}`;
    const mailKey = `rl:em:${await sha256Hex(email.toLowerCase())}`;
    const [ipRaw, mailRaw] = await Promise.all([kv.get(ipKey), kv.get(mailKey)]);
    const ipCount = Number(ipRaw || 0);
    const mailCount = Number(mailRaw || 0);
    if (ipCount >= RATE_MAX_PER_IP || mailCount >= RATE_MAX_PER_EMAIL) return true;
    await Promise.all([
      kv.put(ipKey, String(ipCount + 1), { expirationTtl: RATE_WINDOW_SEC }),
      kv.put(mailKey, String(mailCount + 1), { expirationTtl: RATE_WINDOW_SEC }),
    ]);
    return false;
  } catch {
    return false;
  }
}

/** Optional Cloudflare Turnstile check; skipped when no secret is configured. */
async function verifyTurnstile(
  secret: string | undefined,
  token: string,
  ip: string
): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data: any = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}

/** Strip control chars that could poison downstream systems. */
function clean(v: unknown, max = 2000): string {
  return String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim();
}

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status: number, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });
}

/** 获取飞书 tenant_access_token（有效期约 2 小时） */
async function getTenantToken(appId: string, appSecret: string): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const data: any = await res.json();
  if (!data.tenant_access_token) {
    throw new Error(`feishu token failed: ${data.code} ${data.msg}`);
  }
  return data.tenant_access_token;
}

/** 写入多维表格一行 */
async function addBitableRecord(
  token: string,
  appToken: string,
  tableId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ fields }),
  });
  const data: any = await res.json();
  if (data.code !== 0) {
    throw new Error(`bitable insert failed: ${data.code} ${data.msg}`);
  }
}

const s = (v: unknown, max = 2000): string => String(v ?? '').slice(0, max).trim();

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, { headers: corsHeaders(request.headers.get('Origin')) });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get('Origin');
  const cors = corsHeaders(origin);

  // --- 0. Origin allowlist: reject cross-site form posts ---
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return json({ ok: false, error: 'forbidden_origin' }, 403, cors);
  }

  // --- 1. Body size cap (cheap DoS / log-flood guard) ---
  const declaredLen = Number(request.headers.get('Content-Length') || 0);
  if (declaredLen > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'payload_too_large' }, 413, cors);
  }

  let payload: Record<string, unknown>;
  try {
    const ct = request.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ ok: false, error: 'payload_too_large' }, 413, cors);
      }
      payload = JSON.parse(raw);
    } else {
      const fd = await request.formData();
      payload = Object.fromEntries(fd.entries());
    }
  } catch {
    return json({ ok: false, error: 'invalid_payload' }, 400, cors);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json({ ok: false, error: 'invalid_payload' }, 400, cors);
  }

  const ip = clientIp(request);

  // --- 2. Honeypot: bots fill hidden fields humans never see ---
  const honeypot = clean(payload._hp ?? payload.website_url ?? '', 200);
  if (honeypot) {
    // Pretend success so the bot does not retry with a different strategy.
    return json({ ok: true, id: Date.now() }, 200, cors);
  }

  // --- 3. Timing check: instant submits are scripted ---
  const elapsed = Number(payload._t ?? 0);
  if (elapsed > 0 && elapsed < MIN_FILL_MS) {
    return json({ ok: true, id: Date.now() }, 200, cors);
  }

  // --- 4. Human challenge (only enforced when Turnstile is configured) ---
  const turnstileToken = clean(payload.cf_turnstile_response ?? payload['cf-turnstile-response'] ?? '', 4000);
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET, turnstileToken, ip))) {
    return json({ ok: false, error: 'challenge_failed' }, 403, cors);
  }

  // 关键字段校验——与前端 required 保持一致
  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const company = clean(payload.company, 200);
  const phone = clean(payload.phone ?? payload.whatsapp, 60);
  const category = clean(payload.category, 100);
  const quantity = clean(payload.quantity, 60);
  const market = clean(payload.market, 100);
  const paymentMethod = clean(payload.payment_method, 100);
  const paymentDetail = clean(payload.payment_method_detail, 200);
  const source = clean(payload.source, 100);
  const sourceDetail = clean(payload.source_detail, 200);
  const message = clean(payload.message, 5000);

  const missing: string[] = [];
  if (!name) missing.push('name');
  if (!company) missing.push('company');
  if (!email) missing.push('email');
  if (!phone) missing.push('phone');
  if (!category) missing.push('category');
  if (!quantity) missing.push('quantity');
  if (!market) missing.push('market');
  if (!paymentMethod) missing.push('payment_method');
  if (!source) missing.push('source');
  if (missing.length) {
    return json({ ok: false, error: 'missing_required', fields: missing }, 400, cors);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400, cors);
  }
  // "Other" selected but no detail text supplied → reject so the table is never ambiguous
  if (paymentMethod === 'Other' && !paymentDetail) {
    return json({ ok: false, error: 'payment_method_detail_required' }, 400, cors);
  }
  if (source === 'Other' && !sourceDetail) {
    return json({ ok: false, error: 'source_detail_required' }, 400, cors);
  }
  // Reject header-injection attempts in single-line fields.
  for (const [k, v] of Object.entries({ name, email, company, phone, category, quantity, market })) {
    if (/[\r\n]/.test(String(v))) {
      return json({ ok: false, error: 'invalid_input', field: k }, 400, cors);
    }
  }

  // --- 5. Rate limit per IP and per email ---
  if (await isRateLimited(env.INQUIRY_RATE_LIMIT, ip, email)) {
    return json({ ok: false, error: 'rate_limited' }, 429, {
      ...cors,
      'Retry-After': '3600',
    });
  }

  const now = Date.now();
  // Feishu Bitable renders DateTime cells in UTC, so shift +8h to make the
  // stored instant display as Beijing time (CST) in the table.
  const CST_OFFSET_MS = 8 * 60 * 60 * 1000;
  const record = {
    name,
    company,
    email,
    whatsapp: phone,
    category,
    quantity,
    market,
    payment_method: paymentMethod,
    payment_method_detail: paymentDetail,
    source,
    source_detail: sourceDetail,
    message,
    ref_referrer: clean(payload.ref_referrer, 500),
    ref_landing: clean(payload.ref_landing, 500),
    ref_utm: clean(payload.ref_utm, 500),
    submitted_at: now,
    ip,
    country: (request.cf as any)?.country || '',
  };

  const appId = env.FEISHU_APP_ID;
  const appSecret = env.FEISHU_APP_SECRET;
  const bitableApp = env.FEISHU_BITABLE_APP || 'J1aqbSMEKaL9ausJLBkcJncxnQe';
  const tableId = env.FEISHU_TABLE_ID || 'tblezJ4xmsUfeFaS';

  let feishuOk = false;
  let feishuError = '';

  if (!appId || !appSecret) {
    feishuError = 'feishu_credentials_missing';
  } else {
    try {
      const token = await getTenantToken(appId, appSecret);
      await addBitableRecord(token, bitableApp, tableId, {
        客户姓名: record.name,
        公司名称: record.company,
        邮箱: record.email,
        WhatsApp: record.whatsapp,
        产品品类: record.category,
        数量: record.quantity,
        目标市场: record.market,
        支付方式: record.payment_method
          ? record.payment_method +
            (record.payment_method_detail ? ` (${record.payment_method_detail})` : '')
          : '',
        渠道来源: record.source,
        渠道补充: record.source_detail,
        需求详情: record.message,
        落地页: record.ref_landing,
        '真实来源(referrer)': record.ref_referrer,
        UTM参数: record.ref_utm,
        邮件状态: '未发送',
        提交时间: record.submitted_at + CST_OFFSET_MS,
      });
      feishuOk = true;
    } catch (e: any) {
      feishuError = String(e?.message || e).slice(0, 300);
    }
  }

  // JSON 备份（KV 可选，失败不影响主流程）
  if (env.BACKUP_KV) {
    try {
      const key = `inquiry/${new Date(now).toISOString().slice(0, 10)}/${now}-${record.email}`;
      await env.BACKUP_KV.put(key, JSON.stringify({ ...record, feishuOk, feishuError }));
    } catch {
      /* 忽略备份失败 */
    }
  }

  // 飞书写入失败时返回 502，前端提示“稍后重试”，避免客户以为没提交。
  // detail 仅供日志排查，不回传给浏览器（可能含上游内部信息）。
  if (!feishuOk) {
    console.error('[inquiry] storage failed:', feishuError);
    return json({ ok: false, error: 'storage_failed' }, 502, cors);
  }

  return json({ ok: true, id: now }, 200, cors);
};
