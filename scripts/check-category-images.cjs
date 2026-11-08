// 检查 products 首页 8 个分类图的实际尺寸/比例
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const src = fs.readFileSync(path.join(__dirname, '..', 'src/data/products-b2b.js'), 'utf8');
const cats = [...src.matchAll(/id: '([a-z-]+)',[\s\S]*?image: '([^']+)'/g)].map((m) => ({ id: m[1], image: m[2] }));

const out = execFileSync('python', ['-c', `
import json,sys
from PIL import Image
items=json.loads(sys.argv[1])
res=[]
for it in items:
    p=it['abs']
    try:
        im=Image.open(p)
        res.append({'id':it['id'],'image':it['image'],'w':im.width,'h':im.height,'mode':im.mode,'size':__import__('os').path.getsize(p)})
    except Exception as e:
        res.append({'id':it['id'],'image':it['image'],'err':str(e)})
print(json.dumps(res))
`, JSON.stringify(cats.map((c) => ({ ...c, abs: path.join(__dirname, '..', 'public', c.image) })))], { encoding: 'utf8' });

console.log('分类 | 图片 | 尺寸 | 比例(aspect) | 文件大小');
for (const r of JSON.parse(out)) {
  if (r.err) { console.log(r.id, r.err); continue; }
  const ar = (r.w / r.h).toFixed(3);
  const tag = Math.abs(r.w / r.h - 0.8) < 0.02 ? '4:5 ✅' : (r.w === r.h ? '1:1 ⚠️' : `${ar} ⚠️`);
  console.log(`${r.id.padEnd(16)} | ${r.w}x${r.h} | ${tag.padEnd(10)} | ${(r.size / 1024).toFixed(0)} KB | ${r.image}`);
}
