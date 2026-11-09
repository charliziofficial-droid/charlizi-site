// functions/api/inquiry.ts
// Cloudflare Pages Function — 接收询盘表单提交
// 职责：校验 -> 写飞书多维表格 -> 写 JSON 备份(R2/KV 可选) -> 返回结果
//
// 环境变量（在 Cloudflare Pages 项目 Settings > Environment variables 配置）：
//   FEISHU_APP_ID       飞书应用 App ID
//   FEISHU_APP_SECRET   飞书应用 App Secret
//   FEISHU_BITABLE_APP  Bitable app_token   (L3vlbaFb3aImnNsgeHFcnbKGnsf)
//   FEISHU_TABLE_ID     Bitable table_id    (tblBbGODp6ubtkQ8)
//   BACKUP_KV           可选，KV namespace 绑定，用于 JSON 备份

interface Env {
  FEISHU_APP_ID?: string;
  FEISHU_APP_SECRET?: string;
  FEISHU_BITABLE_APP?: string;
  FEISHU_TABLE_ID?: string;
  BACKUP_KV?: KVNamespace;
}

const ALLOWED_ORIGINS = ['https://charlizi.com', 'https://www.charlizi.com'];

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

  let payload: Record<string, unknown>;
  try {
    const ct = request.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
      payload = await request.json();
    } else {
      const fd = await request.formData();
      payload = Object.fromEntries(fd.entries());
    }
  } catch {
    return json({ ok: false, error: 'invalid_payload' }, 400, cors);
  }

  // 关键字段校验
  const name = s(payload.name, 120);
  const email = s(payload.email, 200);
  const message = s(payload.message, 5000);
  if (!name || !email || !message) {
    return json({ ok: false, error: 'missing_required' }, 400, cors);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400, cors);
  }

  const now = Date.now();
  // Feishu Bitable renders DateTime cells in UTC, so shift +8h to make the
  // stored instant display as Beijing time (CST) in the table.
  const CST_OFFSET_MS = 8 * 60 * 60 * 1000;
  const record = {
    name,
    company: s(payload.company, 200),
    email,
    whatsapp: s(payload.whatsapp, 60),
    category: s(payload.category, 100),
    quantity: s(payload.quantity, 60),
    market: s(payload.market, 100),
    payment_method: s(payload.payment_method, 100),
    payment_method_detail: s(payload.payment_method_detail, 200),
    source: s(payload.source, 100),
    source_detail: s(payload.source_detail, 200),
    message,
    ref_referrer: s(payload.ref_referrer, 500),
    ref_landing: s(payload.ref_landing, 500),
    ref_utm: s(payload.ref_utm, 500),
    submitted_at: now,
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: (request.cf as any)?.country || '',
  };

  const appId = env.FEISHU_APP_ID;
  const appSecret = env.FEISHU_APP_SECRET;
  const bitableApp = env.FEISHU_BITABLE_APP || 'L3vlbaFb3aImnNsgeHFcnbKGnsf';
  const tableId = env.FEISHU_TABLE_ID || 'tblBbGODp6ubtkQ8';

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

  // 飞书写入失败时返回 502，前端提示“稍后重试”，避免客户以为没提交
  if (!feishuOk) {
    return json({ ok: false, error: 'storage_failed', detail: feishuError }, 502, cors);
  }

  return json({ ok: true, id: now }, 200, cors);
};
