# -*- coding: utf-8 -*-
"""补到 1200：oeko / bra-anatomy / bra-set / size-grading / wirefree / choosing / silicone-cup"""
import io, os, re

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
BLOG = os.path.join(ROOT, 'src', 'pages', 'blog')

JOBS = []

JOBS.append(('oeko-tex-certification', '      <h2>BSCI vs OEKO-TEX vs ISO</h2>', '''<h2>Common myths worth correcting</h2>
<ul>
  <li><strong>"Standard 100 means the garment is organic."</strong> It does not. Fibre origin and chemical safety are separate questions, and organic content has its own certification chain.</li>
  <li><strong>"The factory is certified, so whatever it makes is certified."</strong> Only the named article categories are covered. New laces, new linings and new labels fall outside until added.</li>
  <li><strong>"It covers the whole supply chain."</strong> It covers the articles listed on the certificate, which the factory chose to submit. Dyeing and finishing subcontractors are covered only if they were in scope.</li>
  <li><strong>"It never expires if the product does not change."</strong> It renews annually regardless, because the limit values and the parameter list are themselves revised.</li>
</ul>
<p>
  Each of these is a claim a brand can put in marketing copy and later have to withdraw. Worth knowing
  before the copy is written rather than after.
</p>

'''))

JOBS.append(('bra-anatomy', '      <h2>How to use this in a supplier conversation</h2>', '''<h2>How construction choices move the price</h2>
<p>
  Three examples of the same silhouette, same size run, same colourway, priced very differently
  because of construction rather than material.
</p>
<ul>
  <li><strong>Two-panel cut-and-sew underwire</strong> - the reference point. Wire, casing, insertion operation, but minimal sewing and low material waste.</li>
  <li><strong>Four-panel wirefree</strong> - you remove the wire, the casing and the insertion operation, then add two extra panels, more seam allowance, more sewing minutes and firmer elastic. Unit cost lands close to the underwire version, often within five percent.</li>
  <li><strong>Bonded seamless</strong> - no sewing on the body, but bonding press time, higher tooling cost and per-lot peel testing. Cheapest at high volume, most expensive at low volume, and impossible to correct after the fact.</li>
</ul>
<p>
  The pattern here is consistent: construction choice moves cost between labour, machinery and material,
  and rarely changes the total as much as buyers expect. What does change is the minimum quantity at
  which the construction makes sense.
</p>

'''))

JOBS.append(('bra-set-development', '      <h2>What to put in the set spec</h2>', '''<h2>How to sequence a set programme</h2>
<p>
  Sets are lost to sequencing more often than to any technical problem, so the order of operations
  matters more than usual.
</p>
<ul>
  <li><strong>Lock the bra block first.</strong> The bra is the harder garment and the longer lead. Building the panty while the bra block is still moving means re-cutting the panty colour match against a design that then changes.</li>
  <li><strong>Submit lab dips for both fabric bases together</strong>, before either garment is approved. Two approvals that each match the reference and not each other is the standard way a set ships wrong.</li>
  <li><strong>Fit the two pieces on the same model in the same session.</strong> Retail buyers will see them together, and mismatches are far more obvious in combination than in isolation.</li>
  <li><strong>Order trims for the full size run at once.</strong> Trim minimums are per SKU, not per size, so splitting a trim order across two drops doubles the minimum.</li>
</ul>
<p>
  Follow that order and a set programme runs about four to six weeks longer than two independent
  garments. Skip it and it runs longer still, with a colour problem at the end.
</p>

'''))

JOBS.append(('size-grading', '      <h2>What a proper full-bust spec contains</h2>', '''<h2>What a grade table should look like</h2>
<p>
  A usable grade table is not a single increment column. It is a per-size row with the dimensions that
  actually change shape, stated separately.
</p>
<ul>
  <li>Underbust and full bust, as separate columns</li>
  <li>Cup depth, as its own column rather than inferred from bust</li>
  <li>Wire length and wire width, per size</li>
  <li>Wing height at side seam</li>
  <li>Strap width and strap length range</li>
  <li>Centre front height, because the gore has to tack at every size or the bra is not finished</li>
</ul>
<p>
  If a factory's grade table has one increment for everything, the grading was done by scaling, and the
  failures will appear at the ends of the range where scaling diverges from anatomy.
</p>

'''))

