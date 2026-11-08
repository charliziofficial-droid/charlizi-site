// scripts/gen-missing-styles.cjs
// 为 gallery 中【尚无 styleContent 详情页】的款式生成 SEO 详情页内容。
// 输出: src/data/product-style-content-extra.ts  (export const styleExtra)
// 不覆盖 product-style-content.ts。

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TMP = path.join(ROOT, 'tmp');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

// 1) 用 Astro 的 TS 无法直接 require，改用 node 读取 d-drive + supplement 的 JSON 数据源。
//    d-drive 数据来自 tmp/new-styles.json（原始生成输入），supplement 从 ts 里解析 slug。
const rawNew = JSON.parse(fs.readFileSync(path.join(TMP, 'new-styles.json'), 'utf8'));

const CATNAME = {
  'bras': 'Bra',
  'bra-sets': 'Bra Set',
  'silicone-bras': 'Silicone Bra',
  'panties': 'Panties',
  'shapewear': 'Shapewear & Bodysuit',
  'camisoles': 'Camisole Set',
  'sleepwear': 'Sleepwear',
  'plus-size-bras': 'Plus Size Bra',
};

const CATNAME_FULL = {
  'bras': 'Bras',
  'bra-sets': 'Bra Sets',
  'silicone-bras': 'Silicone Bras',
  'panties': 'Panties',
  'shapewear': 'Shapewear & Bodysuits',
  'camisoles': 'Camisole Sets',
  'sleepwear': 'Sleepwear & Dresses',
  'plus-size-bras': 'Plus Size Bras',
};

