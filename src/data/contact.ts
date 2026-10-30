/**
 * 单一事实源（Single Source of Truth）—— 联系方式
 *
 * 依据：
 *  - 电话 / WhatsApp / 地址：工厂展示主图 factory-footer-contact.jpg（用户确认「以主图为主」）
 *  - 邮箱：用户 2026-10-30 明确指定 charlizi.official@gmail.com
 * 任何页面需要使用电话/邮箱/微信/地址，一律从这里引用，不要再硬编码。
 *
 * 2026-10-30 统一口径：此前 contact.astro / navigation.ts / 各处硬编码为
 * +86 136 3285 6817 / sales@charlizi.com / charlizi_factory / 深圳龙岗，
 * 与主图不一致，已全部改为下面的值。
 */

export const CONTACT = {
  /** 联系电话（显示用） */
  phoneDisplay: '+86 133 5274 3559',
  /** 联系电话（tel: 链接用，无空格） */
  phoneTel: '+8613352743559',
  /** WhatsApp 链接 */
  whatsapp: 'https://wa.me/8613352743559',
  /** 邮箱 */
  email: 'charlizi.official@gmail.com',
  /** 微信 */
  wechat: 'ke_666889',
  /** 联系人 */
  contactName: 'Yang Gengfeng',
  /** 公司名 */
  company: 'Charlizi Intimate Apparel Co., Ltd.',

  address: {
    line1: 'Shiqiaotou Industry District No.102',
    line2: 'Junbu Town, Puning City',
    region: 'Guangdong',
    country: 'China',
    /** 单行完整地址 */
    full: 'Shiqiaotou Industry District No.102, Junbu Town, Puning City, Guangdong, China',
    locality: 'Puning',
    postalCode: '',
  },
} as const;

/** 页脚 / 通用列表用的联系方式条目 */
export const CONTACT_LINKS = [
  { text: `WhatsApp: ${CONTACT.phoneDisplay}`, href: CONTACT.whatsapp },
  { text: `Email: ${CONTACT.email}`, href: `mailto:${CONTACT.email}` },
  { text: `WeChat: ${CONTACT.wechat}`, href: '#' },
];