JOBS.append(('wirefree-vs-underwire', '      <h2>What we usually recommend</h2>', '''<h2>Matching the construction to the product line</h2>
<ul>
  <li><strong>Full-bust and plus-size</strong> - underwire remains the more reliable engineering answer above a G cup. Wirefree is achievable but needs a genuinely structural block, not a softened version of a lighter style.</li>
  <li><strong>Everyday and sleep</strong> - wirefree wins on comfort and wash durability, and the support requirement is lower.</li>
  <li><strong>Seamless and bonded</strong> - wirefree is effectively mandatory, because you cannot insert a wire into a bonded seamless cup.</li>
  <li><strong>Plunge and balconette</strong> - underwire gives shape control that wirefree struggles to reproduce, because the wire is doing the work at the outer edge.</li>
</ul>
<p>
  It is also worth separating comfort from support, because customers conflate the two. A poorly
  engineered wirefree bra is uncomfortable and unsupportive at the same time, while a well engineered
  underwire is supportive and disappears on the body. The construction is not the variable that decides
  comfort. The block is.
</p>

'''))

JOBS.append(('choosing-bra-manufacturer', '    <div class="mt-12 p-6 bg-cream border-l-4 border-accent">', '''      <h2>10. Red flags, in order of how badly they cost you</h2>
      <ul>
        <li><strong>A quote with no breakdown.</strong> You cannot compare it, and it will move once details appear.</li>
        <li><strong>No written AQL standard.</strong> Acceptance becomes whatever the inspector decided that morning.</li>
        <li><strong>MOQ quoted per design but enforced per colour.</strong> Discovered after you have planned a launch around three colourways.</li>
        <li><strong>Pattern making outsourced.</strong> Every fit correction adds a week, and you will do several.</li>
        <li><strong>No current certificate, only a logo on the website.</strong> The most common and the easiest to check.</li>
        <li><strong>Unwillingness to name a reference client.</strong> Not always fatal, but always worth pushing on.</li>
      </ul>

'''))

JOBS.append(('silicone-cup-moulding-process', '      <h2>What it costs, roughly</h2>', '''<h2>Where moulding programmes usually slip</h2>
<p>
  Tool wear and compound lot variation account for most of the difference between a first article
  sample and the thousandth piece. Two symptoms to watch for on a running order.
</p>
<ul>
  <li><strong>Rim thickness drifting over the run.</strong> The tool is wearing at the edge, which is where the taper is finest. It shows up as increasing edge lift in the field before it shows up anywhere in QC.</li>
  <li><strong>Colour shifting between compound lots.</strong> Silicone base batches vary slightly, and under-corrected they become visible on light colourways only. Ask for the colour to be checked against a retained first-article on every lot.</li>
</ul>
<p>
  Both are cheap to monitor and expensive to discover in returns, which is why retention of a first
  article approved sample is worth insisting on.
</p>

'''))


def count_words(html):
    txt = re.sub(r'<script.*?</script>', ' ', html, flags=re.S)
    txt = re.sub(r'<[^>]+>', ' ', txt)
    return len(re.findall(r"[A-Za-z][A-Za-z'-]*", txt))


def main():
    for slug, anchor, block in JOBS:
        path = os.path.join(BLOG, slug + '.astro')
        with io.open(path, encoding='utf-8') as f:
            src = f.read()
        first_line = block.strip().split('\n')[0].strip()
        if first_line in src:
            print('SKIP', slug)
            continue
        n = src.count(anchor)
        if n != 1:
            print('!! anchor %d for %s' % (n, slug))
            continue
        indented = '\n'.join(
            ('      ' + ln if ln.strip() else ln) for ln in block.rstrip().split('\n'))
        src = src.replace(anchor, indented + '\n\n' + anchor)
        with io.open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(src)
        print('%-32s ~%d' % (slug, count_words(src)))


if __name__ == '__main__':
    main()
