const fs = require('fs');
const path = require('path');
const https = require('https');

const D = path.join(__dirname, '..', 'dist');

// 1) sitemap
const sm = fs.readFileSync(path.join(D, 'sitemap-0.xml'), 'utf8');
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log('========== SITEMAP ==========');
console.log('URL 总数:', urls.length);
const adminInSm = urls.filter((u) => /\/(admin|dashboard|manage|decapcms)/.test(u));
console.log('sitemap 含后台页:', adminInSm.length, adminInSm.slice(0, 5).join(', '));
const dup = urls.filter((u, i) => urls.indexOf(u) !== i);
console.log('重复 URL:', dup.length);
const withSlash = urls.filter((u) => u.endsWith('/')).length;
console.log('带末尾斜杠:', withSlash, '/', urls.length);
console.log('lastmod 存在:', /<lastmod>/.test(sm));
console.log('示例前 3:', urls.slice(0, 3).join('\n            '));

// 2) 内链连通性：所有 HTML 里的站内链接是否都有对应文件
console.log('\n========== 内链完整性 ==========');
function walk(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, out); else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = walk(D);
const exists = new Set(files.map((p) => p.replace(D, '').replace(/\\/g, '/').replace(/index\.html$/, '')));
const broken = new Map();
let total = 0;
for (const p of files) {
  const rel = p.replace(D, '').replace(/\\/g, '/');
  if (/\/(admin|dashboard|manage)/.test(rel)) continue;
  const c = fs.readFileSync(p, 'utf8');
  for (const m of c.matchAll(/href=["'](\/[^"'#?]*)/g)) {
    total++;
    let href = m[1];
    if (/\.(css|js|png|jpg|jpeg|webp|svg|ico|txt|xml|pdf|json|woff2?)$/i.test(href)) continue;
    const norm = href.replace(/index\.html$/, '');
    const key = norm.endsWith('/') ? norm : norm + '/';
    if (!exists.has(key) && !exists.has(norm)) {
      if (!broken.has(href)) broken.set(href, new Set());
      broken.get(href).add(rel);
    }
  }
}
console.log('站内链接总数:', total);
console.log('失效链接:', broken.size);
[...broken.entries()].slice(0, 10).forEach(([h, s]) => console.log(`  ❌ ${h}  ← ${[...s].slice(0, 2).join(', ')}${s.size > 2 ? ` (+${s.size - 2})` : ''}`));

// 3) AI 爬虫可见性：内容是否在静态 HTML 里（非 JS 渲染）
console.log('\n========== GEO / AI 可读性 ==========');
const home = fs.readFileSync(path.join(D, 'index.html'), 'utf8');
const noScript = home.replace(/<script[\s\S]*?<\/script>/gi, '');
const txt = noScript.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log('首页去 JS 后纯文本词数:', txt.split(' ').filter((w) => /[a-zA-Z]{2,}/.test(w)).length, '(应 > 300)');
console.log('首页含关键实体词:', ['manufacturer', 'OEM', 'MOQ', 'BSCI', 'bra'].map((w) => `${w}:${txt.toLowerCase().includes(w.toLowerCase()) ? '✅' : '❌'}`).join(' '));

const llms = fs.readFileSync(path.join(D, 'llms.txt'), 'utf8');
console.log('llms.txt 字符数:', llms.length, '| 链接数:', (llms.match(/https:\/\/charlizi\.com/g) || []).length);

// 4) 每个产品详情页是否真的有独特内容
console.log('\n========== 产品页内容唯一性 ==========');
const prodFiles = files.filter((p) => /products[\\/][a-z-]+[\\/][a-z0-9-]+[\\/]index\.html$/.test(p));
console.log('产品详情页:', prodFiles.length);
const sig = new Map();
for (const p of prodFiles) {
  const c = fs.readFileSync(p, 'utf8');
  const body = c.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const t = (c.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  sig.set(p, { title: t.trim(), len: body.length });
}
const titles = [...sig.values()].map((v) => v.title);
const dupT = titles.filter((t, i) => titles.indexOf(t) !== i);
console.log('重复 title 的产品页:', dupT.length, dupT.slice(0, 3).join(' | '));
const lens = [...sig.values()].map((v) => v.len);
console.log('内容长度 最少', Math.min(...lens), '最多', Math.max(...lens), '平均', Math.round(lens.reduce((a, b) => a + b, 0) / lens.length));
