const https = require('https');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

function post(host, path, body, headers) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const t0 = Date.now();
    const req = https.request(
      {
        hostname: host,
        path,
        method: 'POST',
        headers: {
          'User-Agent': UA,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, ms: Date.now() - t0, body: b }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.setTimeout(25000, () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

(async () => {
  const q = {
    query: `{
      products(first: 5) {
        edges {
          node {
            title
            options { name values }
          }
        }
      }
    }`,
  };

  console.log('=== 测试 Storefront API (tokenless) ===');
  const r = await post('fwmabi-vk.myshopify.com', '/api/2024-10/graphql.json', q, {});
  console.log('status=' + r.status + ' ' + r.ms + 'ms');
  try {
    const j = JSON.parse(r.body);
    if (j.data && j.data.products) {
      console.log('✅ 成功拿到产品数: ' + j.data.products.edges.length);
      j.data.products.edges.forEach((e) => {
        const n = e.node;
        const sizeOpt = (n.options || []).find((o) => /size/i.test(o.name));
        console.log('  - ' + n.title.slice(0, 50) + (sizeOpt ? '  sizes: ' + sizeOpt.values.join(',') : ''));
      });
    } else {
      console.log('返回: ' + r.body.slice(0, 400));
    }
  } catch (e) {
    console.log('parse fail: ' + r.body.slice(0, 300));
  }
})();
