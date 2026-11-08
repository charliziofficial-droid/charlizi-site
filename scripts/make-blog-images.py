"""为博客文章生成 16:10 头图 + 响应式变体。
图片取自真实产品图，确保图文对应。每篇文章可指定多张图（头图 + 正文插图）。
"""
import os
from PIL import Image

SRC = 'public/factory/images/products-cards'
OUT = 'public/factory/images'
RESPO = os.path.join(OUT, 'responsive')
TARGET_W, TARGET_H = 1600, 1000  # 16:10

# 每篇文章的配图：源图路径 -> 输出名 -> 说明
JOBS = {
    # 1. 文胸结构/工艺类 —— 用文胸细节图
    'bra-anatomy': [
        (f'{SRC}/bras/a5032-front.webp', 'blog-bra-anatomy-hero.webp'),
        (f'{SRC}/bras/b1133-front.webp', 'blog-bra-anatomy-detail.webp'),
    ],
    # 2. 无钢圈 vs 钢圈 —— 两款文胸对比
    'wirefree-vs-underwire': [
        (f'{SRC}/bras/cheetah-print-wirefree-bra-front.webp', 'blog-wirefree-underwire-hero.webp'),
        (f'{SRC}/bras/u06-front.webp', 'blog-wirefree-underwire-compare.webp'),
    ],
    # 3. 尺码放码/合体度 —— 加大码文胸
    'size-grading': [
        (f'{SRC}/plus-size-bras/black-lace-deep-v-bra-plus-size-front.webp', 'blog-size-grading-hero.webp'),
    ],
    # 4. 硅胶文胸制造 —— 硅胶类
    'silicone-bra-manufacturing': [
        (f'{SRC}/silicone-bras/j1074-front.webp', 'blog-silicone-bra-hero.webp'),
        (f'{SRC}/silicone-bras/adhesive-bra-push-up-nude-front.webp', 'blog-silicone-bra-detail.webp'),
    ],
    # 5. 内裤版型 —— 内裤类
    'panty-fit-guide': [
        (f'{SRC}/panties/c312-front.webp', 'blog-panty-fit-hero.webp'),
        (f'{SRC}/panties/black-red-lace-panties-front.webp', 'blog-panty-fit-detail.webp'),
    ],
    # 6. 塑身衣 —— 塑身类
    'shapewear-manufacturing': [
        (f'{SRC}/shapewear/a8168-front.webp', 'blog-shapewear-hero.webp'),
        (f'{SRC}/shapewear/black-mesh-deep-v-bodysuit-front.webp', 'blog-shapewear-detail.webp'),
    ],
}

os.makedirs(RESPO, exist_ok=True)
report = []

for topic, items in JOBS.items():
    for src, name in items:
        if not os.path.exists(src):
            report.append((name, 'MISSING SRC', src))
            continue
        im = Image.open(src).convert('RGB')
        sw, sh = im.size
        # 按 16:10 从中心裁切（产品图是 4:5 竖构图，需要裁掉上下）
        target_ratio = TARGET_W / TARGET_H
        src_ratio = sw / sh
        if src_ratio > target_ratio:
            # 太宽，裁左右
            nw = int(sh * target_ratio)
            left = (sw - nw) // 2
            im = im.crop((left, 0, left + nw, sh))
        else:
            # 太高，裁上下
            nh = int(sw / target_ratio)
            top = max(0, (sh - nh) // 2)
            im = im.crop((0, top, sw, top + nh))
        im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        out = os.path.join(OUT, name)
        im.save(out, 'WEBP', quality=88, method=6)
        # 响应式
        for w in (480, 768, 1024):
            h = int(TARGET_H * w / TARGET_W)
            im.resize((w, h), Image.LANCZOS).save(
                os.path.join(RESPO, name.replace('.webp', f'@{w}.webp')), 'WEBP', quality=85, method=6)
        report.append((name, f'{TARGET_W}x{TARGET_H}', f'{os.path.getsize(out)//1024}KB'))

print('%-42s %-14s %s' % ('FILE', 'SIZE', 'BYTES'))
for r in report:
    print('%-42s %-14s %s' % r)
print('\n共生成', len([r for r in report if r[1] != 'MISSING SRC']), '张头图')
