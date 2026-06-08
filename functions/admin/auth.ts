// Cloudflare Pages Function — Decap CMS OAuth GitHub Authentication
// Redirects to GitHub OAuth, then handles callback to store token

interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  OAUTH_SECRET?: string; // used to sign/verify state param
}

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // ── Handle callback from GitHub ──
  if (url.pathname === '/admin/auth/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = request.headers.get('cookie')
      ?.split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('oauth_state='))
      ?.split('=')[1];

    // Verify state (CSRF protection)
    if (!state || !storedState || state !== storedState) {
      return new Response('Invalid state parameter — possible CSRF attack', { status: 403 });
    }

    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    const cid = env.GITHUB_CLIENT_ID;
    const csec = env.GITHUB_CLIENT_SECRET;
    if (!cid || !csec) {
      return new Response('GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET env vars.', { status: 500 });
    }

    // Exchange code for token
    const tokenResp = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: cid, client_secret: csec, code }),
    });

    const tokenData: any = await tokenResp.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new Response(`OAuth token exchange failed: ${JSON.stringify(tokenData)}`, { status: 400 });
    }

    // Return the token via redirect back to Decap CMS
    const redirectUrl = url.origin + '/admin/';
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Auth Success</title></head><body>
<script>
  (function() {
    var authResult = ${JSON.stringify({ token: accessToken, provider: 'github' })};
    if (window.opener) {
      window.opener.postMessage(authResult, '${redirectUrl}');
      window.close();
    } else {
      document.body.innerHTML = '<p>Auth successful! You may close this window and refresh the admin panel.</p>';
    }
  })();
</script>
</body></html>`;
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `oauth_state=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  // ── Initiate OAuth flow (redirect to GitHub) ──
  const cid = env.GITHUB_CLIENT_ID;
  if (!cid) {
    return new Response('GitHub OAuth not configured. Set GITHUB_CLIENT_ID env var.', { status: 500 });
  }

  // Generate state for CSRF
  const stateBytes = new Uint8Array(16);
  crypto.getRandomValues(stateBytes);
  const state = Array.from(stateBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  const redirectUri = url.origin + '/admin/auth/callback';
  const githubUrl = `${GITHUB_OAUTH_URL}?client_id=${cid}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=repo`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: githubUrl,
      'Set-Cookie': `oauth_state=${state}; Max-Age=300; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  });
};
