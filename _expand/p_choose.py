# -*- coding: utf-8 -*-
"""扩写 choosing-bra-manufacturer.astro"""
import io, os, re

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
PATH = os.path.join(ROOT, 'src', 'pages', 'blog', 'choosing-bra-manufacturer.astro')

with io.open(PATH, encoding='utf-8') as f:
    src = f.read()

A1 = '      <h2>1. Start with Certification</h2>'
assert src.count(A1) == 1

HEAD = '''      <h2>0. Before you shortlist anyone, define the product</h2>
      <p>
        Most bad factory relationships start before the first email, because the brand has not
        decided what it is making. A push-up bra describes a category, not a product. Write down
        six things first.
      </p>
      <ul>
        <li>cup construction - moulded, cut-and-sew or bonded seamless,</li>
        <li>wire or wirefree,</li>
        <li>size range, and whether you need graded cups above DD,</li>
        <li>target landed cost and target retail, which together set your ceiling,</li>
        <li>colourways in the first drop,</li>
        <li>compliance market - EU, US or both, because OEKO-TEX product class and labelling differ.</li>
      </ul>
      <p>
        A factory can quote against that list in an hour. Against a push-up bra they will quote a
        guess, and that guess becomes the anchor for every conversation afterwards.
      </p>

'''

src = src.replace(A1, HEAD + A1)

A2 = '    <div class="mt-12 p-6 bg-cream border-l-4 border-accent">'
assert src.count(A2) == 1

TAIL = '''      <h2>6. Price is the last question, not the first</h2>
      <p>
        Comparing quotes before you have compared specifications is the single most common sourcing
        mistake. Two bids that differ by 40% are rarely the same product. Before you look at the
        number, make every supplier quote against the same six-line breakdown.
      </p>
      <ul>
        <li><strong>Fabric and lace</strong>, with the composition and weight stated, not just a name.</li>
        <li><strong>Cup construction</strong>, including whether mould tooling is charged separately and who owns it.</li>
        <li><strong>Trims</strong> - hook-and-eye column count, elastic grade, ring and slider finish.</li>
        <li><strong>Grading</strong>, quoted per size so a wide run is visible rather than hidden in a blended rate.</li>
        <li><strong>Packaging</strong>, because it is the most commonly omitted line and it is often 10-20% of landed cost.</li>
        <li><strong>Testing</strong>, for fibre content, colour fastness and any market-specific requirement.</li>
      </ul>
      <p>
        A quote that cannot be broken down this way is not a quote. It is a number with no
        mechanism behind it, and it will move as soon as the first detail changes.
      </p>

      <h2>7. Ask how they handle a defect</h2>
      <p>
        Every factory ships defects eventually. The variable is whether they tell you. Ask
        directly, in the first call, what their AQL standard is and what happens when a lot fails
        inspection. A supplier who answers with a specific number and a specific remedy - rework,
        credit, or replacement at their cost - has thought about it. A supplier who answers that
        they never have defects has not.
      </p>
      <p>
        Also ask for the last two inspection reports they issued for another client, redacted. The
        way a factory documents its own failures tells you more than any sales deck. For context on
        what those reports should be measuring, see our
        <a href="/blog/oeko-tex-certification">OEKO-TEX guide</a> and
        <a href="/blog/shapewear-manufacturing">shapewear manufacturing breakdown</a>.
      </p>

      <h2>What a good partnership looks like after year one</h2>
      <p>
        The relationship that survives is not the one with the lowest first quote. It is the one
        where the factory has your pattern blocks on file, knows which sizes you actually sell,
        flags a fabric discontinuation before it becomes an emergency, and quotes a reorder without
        asking you to resend the tech pack.
      </p>
      <p>
        That is the real test of a manufacturing partner: how little work a reorder is.
      </p>

'''

src = src.replace(A2, TAIL + A2)

with io.open(PATH, 'w', encoding='utf-8', newline='') as f:
    f.write(src)

txt = re.sub(r'<[^>]+>', ' ', src)
print('words ~', len(re.findall(r"[A-Za-z][A-Za-z'-]*", txt)))
print('h2', src.count('<h2'))
