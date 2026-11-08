"""按填充率/居中/竖构图评分，为每个分类挑选最佳封面图（只用正面图、排错已删款）。"""
import os
import re
import json
from PIL import Image, ImageChops

base = 'public/factory/images/products-cards'
BAN = {'deep-v-lace-bodysuit-multi-color-front.webp'}


def score(path):
    try:
        im = Image.open(path).convert('RGB')
    except Exception:
        return None
    bg = Image.new('RGB', im.size, (255, 255, 255))
    bbox = ImageChops.difference(im, bg).convert('L').point(lambda x: 255 if x > 14 else 0).getbbox()
    if not bbox:
        return None
    W, H = im.size
    cw, ch = bbox[2] - bbox[0], bbox[3] - bbox[1]
    if cw < W * 0.15 or ch < H * 0.15:
        return None
    fill = (cw * ch) / (W * H)
    hcov = ch / H
    wcov = cw / W
    ml, mr = bbox[0], W - bbox[2]
    mt, mb = bbox[1], H - bbox[3]
    hoff = abs(ml - mr) / W
    voff = abs(mt - mb) / H
    aspect = ch / cw if cw else 0
    vbonus = 1.0 if aspect >= 1.0 else (0.75 if aspect >= 0.8 else 0.45)
    s = hcov * 40 + fill * 30 + (1 - hoff) * 12 + (1 - voff) * 8 + vbonus * 10
    if W < 900 or H < 900:
        s *= 0.6
    return dict(score=round(s, 2), w=W, h=H, content='%dx%d' % (cw, ch),
                fill=round(fill * 100, 1), hcov=round(hcov * 100, 1), wcov=round(wcov * 100, 1),
                margin='L%d T%d R%d B%d' % (ml, mt, mr, mb), path=path)


out = {}
for cat in sorted(os.listdir(base)):
    d = os.path.join(base, cat)
    if not os.path.isdir(d):
        continue
    rows = []
    for f in sorted(os.listdir(d)):
        if not f.endswith('.webp') or '@' in f or '-front' not in f or f in BAN:
            continue
        r = score(os.path.join(d, f))
        if r:
            r['file'] = f
            rows.append(r)
    rows.sort(key=lambda x: (-x['score'], x['file']))
    out[cat] = rows[:5]

print('%-16s %-58s %8s %8s %8s' % ('CATEGORY', 'BEST FILE', 'SCORE', 'HCOV', 'FILL'))
for cat, rows in out.items():
    if not rows:
        print('%-16s  (no candidates)' % cat)
        continue
    r = rows[0]
    print('%-16s %-58s %8.1f %7.1f%% %7.1f%%' % (cat, r['file'][:58], r['score'], r['hcov'], r['fill']))

os.makedirs('tmp', exist_ok=True)
json.dump(out, open('tmp/cat-picks.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('\nsaved tmp/cat-picks.json')
