import re
from PIL import Image, ImageChops

src = open('src/data/products-b2b.js', encoding='utf-8').read()
cats = re.findall(r"id: '([a-z-]+)',[\s\S]*?image: '([^']+)'", src)

print('%-16s %-14s %-12s %s' % ('CATEGORY', 'IMAGE', 'CONTENT', 'FILL% / MARGIN'))
for cid, img in cats:
    p = 'public' + img
    im = Image.open(p).convert('RGB')
    bg = Image.new('RGB', im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert('L')
    bbox = diff.point(lambda x: 255 if x > 12 else 0).getbbox()
    if bbox:
        cw, ch = bbox[2] - bbox[0], bbox[3] - bbox[1]
        fill = (cw * ch) / (im.width * im.height) * 100
        ml, mt = bbox[0], bbox[1]
        mr, mb = im.width - bbox[2], im.height - bbox[3]
        print('%-16s %-14s %-12s %5.1f%%  L%d T%d R%d B%d' % (cid, '%dx%d' % (im.width, im.height), '%dx%d' % (cw, ch), fill, ml, mt, mr, mb))
    else:
        print('%-16s BLANK' % cid)
