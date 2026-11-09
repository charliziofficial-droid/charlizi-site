# -*- coding: utf-8 -*-
"""扩写 oeko-tex-certification.astro + 修正 Product Class I -> II 错误"""
import io, os, re

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
PATH = os.path.join(ROOT, 'src', 'pages', 'blog', 'oeko-tex-certification.astro')

with io.open(PATH, encoding='utf-8') as f:
    src = f.read()

# ---- 事实修正：内衣属 Class II，不是 Class I ----
OLD_CLASS = '''      <h2>What is OEKO-TEX Standard 100?</h2>
      <p>OEKO-TEX Standard 100 tests for over 350 harmful substances across four product classes. Intimate apparel falls under Product Class 1 (the strictest category, alongside baby products), meaning every component — fabric, thread, lace, elastic, labels — must pass the most stringent testing.</p>
'''
NEW_CLASS = '''      <h2>What OEKO-TEX Standard 100 actually tests</h2>
      <p>OEKO-TEX Standard 100 tests the finished article for harmful substances - it tests materials, not the factory. The parameter list covers formaldehyde, heavy metals, azo dyes, chlorinated phenols, phthalates and the arylamines released when certain dyes break down.</p>
      <p>The part most buyers miss is that limit values change by product class, because the exposure route changes.</p>
      <ul>
        <li><strong>Product Class I</strong> - articles for babies and toddlers under three. The strictest limits, because of skin sensitivity and mouthing.</li>
        <li><strong>Product Class II</strong> - articles worn next to the skin over a large area. This is where bras, underwear and shapewear sit.</li>
        <li><strong>Product Class III</strong> - articles used away from the skin.</li>
        <li><strong>Product Class IV</strong> - furnishing and decoration materials.</li>
      </ul>
      <p>A certificate that says Standard 100 without naming the product class tells you very little. Class III on a bra is a certificate for the wrong product, and claims based on it do not survive a retailer audit.</p>
'''
assert src.count(OLD_CLASS) == 1
src = src.replace(OLD_CLASS, NEW_CLASS)

# ---- 在 "Why It Matters" 之前插入证书阅读方法 ----
A1 = '      <h2>Why It Matters for Lingerie</h2>'
assert src.count(A1) == 1
INS1 = '''      <h2>Reading the certificate properly</h2>
      <p>Three fields decide whether the document is useful to you: the certificate number, the validity date, and the list of certified articles. That last one is where most claims fall apart.</p>
      <ul>
        <li>A certificate covers <strong>named article categories</strong>, for example "ladies' underwear, knitted, dyed". A new lace you introduce next season is not automatically covered by it.</li>
        <li>It is issued to a <strong>specific company at a specific production site</strong>. A trading company holding a factory's certificate is not the same thing as the factory holding one.</li>
        <li>It <strong>expires annually</strong>. Ask for the current cycle rather than a PDF from three years ago.</li>
        <li>The certified scope lists <strong>components separately</strong> - fabric, lining, elastic, thread and any print or heat transfer. Your label supplier matters as much as your fabric mill.</li>
      </ul>
      <p>The practical test takes two minutes: take the certificate number and look it up in the public OEKO-TEX buying guide yourself. That settles the question faster than any email exchange.</p>

      <h2>Where the certificate stops</h2>
      <p>Standard 100 certifies the material as tested. It does not certify that the factory keeps buying that material, and it does not cover chemicals introduced by your own decoration unless those were in the tested scope.</p>
      <p>Two things follow. First, ask for the certificate plus the mill's material declaration for the specific fabrics in your order. Second, put a clause in the purchase order requiring that any substitution of fabric, lace or elastic be disclosed and re-tested. Substitution is exactly where certified product quietly becomes uncertified product.</p>

'''

src = src.replace(A1, INS1 + A1)

# ---- 在 BSCI 对比段前插入"配套证书" ----
A2 = '      <h2>BSCI vs OEKO-TEX vs ISO</h2>'
assert src.count(A2) == 1
INS2 = '''      <h2>What to hold alongside it</h2>
      <ul>
        <li><strong>BSCI or Sedex</strong> - social compliance and worker welfare. A different question answered by a different audit.</li>
        <li><strong>REACH SVHC declaration</strong> - needed for EU sale regardless of OEKO-TEX status, and it is your own legal obligation as importer.</li>
        <li><strong>California Prop 65 assessment</strong> - relevant if you sell in the US and the product carries any print, coating or metal trim.</li>
        <li><strong>Detox / ZDHC conformance</strong> - increasingly requested by EU retailers as a supplement to Standard 100, focused on manufacturing input chemistry.</li>
      </ul>
      <p>None of these replace each other. A factory with excellent chemical testing and a poor social audit is still a supply chain risk, and the reverse is also true.</p>

'''
src = src.replace(A2, INS2 + A2)

# ---- ISO 段后追加实例与费用 ----
A3 = '      <p>A well-equipped factory should hold all three.</p>'
assert src.count(A3) == 1
INS3 = '''      <p>A well-equipped factory should hold all three. In practice most hold social and chemical certification and are weaker on quality management system documentation, which is the one you feel in month six rather than month one.</p>

      <h2>What certification costs, and who pays</h2>
      <p>Standard 100 is charged per application, by article category, and scales with the number of components in scope. A single-category intimate apparel application on existing mill material is modest. Adding a new lace, a new elastic supplier or a printed label expands the scope and the fee.</p>
      <p>This is why you should confirm the certified scope covers <em>your</em> bill of materials at quoting stage, not after sampling. A factory quoting a new seasonal fabric that falls outside their existing certificate is quoting you a compliance problem, whether or not they mention it.</p>

      <h2>What to ask for in writing</h2>
      <ul>
        <li>Current certificate number, product class and expiry date</li>
        <li>The certified article list, so you can check your BOM against it</li>
        <li>The issuing institute name, because Standard 100 is issued through authorised institutes and the name tells you who tested it</li>
        <li>A written commitment to re-test on any material substitution</li>
      </ul>
      <p>For how these documents fit into a supplier evaluation in general, see <a href="/blog/choosing-bra-manufacturer">how to choose a bra manufacturer</a>.</p>
'''
src = src.replace(A3, INS3)

with io.open(PATH, 'w', encoding='utf-8', newline='') as f:
    f.write(src)

txt = re.sub(r'<[^>]+>', ' ', src)
print('words ~', len(re.findall(r"[A-Za-z][A-Za-z'-]*", txt)))
print('h2', src.count('<h2'))
