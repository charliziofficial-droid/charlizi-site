// src/data/blog-schema.ts
// Central registry of per-article structured data (Article + FAQPage + BreadcrumbList)
// for GEO (AI answer engines) and classic SEO rich results.
//
// Used by:
//   - src/components/BlogSchema.astro  (renders the JSON-LD on each blog page)
//
// To add a new article: append an entry below. Keep `slug` identical to the
// src/pages/blog/<slug>.astro filename.

export interface BlogFaqItem {
  q: string;
  a: string;
}

export interface BlogSchemaEntry {
  slug: string;
  /** Full article H1 as rendered on the page */
  headline: string;
  /** Short SEO title (used on /blog index) */
  shortTitle: string;
  /** Meta description, <= 160 chars ideally */
  description: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Path to hero image, relative to site root */
  image: string;
  /** Alt text for hero image */
  imageAlt: string;
  /** Primary keywords / entities the article covers (schema.org about) */
  keywords: string[];
  /** Article section — matches the product line it belongs to */
  section: string;
  /** Reading time in minutes (approx) */
  readMinutes: number;
  /** Related internal URLs to cross-link */
  related: { label: string; href: string }[];
  /** FAQ pairs rendered as FAQPage schema AND appended to the page body */
  faq: BlogFaqItem[];
}

const AUTHOR = {
  '@type': 'Organization',
  '@id': 'https://charlizi.com/#organization',
  name: 'Charlizi Factory',
  url: 'https://charlizi.com',
} as const;

