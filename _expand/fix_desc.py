# -*- coding: utf-8 -*-
"""收敛 description 到 <=165 字符"""
import io, os, re

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
BLOG = os.path.join(ROOT, 'src', 'pages', 'blog')

FIX = {
    'bra-set-development': (
        "Matching a bra and panty set is harder than making either piece alone — fabric dye lots, elastic colour, trim continuity and the grading mismatch nobody warns you about.",
        "Matching a bra and panty set is harder than making either piece — dye lots, elastic colour, trim continuity and the grading mismatch nobody warns you about.",
    ),
    'wirefree-vs-underwire': (
        "The real manufacturing differences between wirefree and underwire bras — pattern complexity, support structures, grading costs and how to choose for your product line.",
        "Wirefree vs underwire: the real manufacturing differences — pattern complexity, support structures, grading cost and how to choose for your product line.",
    ),
}

for slug, (old, new) in FIX.items():
    p = os.path.join(BLOG, slug + '.astro')
    s = io.open(p, encoding='utf-8').read()
    assert s.count(old) == 1, slug
    s = s.replace(old, new)
    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    print('%-32s %d -> %d' % (slug, len(old), len(new)))
