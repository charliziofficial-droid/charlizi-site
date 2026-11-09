# -*- coding: utf-8 -*-
"""第二轮：把每篇的站内链接补到 >=3"""
import io, os, re

BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'

# slug -> [(anchor, replacement)]
FIX = {}

FIX['adhesive-bra-spec-guide'] = [(
    '<p>\n        Specify pass and fail numbers for each, and write them into the purchase order. Without numbers, the\n        answer to "did it pass" is always yes. See\n        <a href="/blog/silicone-bra-manufacturing">silicone bra manufacturing</a> for how cure parameters\n        drive these outcomes, and\n        <a href="/blog/silicone-cup-moulding-process">the moulding process walkthrough</a> for where they are\n        set.\n      </p>',
    '<p>\n        Specify pass and fail numbers for each, and write them into the purchase order. Without numbers, the\n        answer to "did it pass" is always yes. See\n        <a href="/blog/silicone-bra-manufacturing">silicone bra manufacturing</a> for how cure parameters\n        drive these outcomes, and\n        <a href="/blog/silicone-cup-moulding-process">the moulding process walkthrough</a> for where they are\n        set. Because there is no band to adjust, size does the work a hook-and-eye does on a wired bra -\n        our <a href="/blog/size-grading">size grading guide</a> covers how the range should be built.\n      </p>',
)]

FIX['bra-anatomy'] = [(
    '<p>\n        A wirefree bra with four panels often costs about the same as an underwire with two. You removed the\n        wire, the casing and the insertion operation, and spent the saving on fabric and seams instead.\n      </p>',
    '<p>\n        A wirefree bra with four panels often costs about the same as an underwire with two. You removed the\n        wire, the casing and the insertion operation, and spent the saving on fabric and seams instead.\n        That trade is set out in more detail in\n        <a href="/blog/wirefree-vs-underwire">wirefree versus underwire</a>.\n      </p>',
)]

FIX['bra-set-development'] = [(
    '<p>\n        Follow that order and a set programme runs about four to six weeks longer than two independent\n        garments. Skip it and it runs longer still, with a colour problem at the end.\n      </p>',
    '<p>\n        Follow that order and a set programme runs about four to six weeks longer than two independent\n        garments. Skip it and it runs longer still, with a colour problem at the end. The panty half has\n        its own four decisions - see the <a href="/blog/panty-fit-guide">panty fit guide</a> - and the bra\n        half is worth reading alongside <a href="/blog/bra-anatomy">bra anatomy</a> and\n        <a href="/blog/size-grading">size grading</a>.\n      </p>',
)]

FIX['bulk-vs-small-batch'] = [(
    '<p>\n        The rule we give brands: commit to bulk when you can forecast sell-through within roughly\n        a quarter. Below that confidence, small batch is cheaper even at the higher unit price.\n      </p>',
    '<p>\n        The rule we give brands: commit to bulk when you can forecast sell-through within roughly\n        a quarter. Below that confidence, small batch is cheaper even at the higher unit price. If cost per\n        unit is the constraint, see <a href="/blog/bra-anatomy">where unit cost actually sits</a> before\n        assuming volume is the only lever.\n      </p>',
)]

FIX['choosing-bra-manufacturer'] = [(
    '<p>\n        That is the real test of a manufacturing partner: how little work a reorder is.\n      </p>',
    '<p>\n        That is the real test of a manufacturing partner: how little work a reorder is. For the pricing\n        mechanics behind a first order, see <a href="/blog/bulk-vs-small-batch">bulk versus small\n        batch</a>.\n      </p>',
)]

FIX['oeko-tex-certification'] = [(
    '<p>\n        This is why you should confirm the certified scope covers <em>your</em> bill of materials at quoting\n        stage, not after sampling. A factory quoting a new seasonal fabric that falls outside their existing\n        certificate is quoting you a compliance problem, whether or not they mention it.\n      </p>',
    '<p>\n        This is why you should confirm the certified scope covers <em>your</em> bill of materials at quoting\n        stage, not after sampling. A factory quoting a new seasonal fabric that falls outside their existing\n        certificate is quoting you a compliance problem, whether or not they mention it. Where that fabric\n        lands in the garment is set out in <a href="/blog/bra-anatomy">bra anatomy</a>.\n      </p>',
)]

