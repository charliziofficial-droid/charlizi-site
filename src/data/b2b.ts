// Factory Statistics
export const factoryStats = {
  workers: '200+',
  area: '5,000㎡',
  annualOutput: '5M+',
  monthlyContainers: '40+',
  founded: '2018',
};

// Certifications
export const certifications = [
  { name: 'BSCI', desc: 'Social compliance audit — factory working conditions &amp; ethics' },
  { name: 'OEKO-TEX', desc: 'Standard 100 certified — fabric safety for intimate apparel' },
  { name: 'ISO 9001', desc: 'Quality management system — production consistency' },
  { name: 'FAMA', desc: 'Fair labor association — supply chain responsibility' },
  { name: 'Sedex', desc: 'SMETA audited — ethical trade &amp; sustainable sourcing' },
];

// Product Categories
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  subCategories: string[];
  specs: string[];
  moq: string;
  leadTime: string;
  badge1: string;
  badge2: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: 'bra-sets',
    name: 'Bra Sets',
    slug: 'bra-sets',
    description: 'Matching bra and panty sets — underwire, wirefree, lace, and seamless options. Custom color and fabric matching available.',
    subCategories: ['Underwire Set', 'Wirefree Set', 'Lace Set', 'Seamless Set', 'Sport Set', 'Bralette Set'],
    specs: ['Fabric: Cotton, Modal, Spandex, Nylon, Microfiber', 'Cup: A–G (custom grading available)', 'Back: Standard, U-back, Racerback, Multi-way', 'Closure: Hook &amp; eye, Front-close, Pullover', 'Padding: Removable, Light, Push-up, None', 'Trim: Lace, Embroidery, Ribbon, Satin bow', 'Label: Custom woven/printed/puff heat transfer'],
    moq: '200',
    leadTime: '30-45',
    badge1: 'OEM/ODM',
    badge2: 'BSCI Certified',
  },
  {
    id: 'bras',
    name: 'Bras',
    slug: 'bras',
    description: 'All types of bras — full cup, demi, push-up, minimizer, wireless, and more. Every style customizable.',
    subCategories: ['Full Cup', 'Demi Cup', 'Push-up', 'Minimizer', 'Wireless', 'Nursing Bra', 'Seamless', 'Sport Bra', 'Multi-way/Convertible'],
    specs: ['Fabric: Cotton, Modal, Spandex, Nylon, Microfiber', 'Cup: A–G (custom grading available)', 'Back: Standard, U-back, Racerback, Multi-way', 'Closure: Hook &amp; eye, Front-close, Pullover', 'Padding: Removable, Light, Push-up, None', 'Underwire: Yes / No (wirefree available)', 'Hardware: Nickel-free, Gold/Matte Black/Silver plating'],
    moq: '200',
    leadTime: '30-45',
    badge1: 'OEM/ODM',
    badge2: 'Sizes A–G',
  },
  {
    id: 'plus-size-bras',
    name: 'Plus Size Bras',
    slug: 'plus-size-bras',
    description: 'Full-bust constructions up to 44G+. Reinforced side panels, wider straps, and extra support engineering.',
    subCategories: ['Full Coverage', 'Side Support', 'Minimizer', 'Wirefree Plus', 'Sports Plus', 'Front-Close Plus'],
    specs: ['Size range: Up to 44G+ (custom grading)', 'Reinforced side panels for support', 'Wider padded straps', '3/4/5 hook back closures', 'Extra-strength elastic', 'Full cup coverage design', 'Underwire reinforcement'],
    moq: '200',
    leadTime: '35-50',
    badge1: 'Sizes Up to 44G+',
    badge2: 'Reinforced Construction',
  },
  {
    id: 'panties',
    name: 'Panties',
    slug: 'panties',
    description: 'Full range of panties — seamless, cotton, lace, high-waist, thong, boyshort. Custom elastic and trim.',
    subCategories: ['Seamless', 'Cotton', 'Lace', 'High-Waist', 'Thong/G-String', 'Boyshort', 'Bikini', 'Period Panty', 'Shapewear Panty'],
    specs: ['Fabric: Cotton, Modal, Spandex, Microfiber, Bamboo', 'Gusset: Cotton, Antimicrobial (optional)', 'Elastic: Soft, Lace trim, No-show', 'Waist: Low, Mid, High, Extra-high', 'Seam: Seamless / Sewn construction', 'Label: Custom woven/printed/heat transfer', 'Packaging: Polybag, Box set, Display ready'],
    moq: '200',
    leadTime: '25-40',
    badge1: 'XS–6XL',
    badge2: 'Seamless Available',
  },
  {
    id: 'silicone-bras',
    name: 'Silicone Bras',
    slug: 'silicone-bras',
    description: 'Adhesive silicone bras, strapless options, backless designs. Skin-safe medical grade silicone.',
    subCategories: ['Strapless Silicone', 'Backless Adhesive', 'Push-up Silicone', 'Reusable Sticky', 'Nipple Covers/Pasties', 'Wedding/Bridal Specialty'],
    specs: ['Material: Medical-grade silicone', 'Adhesive: Self-adhesive, washable reuse', 'Skin-safe: Hypoallergenic, latex-free', 'Colors: Nude, Black, White, Custom Pantone', 'Reusability: 30–50 wears per pair', 'Packaging: Retail box, Blister pack, Custom'],
    moq: '500',
    leadTime: '30-45',
    badge1: 'Medical-Grade Silicone',
    badge2: 'Skin-Safe',
  },
  {
    id: 'shapewear',
    name: 'Shapewear',
    slug: 'shapewear',
    description: 'Waist trainers, tummy control shorts, bodysuits, thigh shapers. Power mesh or latex construction.',
    subCategories: ['Waist Trainer/Cincher', 'Tummy Control Shorts', 'Bodysuit/Full Body', 'Thigh Shaper', 'Arm Shaper', 'Post-Surgery/Recovery', 'Camisole/Top Shaper'],
    specs: ['Fabric: Nylon/Spandex power mesh, Latex, Cotton lining', 'Control Level: Light, Medium, Firm, Extra Firm', 'Closure: Hook &amp; eye, Zipper, Pull-on', 'Boning: Steel, Plastic, None', 'Features: Anti-slip grip, Breathable panels', 'Sizes: S–XXXL, Plus size available'],
    moq: '200',
    leadTime: '35-50',
    badge1: 'Power Mesh / Latex',
    badge2: 'Firm Control',
  },
  {
    id: 'sleepwear',
    name: 'Sleepwear',
    slug: 'sleepwear',
    description: 'Custom pajamas, chemises, robes, and loungewear. Soft fabrics with custom prints and trims.',
    subCategories: ['Pajama Set (Short/Long)', 'Chemise/Nightgown', 'Robe/Bathrobe', 'Two-Piece Lounge', 'Teddy/Babydoll', 'Kimonos &amp; Cover-ups'],
    specs: ['Fabric: Cotton, Modal, Bamboo, Satin, Silk blend', 'Print: Solid, Stripe, Custom print/all-over', 'Trim: Lace, Ribbon, Satin binding', 'Closure: Button, Wrap, Pullover', 'Packaging: Gift box, Tissue wrap, Drawstring bag'],
    moq: '300',
    leadTime: '30-50',
    badge1: 'Custom Only',
    badge2: 'Custom Print Available',
  },
];

