const https = require('https');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function get(url, headers = {}) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', ...headers } },
      (r) => {
        let b = '';
        r.on('data', (d) => (b += d));
        r.on('end', () => resolve({ status: r.statusCode, body: b }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: '', err: e.message }));
    req.setTimeout(25000, () => { req.destroy(); resolve({ status: 0, body: '', err: 'timeout' }); });
    req.end();
  });
}

(async () => {
  console.log('========== 搜索引擎收录检查 ==========\n');

  // Bing
  const bing = await get('https://www.bing.com/search?q=site%3Acharlizi.com&count=50&setlang=en');
  const bingUrls = [...new Set([...bing.body.matchAll(/https?:\/\/(?:www\.)?charlizi\.com[^"&<\s]*/g)].map((m) => m[0]))];
  const bingCount = (bing.body.match(/<li class="b_algo"/g) || []).length;
  console.log(`[Bing] HTTP ${bing.status} | 结果条目 <li.b_algo>: ${bingCount} | 抓到 charlizi URL: ${bingUrls.length}`);
  console.log('  "There are no results" :', /There are no results/i.test(bing.body));
  bingUrls.slice(0, 12).forEach((u) => console.log('   · ' + u));

  // Google
  const g = await get('https://www.google.com/search?q=site%3Acharlizi.com&num=50&hl=en');
  const gCount = (g.body.match(/<a href="\/url\?q=/g) || []).length;
  const gUrls = [...new Set([...g.body.matchAll(/https?:\/\/(?:www\.)?charlizi\.com[^"&<\s]*/g)].map((m) => m[0]))];
  console.log(`\n[Google] HTTP ${g.status} | 结果链接: ${gCount} | 抓到 charlizi URL: ${gUrls.length}`);
  console.log('  疑似验证码/拦截:', /captcha|unusual traffic|enablejs/i.test(g.body));
  gUrls.slice(0, 12).forEach((u) => console.log('   · ' + u));

  // DuckDuckGo html
  const ddg = await get('https://html.duckduckgo.com/html/?q=site%3Acharlizi.com');
  const ddgUrls = [...new Set([...ddg.body.matchAll(/https?%3A%2F%2F(?:www\.)?charlizi\.com[^"&<\s]*/g)].map((m) => decodeURIComponent(m[0])))];
  console.log(`\n[DuckDuckGo] HTTP ${ddg.status} | 抓到 charlizi URL: ${ddgUrls.length}`);
  ddgUrls.slice(0, 8).forEach((u) => console.log('   · ' + u));

  // Yandex
  const yx = await get('https://yandex.com/search/?text=site%3Acharlizi.com');
  console.log(`\n[Yandex] HTTP ${yx.status} | 含 charlizi: ${/charlizi\.com/.test(yx.body)} | 验证码: ${/captcha/i.test(yx.body)}`);

  console.log('\n========== 知名品牌词自然排名 ==========\n');
  for (const q of ['lingerie manufacturer china', 'bra oem manufacturer', 'intimate apparel manufacturer china oem']) {
    const r = await get('https://www.bing.com/search?q=' + encodeURIComponent(q) + '&count=30&setlang=en');
    const idx = r.body.indexOf('charlizi.com');
    const rank = idx > -1 ? (r.body.slice(0, idx).match(/<li class="b_algo"/g) || []).length + 1 : null;
    console.log(`  "${q}" -> ${rank ? '第 ' + rank + ' 位' : '未出现(前30)'}`);
  }
})();
