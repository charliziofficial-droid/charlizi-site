const https = require('https');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': UA, Accept: '*/*', 'Accept-Language': 'en-US,en;q=0.9' } }, (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      })
      .on('error', () => resolve({ status: 0, body: '' }));
  });
}

(async () => {
  for (const t of [
    'https://www.viomisha.com/products.json?limit=250',
    'https://fwmabi-vk.myshopify.com/products.json?limit=250',
  ]) {
    const r = await get(t);
    console.log(t + ' -> ' + r.status + ' len=' + r.body.length);
    if (r.status === 200) {
      try {
        const j = JSON.parse(r.body);
        const sizes = new Set();
        const titles = [];
        (j.products || []).forEach((p) => {
          titles.push(p.title);
          (p.variants || []).forEach((v) => {
            if (v.title && v.title !== 'Default Title') sizes.add(v.title.trim());
          });
        });
        console.log('  products: ' + titles.length);
        console.log('  titles: ' + titles.slice(0, 12).join(' | '));
        console.log('  variant sizes: ' + ([...sizes].slice(0, 80).join(' | ') || '-'));
        return;
      } catch (e) {
        console.log('  parse fail');
      }
    }
    await new Promise((r2) => setTimeout(r2, 4000));
  }
})();
