const fs = require('fs');
const path = require('path');

const D = path.join(__dirname, '..', 'dist', 'blog');

const posts = [
  ['bra-anatomy', 'Bra Anatomy'],
  ['wirefree-vs-underwire', 'Wirefree vs Underwire'],
  ['size-grading', 'Size Grading'],
  ['silicone-bra-manufacturing', 'Adhesive Silicone'],
  ['panty-fit-guide', 'Panties Are Where'],
  ['shapewear-manufacturing', 'Shapewear Manufacturing'],
  ['bra-set-development', 'Bra and Panty Set'],
  ['choosing-bra-manufacturer', 'Choose the Right Bra'],
  ['oeko-tex-certification', 'OEKO-TEX'],
  ['bulk-vs-small-batch', 'Bulk vs Small Batch'],
];

console.log('SLUG'.padEnd(30) + 'WORDS'.padStart(7) + '  H2' + '  IMG' + '  ALT  STATUS');
let total = 0;
for (const [slug, marker] of posts) {
  const p = path.join(D, slug, 'index.html');
  if (!fs.existsSync(p)) { console.log(slug.padEnd(30) + 'MISSING'); continue; }
  const c = fs.readFileSync(p, 'utf8');
  const body = c.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const words = body.split(/\s+/).filter((w) => /^[a-zA-Z]{2,}/.test(w)).length;
  total += words;
  const h2 = (c.match(/<h2\b/g) || []).length;
  const imgs = [...c.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const withAlt = imgs.filter((x) => /\balt\s*=\s*["'][^"']{10,}["']/i.test(x)).length;
  const isPlaceholder = /being developed/i.test(c);
  const ok = !isPlaceholder && words > 500 && h2 >= 4 && withAlt >= 1;
  const status = ok ? 'OK' : (isPlaceholder ? 'FAIL placeholder' : (words <= 500 ? 'WARN short' : 'WARN check'));
  console.log(
    slug.padEnd(30) + String(words).padStart(7) + String(h2).padStart(4) + String(imgs.length).padStart(5) + String(withAlt).padStart(5) + '  ' + status
  );
}
console.log('\n合计 ' + total + ' 词 | 平均 ' + Math.round(total / posts.length) + ' 词/篇');

// 索引页链接
const idx = fs.readFileSync(path.join(D, 'index.html'), 'utf8');
const links = [...idx.matchAll(/href="\/blog\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]);
console.log('\n博客索引页链接 (%d):', [...new Set(links)].length);
[...new Set(links)].forEach((l) => console.log('  ' + (fs.existsSync(path.join(D, l, 'index.html')) ? '✅' : '❌') + ' ' + l));