// 已有的 key（避免重复）
const existing = new Set();
const cur = fs.readFileSync(path.join(ROOT, 'src/data/product-style-content.ts'), 'utf8');
for (const m of cur.matchAll(/"([a-z0-9-]+)\/([a-z0-9-]+)":\s*\{/g)) {
  existing.add(m[1] + '/' + m[2]);
}
console.log('现有详情页:', existing.size);

// 2) 构建待生成清单
const jobs = []; // {category, slug, title, images:[{file,view,alt}]}
const seen = new Set();
for (const [cat, styles] of Object.entries(rawNew)) {
  for (const s of styles) {
    const images = s.images.map((im) => ({
      file: '/factory/images/products-cards/' + cat + '/' + im.file.split('/').pop(),
      view: im.view,
      alt: '',
    }));
    const slug = images[0].file.split('/').pop().replace('-front.webp', '');
    const key = cat + '/' + slug;
    if (existing.has(key) || seen.has(key)) continue;
    seen.add(key);
    const title = (CATNAME[cat] || 'Product') + ' ' + s.code;
    images.forEach((im) => { im.alt = title + ', ' + im.view + ' view'; });
    jobs.push({ category: cat, slug, title, code: s.code, images });
  }
}
console.log('待生成详情页:', jobs.length);

// 3) 文案模板
const FEATURE_POOL = {
  'bras': ['Underwire or wire-free construction to your spec', 'Adjustable straps and hook-and-eye back closure', 'Lace, mesh, microfiber or cotton fabric options', 'Custom cup sizing and padding available', 'Colour matching and trim coordination'],
  'bra-sets': ['Coordinated bra and bottom in matching fabric', 'Underwire, wire-free or bralette construction', 'Lace, mesh, satin and microfiber options', 'Custom colour matching across both pieces', 'Mixed size packing available per set'],
  'silicone-bras': ['Skin-friendly silicone adhesive, reusable', 'Push-up, plunge or strapless silhouettes', 'Clear or skin-tone back strap options', 'Nude, black and custom Pantone colours', 'Individually polybagged with instruction card'],
  'panties': ['Brief, thong, hipster and high-waist shapes', 'Cotton gusset, laser-cut or sewn edge', 'Lace, mesh, cotton-spandex and satin', 'Custom waistband and trim options', 'Size range XS–4XL available'],
  'shapewear': ['Tummy control and waist definition panels', 'Bodysuit, brief or thigh-shaper formats', 'Power mesh and compression fabric options', 'Hook-and-eye or snap gusset closure', 'Adjustable straps and open-bust options'],
  'camisoles': ['Camisole tops and matching two-piece sets', 'Cotton-spandex, modal, satin or mesh fabric', 'Lace trim, scalloped edge, ribbon straps', 'Adjustable straps and built-in shelf bra option', 'Sizes S–XXXL with plus size available'],
  'sleepwear': ['Nightdresses, chemises, slips and robes', 'Satin, chiffon, cotton and modal options', 'Lace trim and adjustable strap detailing', 'Custom print and embroidery available', 'Gift-box packing option'],
  'plus-size-bras': ['Full-figure cup construction, D–J cup', 'Wide cushioned straps and back support', 'Underwire, wire-free and minimiser options', 'Four-hook and five-hook back closures', 'Extended size grading to 4XL'],
};

const USECASES = {
  'bras': ['Private-label lingerie brands', 'Wholesale and distribution', 'Online and marketplace sellers', 'Boutique retail chains'],
  'bra-sets': ['Private-label lingerie brands', 'Gift and bridal sets', 'Online and marketplace sellers', 'Boutique retail chains'],
  'silicone-bras': ['Bridal and occasion wear', 'Backless and strapless outfits', 'Online and marketplace sellers', 'Wholesale and distribution'],
  'panties': ['Multi-pack retail programmes', 'Private-label lingerie brands', 'Online and marketplace sellers', 'Wholesale and distribution'],
  'shapewear': ['Shapewear brands and labels', 'Bridal and occasion wear', 'Online and marketplace sellers', 'Wholesale and distribution'],
  'camisoles': ['Loungewear and sleepwear labels', 'Gift and set programmes', 'Online and marketplace sellers', 'Boutique retail chains'],
  'sleepwear': ['Sleepwear and loungewear brands', 'Gift-box and holiday programmes', 'Online and marketplace sellers', 'Boutique retail chains'],
  'plus-size-bras': ['Plus size specialist retailers', 'Private-label lingerie brands', 'Online and marketplace sellers', 'Wholesale and distribution'],
};

const ATTRS = {
  'bras': ['Underwire', 'Wire-free', 'Lace', 'Mesh', 'Microfiber', 'Adjustable Straps', 'OEM'],
  'bra-sets': ['Matching Set', 'Lace', 'Mesh', 'Satin', 'Underwire', 'Two-Piece', 'OEM'],
  'silicone-bras': ['Adhesive', 'Push-Up', 'Strapless', 'Reusable', 'Skin-Friendly', 'Nude', 'OEM'],
  'panties': ['Thong', 'Brief', 'High-Waist', 'Cotton Gusset', 'Lace', 'Laser-Cut', 'OEM'],
  'shapewear': ['Tummy Control', 'Bodysuit', 'Power Mesh', 'Compression', 'Shaping', 'Seamless', 'OEM'],
  'camisoles': ['Camisole', 'Two-Piece Set', 'Lace Trim', 'Cotton-Spandex', 'Strappy', 'Lounge', 'OEM'],
  'sleepwear': ['Nightdress', 'Chemise', 'Slip', 'Satin', 'Lace Trim', 'Loungewear', 'OEM'],
  'plus-size-bras': ['Plus Size', 'Full-Figure', 'D–J Cup', 'Wire-free', 'Cushioned Straps', 'Extended Sizing', 'OEM'],
};

function buildStyle(j) {
  const cn = CATNAME_FULL[j.category] || 'Lingerie';
  const cnShort = CATNAME[j.category] || 'Product';
  const feat = FEATURE_POOL[j.category] || FEATURE_POOL['bras'];
  const uc = USECASES[j.category] || USECASES['bras'];
  const at = ATTRS[j.category] || ATTRS['bras'];

  // 清理款号里的中文（如 10761金色 -> 10761 Gold），标题/描述不能带中文
  const COLOR_MAP = { '金色': 'Gold', '银色': 'Silver', '黑色': 'Black', '白色': 'White', '红色': 'Red', '粉色': 'Pink', '肉色': 'Nude', '蓝色': 'Blue', '紫色': 'Purple', '绿色': 'Green', '灰色': 'Grey', '肤色': 'Nude' };
  let displayCode = String(j.code);
  let colorName = '';
  for (const [zh, en] of Object.entries(COLOR_MAP)) {
    if (displayCode.includes(zh)) {
      displayCode = displayCode.replace(zh, '').trim();
      colorName = en;
      break;
    }
  }
  displayCode = displayCode.replace(/[^\x20-\x7E]/g, '').trim();
  const displayTitle = j.title.replace(String(j.code), displayCode) + (colorName ? ' ' + colorName : '');

  return {
    slug: j.slug,
    title: displayTitle,
    baseTitle: displayTitle,
    category: j.category,
    categoryName: cn,
    h1: displayTitle + ' — OEM Wholesale Manufacturer',
    seoTitle: displayTitle + ' OEM Wholesale Manufacturer',
    seoDescription: 'OEM/ODM manufacturer of the ' + displayTitle.toLowerCase() + ' — custom fabric, colour and sizing. BSCI & OEKO-TEX certified. MOQ 200 pcs per design. Request a quote and sample today.',
    intro: displayTitle + ' produced in our Guangdong factory for brands, wholesalers and private-label buyers. ' + feat[0] + '. Every order is built to your tech pack with your choice of fabric, colour, trim and sizing, then inspected piece by piece before packing. MOQ 200 pcs per design.',
    features: feat,
    specs: [
      { label: 'Style No.', value: displayCode },
      { label: 'Category', value: cn },
      { label: 'MOQ', value: '200 pcs per design' },
      { label: 'Lead Time', value: '30-45 days after sample approval' },
      { label: 'Sizes', value: 'S–XXXL / custom grading' },
      { label: 'Colours', value: colorName ? colorName + ' (custom Pantone matching)' : 'Custom Pantone matching' },
      { label: 'Certification', value: 'BSCI, OEKO-TEX Standard 100' },
      { label: 'Packing', value: 'Polybag or custom gift box' },
    ],
    useCases: uc,
    faq: [
      { q: 'What is the minimum order quantity?', a: '200 pcs per design, per colour. Mixed sizing is accepted within that quantity.' },
      { q: 'Can you customise fabric, colour and trim?', a: 'Yes. Send us your tech pack or a reference sample and we will match fabric, colour, trim and sizing.' },
      { q: 'How long does sampling take?', a: '5-7 days for a pre-production sample after we confirm your spec. Bulk lead time is 30-45 days after sample approval.' },
      { q: 'Are you certified for export?', a: 'We are BSCI audited and use OEKO-TEX Standard 100 certified fabrics. Full documentation is provided with each order.' },
    ],
    images: j.images.map((im) => ({ ...im, file: im.file, view: im.view, alt: displayTitle + ', ' + im.view + ' view' })),
    attrs: at,
    related: [],
  };
}

// 4) related: 同分类内其它款式，最多 4 个
const byCat = {};
for (const j of jobs) (byCat[j.category] = byCat[j.category] || []).push(j);
for (const j of jobs) {
  const sib = byCat[j.category].filter((x) => x.slug !== j.slug).slice(0, 4);
  j.related = sib.map((x) => ({ slug: x.slug, title: x.title }));
}

const out = {};
for (const j of jobs) out[j.category + '/' + j.slug] = buildStyle(j);

const header = [
  '// AUTO-GENERATED by scripts/gen-missing-styles.cjs — do not edit by hand.',
  '// 为 D 盘新增款式补充的详情页内容（追加，不覆盖 product-style-content.ts）',
  "import type { StyleContent } from './product-style-content';",
  '',
  'export const styleExtra: Record<string, StyleContent> = ',
  JSON.stringify(out, null, 2) + ';',
  '',
].join('\n');

fs.writeFileSync(path.join(ROOT, 'src/data/product-style-content-extra.ts'), header, 'utf8');
console.log('已写出 src/data/product-style-content-extra.ts，条目数:', Object.keys(out).length);
console.log('按分类:', JSON.stringify(Object.keys(out).reduce((a, k) => { const c = k.split('/')[0]; a[c] = (a[c] || 0) + 1; return a; }, {}), null, 2));
