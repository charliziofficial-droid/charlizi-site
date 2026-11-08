const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIST = path.join(__dirname, '..', 'dist');

// 1) 已删款式
const del = path.join(DIST, 'products', 'shapewear', 'deep-v-lace-bodysuit-multi-color', 'index.html');
console.log('=== 1. 删除验证 ===');
console.log('详情页仍存在:', fs.existsSync(del), '(应为 false)');

const swp = path.join(DIST, 'products', 'shapewear', 'index.html');
const sw = fs.readFileSync(swp, 'utf8');
console.log('shapewear 页仍引用该款:', sw.includes('deep-v-lace-bodysuit-multi-color'));
const swLinks = [...new Set([...sw.matchAll(/href="\/products\/shapewear\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]))];
console.log('shapewear 剩余款式:', swLinks.join(', '));

// 全站搜索残留
let dangling = 0;
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html') || f.endsWith('.xml')) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.includes('deep-v-lace-bodysuit-multi-color')) { dangling++; console.log('  残留:', p.replace(DIST, '')); }
    }
  }
}
walk(DIST);
console.log('dist 全站残留文件数:', dangling);

// 2) 分类封面图
console.log('\n=== 2. 分类封面图 ===');
const idx = fs.readFileSync(path.join(DIST, 'products', 'index.html'), 'utf8');
const src = fs.readFileSync(path.join(__dirname, '..', 'src/data/products-b2b.js'), 'utf8');
const cats = [...new Set([...src.matchAll(/id: '([a-z-]+)',[\s\S]*?image: '([^']+)'/g)].map((m) => `${m[1]}|${m[2]}`))];

const list = cats.map((c) => c.split('|')).filter(([id]) => ['bra-sets', 'bras', 'plus-size-bras', 'panties', 'silicone-bras', 'shapewear', 'camisoles', 'sleepwear'].includes(id));
const arg = JSON.stringify(list.map(([id, img]) => ({ id, abs: path.join(__dirname, '..', 'public', img), img })));
const out = execFileSync('python', ['-c', `
import json,sys
from PIL import Image, ImageChops
for it in json.loads(sys.argv[1]):
    im=Image.open(it['abs']).convert('RGB')
    bg=Image.new('RGB',im.size,(255,255,255))
    bb=ImageChops.difference(im,bg).convert('L').point(lambda x:255 if x>14 else 0).getbbox()
    cw,ch=bb[2]-bb[0],bb[3]-bb[1]
    print('%s|%dx%d|%.1f|%s' % (it['id'],im.width,im.height,(cw*ch)/(im.width*im.height)*100,it['img'].split('/')[-1]))
`, arg], { encoding: 'utf8' });

for (const line of out.trim().split('\n')) {
  const [id, dim, fill, file] = line.split('|');
  const live = idx.includes(file);
  console.log(`${id.padEnd(16)} ${dim.padEnd(10)} fill ${fill.padStart(5)}%  ${live ? '首页引用✅' : '❌未引用'}  ${file}`);
}
