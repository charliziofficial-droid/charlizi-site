const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } }, (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      })
      .on('error', () => resolve({ status: 0, body: '' }));
  });
}

(async () => {
  // 先从 /products/plus-size-bras/ 抓产品链接
  const list = await get('https://charlizi.com/products/plus-size-bras/');
  const links = [...new Set((list.body.match(/href="(\/products\/plus-size-bras\/[a-z0-9\-]+\/?)"/gi) || []).map((h) => h.replace(/href="|"$/g, '')))].filter((h) => h !== '/products/plus-size-bras/');
  console.log('product links: ' + links.length);
  links.slice(0, 3).forEach((l) => console.log('  ' + l));

  for (const l of links.slice(0, 3)) {
    const p = await get('https://charlizi.com' + l);
    const allSizes = [
      ...new Set(
        (p.body.match(/\b(?:28|30|32|34|36|38|40|42|44|46|48)\s?[A-H]{1,3}\b/gi) || []).map((s) => s.replace(/\s+/g, '').toUpperCase())
      ),
    ];
    // 也找 size 相关 JSON
    const jsonSizes = [
      ...new Set(
        ([...p.body.matchAll(/"size"\s*:\s*"([^"]{1,10})"/gi)] || []).map((m) => m[1].toUpperCase())
      ),
    ];
    console.log('\n' + l + ' status=' + p.status);
    console.log('  band+cup: ' + (allSizes.join(', ') || '-'));
    console.log('  size字段: ' + (jsonSizes.join(', ') || '-'));
  }
})();