FIX['panty-fit-guide'] = [(
    '<p>\n        Front rise and back rise in centimetres, per size</p>',
    '<p>\n        Front rise and back rise in centimetres, per size</p>',
)]

FIX['panty-fit-guide'] = [(
    '<p>\n        None of this is exotic. It is simply the difference between specifying a panty and ordering one.\n        The brands with the lowest returns in this category almost always turn out to have a spec sheet\n        with numbers on it rather than adjectives.\n      </p>',
    '<p>\n        None of this is exotic. It is simply the difference between specifying a panty and ordering one.\n        The brands with the lowest returns in this category almost always turn out to have a spec sheet\n        with numbers on it rather than adjectives. For how the rise and gusset grade across a size run, see\n        <a href="/blog/size-grading">size grading</a>, and for the matching top half,\n        <a href="/blog/bra-set-development">bra set development</a>.\n      </p>',
)]

FIX['shapewear-manufacturing'] = [(
    '<p>\n        Each test maps to a specific complaint. A factory reporting only visual inspection and flat\n        measurements is testing the two things customers rarely complain about.\n      </p>',
    '<p>\n        Each test maps to a specific complaint. A factory reporting only visual inspection and flat\n        measurements is testing the two things customers rarely complain about. For how those acceptance\n        criteria get onto a purchase order, see\n        <a href="/blog/choosing-bra-manufacturer">choosing a bra manufacturer</a>.\n      </p>',
)]

FIX['silicone-bra-manufacturing'] = [(
    '<p>\n        You cannot detect under-cure by looking at a finished cup. You detect it by squeeze-testing against a\n        light for cloudiness, and by tear-testing a nicked edge. Both are manual, both are cheap, and both are\n        skipped by factories paid per dozen rather than per accepted lot.\n      </p>',
    '<p>\n        You cannot detect under-cure by looking at a finished cup. You detect it by squeeze-testing against a\n        light for cloudiness, and by tear-testing a nicked edge. Both are manual, both are cheap, and both are\n        skipped by factories paid per dozen rather than per accepted lot. The\n        <a href="/blog/silicone-cup-moulding-process">moulding process walkthrough</a> shows where the cure\n        cycle sits in the line.\n      </p>',
)]

FIX['silicone-cup-moulding-process'] = [(
    '<p>\n        Both are cheap to monitor and expensive to discover in returns, which is why retention of a first\n        article approved sample is worth insisting on. Downstream of moulding, the adhesive stage is where\n        most field failures originate - see the <a href="/blog/adhesive-bra-spec-guide">adhesive bra spec\n        guide</a>.\n      </p>',
    '<p>\n        Both are cheap to monitor and expensive to discover in returns, which is why retention of a first\n        article approved sample is worth insisting on. Downstream of moulding, the adhesive stage is where\n        most field failures originate - see the <a href="/blog/adhesive-bra-spec-guide">adhesive bra spec\n        guide</a>. For the cure chemistry itself, read\n        <a href="/blog/silicone-bra-manufacturing">silicone bra manufacturing</a>.\n      </p>',
)]

FIX['size-grading'] = [(
    '<p>\n        Minimum viable fit set for a new block: the base size, one size either side, plus both extremes.\n        Above a DD, add the size at which the wire length changes category.\n      </p>',
    '<p>\n        Minimum viable fit set for a new block: the base size, one size either side, plus both extremes.\n        Above a DD, add the size at which the wire length changes category. The wire side of that problem is\n        covered in <a href="/blog/wirefree-vs-underwire">wirefree versus underwire</a>.\n      </p>',
)]

FIX['wirefree-vs-underwire'] = [(
    '<p>\n        Wirefree is not uniformly more expensive, and the usual assumption gets the direction\n        backwards.\n      </p>',
    '<p>\n        Wirefree is not uniformly more expensive, and the usual assumption gets the direction\n        backwards. See <a href="/blog/bra-anatomy">bra anatomy</a> for how each component contributes to\n        the total.\n      </p>',
)]

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

print('---- 最终站内链接数 ----')
import glob
for p in sorted(glob.glob(os.path.join(BLOG, '*.astro'))):
    name = os.path.basename(p)
    if name.startswith('['):
        continue
    s = io.open(p, encoding='utf-8').read()
    inner = sorted(set(re.findall(r'href="(/blog/[^"#]+)"', s)))
    print('%-36s %d  %s' % (name[:-6], len(inner),
                            ', '.join(x.replace('/blog/', '') for x in inner)))
