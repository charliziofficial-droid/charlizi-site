const fs = require('fs');
const path = require('path');

const D = path.join(__dirname, '..', 'dist');
const SITE = 'https://charlizi.com';

function walk(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(D);
console.log(`总 HTML 页面: ${files.length}\n`);

const issues = {
  noTitle: [], longTitle: [], shortTitle: [],
  noDesc: [], longDesc: [], shortDesc: [],
  noCanonical: [], badCanonical: [],
  h1zero: [], h1multi: [],
  noLD: [], ldInvalid: [],
  imgNoAlt: [],
  thinContent: [],
  selfCanon: [],
};
let totWords = 0, totImgs = 0, totNoAlt = 0, maxWords = 0;
const ldTypeCount = {};

for (const p of files) {
  const rel = p.replace(D, '').replace(/\\/g, '/');
  const c = fs.readFileSync(p, 'utf8');
  const hm = c.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const h = hm ? hm[1] : '';

  const t = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = t ? t[1].trim() : null;
  if (!title) issues.noTitle.push(rel);
  else {
    if (title.length > 60) issues.longTitle.push(`${rel} (${title.length})`);
    if (title.length < 20) issues.shortTitle.push(`${rel} (${title.length})`);
  }

  const dm = h.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || h.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const desc = dm ? dm[1] : null;
  if (!desc) issues.noDesc.push(rel);
  else {
    if (desc.length > 160) issues.longDesc.push(`${rel} (${desc.length})`);
    if (desc.length < 70) issues.shortDesc.push(`${rel} (${desc.length})`);
  }

  const cm = h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  if (!cm) issues.noCanonical.push(rel);
  else {
    const href = cm[1];
    if (!href.startsWith('https://charlizi.com')) issues.badCanonical.push(`${rel} -> ${href}`);
    const expect = SITE + (rel === '/index.html' ? '/' : rel.replace(/index\.html$/, ''));
    if (href !== expect && !href.replace(/\/$/, '') !== expect.replace(/\/$/, '')) issues.selfCanon.push(`${rel} -> ${href}`);
  }

  const h1 = (c.match(/<h1\b/gi) || []).length;
  if (h1 === 0) issues.h1zero.push(rel);
  else if (h1 > 1) issues.h1multi.push(`${rel} (${h1})`);

  const ld = [...c.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  if (!ld.length) issues.noLD.push(rel);
  for (const j of ld) {
    try {
      const o = JSON.parse(j);
      const arr = Array.isArray(o) ? o : o['@graph'] ? o['@graph'] : [o];
      for (const x of arr) {
        if (!x || !x['@type']) continue;
        for (const ty of [].concat(x['@type'])) ldTypeCount[ty] = (ldTypeCount[ty] || 0) + 1;
      }
    } catch (e) { issues.ldInvalid.push(rel); break; }
  }

  const imgs = [...c.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  totImgs += imgs.length;
  const na = imgs.filter((x) => !/\balt\s*=\s*["'][^"']+["']/i.test(x));
  totNoAlt += na.length;
  if (na.length) issues.imgNoAlt.push(`${rel} (${na.length}/${imgs.length})`);

  const body = c.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const words = body.split(/\s+/).filter((w) => /[a-zA-Z]{2,}/.test(w)).length;
  totWords += words;
  if (words > maxWords) maxWords = words;
  if (words < 150) issues.thinContent.push(`${rel} (${words})`);
}

const show = (label, arr, cap = 8) => {
  console.log(`${label}: ${arr.length}`);
  arr.slice(0, cap).forEach((x) => console.log('   · ' + x));
  if (arr.length > cap) console.log(`   ... 还有 ${arr.length - cap} 个`);
};

console.log('========== 全站 SEO 问题 ==========\n');
show('缺 title', issues.noTitle);
show('title 过长(>60)', issues.longTitle);
show('title 过短(<20)', issues.shortTitle);
show('缺 description', issues.noDesc);
show('description 过长(>160)', issues.longDesc);
show('description 过短(<70)', issues.shortDesc);
show('缺 canonical', issues.noCanonical);
show('canonical 非本站域名', issues.badCanonical);
show('canonical 与自身 URL 不符', issues.selfCanon, 5);
show('H1 为 0', issues.h1zero);
show('H1 多个', issues.h1multi);
show('无 JSON-LD', issues.noLD);
show('JSON-LD 解析失败', issues.ldInvalid);
show('图片缺 alt', issues.imgNoAlt, 6);
console.log(`图片总数 ${totImgs}，缺 alt ${totNoAlt} (${(totNoAlt / totImgs * 100).toFixed(2)}%)\n`);
show('内容过薄(<150 词)', issues.thinContent, 6);

console.log('\n========== 结构化数据类型分布 ==========');
Object.entries(ldTypeCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k.padEnd(28)} ${v}`));
console.log(`\n全站总词数 ${totWords.toLocaleString()}，单页最多 ${maxWords} 词，平均 ${Math.round(totWords / files.length)} 词`);
