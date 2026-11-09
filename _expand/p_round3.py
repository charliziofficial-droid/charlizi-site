# -*- coding: utf-8 -*-
"""最后一轮：把 4 篇 <1200 词的补到 1200+"""
import io, os, re, sys

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
BLOG = os.path.join(ROOT, 'src', 'pages', 'blog')

JOBS = []

JOBS.append(('adhesive-bra-spec-guide', '      <h2>What to put on the spec sheet</h2>', '''<h2>7. Sizing is where the returns live</h2>
<p>
  Adhesive bras do not have an adjustable band, so they cannot absorb a wrong guess. A cup that is
  slightly too small will hold for an hour and then release; one that is too large lifts at the rim and
  takes the adhesive with it.
</p>
<p>
  Because there is no closure to compensate, size is doing the work that a hook-and-eye does on a
  conventional bra. Two consequences for the range plan.
</p>
<ul>
  <li><strong>Do not grade by scaling the cup linearly.</strong> Cup volume and cup depth change at different rates across the range, and on this product the depth is what decides whether the rim seals.</li>
  <li><strong>Publish a body measurement chart, not a bra size conversion.</strong> A customer who wears 34C in a wired bra is not necessarily an A cup in an adhesive bra, because the two are not measuring the same thing.</li>
</ul>
<p>
  We recommend five sizes as the minimum workable range, with the middle size developed first and the
  extremes graded from it. Building the range from the smallest size upward reliably produces a large
  size that will not stay on.
</p>

<h2>8. What to reject at inspection</h2>
<ul>
  <li><strong>Visible bubbles or inclusions in the cup wall</strong> - a degassing failure, and it becomes a tear point.</li>
  <li><strong>Rim thickness inconsistent around the perimeter</strong> - the rim should be moulded to taper, not trimmed to shape. A trimmed rim has a cut edge and a cut edge peels.</li>
  <li><strong>Adhesive overhanging the cup edge</strong> - it will pick up lint in the pouch before the customer ever wears it.</li>
  <li><strong>Closure hardware that does not sit flat</strong> - on a front-clasp style this is a comfort issue at the sternum, the most sensitive point on the garment.</li>
  <li><strong>Colour variation between left and right cup</strong> - both are cut from the same batch, so a difference means they came from different batches.</li>
</ul>
<p>
  Each of these is detectable in seconds by hand and eye. The reason they ship is that the inspection
  standard was never written down, so the inspector applies their own.
</p>

'''))

JOBS.append(('shapewear-manufacturing', '      <h2>What we specify on every shapewear development</h2>', '''<h2>Where shapewear goes wrong commercially</h2>
<p>
  The most common failure on this product is not a manufacturing defect. It is a specification that
  produced a garment nobody can wear for a full day.
</p>
<p>
  Compression that measures correctly on a flat table can still be unwearable, because the body is not
  flat. A bodysuit that holds 18 mmHg at the waist and 18 mmHg at the ribs will feel like a restraint
  at hour two, and the customer will conclude the sizing is wrong rather than the design.
</p>
<p>
  Two practical guards. Fit the garment on a body for a four hour wear trial before approving bulk, not
  a fifteen minute try-on. And build the sample in the middle size, then check that the largest size can
  be put on without help, because donning difficulty is the complaint that never makes it into a review
  but always makes it into a return.
</p>

<h2>Cost, honestly</h2>
<ul>
  <li><strong>Development</strong> - the most expensive category we run. A bonded bodysuit takes three to four fit rounds plus wash testing, because the failure only appears after cycles.</li>
  <li><strong>Materials</strong> - warp knit at high modulus costs meaningfully more than circular knit, and it is the part you cannot substitute without redesigning.</li>
  <li><strong>Machine time</strong> - bonding presses are slow compared with sewing machines, and line capacity is the real constraint at volume rather than labour cost.</li>
  <li><strong>Testing</strong> - per-lot wash and peel testing is a real recurring cost. It is also the only thing standing between you and a season of returns.</li>
</ul>
<p>
  A shapewear quote far below the others is almost always a circular-knit product being compared
  against warp-knit bids. Check the construction line before the price line.
</p>

'''))