export const blogSchema: BlogSchemaEntry[] = [
  // ------------------------------------------------------------------ new 2
  {
    slug: 'silicone-cup-moulding-process',
    headline: 'Silicone Cup Moulding: The Full Process From Tool to Finished Bra',
    shortTitle: 'Silicone Cup Moulding: The Full Process',
    description:
      'Step by step through silicone cup moulding: tool making, compound choice, degassing, cure cycle, trimming and adhesive lamination.',
    date: '2026-11-17',
    image: '/factory/images/blog-silicone-moulding-hero.webp',
    imageAlt: 'Production line staff handling moulded components on a conveyor at the Charlizi factory',
    keywords: ['silicone bra moulding', 'silicone cup manufacturing', 'platinum cure silicone', 'adhesive bra OEM', 'silicone bra factory', 'moulded cup'],
    section: 'Silicone Bra Manufacturing',
    readMinutes: 11,
    related: [
      { label: 'Adhesive Bra Manufacturing: What Buyers Get Wrong', href: '/blog/adhesive-bra-spec-guide' },
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Silicone Bras OEM/ODM', href: '/products/silicone-bras' },
    ],
    faq: [
      {
        q: 'How long does it take to make a silicone cup mould tool?',
        a: 'Roughly 20-30 days from approved 3D drawing to a production tool. Tools are CNC-cut from aluminium or steel billet, then hand-polished, because tooling marks transfer to the moulded surface and become tear points in the finished cup.',
      },
      {
        q: 'Why does silicone shrink during moulding?',
        a: 'Silicone shrinks roughly 2-3% as it cures. If the tool is cut to nominal dimensions with no shrink allowance, every cup comes out undersized and the entire size run has to be scrapped. Shrink allowance is one of the first things to ask a supplier about.',
      },
      {
        q: 'What is degassing and why does it matter?',
        a: 'Mixed silicone carries entrained air. Vacuum degassing pulls the mix below about -0.095 MPa for several minutes before injection. Without it you get micro-bubbles that are invisible on the surface but show up as cloudy patches once the cup is stretched. You cannot detect skipped degassing by looking at a finished cup.',
      },
      {
        q: 'What causes a silicone bra to fail after a few wears?',
        a: 'Almost always under-cure at stage 4. The cup looks perfect coming out of the press, feels slightly tacky, and then loses tack within five to eight wears, delaminates at the rim, or takes a permanent crease after two washes. A proper 3 mm cup cures 8-15 minutes at 120-150 degrees C.',
      },
      {
        q: 'Should the cup edge be moulded or trimmed?',
        a: 'Moulded. The taper down to 0.8-1.2 mm at the rim should be cut into the tool. Punch-die or hand trimming leaves a square hard edge, and that hard edge is what lifts first in wear. Trimming should only remove flash outside the taper, never form the sealing surface.',
      },
      {
        q: 'What is a realistic unit cost for silicone cups?',
        a: 'Around USD 2.20-4.50 landed per reusable adhesive bra at 500 pcs. Adhesive chemistry is the biggest lever (a hybrid silicone layer adds 15-25% over plain acrylic), then cavity count, then packaging. A quote 40% under that band usually means a different adhesive or a trimmed edge.',
      },
    ],
  },

  // ------------------------------------------------------------------ new 1
  {
    slug: 'adhesive-bra-spec-guide',
    headline: 'Adhesive Bra Manufacturing: What Buyers Get Wrong in the Spec',
    shortTitle: 'Adhesive Bra Manufacturing: What Buyers Get Wrong in the Spec',
    description:
      'Sticky bras fail for spec reasons, not user error - adhesive chemistry, edge thickness, cup moulding and wash survival, from a factory that builds them.',
    date: '2026-11-10',
    image: '/factory/images/blog-adhesive-spec-hero.webp',
    imageAlt: 'Rabbit-ear style adhesive silicone bra shown in two colourways with wing and clasp detail',
    keywords: ['adhesive bra manufacturing', 'sticky bra', 'silicone bra OEM', 'adhesive chemistry', 'backless bra', 'strapless bra'],
    section: 'Silicone Bra Manufacturing',
    readMinutes: 7,
    related: [
      { label: 'Adhesive Silicone Bras: Good vs Return', href: '/blog/silicone-bra-manufacturing' },
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Silicone Bras OEM/ODM', href: '/products/silicone-bras' },
    ],
    faq: [
      {
        q: 'What adhesive is used in a reusable sticky bra?',
        a: 'Most sticky bras use one of three chemistries: acrylic pressure-sensitive adhesive (cheapest, tack drops within about ten wears because body heat and skin oil degrade it), silicone gel adhesive (higher cost, softer, re-tacks far better after washing), or a hybrid with a silicone skin-contact layer over an acrylic carrier. Hybrid is the balance most factories with low return rates now run.',
      },
      {
        q: 'Why does the edge of an adhesive bra lift first?',
        a: 'A thick edge creates a sharp step against the skin, and that step lifts as soon as the wearer moves. Once a small section lifts, the peel travels inward. The fix is a tapered, moulded edge — typically 0.8-1.2 mm at the outer rim. A trimmed edge is faster to produce and is the most common cause of edge-lift complaints.',
      },
      {
        q: 'Should the push-up pad be glued in or encapsulated?',
        a: 'Encapsulated during moulding. If the pad is bonded in afterwards it can migrate and the cup deforms in the wash. Pad thickness should also be specified per size band rather than as one uniform thickness across the whole range.',
      },
      {
        q: 'How many wears should a reusable adhesive bra last?',
        a: 'With silicone or hybrid adhesive and a proper moulded edge, roughly 20-30 wears is realistic. Anything under 10 usually means under-cured adhesive or an acrylic-only layer. Specify the wash cycle count and a tack-retention pass threshold in the purchase order rather than accepting the word reusable.',
      },
      {
        q: 'What is the MOQ for custom adhesive bras?',
        a: 'MOQ at Charlizi is 200-300 pcs per design and colourway, with sample development available before a bulk commitment.',
      },
    ],
  },

  // ------------------------------------------------------------------ 1
  {
    slug: 'bra-anatomy',
    headline: 'Bra Anatomy: The 12 Components That Decide Cost and Fit',
    shortTitle: 'Bra Anatomy: The 12 Components That Decide Cost and Fit',
    description:
      'A factory-side breakdown of every component in a bra - cup, wire, wing, band, hook, slider - and how each one moves your unit cost and fit quality.',
    date: '2026-11-08',
    image: '/factory/images/blog-bra-anatomy-hero.webp',
    imageAlt: 'Front view of an underwire lace bra showing cup, band and strap construction',
    keywords: ['bra manufacturing', 'bra components', 'bra cost breakdown', 'bra construction', 'cup construction', 'underwire spec'],
    section: 'Bra Manufacturing',
    readMinutes: 9,
    related: [
      { label: 'Wirefree vs Underwire Bras', href: '/blog/wirefree-vs-underwire' },
      { label: 'Size Grading for Full-Bust Bras', href: '/blog/size-grading' },
      { label: 'Bras OEM/ODM', href: '/products/bras' },
    ],
    faq: [
      {
        q: 'What are the main components of a bra?',
        a: 'A bra is built from roughly twelve components: the cup, underwire, wing, band, bridge (gore), strap, ring, slider, hook-and-eye closure, elastic, and usually a small bow or trim. Each one has its own price floor and its own effect on fit, which is why a 30% cheaper quote almost always means a component was swapped rather than labour being more efficient.',
      },
      {
        q: 'Which bra component drives cost the most?',
        a: 'The cup. Cup construction moves unit cost more than any other part, and it climbs in four tiers: unmoulded cut-and-sew (cheapest, hardest to keep consistent), moulded single-layer, moulded double-layer spacer (roughly 1.5-2x single-layer), and contour or graduated push-up (highest tooling cost, and the tier where cheap versions collapse after a few dozen washes).',
      },
      {
        q: 'Why do bra quotes from different factories differ so much?',
        a: 'In most cases the difference is cup construction, wire spec, or elastic quality — not labour. Before comparing two quotes, ask each supplier which cup type, which wire (nickel-free stainless vs budget coated steel), and which elastic they are quoting. That single question resolves most price gaps.',
      },
      {
        q: 'Does underwire quality affect compliance?',
        a: 'Yes. Nickel-free stainless wire is both a durability and a compliance question for EU shipments. Budget wire uses a thinner coated steel with variable gauge that feels acceptable in hand but pokes through the channel after a season of wear.',
      },
      {
        q: 'What is the MOQ for custom bra manufacturing at Charlizi?',
        a: 'MOQ is 200-300 pcs per design depending on construction complexity, sampled through our Viomisha.com small-batch channel so you can evaluate quality before committing to bulk.',
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    slug: 'bra-set-development',
    headline: 'Developing a Bra and Panty Set That Actually Matches',
    shortTitle: 'Developing a Bra and Panty Set That Actually Matches',
    description:
      'Matching a bra and panty set is harder than making either alone - dye lots, elastic colour, trim continuity and the grading mismatch nobody warns you about.',
    date: '2026-11-08',
    image: '/factory/images/blog-bra-set-hero.webp',
    imageAlt: 'Matched lace bra and panty set produced as a single coordinated colourway',
    keywords: ['bra and panty set manufacturing', 'matching lingerie set', 'dye lot control', 'lingerie set development', 'bra set OEM'],
    section: 'Bra Set Development',
    readMinutes: 8,
    related: [
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Panties Are Where Fit Goes Wrong', href: '/blog/panty-fit-guide' },
      { label: 'Bra Sets OEM/ODM', href: '/products/bra-sets' },
    ],
    faq: [
      {
        q: 'Why do bra and panty sets often arrive in slightly different colours?',
        a: 'Dye lots. Bra fabric and panty fabric are frequently different bases — a stretch lace on the bra, a lighter jersey or mesh on the panty — and each base absorbs dye differently even in the same bath. The fix is to dye both bases in one lot, or to specify a matched reflectance tolerance and approve a colour continuity card before bulk.',
      },
      {
        q: 'What is the hardest part of developing a matching set?',
        a: 'Grading continuity. The bra is graded on cup and band increments while the panty is graded on waist and hip — two different systems that drift apart at the size extremes. A set that looks perfect in M can look mismatched in XL unless the grading tables are reconciled at development stage.',
      },
      {
        q: 'How do you keep elastic colour consistent across a set?',
        a: 'Order bra elastic and panty elastic from the same dye lot and specify the same supplier for both. Mixing suppliers is the single most common cause of a visible elastic shade difference under daylight.',
      },
      {
        q: 'What MOQ applies to a coordinated bra and panty set?',
        a: 'A set is treated as one design with two components, so MOQ runs 200-300 sets per colourway at Charlizi depending on lace and trim availability. Multi-colourway orders are quoted per colourway.',
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    slug: 'panty-fit-guide',
    headline: 'Panties Are Where Fit Goes Wrong: A Manufacturing Guide',
    shortTitle: 'Panties Are Where Fit Goes Wrong: A Manufacturing Guide',
    description:
      'Rise, gusset construction, leg elastic and fabric recovery - the four production decisions that decide whether a panty fits, rides up, or gets returned.',
    date: '2026-11-08',
    image: '/factory/images/blog-panty-fit-hero.webp',
    imageAlt: 'Front view of a lace panty showing rise, gusset and leg elastic construction',
    keywords: ['panty manufacturing', 'panty fit', 'gusset construction', 'leg elastic', 'panty rise', 'panties OEM'],
    section: 'Panty Manufacturing',
    readMinutes: 8,
    related: [
      { label: 'Developing a Matching Bra and Panty Set', href: '/blog/bra-set-development' },
      { label: 'Size Grading for Full-Bust Bras', href: '/blog/size-grading' },
      { label: 'Panties OEM/ODM', href: '/products/panties' },
    ],
    faq: [
      {
        q: 'Why do panties ride up even when the size is correct?',
        a: 'Ride-up is almost always a leg-elastic tension problem, not a sizing problem. If leg elastic is applied at too high a stretch ratio, or with an elastic that loses recovery after a few washes, the leg opening grips and the garment migrates. Specifying an elastic with tested recovery (not just initial stretch) fixes it.',
      },
      {
        q: 'What is the gusset and why does construction matter?',
        a: 'The gusset is the inner crotch panel. It is usually a cotton or cotton-blend piece sewn in separately, and how it is attached — flatlock, bound, or double-stitched — decides both comfort and whether the seam shows through the outer fabric. A cheaply attached gusset is one of the top reasons a panty gets returned.',
      },
      {
        q: 'How does rise affect returns?',
        a: 'Rise (low, mid, high) changes where the waistband sits and how the garment moves with the body. Getting rise wrong for your target market produces a fit complaint that no amount of fabric quality can fix — a mid-rise pattern sold to a market that expects high rise will be returned regardless of construction quality.',
      },
      {
        q: 'What fabric recovery should I specify for panties?',
        a: 'Specify recovery measured after repeated wash cycles, not initial stretch. A jersey that snaps back to 95% of original after five washes will hold shape; one that relaxes to 85% will bag out at the seat within weeks.',
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    slug: 'shapewear-manufacturing',
    headline: 'Shapewear Manufacturing: Compression, Bonding and the Hard Parts',
    shortTitle: 'Shapewear Manufacturing: Compression, Bonding and the Hard Parts',
    description:
      'How compression levels are engineered, why bonded seams fail, and what to specify so shapewear holds its shape - from a factory that builds it.',
    date: '2026-11-08',
    image: '/factory/images/blog-shapewear-hero.webp',
    imageAlt: 'Black shaping bodysuit showing compression panel construction and bonded seams',
    keywords: ['shapewear manufacturing', 'compression levels', 'bonded seams', 'shaping bodysuit', 'tummy control', 'shapewear OEM'],
    section: 'Shapewear Manufacturing',
    readMinutes: 9,
    related: [
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Bulk vs Small Batch Sourcing', href: '/blog/bulk-vs-small-batch' },
      { label: 'Shapewear OEM/ODM', href: '/products/shapewear' },
    ],
    faq: [
      {
        q: 'How is compression level engineered in shapewear?',
        a: 'Compression is not one fabric property — it is built from fabric weight and modulus, panel placement, panel count, and seam direction. A single-layer knit can only reach a modest compression band; firm control requires multiple panels with graduated stretch so the garment compresses where you want it and releases where the body needs to move.',
      },
      {
        q: 'Why do bonded seams fail on shapewear?',
        a: 'Bond failure usually comes from three causes: insufficient bond temperature or dwell time during lamination, contamination on the fabric surface before bonding, or a mismatch between the adhesive film and the fabric base. Because bonded seams carry the full compression load, any weak point propagates — which is why bonded construction demands tighter process control than stitched construction.',
      },
      {
        q: 'What should I specify to make shapewear hold its shape after washing?',
        a: 'Specify compression retention after a defined number of wash cycles (e.g. 5-10), not just initial compression. Also specify the adhesive film type and bonding parameters, and request wash-test reports on the finished garment rather than on the fabric alone.',
      },
      {
        q: 'Is shapewear harder to manufacture than bras?',
        a: 'Different, rather than simply harder. Bras are component- and pattern-intensive; shapewear is process- and material-intensive. Shapewear tolerances on bonding and compression are tighter, and defect rates are far more sensitive to process drift, so factory process control matters more than pattern-making skill.',
      },
    ],
  },

  // ------------------------------------------------------------------ 5
  {
    slug: 'silicone-bra-manufacturing',
    headline: 'Adhesive Silicone Bras: What Separates a Good One From a Return',
    shortTitle: 'Adhesive Silicone Bras: What Separates a Good One From a Return',
    description:
      'Silicone grade, adhesive chemistry, edge thickness and wash-survival - the manufacturing factors that decide whether an adhesive bra gets reordered or returned.',
    date: '2026-11-08',
    image: '/factory/images/blog-silicone-bra-hero.webp',
    imageAlt: 'Adhesive silicone push-up bra showing cup thickness and edge detail',
    keywords: ['silicone bra manufacturing', 'adhesive bra', 'backless bra', 'silicone grade', 'reusable adhesive bra', 'silicone bras OEM'],
    section: 'Silicone Bra Manufacturing',
    readMinutes: 8,
    related: [
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Bulk vs Small Batch Sourcing', href: '/blog/bulk-vs-small-batch' },
      { label: 'Silicone Bras OEM/ODM', href: '/products/silicone-bras' },
    ],
    faq: [
      {
        q: 'What makes a silicone bra get returned?',
        a: 'The three dominant causes are adhesive failure (loses tack after 2-3 wears), edge lift (the perimeter rolls away from the skin because the edge is too thick or the adhesive is under-cured), and colour/finish mismatch (the nude tone does not match the marketed shade). All three are manufacturing specs, not user error.',
      },
      {
        q: 'What silicone grade is used in a good adhesive bra?',
        a: 'Medical-grade or skin-safe silicone with a specified shore hardness. Softer silicone conforms better but tears at thin sections; harder silicone holds shape but feels rigid. The right grade depends on cup size — larger sizes need a firmer body with a softer adhesive layer rather than one uniform material.',
      },
      {
        q: 'How many wears should a reusable adhesive bra last?',
        a: 'A properly specified reusable adhesive bra should hold tack for roughly 20-30 wears when cared for correctly. Anything below 10 wears points to under-cured adhesive or a low-grade adhesive layer, and will generate returns regardless of how good the packaging looks.',
      },
      {
        q: 'What is the MOQ for custom silicone bras?',
        a: 'MOQ at Charlizi is 200-300 pcs per design/colour, with sample development available before bulk commitment.',
      },
    ],
  },

  // ------------------------------------------------------------------ 6
  {
    slug: 'size-grading',
    headline: 'Size Grading for Full-Bust Bras: Where Ranges Break',
    shortTitle: 'Size Grading for Full-Bust Bras: Where Ranges Break',
    description:
      'Why scaling a 34B pattern to a 42F does not work, how grading increments should change above a D cup, and what to specify so your full-bust sizes actually fit.',
    date: '2026-11-08',
    image: '/factory/images/blog-size-grading-hero.webp',
    imageAlt: 'Black lace full-bust bra showing cup and band grading for extended sizes',
    keywords: ['bra size grading', 'full bust bras', 'plus size bra manufacturing', 'grading increments', 'bra pattern grading', 'plus size bras OEM'],
    section: 'Plus Size Bra Manufacturing',
    readMinutes: 9,
    related: [
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Wirefree vs Underwire Bras', href: '/blog/wirefree-vs-underwire' },
      { label: 'Plus Size Bras OEM/ODM', href: '/products/plus-size-bras' },
    ],
    faq: [
      {
        q: 'Why does scaling a 34B pattern up to a 42F not work?',
        a: 'Because the body does not scale uniformly. Band circumference grows in a roughly linear way, but cup volume grows geometrically, and the load path shifts — at full bust the support moves from the band into the straps and the wire. A uniformly scaled pattern gives you a garment that measures right on the table and fits wrong on the body.',
      },
      {
        q: 'How should grading increments change above a D cup?',
        a: 'Cup depth increments need to increase above D rather than stay constant, and strap width, wire gauge, and wing height all need their own step rules. Treating E, F, G, H cups as "one increment further" is the most common reason a full-bust range fits only at the small end.',
      },
      {
        q: 'What should I specify to a factory for a full-bust range?',
        a: 'Specify separate grading tables for band and cup, state the size range you intend to sell and where your volume sits, and ask the factory to show you fit samples at the largest cup in the range — not just the base size. Also agree wire gauge and strap width at the top of the range before tooling.',
      },
      {
        q: 'Is full-bust manufacturing more expensive?',
        a: 'Yes, structurally. Larger cups need more fabric per unit, firmer wires, wider straps and additional support components, so material cost per unit rises faster than size ratio alone would suggest. Tooling cost also rises because the grading tables are bespoke.',
      },
    ],
  },

  // ------------------------------------------------------------------ 7
  {
    slug: 'wirefree-vs-underwire',
    headline: 'Wirefree vs Underwire Bras: What Actually Changes in Production',
    shortTitle: 'Wirefree vs Underwire Bras: What Actually Changes in Production',
    description:
      'Wirefree vs underwire bras: the real manufacturing differences - pattern complexity, support structures, grading costs and how to choose for your line.',
    date: '2026-11-08',
    image: '/factory/images/blog-wirefree-underwire-hero.webp',
    imageAlt: 'Wirefree seamless bra shown in leopard print, worn without an underwire',
    keywords: ['wirefree bra manufacturing', 'underwire bra manufacturing', 'wirefree vs underwire', 'seamless bra', 'bra support structure'],
    section: 'Bra Manufacturing',
    readMinutes: 8,
    related: [
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Size Grading for Full-Bust Bras', href: '/blog/size-grading' },
      { label: 'Bras OEM/ODM', href: '/products/bras' },
    ],
    faq: [
      {
        q: 'What changes in production when you make a wirefree bra?',
        a: 'The wing takes over the entire support job, so wing fabric choice, bonding method and panel structure all become more critical. Pattern complexity often rises because support has to be engineered into fabric and construction rather than delegated to a wire. Grading cost also changes — wirefree structures need more test iterations before the range is locked.',
      },
      {
        q: 'Is wirefree cheaper to manufacture than underwire?',
        a: 'Not necessarily. Wirefree removes wire cost and channel stitching, but usually adds cost through more expensive support fabrics, extra panels, and longer development cycles. At small MOQ, underwire is frequently the cheaper option because the structure is well understood and tooling is standard.',
      },
      {
        q: 'Which is better for full-bust sizes?',
        a: 'Underwire still carries a structural advantage at large cup sizes because the wire transfers load to the band. Wirefree full-bust is achievable but requires purpose-built support structures — it cannot be a scaled-up version of a small-cup wirefree pattern.',
      },
      {
        q: 'Can I produce both wirefree and underwire under one product line?',
        a: 'Yes, and it is common — but they should be separate patterns, not the same pattern with the wire removed. Each needs its own grading table, and each will have a different defect profile, so QC standards should be written per construction.',
      },
    ],
  },

  // ------------------------------------------------------------------ 8
  {
    slug: 'choosing-bra-manufacturer',
    headline: 'How to Choose the Right Bra Manufacturer for Your Brand',
    shortTitle: 'How to Choose the Right Bra Manufacturer for Your Brand',
    description:
      'A practical guide for DTC brands looking for a reliable bra OEM partner - from MOQ considerations to quality certification requirements.',
    date: '2026-06-01',
    image: '/factory/images/blog-choosing-manufacturer.webp',
    imageAlt: 'Bra manufacturing facility floor with cutting and sewing stations',
    keywords: ['bra manufacturer', 'how to choose a manufacturer', 'bra OEM sourcing', 'lingerie supplier', 'MOQ bra manufacturing', 'BSCI certified factory'],
    section: 'Sourcing Guide',
    readMinutes: 7,
    related: [
      { label: 'Bulk vs Small Batch Sourcing', href: '/blog/bulk-vs-small-batch' },
      { label: 'Understanding OEKO-TEX Certification', href: '/blog/oeko-tex-certification' },
      { label: 'About Charlizi Factory', href: '/about' },
    ],
    faq: [
      {
        q: 'What should I check first when vetting a bra manufacturer?',
        a: 'Ask for the certification set before anything else — BSCI or Sedex for social compliance, OEKO-TEX Standard 100 for fabric safety, and ISO 9001 for process control. A factory that cannot produce these documents will become a compliance problem once you sell into the EU or into a major retailer.',
      },
      {
        q: 'What MOQ should I expect from a bra factory?',
        a: 'Typical bra MOQ runs 200-500 pcs per design per colourway, with multi-colourway orders quoting per colour. At Charlizi the range is 200-300 pcs/design, and small-batch sampling runs through Viomisha.com so you can evaluate quality before committing to bulk.',
      },
      {
        q: 'How do I verify quality before placing a bulk order?',
        a: 'Order a production-representative sample — meaning made on the same line, with the same materials, as the bulk run, not a hand-made studio sample. Then specify an AQL inspection level (AQL 2.5 is standard for apparel) and agree the inspection stage: in-line, end-line, or pre-shipment.',
      },
      {
        q: 'Should I visit the factory?',
        a: 'If volume justifies it, yes — and specifically ask to see cutting, sewing, and QC under one roof. A factory that subcontracts one of those stages has less control over your lead time and quality than one that does everything in-house.',
      },
      {
        q: 'What lead time is realistic for a first bra order?',
        a: 'Plan on roughly 15-25 days for sampling and revisions, then 30-45 days for bulk production after sample approval, plus shipping. First orders always take longer than repeat orders because pattern and grading adjustments happen during sampling.',
      },
    ],
  },

  // ------------------------------------------------------------------ 9
  {
    slug: 'oeko-tex-certification',
    headline: 'Understanding OEKO-TEX Certification in Intimate Apparel',
    shortTitle: 'Understanding OEKO-TEX Certification in Intimate Apparel',
    description:
      "What OEKO-TEX Standard 100 means for lingerie production, and why it matters for your brand's compliance and customer trust.",
    date: '2026-05-25',
    image: '/factory/images/blog-oeko-tex.webp',
    imageAlt: 'Fabric testing and certification documentation for intimate apparel production',
    keywords: ['OEKO-TEX certification', 'OEKO-TEX Standard 100', 'lingerie compliance', 'fabric testing', 'BSCI', 'intimate apparel certification'],
    section: 'Compliance',
    readMinutes: 7,
    related: [
      { label: 'How to Choose the Right Bra Manufacturer', href: '/blog/choosing-bra-manufacturer' },
      { label: 'Bra Anatomy: 12 Components', href: '/blog/bra-anatomy' },
      { label: 'Certifications', href: '/about' },
    ],
    faq: [
      {
        q: 'What is OEKO-TEX Standard 100?',
        a: 'OEKO-TEX Standard 100 is an independent testing and certification system for textile raw, semi-finished and finished products. It certifies that every component of the article — fabric, thread, elastic, trim, labels — has been tested for harmful substances at levels considered safe for human health.',
      },
      {
        q: 'Why does OEKO-TEX matter more for underwear than outerwear?',
        a: 'Because of skin contact area and duration. Intimate apparel sits against mucous-membrane-adjacent skin for many hours a day, so thresholds for substances like formaldehyde, certain azo dyes and heavy metals are applied with far less tolerance than for a jacket or a bag.',
      },
      {
        q: 'Does OEKO-TEX cover every part of a bra?',
        a: 'It covers every component that goes into the finished article, which is why the certificate must list the accessories too — elastic, sliders, rings, hook-and-eye tape, and any lace trim. A fabric-only certificate does not certify the finished bra.',
      },
      {
        q: 'What is the difference between OEKO-TEX and BSCI?',
        a: 'They test different things. OEKO-TEX is a product safety certification about what the garment is made of. BSCI (Business Social Compliance Initiative) is a social audit about how the workers who made it are treated — hours, wages, safety, and freedom of association. Buyers normally want both.',
      },
      {
        q: 'Does Charlizi hold OEKO-TEX certification?',
        a: 'Yes — Charlizi is BSCI and OEKO-TEX certified, with ISO 9001 quality management and FAMA (Disney facility authorization) also in place. Certificates are available on request with any quote.',
      },
    ],
  },

  // ------------------------------------------------------------------ 10
  {
    slug: 'bulk-vs-small-batch',
    headline: 'Bulk vs Small Batch: Sourcing Strategy for Apparel Brands',
    shortTitle: 'Bulk vs Small Batch: Sourcing Strategy for Apparel Brands',
    description:
      'When to start with small batch sampling and when to scale to full production. A strategic guide for intimate apparel brands.',
    date: '2026-05-18',
    image: '/factory/images/blog-bulk-vs-small.webp',
    imageAlt: 'Bulk production rolls of fabric alongside finished packaged garments',
    keywords: ['bulk vs small batch', 'small batch manufacturing', 'apparel sourcing strategy', 'MOQ strategy', 'intimate apparel production'],
    section: 'Sourcing Guide',
    readMinutes: 7,
    related: [
      { label: 'How to Choose the Right Bra Manufacturer', href: '/blog/choosing-bra-manufacturer' },
      { label: 'Shapewear Manufacturing', href: '/blog/shapewear-manufacturing' },
      { label: 'Contact Charlizi', href: '/contact' },
    ],
    faq: [
      {
        q: 'When should a brand use small-batch production instead of bulk?',
        a: 'Small batch makes sense before you have sales data: new silhouette, new colourway, new size range, or a new market. It lets you validate fit and sell-through with real customers before you commit tooling and fabric budget to a full run.',
      },
      {
        q: 'When does bulk production become the cheaper choice?',
        a: 'Once a style has proven sell-through, bulk almost always wins on unit cost. Sample development, pattern grading and setup are fixed costs per design — spreading them across 2,000 units instead of 200 cuts the per-unit burden substantially, and fabric buying at volume lowers material cost too.',
      },
      {
        q: 'What are the hidden costs of small batch?',
        a: 'Higher unit price, restricted fabric and trim selection, and less favourable lead time priority. Small batch runs are usually slotted around larger orders, so a small order can wait longer than the MOQ suggests — factor that into launch planning.',
      },
      {
        q: 'How does Charlizi handle small-batch sampling?',
        a: 'Small-batch evaluation runs through Viomisha.com, our sampling channel, so a brand can test a design at low volume before committing to the 200-300 pcs/design bulk MOQ at the factory.',
      },
    ],
  },
];

export const blogSchemaBySlug: Record<string, BlogSchemaEntry> = Object.fromEntries(
  blogSchema.map((e) => [e.slug, e])
);

/** Build the schema.org graph for one article (Article + FAQPage + BreadcrumbList). */
export function buildBlogSchemaGraph(e: BlogSchemaEntry) {
  const url = `https://charlizi.com/blog/${e.slug}`;
  const image = `https://charlizi.com${e.image}`;

  const article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: e.headline,
    name: e.headline,
    description: e.description,
    image: [image],
    datePublished: e.date,
    dateModified: e.date,
    inLanguage: 'en',
    articleSection: e.section,
    keywords: e.keywords.join(', '),
    wordCount: e.readMinutes * 220,
    timeRequired: `PT${e.readMinutes}M`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: AUTHOR,
    publisher: AUTHOR,
    isPartOf: { '@id': 'https://charlizi.com/#website' },
    about: e.keywords.map((k) => ({ '@type': 'Thing', name: k })),
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: e.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://charlizi.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://charlizi.com/blog' },
      { '@type': 'ListItem', position: 3, name: e.shortTitle, item: url },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [article, faqPage, breadcrumb],
  };
}
