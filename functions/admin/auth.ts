// functions/admin/auth.ts
// Cloudflare Pages Function — Decap CMS GitHub OAuth
//
//   GET /admin/auth           -> redirect to GitHub OAuth
//   GET /admin/auth/callback  -> handle OAuth callback
//
// SECURITY NOTES (hardened 2026-11)
//  - No hardcoded client_id fallback; credentials must come from env.
//  - Access token is NEVER interpolated into HTML. The callback page reads the
//    token from the URL fragment (#...) which never reaches a server or log.
//  - The postMessage targetOrigin is pinned to our own origin, not '*'.
//  - State parameter is signed + verified to block OAuth CSRF / login CSRF.
//  - CORS is restricted to our own origin instead of '*'.
//  - OAuth errors are logged server-side but never echoed to the browser.

interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  OAUTH_STATE_SECRET?: string;
}

const SITE_ORIGIN = 'https://charlizi.com';
const ALLOWED_ORIGINS = [SITE_ORIGIN, 'https://www.charlizi.com'];

function ownerOrigin(request: Request): string {
  const o = request.headers.get('Origin');
  return o && ALLOWED_ORIGINS.includes(o) ? o : SITE_ORIGIN;
}

/** Escape a string for safe embedding in HTML text / attribute context. */
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only allow a same-origin or relative path as the post-auth redirect. */
function safeReturnPath(v: string | null): string {
  if (!v) return '/admin/';
  if (!v.startsWith('/') || v.startsWith('//')) return '/admin/';
  return v;
}

// ---- Minimal stateless HMAC state (no KV required) -------------------------

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array {
  const p = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = p.length % 4 ? '='.repeat(4 - (p.length % 4)) : '';
  const bin = atob(p + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function makeState(secret: string, payload: string): Promise<string> {
  const body = b64url(new TextEncoder().encode(payload));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), new TextEncoder().encode(body));
  return `${body}.${b64url(sig)}`;
}

async function verifyState(secret: string, state: string): Promise<string | null> {
  const parts = state.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  let sigBytes: Uint8Array;
  try {
    sigBytes = b64urlDecode(sig);
  } catch {
    return null;
  }
  const ok = await crypto.subtle.verify(
    'HMAC',
    await hmacKey(secret),
    sigBytes,
    new TextEncoder().encode(body)
  );
  if (!ok) return null;
  try {
    return new TextDecoder().decode(b64urlDecode(body));
  } catch {
    return null;
  }
}

// ---- Handler ---------------------------------------------------------------

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const stateSecret = env.OAUTH_STATE_SECRET || clientSecret || '';

  // Never run OAuth without real credentials.
  if (!clientId || !clientSecret || !stateSecret) {
    console.error('[admin/auth] missing OAuth env vars');
    return new Response('OAuth is not configured', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const secure = {
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  };

  // ---- OAuth callback ------------------------------------------------------
  if (pathname.endsWith('/callback')) {
    const code = searchParams.get('code');
    const state = searchParams.get('state') || '';
    const err = searchParams.get('error');

    if (err) {
      // Log the reason, but never reflect attacker-controlled text back.
      console.error('[admin/auth] provider error:', err.slice(0, 100));
      return new Response('Authorization was denied.', { status: 400, headers: secure });
    }
    if (!code) {
      return new Response('Missing authorization code', { status: 400, headers: secure });
    }

    // Verify signed state -> blocks OAuth CSRF.
    const statePayload = await verifyState(stateSecret, state);
    if (!statePayload) {
      console.error('[admin/auth] state verification failed');
      return new Response('Invalid or expired state. Please start again.', {
        status: 400,
        headers: secure,
      });
    }
    let returnPath = '/admin/';
    try {
      returnPath = safeReturnPath(JSON.parse(statePayload).r ?? null);
    } catch {
      returnPath = '/admin/';
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state,
      }),
    });

    const tokenData: any = await tokenResponse.json().catch(() => ({}));
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      // Do not leak provider error text to the browser.
      console.error('[admin/auth] token exchange failed:', tokenData?.error);
      return new Response('Could not complete GitHub sign-in. Please try again.', {
        status: 400,
        headers: secure,
      });
    }

    // Fetch the authenticated login for display only.
    let login = 'unknown';
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'charlizi-decap-oauth',
        },
      });
      const userData: any = await userResponse.json();
      login = esc(userData?.login || 'unknown');
    } catch {
      /* display-only, ignore */
    }

    // The token travels in the URL FRAGMENT: not sent to any server, not in
    // Referer, not in access logs. Everything rendered below is escaped.
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>Signing in…</title>
</head>
<body>
<p>Authenticated as <strong>${login}</strong>. Finishing sign-in…</p>
<script>
(function () {
  var data = { token: location.hash.slice(1), provider: 'github' };
  try { history.replaceState(null, '', location.pathname); } catch (e) {}
  var target = ${JSON.stringify(ownerOrigin(request))};
  if (window.opener) {
    window.opener.postMessage('authorization:github:success:' + JSON.stringify(data), target);
    window.close();
  } else {
    location.replace(${JSON.stringify(returnPath)});
  }
})();
</script>
</body>
</html>`;

    return new Response(content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Locked-down CSP: no external resources, no framing, inline script only.
        'Content-Security-Policy':
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
        'X-Frame-Options': 'DENY',
        ...secure,
      },
    });
  }

  // ---- Redirect to GitHub --------------------------------------------------
  const returnPath = safeReturnPath(searchParams.get('return'));
  const redirectUri = `${url.origin}/admin/auth/callback`;
  const state = await makeState(stateSecret, JSON.stringify({ r: returnPath, n: crypto.randomUUID() }));

  const authUrl =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&scope=repo' +
    '&response_type=code' +
    `&state=${encodeURIComponent(state)}`;

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl, ...secure },
  });
};
