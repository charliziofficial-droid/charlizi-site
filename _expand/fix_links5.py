# -*- coding: utf-8 -*-
"""第五轮：oeko / shapewear 各补 1 条"""
import io, os, re

BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'

FIX = {
    'oeko-tex-certification': [(
        'It <strong>expires annually</strong>. Ask for the current cycle rather than a PDF from three years ago.',
        'It <strong>expires annually</strong>. Ask for the current cycle rather than a PDF from three years ago. '
        'Our <a href="/blog/bulk-vs-small-batch">bulk versus small batch</a> guide covers how to write that '
        'requirement into a first purchase order.',
    )],
    'shapewear-manufacturing': [(
        'and <a href="/blog/choosing-bra-manufacturer">how to choose a manufacturer</a> for what to verify on the line.',
        'and <a href="/blog/choosing-bra-manufacturer">how to choose a manufacturer</a> for what to verify on the line. '
        'Compression and recovery testing is covered alongside size grading in '
        '<a href="/blog/size-grading">our grading guide</a>.',
    )],
}

for slug, pairs in FIX.items():
    p = os.path.join(BLOG, slug + '.astro')
    s = io.open(p, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        if n != 1:
            print('!! %s anchor %d' % (slug, n))
            continue
        s = s.replace(old, new)
    io.open(p, 'w', encoding='utf-8', newline='').write(s)

import glob
print('---- 最终 ----')
allok = True
for p in sorted(glob.glob(os.path.join(BLOG, '*.astro'))):
    name = os.path.basename(p)
    if name.startswith('['):
        continue
    s = io.open(p, encoding='utf-8').read()
    inner = sorted(set(re.findall(r'href="(/blog/[^"#]+)"', s)))
    flag = 'OK ' if len(inner) >= 3 else 'LOW'
    if len(inner) < 3:
        allok = False
    print('%s %-34s %d' % (flag, name[:-6], len(inner)))
print('ALL OK' if allok else 'STILL LOW')
