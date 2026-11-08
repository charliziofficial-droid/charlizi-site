const https = require('https');
const zlib = require('zlib');

function req(url, ua, extraHeaders = {}) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const r = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
        headers: { 'User-Agent': ua, 'Accept': '*/*', 'Accept-Encoding': 'gzip', ...extraHeaders } },
      (res) => {
        const s = (res.headers['content-encoding'] || '') === 'gzip' ? res.pipe(zlib.createGunzip()) : res;
        let b = '';
        s.on('data', (d) => (b += d.toString('utf8')));
        s.on('end', () => resolve({ status: res.statusCode, body: b, headers: res.headers }));
        s.on('error', () => resolve({ status: res.statusCode, body: b, headers: res.headers }));
      }
    );
    r.on('error', (e) => resolve({ status: 0, body: '', err: e.message }));
    r.setTimeout(20000, () => { r.destroy(); resolve({ status: 0, body: '', err: 'timeout' }); });
    r.end();
  });
}

const BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

(async () => {
  console.log('========== 403 来源诊断 ==========\n');

  const agents = [
    ['普通浏览器', BROWSER],
    ['GPTBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot'],
    ['ChatGPT-User', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot'],
    ['OAI-SearchBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot'],
    ['ClaudeBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com'],
    ['Claude-User', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Claude-User/1.0; +claude-user@anthropic.com'],
    ['anthropic-ai', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; anthropic-ai/1.0'],
    ['PerplexityBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)'],
    ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
    ['Google-Extended', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
    ['Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'],
    ['CCBot', 'Mozilla/5.0 (compatible; CCBot/2.0; https://commoncrawl.org/faq/)'],
    ['Applebot', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)'],
  ];

  for (const [name, ua] of agents) {
    const r = await req('https://charlizi.com/', ua);
    const w = r.body ? r.body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => /[a-zA-Z]{2,}/.test(x)).length : 0;
    const server = r.headers ? (r.headers['server'] || '-') : '-';
    const snippet = r.body ? r.body.replace(/\s+/g, ' ').slice(0, 90) : (r.err || '');
    console.log(`  ${name.padEnd(16)} ${String(r.status).padEnd(4)} ${String(w).padStart(5)}词  server=${server}  ${r.status === 200 ? '' : '«' + snippet + '»'}`);
  }

  console.log('\n========== robots.txt 对 AI 声明 vs 实际 ==========');
  const rb = await req('https://charlizi.com/robots.txt', BROWSER);
  console.log('robots.txt HTTP', rb.status);
  const blocks = rb.body.split(/\n(?=User-agent:)/i);
  for (const b of blocks) {
    const ua = (b.match(/User-agent:\s*(.+)/i) || [])[1];
    const rules = (b.match(/(Allow|Disallow):\s*(\S*)/gi) || []).join(' ');
    if (ua) console.log(`  ${ua.padEnd(22)} ${rules}`);
  }

  console.log('\n========== 响应头 (缓存 / CDN) ==========');
  const r0 = await req('https://charlizi.com/', BROWSER);
  ['server', 'cf-ray', 'cf-cache-status', 'x-cache', 'cache-control', 'x-vercel-cache', 'x-powered-by', 'via'].forEach((k) => {
    if (r0.headers[k]) console.log(`  ${k}: ${r0.headers[k]}`);
  });
})();
