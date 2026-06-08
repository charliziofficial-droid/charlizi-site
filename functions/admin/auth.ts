// functions/admin/auth.ts
// Cloudflare Pages Function for Decap CMS GitHub OAuth
// Expected endpoints:
//   GET /admin/auth  -> redirect to GitHub OAuth
//   GET /admin/auth/callback -> handle OAuth callback

interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // CORS headers for Decap CMS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientId = env.GITHUB_CLIENT_ID || 'Ov23liJ7fu8qeCc3HF2V';
  const clientSecret = env.GITHUB_CLIENT_SECRET || '';

  // OAuth callback endpoint
  if (pathname.endsWith('/callback')) {
    const code = searchParams.get('code');
    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return new Response(JSON.stringify({ error: 'Failed to get access token', details: tokenData }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    const userData = await userResponse.json();

    // Return HTML page that posts the token back to Decap CMS
    const content = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>GitHub Auth Success</title></head>
      <body>
        <script>
          (function() {
            var data = {
              token: '${tokenData.access_token}',
              provider: 'github',
              user: {
                name: '${userData.login || 'unknown'}',
                avatar_url: '${userData.avatar_url || ''}'
              }
            };
            var origin = window.location.origin;
            if (window.opener) {
              window.opener.postMessage(data, origin);
              window.close();
            } else {
              document.body.innerHTML = '<p>Authentication successful! You can close this window and go back to the admin panel.</p>';
            }
          })();
        </script>
        <p>Authenticated as <strong>${userData.login || 'unknown'}</strong>. Redirecting...</p>
      </body>
      </html>
    `;

    return new Response(content, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
    });
  }

  // Root endpoint: redirect to GitHub OAuth
  const redirectUri = `${url.origin}/admin/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user&response_type=code`;

  return Response.redirect(githubAuthUrl, 302);
};
