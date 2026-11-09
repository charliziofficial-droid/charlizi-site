# -*- coding: utf-8 -*-
"""第三轮：补齐剩余 6 篇的站内链接到 >=3（用短锚点，避开长段落）"""
import io, os, re, glob

BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'

FIX = {}

FIX['oeko-tex-certification'] = [(
    'That settles the question faster than any email exchange.</p>',
    'That settles the question faster than any email exchange. For where those certified materials end up '
    'in the finished garment, see <a href="/blog/bra-anatomy">bra anatomy</a>.</p>',
)]

FIX['shapewear-manufacturing'] = [(
    'and the cost difference is real.\n      </p>',
    'and the cost difference is real. Edge construction sits alongside the bonded seam problem - see '
    '<a href="/blog/wirefree-vs-underwire">wirefree versus underwire</a> for how construction choices '
    'redistribute cost.\n      </p>',
)]

FIX['wirefree-vs-underwire'] = [(
    'It is not a preference; it is the tooling maths.',
    'It is not a preference; it is the tooling maths. See '
    '<a href="/blog/bra-anatomy">bra anatomy</a> for how the components break down, and '
    '<a href="/blog/bulk-vs-small-batch">bulk versus small batch</a> for how tooling amortisation behaves '
    'across order sizes.',
)]

FIX['panty-fit-guide'] = [(
    'and it is the single highest-return activity in panty development.',
    'and it is the single highest-return activity in panty development. For the bra half of the same '
    'programme, see <a href="/blog/bra-anatomy">bra anatomy</a>.',
)]

FIX['silicone-bra-manufacturing'] = [(
    'Confusing the two is the most common spec error on this product.</li>',
    'Confusing the two is the most common spec error on this product.</li>',
)]

FIX['silicone-cup-moulding-process'] = [(
    'article approved sample is worth insisting on.',
    'article approved sample is worth insisting on. If the tool is being developed for a small first '
    'order, read <a href="/blog/bulk-vs-small-batch">bulk versus small batch</a> before you commit to '
    'the die cost.',
)]

FIX['size-grading'] = [(
    'Above a DD, add the size at which the wire length changes category.',
    'Above a DD, add the size at which the wire length changes category. For how the cup itself is '
    'built, see <a href="/blog/bra-anatomy">bra anatomy</a>.',
)]

for slug, pairs in FIX.items():
    p = os.path.join(BLOG, slug + '.astro')
    s = io.open(p, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        if n != 1:
            print('!! %s anchor count %d :: %r' % (slug, n, old[:50]))
            continue
        s = s.replace(old, new)
    io.open(p, 'w', encoding='utf-8', newline='').write(s)

print('---- 最终 ----')
for p in sorted(glob.glob(os.path.join(BLOG, '*.astro'))):
    name = os.path.basename(p)
    if name.startswith('['):
        continue
    s = io.open(p, encoding='utf-8').read()
    inner = sorted(set(re.findall(r'href="(/blog/[^"#]+)"', s)))
    flag = 'OK ' if len(inner) >= 3 else 'LOW'
    print('%s %-34s %d  %s' % (flag, name[:-6], len(inner),
                               ', '.join(x.replace('/blog/', '') for x in inner)))
