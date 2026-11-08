"""把挑选出的分类封面图写回 products-b2b.js 的 image 字段，并同步 category-covers.json。"""
import json
import re
import os

picks = json.load(open('tmp/cat-picks.json', encoding='utf-8'))

# 1) products-b2b.js
p = 'src/data/products-b2b.js'
src = open(p, encoding='utf-8').read()
changed = []
for cat, rows in picks.items():
    if not rows:
        continue
    fname = rows[0]['file']
    # 定位该分类块中的 image 行
    pat = re.compile(r"(id: '%s',[\s\S]*?image: ')([^']+)(')" % re.escape(cat))
    m = pat.search(src)
    if not m:
        print('NOT FOUND:', cat)
        continue
    old = m.group(2)
    new = '/factory/images/products-cards/%s/%s' % (cat, fname)
    if old == new:
        continue
    src = src[:m.start(2)] + new + src[m.end(2):]
    changed.append((cat, old.split('/')[-1], fname))

open(p, 'w', encoding='utf-8').write(src)
print('products-b2b.js 修改 %d 个分类:' % len(changed))
for c, o, n in changed:
    print('  %-16s %s  ->  %s' % (c, o[:50], n[:50]))

# 2) category-covers.json：把新封面放到各分类首位，并剔除已删除款
cp = 'src/data/category-covers.json'
cov = json.load(open(cp, encoding='utf-8'))
for cat, rows in picks.items():
    if not rows or cat not in cov:
        continue
    fname = rows[0]['file']
    lst = [x for x in cov[cat] if x != 'deep-v-lace-bodysuit-multi-color-front.webp']
    lst = [fname] + [x for x in lst if x != fname]
    cov[cat] = lst
for k in cov:
    cov[k] = [x for x in cov[k] if x != 'deep-v-lace-bodysuit-multi-color-front.webp']
json.dump(cov, open(cp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('\ncategory-covers.json 已更新')
print('已删款引用残留:', sum(1 for k in cov for x in cov[k] if 'deep-v-lace' in x))
