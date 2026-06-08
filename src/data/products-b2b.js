// src/data/products-b2b.js
// B2B factory product catalog — 7 categories with variants and specs

export const productCategories = [
  {
    id: 'bra-sets',
    name: 'Bra Sets',
    slug: 'bra-sets',
    description: 'Matching bra and panty sets, available with underwire or wirefree. Bulk OEM/ODM for brands worldwide.',
    image: '/factory/images/bra-sets.jpg',
    metaTitle: 'Bra Set Manufacturer China | OEM Lingerie Sets Wholesale',
    metaDesc: 'Professional bra set manufacturer. Underwire & wirefree matching sets. BSCI certified. MOQ 200 pcs. Small batch sampling via Viomisha.',
    subCategories: ['With Underwire', 'Wirefree / Wireless'],
    specs: ['Underwire bra + matching panty', 'Wirefree bra + matching panty',
            'Padded / non-padded options', 'Adjustable straps & back closure'],
  },
  {
    id: 'bras',
    name: 'Bras',
    slug: 'bras',
    description: 'Full range of bra styles — underwire, wirefree, and seamless. Designed for comfort and support across all sizes.',
    image: '/factory/images/bras.jpg',
    metaTitle: 'Bra Manufacturer China | Underwire Wirefree Seamless Bras OEM',
    metaDesc: 'China bra manufacturer specializing in underwire, wirefree, and seamless bras. Wholesale & OEM. BSCI/OEKO-TEX certified.',
    subCategories: ['With Underwire', 'Wirefree', 'Seamless / Molded'],
    specs: ['Underwire support bras', 'Wirefree comfort bras',
            'Seamless molded bras', 'Full cup / demi cup / triangle',
            'Padded & non-padded options'],
  },
  {
    id: 'plus-size-bras',
    name: 'Plus Size Bras',
    slug: 'plus-size-bras',
    description: 'Full-bust and plus size bras engineered for extra support, comfort, and durability.',
    image: '/factory/images/plus-size-bras.jpg',
    metaTitle: 'Plus Size Bra Manufacturer | Full Bust Bra OEM China',
    metaDesc: 'Plus size & full bust bra manufacturer. Sizes up to 5XL. Underwire & wirefree. Durable construction. MOQ 200 pcs.',
    subCategories: ['With Underwire', 'Wirefree'],
    specs: ['Sizes up to 5XL / US 44G+', 'Reinforced side panels',
            'Wide adjustable straps', '3-row & 4-row back closures',
            'Cotton-lined cups available'],
  },
  {
    id: 'panties',
    name: 'Panties',
    slug: 'panties',
    description: 'Diverse panty styles — bikini, thong, seamless, high waist, mid rise. Bulk production for global brands.',
    image: '/factory/images/panties.jpg',
    metaTitle: 'Panty Manufacturer China | Seamless Thong High Waist OEM',
    metaDesc: 'Panties wholesale manufacturer. Bikini, thong, seamless, high waist, mid rise. Custom fabric & trim. MOQ 300 pcs.',
    subCategories: ['Bikini / Brief', 'Thong / G-String', 'Seamless', 'High Waist', 'Mid Rise'],
    specs: ['Cotton, modal, nylon, spandex blends', 'Seamless bonding available',
            'Laser-cut edges', 'Custom elastic & trim',
            'Size XS-5XL available'],
  },
  {
    id: 'silicone-bras',
    name: 'Silicone Bras',
    slug: 'silicone-bras',
    description: 'Adhesive silicone bras, nipple covers, and strap-on breast petals. Perfect for backless and strapless fashion.',
    image: '/factory/images/silicone-bras.jpg',
    metaTitle: 'Silicone Bra Manufacturer | Adhesive Bra Supplier China',
    metaDesc: 'Silicone bra OEM manufacturer. Nipple covers, adhesive push-up bras, strap-on petals. BSCI certified. MOQ 200 pcs.',
    subCategories: ['Strap-on Breast Petals', 'Adhesive Push-up Bras', 'Nipple Covers'],
    specs: ['Medical-grade silicone', 'Hypoallergenic adhesive',
            'Reusable (50+ times)', 'Skin-tone color matching',
            'Available in A-D cup sizes'],
  },
  {
    id: 'shapewear',
    name: 'Shapewear',
    slug: 'shapewear',
    description: 'Full body shapers and waist cinchers. Tummy control, back smoothing, and body sculpting solutions.',
    image: '/factory/images/shapewear.jpg',
    metaTitle: 'Shapewear Manufacturer China | Waist Trainer OEM Factory',
    metaDesc: 'Shapewear OEM manufacturer. Full body shapers, waist trainers, tummy control. Power mesh & latex options. MOQ 200 pcs.',
    subCategories: ['Full Body Shapewear', 'Waist Cinchers / Trainers'],
    specs: ['Full body shapers (open bust & full coverage)',
            'Waist cinchers & trainers', 'Power mesh & latex fabric options',
            'Hook & eye / zipper closure', 'Targets: tummy, waist, back, thighs'],
  },
  {
    id: 'sleepwear',
    name: 'Sleepwear & Dresses',
    slug: 'sleepwear',
    description: 'Custom development only. Nightgowns, chemises, robes, and dress styles. Minimum 300 pcs per design.',
    image: '/factory/images/sleepwear.jpg',
    metaTitle: 'Custom Sleepwear Manufacturer | OEM Pajamas & Loungewear',
    metaDesc: 'Custom sleepwear OEM manufacturer. Nightgowns, chemises, robes, dresses. Custom pattern & sample development. MOQ 300 pcs.',
    subCategories: ['Custom Development Only'],
    specs: ['Custom pattern making & sample development',
            'MOQ: 300 pcs per design', 'Lead time: 35-50 days',
            'Fabric options: silk, satin, cotton, modal',
            'Lace trim & embroidery available'],
  },
];

