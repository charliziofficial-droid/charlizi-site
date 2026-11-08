const https = require('https');

function get(u) {
  return new Promise((res, rej) => {
    https.get(u + '?cb=' + Math.random(), (r) => {
      let b = '';
      r.on('data', (d) => (b += d));
      r.on('end', () => res({ s: r.statusCode, b }));
    }).on('error', rej);
  });
}

(async () => {
  const r = await get('https://charlizi.com/products/');
  console.log('products 首页 HTTP', r.s);
  const imgs = [...new Set([...r.b.matchAll(/\/factory\/images\/products-cards\/([a-z-]+)\/([a-zA-Z0-9\-]+)\.webp/g)].map((m) => m[1] + '/' + m[2]))];
  console.log('\n首页分类封面图 (' + imgs.length + ' 张):');
  for (const i of imgs) {
    const d = await get('https://charlizi.com/factory/images/products-cards/' + i + '.webp');
    console.log('  ' + (d.s === 200 ? '✅' : '❌') + ' ' + i + (d.s === 200 ? '' : '  HTTP ' + d.s));
  }

  // 已删款全站残留
  const sw = await get('https://charlizi.com/products/shapewear/');
  console.log('\nshapewear 页引用已删款:', sw.b.includes('deep-v-lace-bodysuit-multi-color'));
  const links = [...new Set([...sw.b.matchAll(/href="\/products\/shapewear\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]))];
  console.log('shapewear 款式 (' + links.length + '):', links.join(', '));

  // sitemap 残留
  const sm = await get('https://charlizi.com/sitemap-0.xml');
  console.log('\nsitemap 残留已删款:', sm.b.includes('deep-v-lace-bodysuit-multi-color'));
  console.log('sitemap 详情页数:', [...sm.b.matchAll(/\/products\/[a-z0-9-]+\/[a-z0-9-]+\//g)].length);
})();
