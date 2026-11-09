const https = require('https');

function get(url, depth = 0) {
  return new Promise((resolve) => {
    if (depth > 5) return resolve({ status: 0, body: '', url });
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36', 'Cache-Control': 'no-cache' } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          const next = res.headers.location.startsWith('http') ? res.headers.location : 'https://www.viomisha.com' + res.headers.location;
          return resolve(get(next, depth + 1));
        }
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, body: b, url }));
      }
    );
    req.on('error', () => resolve({ status: 0, body: '', url }));
  });
}

(async () => {
  const r = await get('https://www.viomisha.com/pages/about-women-story-in-stem-fieldsus?x=' + Date.now());
  const idx = r.body.indexOf('charlizi.com');
  console.log('=== charlizi 出现次数: ' + (r.body.match(/charlizi\.com/gi) || []).length + ' ===');

  // 找所有含 charlizi 的 <a 标签
  const anchors = [...r.body.matchAll(/<a\b[^>]*charlizi\.com[^>]*>/gi)].map((m) => m[0]);
  console.log('\n=== <a> tags ===');
  anchors.forEach((a, i) => console.log(i + ': ' + a));

  const rels = anchors.map((a) => {
    const rel = (a.match(/rel="([^"]*)"/i) || [])[1] || '(none)';
    const href = (a.match(/href="([^"]*)"/i) || [])[1] || '';
    return { rel, href };
  });
  console.log('\n=== rel/href ===');
  rels.forEach((x) => console.log('  rel=' + x.rel + '  href=' + x.href));

  const nofollow = rels.some((x) => /nofollow/i.test(x.rel));
  console.log('\n>>> dofollow: ' + (!nofollow));
})();
