"""为每个分类从现有 products-cards 里挑选最适合做分类封面的图。

评分维度（越符合分类卡片越好）：
1. 内容填充率 fill   —— 竖图内容占画布比例，越高越好（避免大片白边）
2. 水平居中 centering —— 内容左右边距差越小越好
3. 垂直居 top/bottom   —— 上下边距差越小越好
4. 内容高度覆盖率 hcov —— 内容高度 / 画布高度，越高越好（竖构图更饱满）
5. 分辨率              —— 至少 900x1125

输出：每个分类 top 8 候选，含评分与文件名。
"""
import os
import re
import json
from PIL import Image, ImageChops

CANDS = {}
base = 'public/factory/images/products-cards'


def content_bbox(path, thr=14):
    im = Image.open(path).convert('RGB')
    bg = Image.new('RGB', im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert('L')
    mask = diff.point(lambda x: 255 if x > thr else 0)
    return im, mask.getbbox()


def score(path):
    try:
        im, bbox = content_bbox(path)
    except Exception as e:
        return None
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
    # 竖构图优先：内容高宽比 >= 1.0
    aspect = ch / cw if cw else 0
    vertical_bonus = 1.0 if aspect >= 1.0 else (0.75 if aspect >= 0.8 else 0.5)

    s = (
        hcov * 40.0            # 内容高度覆盖率（最重要）
        + fill * 30.0          # 填充率
        + (1 - hoff) * 12.0    # 水平居中
        + (1 - voff) * 8.0     # 垂直居中
        + vertical_bonus * 10.0
    )
    # 分辨率门槛
    if W < 900 or H < 900:
        s *= 0.6
    return {
        'score': round(s, 2),
        'w': W, 'h': H,
        'content': '%dx%d' % (cw, ch),
        'fill': round(fill * 100, 1),
        'hcov': round(hcov * 100, 1),
        'wcov': round(wcov * 100, 1),
        'margin': 'L%d T%d R%d B%d' % (ml, mt, mr, mb),
        'path': path,
    }


for cat in sorted(os.listdir(base)):
    d = os.path.join(base, cat)
    if not os.path.isdir(d):
        continue
    rows = []
    for f in sorted(os.listdir(d)):
        if not f.endswith('.webp'):
            continue
        if '@' in f:
            continue
        # 只用正面图
        if '-front' not in f:
            continue
        p = os.path.join(d, f)
        r = score(p)
        if r:
            r['file'] = f
            rows.append(r)
    rows.sort(key=lambda x: -x['score'])
    CANDS[cat] = rows[:8]
    print('\n=== %s (%d 张正面图) ===' % (cat, len(rows)))
    for i, r in enumerate(rows[:8], 1):
        print('  %d. %-58s score %5.1f  hcov %4.1f%%  fill %4.1f%%  %s' % (
            i, r['file'][:58], r['score'], r['hcov'], r['fill'], r['margin']))

json.dump(CANDS, open('tmp/cat-candidates.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('\n已保存 tmp/cat-candidates.json')
