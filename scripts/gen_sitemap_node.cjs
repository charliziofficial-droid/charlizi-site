// gen_sitemap_node.cjs — 构建后扫描 dist/ 生成权威 sitemap.xml（Node 版）
//
// 为什么要有 Node 版：
//   Cloudflare Pages 的构建镜像里没有 python。原来的 build 链是
//     node scripts/gen_tier_prices_json.cjs && astro build && python scripts/gen_sitemap.py
//   python 那步直接 command not found → 整条 build 以非 0 退出 → Pages 判定部署失败，
//   线上继续挂着上一次成功的 commit。表现就是「推送成功但线上永远是旧版」。
//   这个脚本逻辑与 gen_sitemap.py 逐条对齐，保证在无 Python 环境也能产出同样的
//   单文件 sitemap.xml（Astro 自带的 @astrojs/sitemap 只给 sitemap-index + sitemap-0，
//   /sitemap.xml 会是 404 → 404 页是 HTML → GSC 报 "Sitemap is in HTML format"）。
//
// 用法（npm run build 内部调用）：
//   node scripts/gen_sitemap_node.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://charlizi.com';

// 永不收录
const BLOCK_PREFIX = ['/admin', '/dashboard', '/manage', '/decapcms', '/cgi-bin',
  '/404', '/500', '/offline', '/_'];
// 裸露的 .html 后台页：站点用目录式干净 URL，裸露 .html 要么是重定向源，要么是后台页
const BLOCK_SUFFIX = ['.html'];
const BLOCK_EXACT = new Set(['/sitemap.xml', '/sitemap-index.xml', '/robots.txt',
  '/404.html', '/500.html', '/offline.html']);

function collect(dir) {
  const urls = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue; // 跳过 _astro 等构建产物目录
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      urls.push(...collect(full));
    } else if (entry.name.endsWith('.html')) {
      const rel = path.relative(DIST, full).split(path.sep).join('/');
      let u;
      if (rel === 'index.html') u = '/';
      else if (rel.endsWith('/index.html')) u = '/' + rel.slice(0, -'/index.html'.length) + '/';
      else u = '/' + rel;
      urls.push(u);
    }
  }
  return urls;
}

function isBlocked(u) {
  if (BLOCK_EXACT.has(u)) return true;
  if (BLOCK_SUFFIX.some((s) => u.endsWith(s))) return true;
  return BLOCK_PREFIX.some((b) => u === b || u.startsWith(b + '/'));
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ 不存在，请先 astro build');
    return 1;
  }
  const all = collect(DIST);
  const keep = [...new Set(all.filter((u) => !isBlocked(u)))].sort();
  const dropped = [...new Set(all)].filter(isBlocked).sort();

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, '.000Z');
  const parts = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const u of keep) {
    parts.push(`<url><loc>${SITE}${u}</loc><lastmod>${now}</lastmod></url>`);
  }
  parts.push('</urlset>');
  const body = parts.join('');

  // 自检：纯 XML，绝不能被 Cloudflare 的 404 HTML 页污染
  if (!body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) throw new Error('sitemap 头不对');
  if (body.includes('<html')) throw new Error('sitemap 混入 <html> 标签');
  if ((body.match(/<loc>/g) || []).length !== keep.length) throw new Error('<loc> 数量不符');

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), body, { encoding: 'utf8' });
  fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), body, { encoding: 'utf8' });

  console.log(`sitemap.xml 生成完成：${keep.length} 个 URL`);
  if (dropped.length) {
    console.log(`已排除 ${dropped.length} 个（后台/错误页）: ${dropped.slice(0, 8).join(', ')}`);
  }
  console.log('自检通过：纯 XML，无 <html> 标签');
  return 0;
}

process.exit(main());
