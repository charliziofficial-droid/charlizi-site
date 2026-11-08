import os
import re
from PIL import Image, ImageDraw

os.makedirs('tmp', exist_ok=True)
src = open('src/data/products-b2b.js', encoding='utf-8').read()
cats = re.findall(r"id: '([a-z-]+)',[\s\S]*?image: '([^']+)'", src)

# 每个分类的候选（第1名新图）
picks = {
    'bra-sets': 'bra-sets/a1112-front.webp',
    'bras': 'bras/b1133-front.webp',
    'plus-size-bras': 'plus-size-bras/pink-lace-halter-bra-panty-set-plus-size-front.webp',
    'panties': 'panties/c312-front.webp',
    'silicone-bras': 'silicone-bras/j1074-front.webp',
    'shapewear': 'shapewear/a8168-front.webp',
    'camisoles': 'camisoles/b6051-front.webp',
    'sleepwear': 'sleepwear/black-leopard-sheer-cami-nightdress-front.webp',
}

TW, TH = 200, 250
rows = 2
sheet = Image.new('RGB', (TW * 4, (TH + 26) * rows * 2 + 30), (255, 255, 255))
d = ImageDraw.Draw(sheet)

# 上半：当前
d.text((8, 6), 'CURRENT (old)', fill=(200, 30, 30))
for i, (cid, img) in enumerate(cats):
    p = 'public' + img
    im = Image.open(p).convert('RGB')
    im.thumbnail((TW - 10, TH - 10))
    cx = (i % 4) * TW
    cy = 22 + (i // 4) * (TH + 26)
    d.rectangle([cx, cy, cx + TW, cy + TH], outline=(210, 210, 210))
    sheet.paste(im, (cx + (TW - im.width) // 2, cy + (TH - im.height) // 2))
    d.text((cx + 5, cy + TH + 4), cid, fill=(30, 30, 30))

# 下半：新候选
off = (TH + 26) * rows + 30
d.text((8, off + 4), 'PROPOSED (new D-drive, 94% fill)', fill=(20, 140, 60))
for i, cid in enumerate(['bra-sets', 'bras', 'plus-size-bras', 'panties', 'silicone-bras', 'shapewear', 'camisoles', 'sleepwear']):
    p = 'public/factory/images/products-cards/' + picks[cid]
    im = Image.open(p).convert('RGB')
    im.thumbnail((TW - 10, TH - 10))
    cx = (i % 4) * TW
    cy = off + 22 + (i // 4) * (TH + 26)
    d.rectangle([cx, cy, cx + TW, cy + TH], outline=(210, 210, 210))
    sheet.paste(im, (cx + (TW - im.width) // 2, cy + (TH - im.height) // 2))
    d.text((cx + 5, cy + TH + 4), cid, fill=(30, 30, 30))

sheet.save('tmp/cat-compare.png')
print('saved tmp/cat-compare.png', sheet.size)
