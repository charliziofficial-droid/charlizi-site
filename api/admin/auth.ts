// Decap CMS GitHub OAuth callback handler (Vercel Serverless Function)
// Deployed as: /api/admin/auth

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    // Step 1: Redirect to GitHub OAuth
    const clientId = process.env.PUBLIC_GITHUB_CLIENT_ID || '';
    if (!clientId) {
      return new Response(
        JSON.stringify({ error: 'GitHub OAuth not configured. Set PUBLIC_GITHUB_CLIENT_ID env var.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const redirectUrl = new URL('https://github.com/login/oauth/authorize');
    redirectUrl.searchParams.set('client_id', clientId);
    redirectUrl.searchParams.set('scope', 'repo');
    redirectUrl.searchParams.set('redirect_uri', `${url.origin}/api/admin/auth`);
    return Response.redirect(redirectUrl.toString(), 302);
  }

  // Step 2: Exchange code for token
  const clientId = process.env.PUBLIC_GITHUB_CLIENT_ID || '';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || '';

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: 'GitHub OAuth credentials not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const tokenData = await tokenRes.json() as { access_token?: string; error?: string };

  if (!tokenData.access_token) {
    return new Response(
      JSON.stringify({ error: 'Failed to get access token', detail: tokenData.error }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Step 3: Return success page with postMessage for Decap CMS
  const html = `
<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
  <script>
    (function() {
      function recv(e) {
        if (e.data && e.data === 'authorizing:github') {
          window.opener.postMessage(
            'authorization:github:success:{"token":"${tokenData.access_token}","provider":"github"}',
            e.origin
          );
        }
      }
      window.addEventListener('message', recv, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
  <p style="font-family:sans-serif;text-align:center;padding:2rem;color:#333">
    Authorization successful! You can close this window.</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

export type {};
