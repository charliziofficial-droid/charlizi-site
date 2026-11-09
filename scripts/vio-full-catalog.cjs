const https = require('https');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

function post(host, path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: host,
        path,
        method: 'POST',
        headers: {
          'User-Agent': UA,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.setTimeout(25000, () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

(async () => {
  let cursor = null;
  let all = [];
  let page = 0;

  while (page < 10) {
    page++;
    const q = {
      query: `query($cursor: String) {
        products(first: 50, after: $cursor) {
          edges {
            cursor
            node {
              title
              productType
              options { name values }
              priceRange { minVariantPrice { amount currencyCode } }
            }
          }
          pageInfo { hasNextPage }
        }
      }`,
      variables: { cursor },
    };

    const r = await post('fwmabi-vk.myshopify.com', '/api/2024-10/graphql.json', q);
    if (r.status !== 200) { console.log('ERR status=' + r.status + ' ' + r.body.slice(0, 200)); break; }

    const j = JSON.parse(r.body);
    if (!j.data || !j.data.products) { console.log('NO DATA: ' + r.body.slice(0, 300)); break; }

    const edges = j.data.products.edges;
    edges.forEach((e) => all.push(e.node));
    console.log('page ' + page + ': +' + edges.length + ' (total ' + all.length + ')');

    if (!j.data.products.pageInfo.hasNextPage || !edges.length) break;
    cursor = edges[edges.length - 1].cursor;
    await new Promise((x) => setTimeout(x, 1200));
  }

  console.log('\n=== 浜у搧鎬绘暟: ' + all.length + ' ===\n');

  const sizeSets = new Map();
  const priceRange = { min: Infinity, max: 0 };

  all.forEach((p) => {
    const sizeOpt = (p.options || []).find((o) => /size/i.test(o.name));
    const sig = sizeOpt ? sizeOpt.values.join(',') : '(鏃犲昂鐮侀€夐」)';
    sizeSets.set(sig, (sizeSets.get(sig) || 0) + 1);
    const pr = p.priceRange && p.priceRange.minVariantPrice;
    if (pr) {
      const v = parseFloat(pr.amount);
      if (v < priceRange.min) priceRange.min = v;
      if (v > priceRange.max) priceRange.max = v;
    }
  });

  console.log('=== 灏虹爜缁勫悎鍒嗗竷 ===');
  [...sizeSets.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([sig, n]) => console.log('  ' + String(n).padStart(3) + ' 涓骇鍝? ' + sig));

  console.log('\n=== 浠锋牸鍖洪棿 ===');
  console.log('  $' + priceRange.min + ' 鈥?$' + priceRange.max);

  console.log('\n=== 浜у搧绫诲瀷 ===');
  const types = new Map();
  all.forEach((p) => types.set(p.productType || '(绌?', (types.get(p.productType || '(绌?') || 0) + 1));
  [...types.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([t, n]) => console.log('  ' + String(n).padStart(3) + '  ' + t));
})();

