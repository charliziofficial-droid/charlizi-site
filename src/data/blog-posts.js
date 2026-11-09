// Blog posts data

// Slugs that already have a dedicated hand-written .astro page under src/pages/blog/.
// [slug].astro skips these so the generic placeholder never overwrites the richer page.
export const handBuiltSlugs = new Set([
  'bra-anatomy',
  'bra-set-development',
  'panty-fit-guide',
  'shapewear-manufacturing',
  'silicone-bra-manufacturing',
  'size-grading',
  'wirefree-vs-underwire',
  'choosing-bra-manufacturer',
  'oeko-tex-certification',
  'bulk-vs-small-batch',
  'adhesive-bra-spec-guide',
  'silicone-cup-moulding-process',
]);

export const blogPosts = [
  { title: 'Silicone Cup Moulding: The Full Process From Tool to Finished Bra', slug: 'silicone-cup-moulding-process', date: '2026-11-17', image: 'blog-silicone-moulding-hero.webp', desc: 'Step by step through silicone cup moulding: tool making, compound choice, degassing, cure cycle, trimming and adhesive lamination.' },
  { title: 'Adhesive Bra Manufacturing: What Buyers Get Wrong in the Spec', slug: 'adhesive-bra-spec-guide', date: '2026-11-10', image: 'blog-adhesive-spec-hero.webp', desc: 'Sticky bras fail for spec reasons, not user error - adhesive chemistry, edge thickness, cup moulding and wash survival.' },
  { title: 'Bra Anatomy: The 12 Components That Decide Cost and Fit', slug: 'bra-anatomy', date: '2026-11-08', image: 'blog-bra-anatomy-hero.webp', desc: 'A factory-side breakdown of every component in a bra - cup, wire, wing, band, hook, slider - and how each one moves your unit cost and fit quality.' },
  { title: 'Developing a Bra and Panty Set That Actually Matches', slug: 'bra-set-development', date: '2026-11-08', image: 'blog-bra-set-hero.webp', desc: 'Matching a bra and panty set is harder than making either piece alone - fabric dye lots, elastic colour, trim continuity and the grading mismatch nobody warns you about.' },
  { title: 'Panties Are Where Fit Goes Wrong: A Manufacturing Guide', slug: 'panty-fit-guide', date: '2026-11-08', image: 'blog-panty-fit-hero.webp', desc: 'Rise, gusset construction, leg elastic and fabric recovery - the four production decisions that decide whether a panty fits, rides up, or gets returned.' },
  { title: 'Shapewear Manufacturing: Compression, Bonding and the Hard Parts', slug: 'shapewear-manufacturing', date: '2026-11-08', image: 'blog-shapewear-hero.webp', desc: 'How compression levels are engineered, why bonded seams fail, and what to specify so shapewear holds its shape - from a factory that builds it.' },
  { title: 'Adhesive Silicone Bras: What Separates a Good One From a Return', slug: 'silicone-bra-manufacturing', date: '2026-11-08', image: 'blog-silicone-bra-hero.webp', desc: 'Silicone grade, adhesive chemistry, edge thickness and wash-survival - the manufacturing factors that decide whether an adhesive bra gets reordered or returned.' },
  { title: 'Size Grading for Full-Bust Bras: Where Ranges Break', slug: 'size-grading', date: '2026-11-08', image: 'blog-size-grading-hero.webp', desc: 'Why scaling a 34B pattern to a 42F does not work, how grading increments should change above a D cup, and what to specify so your full-bust sizes actually fit.' },
  { title: 'Wirefree vs Underwire Bras: What Actually Changes in Production', slug: 'wirefree-vs-underwire', date: '2026-11-08', image: 'blog-wirefree-underwire-hero.webp', desc: 'The real manufacturing differences between wirefree and underwire bras - pattern complexity, support structures, grading costs and how to choose for your product line.' },
  { title: 'How to Choose the Right Bra Manufacturer for Your Brand', slug: 'choosing-bra-manufacturer', date: '2026-06-01', image: 'blog-choosing-manufacturer.webp', desc: 'A practical guide for DTC brands looking for a reliable bra OEM partner - from MOQ considerations to quality certification requirements.' },
  { title: 'Understanding OEKO-TEX Certification in Intimate Apparel', slug: 'oeko-tex-certification', date: '2026-05-25', image: 'blog-oeko-tex.webp', desc: 'What OEKO-TEX Standard 100 means for lingerie production, and why it matters for your brand\'s compliance and customer trust.' },
  { title: 'Bulk vs Small Batch: Sourcing Strategy for Apparel Brands', slug: 'bulk-vs-small-batch', date: '2026-05-18', image: 'blog-bulk-vs-small.webp', desc: 'When to start with small batch sampling and when to scale to full production. A strategic guide for intimate apparel brands.' },
];
