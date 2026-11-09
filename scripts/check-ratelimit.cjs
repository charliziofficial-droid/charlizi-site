const https = require('https');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

function req(url, headers) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const r = https.get(url, { headers }, (res) => {
      let b = '';
      res.on('data', (d) => (b += d));
      res.on('end', () =>
        resolve({
          url,
          status: res.statusCode,
          ms: Date.now() - t0,
          len: b.length,
          retryAfter: res.headers['retry-after'] || '',
          server: res.headers['server'] || '',
          cfRay: res.headers['cf-ray'] || '',
          powered: res.headers['x-powered-by'] || '',
          snippet: b.slice(0, 200).replace(/\s+/g, ' '),
        })
      );
    });
    r.on('error', (e) => resolve({ url, status: 0, err: e.message }));
    r.setTimeout(20000, () => {
      r.destroy();
      resolve({ url, status: 0, err: 'timeout' });
    });
  });
}

(async () => {
  const tests = [
    ['首页', 'https://www.viomisha.com/'],
    ['products.json', 'https://www.viomisha.com/products.json?limit=5'],
    ['collections/all', 'https://www.viomisha.com/collections/all'],
    ['robots.txt', 'https://www.viomisha.com/robots.txt'],
    ['Shopify 主域 products.json', 'https://fwmabi-vk.myshopify.com/products.json?limit=5'],
  ];

  console.log('=== 第一轮（普通 UA）===');
  for (const [name, url] of tests) {
    const r = await req(url, { 'User-Agent': UA, Accept: 'text/html,application/json' });
    console.log(
      `[${name}] status=${r.status} ${r.ms}ms len=${r.len} retry-after=${r.retryAfter || '-'} server=${r.server}`
    );
    if (r.status === 429) console.log('    body: ' + r.snippet);
    await new Promise((x) => setTimeout(x, 2500));
  }
})();
