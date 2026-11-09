# -*- coding: utf-8 -*-
"""第四轮：剩下 5 篇各补 1 条"""
import io, os, re, glob

BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'

FIX = {
    'bra-anatomy': [(
        'The pattern here is consistent: construction choice moves cost between labour, machinery and material,\n        and rarely changes the total as much as buyers expect. What does change is the minimum quantity at\n        which the construction makes sense.',
        'The pattern here is consistent: construction choice moves cost between labour, machinery and material,\n        and rarely changes the total as much as buyers expect. What does change is the minimum quantity at\n        which the construction makes sense. Size range is the other lever - see\n        <a href="/blog/size-grading">size grading</a>.',
    )],
    'oeko-tex-certification': [(
        'It is <strong>expires annually</strong>. Ask for the current cycle rather than a PDF from three years ago.',
        'It is <strong>expires annually</strong>. Ask for the current cycle rather than a PDF from three years ago.',
    )],
    'shapewear-manufacturing': [(
        'Edge construction sits alongside the bonded seam problem - see <a href="/blog/wirefree-vs-underwire">wirefree versus underwire</a> for how construction choices redistribute cost.',
        'Edge construction sits alongside the bonded seam problem - see <a href="/blog/wirefree-vs-underwire">wirefree versus underwire</a> for how construction choices redistribute cost, and <a href="/blog/choosing-bra-manufacturer">how to choose a manufacturer</a> for what to verify on the line.',
    )],
    'silicone-bra-manufacturing': [(
        'The price gap between these two quotes is real, and it is usually the whole explanation for a bid\n        that lands far under the others.',
        'The price gap between these two quotes is real, and it is usually the whole explanation for a bid\n        that lands far under the others. Tooling ownership is the other fixed cost - see\n        <a href="/blog/bulk-vs-small-batch">bulk versus small batch</a> for how it amortises.',
    )],
    'wirefree-vs-underwire': [(
        'It is not a preference; it is the tooling maths. See <a href="/blog/bra-anatomy">bra anatomy</a> for how the components break down, and <a href="/blog/bulk-vs-small-batch">bulk versus small batch</a> for how tooling amortisation behaves across order sizes.',
        'It is not a preference; it is the tooling maths. See <a href="/blog/bra-anatomy">bra anatomy</a> for how the components break down, <a href="/blog/bulk-vs-small-batch">bulk versus small batch</a> for how tooling amortisation behaves across order sizes, and <a href="/blog/shapewear-manufacturing">shapewear manufacturing</a> for the compression-led end of the same problem.',
    )],
}

for slug, pairs in FIX.items():
    p = os.path.join(BLOG, slug + '.astro')
    s = io.open(p, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        if n != 1:
            print('!! %s anchor %d :: %r' % (slug, n, old[:60]))
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
    print('%s %-34s %d' % (flag, name[:-6], len(inner)))