// Production Steps
export const productionSteps = [
  { step: '01', title: 'Pattern Making & Grading', duration: '3-5 days', desc: 'Using Gerber/Gerber AccuMark CAD system. We digitize your tech pack, create first patterns, and grade across your required size range. In-house pattern engineers with 10+ years of intimate apparel experience.' },
  { step: '02', title: 'Sample Development', duration: '5-7 days', desc: 'Construction of first sample using specified fabric, trim, and hardware. Fit assessment on live models or dress forms. Photographs taken for your approval before proceeding to corrections.' },
  { step: '03', title: 'Fabric & Trim Sourcing', duration: '5-10 days', desc: 'We source fabric from our network of GOTS/OCS/OEKO-TEX certified mills. Custom dyeing (Pantone matched), lace and embroidery development, and hardware selection all coordinated in parallel.' },
  { step: '04', title: 'Bulk Cutting', duration: '3-5 days', desc: 'Automated laser cutting or die-cutting for consistent pieces. Fabric is laid in multiple layers (up to 100 ply) and cut precisely. Each bundle labeled with style, size, and color for traceability.' },
  { step: '05', title: 'Sewing & Assembly', duration: '10-20 days', desc: 'Specialized sewing lines dedicated to intimate apparel. Each operator trained on specific construction steps. In-line quality checks at critical sewing stations every 30 minutes.' },
  { step: '06', title: 'Quality Control (3-Stage)', duration: '3-5 days', desc: 'Stage 1: In-line inspection during sewing. Stage 2: Final inspection per AQL 2.5 standard. Stage 3: Random pre-shipment inspection. Dimensional checks, seam strength, zipper/closure function, and color fastness testing.' },
  { step: '07', title: 'Packing & Shipment', duration: '5-7 days', desc: 'Professional packing per your specifications — polybag, hang tag, barcode sticker, retail box, or display-ready. FCL or LCL shipping. Full documentation: packing list, invoice, certs, test reports.' },
];

