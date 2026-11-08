import os
from PIL import Image, ImageChops

fs = [
    'bra-sets/b2046-front.webp',
    'bras/b1133-front.webp',
    'plus-size-bras/pink-lace-halter-bra-panty-set-plus-size-front.webp',
    'panties/c312-front.webp',
    'silicone-bras/j1074-front.webp',
    'shapewear/a8168-front.webp',
    'camisoles/b6051-front.webp',
    'sleepwear/black-leopard-sheer-cami-nightdress-front.webp',
]
base = 'public/factory/images/products-cards/'
print('%-58s %-12s %8s %10s' % ('FILE', 'SIZE', 'FILL', 'KB'))
allok = True
for f in fs:
    p = base + f
    if not os.path.exists(p):
        print('%-58s MISSING' % f)
        allok = False
        continue
    im = Image.open(p).convert('RGB')
    bg = Image.new('RGB', im.size, (255, 255, 255))
    bb = ImageChops.difference(im, bg).convert('L').point(lambda x: 255 if x > 14 else 0).getbbox()
    cw, ch = bb[2] - bb[0], bb[3] - bb[1]
    fill = (cw * ch) / (im.width * im.height) * 100
    print('%-58s %-12s %7.1f%% %9d' % (f, '%dx%d' % (im.width, im.height), fill, os.path.getsize(p) // 1024))
print('\nALL FILES PRESENT:', allok)
