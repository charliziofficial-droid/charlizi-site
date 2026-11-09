# -*- coding: utf-8 -*-
"""扩写 panty-fit-guide.astro"""
import io, os, re

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
PATH = os.path.join(ROOT, 'src', 'pages', 'blog', 'panty-fit-guide.astro')

with io.open(PATH, encoding='utf-8') as f:
    src = f.read()

A1 = '      <h2>1. Rise is a specification, not a style label</h2>'
assert src.count(A1) == 1
INS1 = '''      <h2>Why panties fail more often than bras</h2>
      <p>
        The reason is structural rather than a matter of attention. A bra has adjustable variables -
        straps, hook positions, band tension - that absorb fit error across a range of bodies. A panty
        has almost none. It either sits where the wearer expects or it does not, and there is no second
        chance once it is on the body.
      </p>
      <p>
        That is why the four decisions below are made on the tech pack rather than in the fitting room.
        By the time a first sample exists, the outcome is largely settled.
      </p>

'''
src = src.replace(A1, INS1 + A1)

A2 = '      <h2>What to put in the spec sheet</h2>'
assert src.count(A2) == 1
INS2 = '''      <h2>Where the cost actually sits</h2>
      <p>
        Buyers are often surprised that a panty and a bra can land within a dollar of each other. The
        breakdown explains it.
      </p>
      <ul>
        <li><strong>Fabric</strong> - the largest line on a basic panty, and the one most exposed to weight and recovery grade. This is where a cheap quote is cheap, and where it shows after the third wash.</li>
        <li><strong>Labour</strong> - proportional to panel count less than you would expect, but highly sensitive to gusset finishing, which is fiddly and often hand-guided.</li>
        <li><strong>Leg elastic</strong> - small per unit, disproportionate in effect. The grade decides returns more than any other component on the garment.</li>
        <li><strong>Trims</strong> - a bow, a charm, a printed care label: each one is a separate SKU with its own minimum order quantity.</li>
      </ul>
      <p>
        A panty quoted 30% below your other quotes is usually cheaper on fabric weight or on gusset
        finishing. Both are invisible in a photograph and obvious in wear.
      </p>

      <h2>The wash test you should run before bulk</h2>
      <p>
        Fit cannot be judged from a first-wear sample. Run three wash cycles at 40 degrees, tumble dry,
        then measure again: waistband height, front rise, leg opening circumference and overall length.
      </p>
      <ul>
        <li><strong>Length change under 2%</strong> - acceptable for cotton-rich jersey.</li>
        <li><strong>Leg opening growth over 5%</strong> - the elastic grade is wrong and the panty will ride up.</li>
        <li><strong>Any visible pilling at the gusset seam</strong> - the lining fibre or the stitch is wrong, and it will not improve.</li>
      </ul>
      <p>
        This test costs three sample units and one afternoon. It catches the failure modes that produce
        one-star reviews, and it is the single highest-return activity in panty development.
      </p>

'''
src = src.replace(A2, INS2 + A2)

with io.open(PATH, 'w', encoding='utf-8', newline='') as f:
    f.write(src)

txt = re.sub(r'<[^>]+>', ' ', src)
print('panty words ~', len(re.findall(r"[A-Za-z][A-Za-z'-]*", txt)), '| h2', src.count('<h2'))
