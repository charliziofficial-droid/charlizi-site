const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        },
        (res) => {
          let b = '';
          res.on('data', (d) => (b += d));
          res.on('end', () => resolve({ status: res.statusCode, body: b }));
        }
      )
      .on('error', () => resolve({ status: 0, body: '' }));
  });
}

(async () => {
  const targets = [
    'https://www.viomisha.com/collections/all',
    'https://www.viomisha.com/products.json?limit=50',
  ];
  for (const t of targets) {
    const r = await get(t);
    console.log('=== ' + t + ' status=' + r.status + ' len=' + r.body.length);
    if (r.status === 200) {
      try {
        const j = JSON.parse(r.body);
        const sizes = new Set();
        (j.products || []).forEach((p) => {
          (p.variants || []).forEach((v) => {
            if (v.title && v.title !== 'Default Title') sizes.add(v.title.trim());
          });
        });
        console.log('  variant titles: ' + ([...sizes].slice(0, 60).join(' | ') || '-'));
      } catch (e) {
        console.log('  not json');
      }
    }
    await new Promise((r2) => setTimeout(r2, 3000));
  }
})();
