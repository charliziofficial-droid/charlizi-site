const https = require('https');
const http = require('http');
const zlib = require('zlib');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function get(url, depth = 0) {
  return new Promise((resolve) => {
    if (depth > 5) return resolve({ status: 0, body: '', err: 'redirect loop' });
    let u;
    try { u = new URL(url); } catch { return resolve({ status: 0, body: '', err: 'bad url' }); }
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
        headers: {
          'User-Agent': UA,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
      },
      (r) => {
        if ([301, 302, 303, 307, 308].includes(r.statusCode) && r.headers.location) {
          r.resume();
          const next = new URL(r.headers.location, url).toString();
          return resolve(get(next, depth + 1));
        }
        const enc = (r.headers['content-encoding'] || '').toLowerCase();
        const stream = enc === 'gzip' ? r.pipe(zlib.createGunzip())
          : enc === 'br' ? r.pipe(zlib.createBrotliDecompress())
          : enc === 'deflate' ? r.pipe(zlib.createInflate()) : r;
        let b = '';
        stream.on('data', (d) => { b += d.toString('utf8'); });
        stream.on('end', () => resolve({ status: r.statusCode, body: b, final: url }));
        stream.on('error', () => resolve({ status: r.statusCode, body: b, final: url }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: '', err: e.message }));
    req.setTimeout(30000, () => { req.destroy(); resolve({ status: 0, body: '', err: 'timeout' }); });
    req.end();
  });
}

function bingRanks(body) {
  // 提取每条自然结果里的目标域名与排名
  const items = [];
  const re = /<li class="b_algo"[\s\S]*?(?=<li class="b_algo"|<\/ol>)/g;
  const blocks = body.match(re) || [];
  blocks.forEach((b, i) => {
    const hm = b.match(/<h2[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"/);
    if (!hm) return;
    let host = '';
    try { host = new URL(hm[1]).hostname.replace(/^www\./, ''); } catch {}
    items.push({ rank: i + 1, host, url: hm[1] });
  });
  return items;
}

(async () => {
  console.log('========== 搜索引擎收录 ==========\n');

  const b = await get('https://www.bing.com/search?q=site%3Acharlizi.com&count=50&setlang=en&cc=us');
  console.log(`[Bing site:] HTTP ${b.status} | 自然结果条数: ${bingRanks(b.body).length}`);
  const bUrls = [...new Set([...b.body.matchAll(/https?:\/\/(?:www\.)?charlizi\.com[^"&\s<>]*/g)].map((m) => m[0].replace(/[.,)]+$/, '')))];
  console.log(`  抓到 charlizi URL: ${bUrls.length}`);
  console.log(`  无结果提示: ${/no results|did not match/i.test(b.body)}`);
  bUrls.filter((u) => !/bing\.com|microsoft/i.test(u)).slice(0, 20).forEach((u) => console.log('   · ' + u));

  const g = await get('https://www.google.com/search?q=site%3Acharlizi.com&num=50&hl=en&gl=us');
  const gUrls = [...new Set([...g.body.matchAll(/https?:\/\/(?:www\.)?charlizi\.com[^"&\s<>]*/g)].map((m) => m[0]))];
  console.log(`\n[Google site:] HTTP ${g.status} | 结果: ${(g.body.match(/<a href="\/url\?q=/g) || []).length} | charlizi URL: ${gUrls.length}`);
  console.log(`  拦截: ${/captcha|unusual traffic|enablejs|before you continue/i.test(g.body)}`);
  gUrls.slice(0, 20).forEach((u) => console.log('   · ' + u));

  console.log('\n========== 关键词自然排名 (Bing 前30) ==========\n');
  for (const q of [
    'lingerie manufacturer china',
    'bra oem manufacturer',
    'custom lingerie manufacturer',
    'intimate apparel manufacturer',
    'shapewear manufacturer china',
    'silicone bra manufacturer',
    'charlizi',
  ]) {
    const r = await get('https://www.bing.com/search?q=' + encodeURIComponent(q) + '&count=30&setlang=en&cc=us');
    const items = bingRanks(r.body);
    const hit = items.find((x) => x.host.includes('charlizi.com'));
    console.log(`  "${q}"`);
    console.log(`     排名: ${hit ? '第 ' + hit.rank + ' 位  ' + hit.url : '未进前 ' + (items.length || 30)}`);
  }

  console.log('\n========== AI 爬虫可达性 (GEO) ==========\n');
  for (const [name, ua] of [
    ['GPTBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot'],
    ['ClaudeBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com'],
    ['PerplexityBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)'],
  ]) {
    const r = await get('https://charlizi.com/', 0);
    // 用 UA 单独请求
    const rr = await new Promise((resolve) => {
      const u = new URL('https://charlizi.com/');
      const req = https.request({ hostname: u.hostname, path: '/', headers: { 'User-Agent': ua, 'Accept-Encoding': 'gzip' } }, (res) => {
        const s = (res.headers['content-encoding'] || '') === 'gzip' ? res.pipe(zlib.createGunzip()) : res;
        let buf = '';
        s.on('data', (d) => (buf += d.toString('utf8')));
        s.on('end', () => resolve({ status: res.statusCode, len: buf.length, words: buf.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[a-zA-Z]{2,}/.test(w)).length }));
      });
      req.on('error', (e) => resolve({ status: 0, err: e.message }));
      req.end();
    });
    console.log(`  ${name.padEnd(14)} HTTP ${rr.status}  内容 ${rr.len} 字节  ${rr.words} 词`);
  }
})();
