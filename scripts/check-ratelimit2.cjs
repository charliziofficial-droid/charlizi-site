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
          status: res.statusCode,
          ms: Date.now() - t0,
          len: b.length,
          retryAfter: res.headers['retry-after'] || '-',
        })
      );
    });
    r.on('error', (e) => resolve({ status: 0, err: e.message }));
    r.setTimeout(20000, () => { r.destroy(); resolve({ status: 0, err: 'timeout' }); });
  });
}

(async () => {
  console.log('=== 先等 65 秒让限流窗口过去 ===');
  await new Promise((r) => setTimeout(r, 65000));

  console.log('\n=== 第二轮：只测 products.json，间隔 30 秒 ===');
  for (let i = 1; i <= 3; i++) {
    const r = await req('https://www.viomisha.com/products.json?limit=5', { 'User-Agent': UA, Accept: 'application/json' });
    console.log(`  第${i}次: status=${r.status} ${r.ms}ms len=${r.len} retry-after=${r.retryAfter}`);
    if (i < 3) await new Promise((x) => setTimeout(x, 30000));
  }

  console.log('\n=== 第三轮：HTML 页面连续 3 次请求（间隔 3 秒）===');
  for (let i = 1; i <= 3; i++) {
    const r = await req('https://www.viomisha.com/pages/about-us', { 'User-Agent': UA, Accept: 'text/html' });
    console.log(`  第${i}次: status=${r.status} ${r.ms}ms len=${r.len} retry-after=${r.retryAfter}`);
    if (i < 3) await new Promise((x) => setTimeout(x, 3000));
  }
})();
