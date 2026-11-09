const https = require('https');

function get(url, depth = 0) {
  return new Promise((resolve) => {
    if (depth > 5) return resolve({ status: 0, body: '', url });
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = res.headers.location.startsWith('http') ? res.headers.location : 'https://charlizi.com' + res.headers.location;
        return resolve(get(next, depth + 1));
      }
      let b = '';
      res.on('data', (d) => (b += d));
      res.on('end', () => resolve({ status: res.statusCode, body: b, url }));
    });
    req.on('error', () => resolve({ status: 0, body: '', url }));
  });
}

(async () => {
  const pages = [
    '/products/plus-size-bras/viomisha-women-plus-size-bras',
    '/products/plus-size-bras/white-floral-underwire-bra-plus-size',
    '/products/bras/',
  ];
  for (const p of pages) {
    const r = await get('https://charlizi.com' + p);
    const sizes = [
      ...new Set((r.body.match(/\b(?:28|30|32|34|36|38|40|42|44|46|48)\s?[A-H]{1,3}\b/gi) || []).map((s) => s.replace(/\s+/g, '').toUpperCase())),
    ].filter((s) => /^\d{2}[A-H]{1,3}$/.test(s));
    console.log('=== ' + p);
    console.log('    final=' + r.url.replace('https://charlizi.com', '') + ' status=' + r.status);
    console.log('    sizes: ' + (sizes.join(', ') || '(none)'));
  }
})();
