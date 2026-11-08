const https = require('https');
const zlib = require('zlib');

function get(u) {
  return new Promise((resolve) => {
    const url = new URL(u + (u.includes('?') ? '&' : '?') + 'cb=' + Math.random());
    const r = https.request(
      { hostname: url.hostname, path: url.pathname + url.search, headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'gzip' } },
      (res) => {
        const s = (res.headers['content-encoding'] || '') === 'gzip' ? res.pipe(zlib.createGunzip()) : res;
        let b = '';
        s.on('data', (d) => (b += d.toString('utf8')));
        s.on('end', () => resolve({ status: res.statusCode, body: b }));
      }
    );
    r.on('error', () => resolve({ status: 0, body: '' }));
    r.setTimeout(25000, () => { r.destroy(); resolve({ status: 0, body: '' }); });
    r.end();
  });
}

const posts = ['bra-anatomy', 'wirefree-vs-underwire', 'size-grading', 'silicone-bra-manufacturing', 'panty-fit-guide', 'shapewear-manufacturing', 'bra-set-development'];

(async () => {
  console.log('========== 线上博客验证 ==========\n');
  let ok = 0;
  for (const s of posts) {
    const r = await get('https://charlizi.com/blog/' + s + '/');
    const words = r.body ? r.body.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => /^[a-zA-Z]{2,}/.test(x)).length : 0;
    const ph = /being developed/i.test(r.body);
    const good = r.status === 200 && words > 500 && !ph;
    if (good) ok++;
    console.log('  ' + (good ? 'OK  ' : 'FAIL') + ' ' + s.padEnd(30) + ' HTTP ' + r.status + '  ' + words + ' 词' + (ph ? '  [占位符!]' : ''));
  }
  console.log('\n通过: ' + ok + ' / ' + posts.length);

  // 头图
  console.log('\n========== 头图 ==========\n');
  const imgs = ['blog-bra-anatomy-hero', 'blog-wirefree-underwire-hero', 'blog-size-grading-hero', 'blog-silicone-bra-hero', 'blog-panty-fit-hero', 'blog-shapewear-hero', 'blog-bra-set-hero'];
  for (const i of imgs) {
    const r = await get('https://charlizi.com/factory/images/' + i + '.webp');
    console.log('  ' + (r.status === 200 ? 'OK  ' : 'FAIL') + ' ' + i + ' HTTP ' + r.status);
  }

  // 索引页
  const idx = await get('https://charlizi.com/blog/');
  const links = [...new Set([...idx.body.matchAll(/href="\/blog\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]))];
  console.log('\n博客索引 HTTP ' + idx.status + ' | 文章链接 ' + links.length + ' 篇');

  // sitemap
  const sm = await get('https://charlizi.com/sitemap-0.xml');
  const blogUrls = [...sm.body.matchAll(/https:\/\/charlizi\.com\/blog\/[a-z0-9-]+\//g)].length;
  const total = [...sm.body.matchAll(/<loc>/g)].length;
  console.log('sitemap: ' + total + ' URL, 其中博客 ' + blogUrls + ' 篇');
})();