// FAQ Items
export const faqItems = [
  { q: 'What is your MOQ?', a: 'Our standard MOQ is 200 pieces per design for most categories. Sleepwear and custom print items require 300 pieces minimum. Silicone bras require 500 pieces minimum. Lower MOQ available through our small batch partner Viomisha for sampling purposes.' },
  { q: 'What is your lead time?', a: 'Typical lead times: 7-10 days for samples (1-2 rounds of revision included), and 30-45 days for bulk production from sample approval. Timeline depends on fabric availability and production line capacity at time of order.' },
  { q: 'What certifications do you hold?', a: 'We are BSCI, OEKO-TEX Standard 100, ISO 9001, FAMA certified, and Sedex SMETA audited. We can provide copies of current certificates upon request.' },
  { q: 'Can you work with my design/tech pack?', a: 'Absolutely. We accept tech packs, reference designs, sketches, or even inspiration images. Our pattern engineers will interpret your requirements and develop samples for approval.' },
  { q: 'What is your sampling process?', a: 'Send us your design reference (tech pack, sketch, or reference product). We review and provide a quotation within 24 hours. Upon confirmation, samples are completed in 7-10 days. Free revisions (1-2 rounds) included.' },
  { q: 'What fabrics do you work with?', a: 'We work with cotton, modal, microfiber, nylon/spandex, bamboo, silk blends, power mesh, latex, and custom blends. All fabrics are OEKO-TEX certified on request. Custom dyeing (Pantone) available from 200 yards per color.' },
  { q: 'Do you offer labeling and packaging customization?', a: 'Yes. Custom woven labels, printed labels, puff heat-transfer labels, hang tags, barcode stickers, and full packaging design. You can provide your own branded materials or we source them for you.' },
  { q: 'What is your payment terms?', a: 'Standard terms: 30% deposit with order, 70% balance before shipment. Letter of Credit (L/C) accepted for bulk orders over $50,000. Payment via T/T bank transfer.' },
  { q: 'Can I visit the factory?', a: 'Factory visits are welcome by appointment. We are located in Buji Street, Longgang District, Shenzhen — 30 minutes from Shenzhen Bao\'an International Airport. We can arrange pickup.' },
  { q: 'Do you ship worldwide?', a: 'Yes. We export to North America, Europe, the Middle East, Southeast Asia, South America, and Australia. Both FCL (full container) and LCL (less than container) shipping available. FOB Shenzhen port.' },
  { q: 'What is the difference between OEM and ODM?', a: 'OEM (Original Equipment Manufacturing): You provide the design, and we manufacture to your specifications. ODM (Original Design Manufacturing): We propose existing designs that you can customize with your branding, colors, and trim.' },
  { q: 'Can I get samples before placing a bulk order?', a: 'Yes. We strongly recommend starting with samples. For smaller quantities under MOQ, try our small batch channel on Viomisha.com. Samples are shipped within 7-10 days via DHL/FedEx.' },
];

// Blog Posts
export const blogPosts = [
  { title: 'How to Choose the Right Bra Manufacturer for Your Brand', date: 'June 1, 2026', desc: 'A practical guide for DTC brands looking for a reliable bra OEM partner — from MOQ considerations to quality certification requirements.', slug: 'choosing-bra-manufacturer' },
  { title: 'Understanding OEKO-TEX Certification in Intimate Apparel', date: 'May 25, 2026', desc: 'What OEKO-TEX Standard 100 means for lingerie production, and why it matters for your brand\'s compliance and customer trust.', slug: 'oeko-tex-certification' },
  { title: 'Bulk vs Small Batch: Sourcing Strategy for Apparel Brands', date: 'May 18, 2026', desc: 'When to start with small batch sampling and when to scale to full production. A strategic guide for intimate apparel brands.', slug: 'bulk-vs-small-batch' },
];

// Team Stats
export const teamStats = [
  { count: '200+', role: 'Skilled Workers', desc: 'Production & QC specialists' },
  { count: '5,000㎡', role: 'Modern Workshop', desc: 'Advanced manufacturing facility' },
  { count: '5M+', role: 'Annual Output', desc: 'Garments produced yearly' },
  { count: '40+', role: 'Monthly Shipments', desc: 'Containers to global brands' },
  { count: '200-300', role: 'MOQ', desc: 'Minimum order per design' },
];

// Team roles for about page
export const teamRoles = [
  { count: '8', role: 'Pattern Engineers', desc: 'CAD pattern making & grading' },
  { count: '12', role: 'Sample Makers', desc: 'First samples & fit approval' },
  { count: '150+', role: 'Production Workers', desc: 'Dedicated sewing lines' },
  { count: '15', role: 'QC Inspectors', desc: '3-stage quality control' },
];