export const certifications = [
  { name: 'BSCI', fullName: 'Business Social Compliance Initiative', desc: 'Social compliance audit passed annually' },
  { name: 'OEKO-TEX', fullName: 'OEKO-TEX Standard 100', desc: 'All fabrics tested for harmful substances' },
  { name: 'ISO 9001', fullName: 'ISO 9001:2015', desc: 'Quality management system certified' },
  { name: 'FAMA', fullName: 'Disney FAMA', desc: 'Disney Facility and Merchandise Authorization' },
  { name: 'Sedex', fullName: 'Sedex Members Ethical Trade Audit', desc: 'Ethical supply chain assessment (optional)' },
];

export const factoryStats = {
  workers: '200+',
  area: '5,000 ㎡',
  annualOutput: '5,000,000+ pcs',
  monthlyContainers: '40+',
  exportMarkets: 'North America · Europe · Middle East · Southeast Asia',
  founded: '2018',
};

export const productionSteps = [
  { step: '01', title: 'Design & Pattern', desc: 'From tech pack or reference sample, our in-house pattern makers create production-ready patterns using CAD systems. We optimize for fit consistency across all sizes.', duration: '3-5 days', image: '/factory/images/process-pattern.jpg' },
  { step: '02', title: 'Sample Making', desc: 'First samples are cut and sewn in our sample room. Fit approval, size set grading, and any revisions are completed before bulk production begins.', duration: '7-10 days', image: '/factory/images/process-sample.jpg' },
  { step: '03', title: 'Fabric Sourcing', desc: 'We source OEKO-TEX certified fabrics from trusted mills. Options include cotton, modal, nylon/spandex, microfiber, lace, and custom prints.', duration: '5-7 days', image: '/factory/images/process-fabric.jpg' },
  { step: '04', title: 'Cutting', desc: 'Automated cutting machines ensure precision across all layers. Marker making optimizes fabric utilization to minimize waste.', duration: '3-5 days', image: '/factory/images/process-cutting.jpg' },
  { step: '05', title: 'Sewing & Assembly', desc: 'Skilled operators work on dedicated production lines. Each style has standardized workstations for consistent quality and output.', duration: '12-20 days', image: '/factory/images/process-sewing.jpg' },
  { step: '06', title: 'Quality Control', desc: 'Three-stage QC: in-line inspection during production, final random inspection (AQL 2.5 or as agreed), and pre-shipment check.', duration: '2-3 days', image: '/factory/images/process-qc.jpg' },
  { step: '07', title: 'Packaging & Shipping', desc: 'Products are packed per your specifications — poly bag, hanger pack, retail box, or OEM branded packaging. FCL/LCL shipping worldwide.', duration: '3-5 days', image: '/factory/images/process-shipping.jpg' },
];

export const faqItems = [
  {
    q: 'What is your minimum order quantity (MOQ)?',
    a: 'Our standard MOQ is 200-300 pcs per design, per size, per color. For sleepwear and dresses, the MOQ is 300 pcs per design. Small batch sampling is available through Viomisha.com.',
  },
  {
    q: 'Can I order a small quantity for sampling?',
    a: 'Yes! Visit Viomisha.com to purchase small quantities for sampling, inventory testing, or personal use. This is the fastest way to evaluate our quality before placing a bulk order.',
  },
  {
    q: 'What is the typical lead time?',
    a: 'Sample making: 7-15 days. Bulk production: 30-45 days depending on order quantity and style complexity. Custom sleepwear development: 35-50 days.',
  },
  {
    q: 'Can you custom develop products from my design?',
    a: 'Yes, full OEM/ODM service is available. Send us your tech pack, reference sample, or design sketch. We create patterns, develop samples, and handle bulk production.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept T/T (wire transfer), L/C, and PayPal for sample orders. Standard payment terms: 30% deposit, 70% before shipment.',
  },
  {
    q: 'Do you have quality certifications?',
    a: 'Yes, we are BSCI and OEKO-TEX Standard 100 certified. ISO 9001 and Disney FAMA are also available. Full certification documents provided upon request.',
  },
  {
    q: 'Can I mix different styles in one container?',
    a: 'Absolutely. We support mixed container shipping (FCL/LCL). You can combine different styles, sizes, and colors in a single shipment to optimize logistics costs.',
  },
  {
    q: 'Can I visit your factory?',
    a: 'Factory visits are welcome. We are located in Shenzhen, Guangdong, China — a major apparel manufacturing hub. Contact us to schedule a visit.',
  },
  {
    q: 'Do you offer custom packaging and branding?',
    a: 'Yes. We offer OEM packaging with your brand logo — poly bags, hang tags, boxes, and barcode stickers. Custom packaging MOQ: 500 pcs.',
  },
  {
    q: 'What fabrics and materials do you work with?',
    a: 'We work with cotton, modal, nylon/spandex, microfiber, polyester, silk, satin, lace, and power mesh. All fabrics can be OEKO-TEX certified upon request.',
  },
  {
    q: 'What sizes do you produce?',
    a: 'Our standard size range is XS-5XL depending on style. Plus size bras go up to US 44G+. Custom grading available.',
  },
  {
    q: 'Do you offer private label (OEM) service?',
    a: 'Yes, OEM is our core business. We produce garments under your brand name with your specifications, packaging, and labeling.',
  },
];
