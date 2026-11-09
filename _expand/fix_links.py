# -*- coding: utf-8 -*-
"""为正文站内链接 <3 的文章补链接（插到对应段落末尾）"""
import io, os

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
BLOG = os.path.join(ROOT, 'src', 'pages', 'blog')

# slug -> (anchor_html, replacement_html)  anchor 必须唯一
FIX = {}

FIX['bra-anatomy'] = [
    (
        '<p>\n        The pattern here is consistent: construction choice moves cost between labour, machinery and material,\n        and rarely changes the total as much as buyers expect. What does change is the minimum quantity at\n        which the construction makes sense.\n      </p>',
        '<p>\n        The pattern here is consistent: construction choice moves cost between labour, machinery and material,\n        and rarely changes the total as much as buyers expect. What does change is the minimum quantity at\n        which the construction makes sense. For how that plays out on a whole style, see\n        <a href="/blog/bulk-vs-small-batch">bulk versus small batch sourcing</a>.\n      </p>',
    ),
]

FIX['shapewear-manufacturing'] = [
    (
        '<p>\n        A shapewear quote far below the others is almost always a circular-knit product being compared\n        against warp-knit bids. Check the construction line before the price line.\n      </p>',
        '<p>\n        A shapewear quote far below the others is almost always a circular-knit product being compared\n        against warp-knit bids. Check the construction line before the price line. The same discipline\n        applies to <a href="/blog/wirefree-vs-underwire">wirefree versus underwire</a>, where the\n        construction choice moves cost between categories rather than changing the total.\n      </p>',
    ),
]

FIX['size-grading'] = [
    (
        '<p>\n        If a factory\'s grade table has one increment for everything, the grading was done by scaling, and the\n        failures will appear at the ends of the range where scaling diverges from anatomy.\n      </p>',
        '<p>\n        If a factory\'s grade table has one increment for everything, the grading was done by scaling, and the\n        failures will appear at the ends of the range where scaling diverges from anatomy. For how the\n        same principle applies to the bottom half of a set, see the\n        <a href="/blog/panty-fit-guide">panty fit guide</a>.\n      </p>',
    ),
]

FIX['oeko-tex-certification'] = [
    (
        '<p>\n        Every serious factory in this category holds Standard 100 and a social audit. They are the entry\n        ticket, not a reason to choose one supplier over another. What actually separates suppliers is\n        whether they can hold a specification across a reorder, and no certificate covers that.\n      </p>',
        '<p>\n        Every serious factory in this category holds Standard 100 and a social audit. They are the entry\n        ticket, not a reason to choose one supplier over another. What actually separates suppliers is\n        whether they can hold a specification across a reorder, and no certificate covers that. For the\n        wider supplier evaluation, see <a href="/blog/choosing-bra-manufacturer">how to choose a bra\n        manufacturer</a>.\n      </p>',
    ),
]

FIX['silicone-cup-moulding-process'] = [
    (
        '<p>\n        Both are cheap to monitor and expensive to discover in returns, which is why retention of a first\n        article approved sample is worth insisting on.\n      </p>',
        '<p>\n        Both are cheap to monitor and expensive to discover in returns, which is why retention of a first\n        article approved sample is worth insisting on. Downstream of moulding, the adhesive stage is where\n        most field failures originate - see the <a href="/blog/adhesive-bra-spec-guide">adhesive bra spec\n        guide</a>.\n      </p>',
    ),
]

FIX['panty-fit-guide'] = [
    (
        '<p>\n        This test costs three sample units and one afternoon. It catches the failure modes that produce\n        one-star reviews, and it is the single highest-return activity in panty development.\n      </p>',
        '<p>\n        This test costs three sample units and one afternoon. It catches the failure modes that produce\n        one-star reviews, and it is the single highest-return activity in panty development. If the panty\n        is part of a set, read <a href="/blog/bra-set-development">set development</a> before you approve\n        colour, because dye lots are checked at the same stage.\n      </p>',
    ),
]


def main():
    for slug, pairs in FIX.items():
        p = os.path.join(BLOG, slug + '.astro')
        s = io.open(p, encoding='utf-8').read()
        for old, new in pairs:
            n = s.count(old)
            if n != 1:
                print('!! %s anchor count %d' % (slug, n))
                continue
            s = s.replace(old, new)
        io.open(p, 'w', encoding='utf-8', newline='').write(s)
        import re
        inner = len(set(re.findall(r'href="(/blog/[^"#]+)"', s)))
        print('%-32s inner=%d' % (slug, inner))


if __name__ == '__main__':
    main()
