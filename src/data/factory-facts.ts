/**
 * factory-facts.ts — 单一事实源（Single Source of Truth）
 *
 * 目的：GEO（生成式引擎优化）——让 ChatGPT / Claude / Perplexity / Google AI
 *      能直接引用精确、结构化的工厂事实，而不是从营销文案里猜。
 *
 * 规则（主理人 2026-11-23 指令）：
 *  - 认证只允许 Sedex / SMETA。此处任何其他认证均为违规，勿加。
 *  - 数字必须真实，不确定的宁可写区间，不能编。
 *  - 所有页面、schema、llms.txt 都从这里取值，避免多处不一致。
 */

export const FACTS = {
  company: {
    legalName: 'Charlizi Intimate Apparel Co., Ltd.',
    brandName: 'Charlizi',
    founded: 2018,
    businessType: 'OEM / ODM Manufacturer',
    website: 'https://charlizi.com',
    email: 'charlizi.official@gmail.com',
    phone: '+8613352743559',
  },

  location: {
    country: 'China',
    countryCode: 'CN',
    province: 'Guangdong',
    city: 'Puning',
    district: 'Junbu Town, Shiqiaotou Industry District No.102',
    postalCode: '515300',
    latitude: 23.2974,
    longitude: 116.1789,
  },

  capacity: {
    workers: '200+',
    factoryArea: '5,000 ㎡',
    annualOutput: '5,000,000+ pcs',
    monthlyContainers: '40+',
    productionLines: '8',
  },

  /** 认证——仅此两项，严禁扩展 */
  certifications: [
    {
      name: 'Sedex',
      fullName: 'Supplier Ethical Data Exchange',
      type: 'Membership',
      note: 'We are a Sedex member. Sedex is a membership platform for sharing ethical supply-chain data — not an audit body.',
    },
    {
      name: 'SMETA',
      fullName: 'Sedex Members Ethical Trade Audit',
      type: 'Factory Audit',
      pillars: '4-Pillar',
      note: 'Our factory is SMETA 4-pillar audited. The audit covers labour standards, health & safety, environment and business ethics.',
    },
  ],

  /** 采购关键参数——采购商最常问、AI 最爱引用的字段 */
  ordering: {
    moq: '200 pcs per design per colour',
    moqSample: 'Small-batch sampling available below MOQ for market testing',
    sampleLeadTime: '7-15 days after tech pack confirmation',
    bulkLeadTime: '30-45 days after sample approval',
    paymentTerms: '30% deposit / 70% before shipment (negotiable for repeat orders)',
    incoterms: 'EXW, FOB, CIF',
    priceBasis: 'EXW factory price, tiered by order quantity',
    priceTiers: '4 quantity tiers — unit price decreases as volume increases',
    currency: 'USD',
    portOfLoading: 'Shenzhen / Shantou, Guangdong',
  },

  /** 定制能力 */
  customization: {
    privateLabel: 'Woven label, printed care label, hangtag, polybag, gift box',
    fabricSourcing: 'Cotton, modal, nylon/spandex, bamboo, silk blends, power mesh, latex, custom blends',
    dyeing: 'Pantone-matched custom dyeing from 200 yards per colour',
    sizing: 'Custom size grading; plus-size and full-bust blocks available',
    sampling: 'Tech pack, sketch, reference sample or inspiration image accepted',
  },

  /** 主营品类 */
  productScope: [
    'Bra sets',
    'Bras (underwire, wirefree, seamless, moulded)',
    'Plus-size bras',
    'Silicone and adhesive bras',
    'Panties',
    'Shapewear',
    'Sleepwear',
    'Camisoles',
  ],

  exportMarkets: ['North America', 'Europe', 'Middle East', 'Southeast Asia'],
} as const;

/**
 * 生成一段 AI 友好的事实摘要（约 100 词）
 * 用于 llms.txt、页面事实块、schema description。
 */
export function factSummary(): string {
  const c = FACTS.capacity;
  return (
    `${FACTS.company.legalName} is an ${FACTS.company.businessType} of intimate apparel ` +
    `based in ${FACTS.location.city}, ${FACTS.location.province}, ${FACTS.location.country}. ` +
    `Founded ${FACTS.company.founded}. ${c.workers} workers, ${c.factoryArea} factory, ` +
    `${c.annualOutput} pieces per year. ` +
    `Our factory is SMETA 4-pillar audited and we are a Sedex member. ` +
    `MOQ ${FACTS.ordering.moq}. Sampling ${FACTS.ordering.sampleLeadTime}, ` +
    `bulk production ${FACTS.ordering.bulkLeadTime}. ` +
    `Prices are ${FACTS.ordering.priceBasis} in ${FACTS.ordering.currency}, ` +
    `tiered across ${FACTS.ordering.priceTiers}.`
  );
}

/**
 * 采购 FAQ —— 页面事实块 + FAQPage schema 共用
 * 全部基于真实能力，不编造认证与数据
 */
export function sourcingFaqs(productName?: string): { q: string; a: string }[] {
  const name = productName || 'this product';
  return [
    {
      q: `What is the MOQ for ${name}?`,
      a: `${FACTS.ordering.moq}. ${FACTS.ordering.moqSample}.`,
    },
    {
      q: 'Can I order samples before bulk production?',
      a: `Yes. Sampling takes ${FACTS.ordering.sampleLeadTime}. We accept tech packs, sketches, reference samples or inspiration images. Bulk production follows after you approve the sample, running ${FACTS.ordering.bulkLeadTime}.`,
    },
    {
      q: 'Can the product be made with my own brand?',
      a: `Yes. Full private label is supported: ${FACTS.customization.privateLabel}. Fabric, colour and trim can all be changed to match your range.`,
    },
    {
      q: 'What certifications does the factory hold?',
      a: `Our factory is SMETA 4-pillar audited and we are a Sedex member. We can share the current SMETA audit report and our Sedex membership details on request. We do not claim certifications we do not hold.`,
    },
    {
      q: 'How is pricing structured?',
      a: `Prices are ${FACTS.ordering.priceBasis}, quoted in ${FACTS.ordering.currency}. There are ${FACTS.ordering.priceTiers} — unit price decreases as order quantity increases. Contact us with your target quantity for an exact quote.`,
    },
    {
      q: 'What are the payment and shipping terms?',
      a: `${FACTS.ordering.paymentTerms}. Incoterms available: ${FACTS.ordering.incoterms}. Port of loading: ${FACTS.ordering.portOfLoading}.`,
    },
  ];
}