JOBS.append(('choosing-bra-manufacturer', '    <div class="mt-12 p-6 bg-cream border-l-4 border-accent">', '''      <h2>8. What to verify on the factory visit, or on video</h2>
      <p>
        If you cannot visit, ask for a live video walkthrough rather than a photo set. Photos are curated.
        Five things are worth seeing specifically.
      </p>
      <ul>
        <li><strong>The cutting room</strong> - is fabric laid and cut by hand or on a machine, and is there a spreader? Hand cutting limits accuracy on lace with a pattern repeat.</li>
        <li><strong>The cup area</strong> - moulding presses present, or boxes of bought-in cups arriving? The second is not disqualifying, but it changes your lead time risk.</li>
        <li><strong>The line</strong> - how many operators, how many operations per garment, and is there a visible in-line check or only an end-of-line one.</li>
        <li><strong>The inspection bench</strong> - a light box, a measurement table and a written AQL sheet on the wall. If the bench does not exist, inspection is happening in the operator's head.</li>
        <li><strong>The sample room</strong> - pattern makers on site. If patterns are outsourced, every fit correction adds a week.</li>
      </ul>

      <h2>9. The three questions that reveal the most</h2>
      <ul>
        <li><strong>"Which size do you fit first?"</strong> A factory that answers with your core size understands grading. One that answers with the smallest size does not.</li>
        <li><strong>"Show me a reorder you ran last quarter."</strong> Reorders prove the first order was not the only one that worked.</li>
        <li><strong>"What did you turn down last year, and why?"</strong> A factory with no answer either takes everything or is not being straight with you.</li>
      </ul>

'''))

JOBS.append(('oeko-tex-certification', '    <div class="mt-12 p-6 bg-cream border-l-4 border-accent">', '''      <h2>A worked example from a real order</h2>
      <p>
        A brand develops a lace bralette in three colourways. The factory's Standard 100 certificate
        covers knitted ladies' underwear in the current cycle, product class II. Everything looks fine
        until the second season, when the brand switches the lace supplier to match a lower price.
      </p>
      <p>
        The new lace is not on the certified article list. The garment is now sold as OEKO-TEX certified
        while one of its components has never been tested in that scope. Nothing has physically changed
        about the product's safety profile, but the claim is no longer supported, and a European retailer
        auditing the supply chain will find it.
      </p>
      <p>
        The fix is procedural, not expensive: a purchase order clause requiring any material substitution
        to be disclosed, plus a re-test before shipment. It costs one conversation and a short delay, and
        it is the single most useful thing a buyer can add to a supplier agreement on this subject.
      </p>

      <h2>Certification is a floor, not a differentiator</h2>
      <p>
        Every serious factory in this category holds Standard 100 and a social audit. They are the entry
        ticket, not a reason to choose one supplier over another. What actually separates suppliers is
        whether they can hold a specification across a reorder, and no certificate covers that.
      </p>

'''))

JOBS.append(('bulk-vs-small-batch', '      <h2>Where this goes wrong most often</h2>', '''      <h2>Lead time is part of the cost</h2>
      <p>
        Small batch is often quoted with a shorter lead time and bulk with a longer one, and brands
        rarely price that difference. A 30 day bulk run that lands three weeks late costs more in missed
        selling weeks than the bulk discount returns.
      </p>
      <p>
        Ask both questions together: what is the unit price, and what is the delivery window at that
        price. A factory quoting bulk at an aggressive rate is sometimes quoting an aggressive rate
        based on a production slot that does not exist yet.
      </p>

      <h2>The reorder is the real test</h2>
      <p>
        The first order tells you whether a factory can make a bra. The reorder tells you whether they
        can make it again. Most brands discover this too late, so build it into the first contract:
      </p>
      <ul>
        <li>Confirm in writing that patterns, graded specs and dye references are held on file for a stated period.</li>
        <li>Agree the reorder lead time in advance, separately from the first-order lead time.</li>
        <li>Fix the price validity window, so a reorder cannot be repriced as a new development.</li>
      </ul>
      <p>
        None of this is unusual to ask. A supplier who resists it is telling you something about how
        reorders usually go.
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
