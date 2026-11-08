const fs = require('fs');
const path = require('path');

const D = path.join(__dirname, '..', 'dist');
const pages = [
  ['首页', 'index.html'],
  ['产品总览', 'products/index.html'],
  ['分类-bras', 'products/bras/index.html'],
  ['详情-a5032', 'products/bras/a5032/index.html'],
  ['Process', 'process/index.html'],
  ['About', 'about/index.html'],
  ['FAQ', 'faq/index.html'],
  ['Contact', 'contact/index.html'],
  ['Blog', 'blog/index.html'],
];

function head(c) {
  const m = c.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : '';
}

function one(c, re) {
  const m = c.match(re);
  return m ? (m[1] || '').trim() : null;
}

const rows = [];
for (const [name, f] of pages) {
  const p = path.join(D, f);
  if (!fs.existsSync(p)) { rows.push({ name, f, missing: true }); continue; }
  const c = fs.readFileSync(p, 'utf8');
  const h = head(c);
  const ld = [...c.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const types = [];
  for (const j of ld) {
    try {
      const o = JSON.parse(j);
      const arr = Array.isArray(o) ? o : o['@graph'] ? o['@graph'] : [o];
      for (const x of arr) if (x && x['@type']) types.push([].concat(x['@type']).join('+'));
    } catch (e) { types.push('INVALID_JSON'); }
  }
  const imgs = [...c.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt\s*=\s*["'][^"']+["']/i.test(t)).length;
  rows.push({
    name, f,
    title: one(h, /<title[^>]*>([\s\S]*?)<\/title>/i),
    desc: one(h, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i),
    canonical: one(h, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    og: !!one(h, /property=["']og:title["']/i),
    ogImg: one(h, /property=["']og:image["'][^>]+content=["']([^"']*)["']/i),
    tw: !!one(h, /name=["']twitter:card["']/i),
    h1: (c.match(/<h1\b/gi) || []).length,
    lang: one(c, /<html[^>]+lang=["']([^"']*)["']/i),
    hreflang: (h.match(/hreflang=/gi) || []).length,
    ld, types,
    imgTotal: imgs.length, imgNoAlt: noAlt,
    jsonldRaw: types.length,
  });
}

console.log('========== 页面级 SEO ==========\n');
for (const r of rows) {
  if (r.missing) { console.log(`❌ ${r.name} — 缺失 ${r.f}\n`); continue; }
  const ok = (b) => (b ? '✅' : '❌');
  console.log(`【${r.name}】${r.f}`);
  console.log(`  title    ${r.title ? r.title.length + '字符  ' + r.title : '❌ 缺失'}`);
  console.log(`  desc     ${r.desc ? r.desc.length + '字符  ' + r.desc.slice(0, 80) : '❌ 缺失'}`);
  console.log(`  canonical ${r.canonical || '❌ 缺失'}`);
  console.log(`  og/twitter ${ok(r.og)}${ok(r.tw)}  og:image ${r.ogImg ? '✅' : '❌'}`);
  console.log(`  <html lang> ${r.lang || '❌'}   hreflang ${r.hreflang}`);
  console.log(`  H1 数量 ${r.h1 === 1 ? '✅ 1' : (r.h1 === 0 ? '❌ 0' : '⚠️ ' + r.h1)}   图片 ${r.imgTotal} 张，缺 alt ${r.imgNoAlt}`);
  console.log(`  JSON-LD  ${r.types.length ? '✅ ' + r.types.join(', ') : '❌ 无'}`);
  console.log('');
}
