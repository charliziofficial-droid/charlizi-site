# -*- coding: utf-8 -*-
"""扩写 bulk-vs-small-batch.astro"""
import io, os, re

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
PATH = os.path.join(ROOT, 'src', 'pages', 'blog', 'bulk-vs-small-batch.astro')

with io.open(PATH, encoding='utf-8') as f:
    src = f.read()

ANCHOR = '      <h2>When to Choose Small Batch</h2>'
assert src.count(ANCHOR) == 1, 'anchor count %d' % src.count(ANCHOR)

BLOCK = '''      <h2>What actually scales, and what never does</h2>
      <p>
        In a bra factory, cost splits into three buckets that behave completely differently as
        quantity moves.
      </p>
      <ul>
        <li><strong>Fixed and one-time:</strong> pattern making, grading across the size run, moulded-cup tooling, sample rounds. These do not change whether you order 200 or 20,000 pieces. They only get divided differently.</li>
        <li><strong>Per colour and per trim:</strong> dye lots, elastic matching, label print runs, packaging. These scale with SKU count rather than unit count, and they are the ones that quietly wreck a launch.</li>
        <li><strong>Per unit and genuinely variable:</strong> fabric, thread, elastic, labour minutes, cup shells. Here bulk really does help, mostly through cutting efficiency and line setup amortisation.</li>
      </ul>
      <p>
        Which means the 15-30% bulk discount you were quoted usually applies to the variable
        portion only. That portion is frequently less than half your landed unit cost.
      </p>

      <h2>The size-run trap</h2>
      <p>
        A bra is not one product. A three-size run of a single style is three patterns, three
        graded spec sheets and three sets of fit samples. Move to a full run of eight to ten sizes
        and your one-time cost roughly triples while your unit cost barely moves.
      </p>
      <p>
        New brands routinely order 300 pieces meaning 300 across S, M and L, then discover the
        factory priced it as three combinations at 100 each. If you want to test a style cheaply,
        test it in the one size that fits your core customer rather than three sizes done badly.
      </p>

      <h2>The cash-flow maths nobody runs</h2>
      <p>
        Small batch looks cheap per order and expensive per unit. Bulk looks expensive per order
        and cheap per unit. Which is better depends entirely on how fast you turn the stock.
      </p>
      <p>
        A worked example. At 200 pieces you might pay USD 8.50 landed; at 2,000 pieces, USD 6.20.
        That saves USD 2.30 a unit but ties up an extra USD 11,000 in inventory. If the stock sells
        through in ten weeks, bulk wins clearly. If it takes ten months, the working capital costs
        more than the discount bought.
      </p>
      <p>
        The rule we give brands: commit to bulk when you can forecast sell-through within roughly
        a quarter. Below that confidence, small batch is cheaper even at the higher unit price.
      </p>

      <h2>What small batch actually costs you</h2>
      <p>
        Two things worth naming out loud. First, line setup: every order pays the same machine
        threading, tensioning and first-piece approval time whether it runs for two hours or two
        days. Second, fabric minimums. Some laces and elastics are sold in mill minimums that exceed
        your entire small-batch order, so you buy the minimum and carry the remainder as dead stock.
      </p>
      <p>
        Neither is a reason to skip small batch. They are reasons to choose colourways around
        fabrics you can actually buy in your quantity, rather than the other way round.
      </p>

'''

src = src.replace(ANCHOR, BLOCK + ANCHOR)

TAIL_ANCHOR = '      <h2>Cost Comparison</h2>'
assert src.count(TAIL_ANCHOR) == 1
TAIL = '''      <h2>How the first order actually gets structured</h2>
      <p>
        In practice most first orders land on a split we recommend explicitly: a sampling round
        followed by a production run, priced as two separate purchase orders.
      </p>
      <ul>
        <li><strong>Sample round:</strong> one to three pieces per size, in the production fabric and colour, so the fit is real rather than approximate. This is where fit corrections happen, and it is cheap precisely because it is small.</li>
        <li><strong>Production run:</strong> quoted against the corrected spec, with the size breakdown locked, so the unit price reflects what you will actually buy.</li>
        <li><strong>Top-up clause:</strong> agree in writing that a reorder within a set window reuses the same patterns and dye lots at the production rate, so scaling up later is not treated as a new development.</li>
      </ul>
      <p>
        That third point is the one brands forget. Without it, a successful first season means
        paying development costs all over again on the reorder.
      </p>

      <h2>Signals that you are ready to go bulk</h2>
      <ul>
        <li>You have reordered the same style at least twice at small-batch volume.</li>
        <li>Returns are below roughly 10% and are not concentrated in one size.</li>
        <li>You know your size curve from real sales, not from assumption, so the size breakdown in a bulk order is not a guess.</li>
        <li>You can hold inventory for at least one full turn without it constraining cash.</li>
        <li>Fabric and colour decisions are locked, because a bulk order that changes lace mid-run cannot be re-cut.</li>
      </ul>

      <h2>Where this goes wrong most often</h2>
      <p>
        The failure pattern is consistent. A brand treats a small batch as a cheap version of a
        bulk order: same size range, same number of colourways, same trim count. That combination
        is the worst of both - you pay the setup cost of a full range spread across 200 units, and
        the unit price comes back barely better than a sample.
      </p>
      <p>
        Small batch works when it is genuinely narrow: one style, one or two sizes, one colour.
        Bulk works when it is genuinely broad and forecastable. The expensive mistake is buying
        narrow volume with broad complexity. See our
        <a href="/blog/size-grading">size grading guide</a> for how the size run drives cost, and
        <a href="/blog/choosing-bra-manufacturer">how to choose a manufacturer</a> for what to
        verify before you commit either way.
      </p>

'''

src = src.replace(TAIL_ANCHOR, TAIL + TAIL_ANCHOR)

with io.open(PATH, 'w', encoding='utf-8', newline='') as f:
    f.write(src)

txt = re.sub(r'<[^>]+>', ' ', src)
txt = re.sub(r'\s+', ' ', txt)
print('words ~', len(re.findall(r"[A-Za-z][A-Za-z'-]*", txt)))
print('h2', src.count('<h2'))
print('blocked ok')
