"""为 bra-set-development 文章生成专属头图（用真实套装产品图）。"""
import os
from PIL import Image

SRC = 'public/factory/images/products-cards/bra-sets'
OUT = 'public/factory/images'
RESPO = os.path.join(OUT, 'responsive')
TW, TH = 1600, 1000

JOBS = [
    ('a1112-front.webp', 'blog-bra-set-hero.webp'),
    ('b2046-front.webp', 'blog-bra-set-detail.webp'),
]

for src_name, out_name in JOBS:
    src = os.path.join(SRC, src_name)
    if not os.path.exists(src):
        print('MISSING', src)
        continue
    im = Image.open(src).convert('RGB')
    sw, sh = im.size
    r = TW / TH
    if sw / sh > r:
        nw = int(sh * r); left = (sw - nw) // 2
        im = im.crop((left, 0, left + nw, sh))
    else:
        nh = int(sw / r); top = max(0, (sh - nh) // 2)
        im = im.crop((0, top, sw, top + nh))
    im = im.resize((TW, TH), Image.LANCZOS)
    im.save(os.path.join(OUT, out_name), 'WEBP', quality=88, method=6)
    for w in (480, 768, 1024):
        h = int(TH * w / TW)
        im.resize((w, h), Image.LANCZOS).save(
            os.path.join(RESPO, out_name.replace('.webp', f'@{w}.webp')), 'WEBP', quality=85, method=6)
    print('OK', out_name, os.path.getsize(os.path.join(OUT, out_name)) // 1024, 'KB')
