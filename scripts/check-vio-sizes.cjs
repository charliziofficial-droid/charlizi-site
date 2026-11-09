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
  const r = await get('https://www.viomisha.com/collections/all');
  console.log('collections/all status=' + r.status + ' len=' + r.body.length);

  // Shopify 会在页面内嵌 product JSON
  const variants = [...r.body.matchAll(/"public_title"\s*:\s*"([^"]{1,20})"/gi)].map((m) => m[1]);
  const sizes = [...r.body.matchAll(/"option\d?"?\s*:\s*"([^"]{1,12})"/gi)].map((m) => m[1]);
  const titleOpt = [...r.body.matchAll(/"title"\s*:\s*"((?:\d{2}[A-H]{1,3})|(?:S|M|L|XL|XXL|XXXL))"/gi)].map((m) => m[1]);

  const all = [...new Set([...variants, ...sizes, ...titleOpt])].filter((s) => /^(\d{2}[A-H]{1,3}|XX?[SML]|XXXL)$/i.test(s));
  console.log('variant titles: ' + ([...new Set(variants)].slice(0, 40).join(' | ') || '-'));
  console.log('\nfiltered sizes: ' + (all.join(', ') || '-'));
})();
