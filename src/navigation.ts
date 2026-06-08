import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Products',
      links: [
        {
          text: 'Bra Sets',
          href: getPermalink('/products/bra-sets'),
        },
        {
          text: 'Bras',
          href: getPermalink('/products/bras'),
        },
        {
          text: 'Plus Size Bras',
          href: getPermalink('/products/plus-size-bras'),
        },
        {
          text: 'Panties',
          href: getPermalink('/products/panties'),
        },
        {
          text: 'Silicone Bras',
          href: getPermalink('/products/silicone-bras'),
        },
        {
          text: 'Shapewear',
          href: getPermalink('/products/shapewear'),
        },
        {
          text: 'Sleepwear',
          href: getPermalink('/products/sleepwear'),
        },
      ],
    },
    {
      text: 'Process',
      href: getPermalink('/process'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Blog',
      href: getPermalink('/blog'),
    },
    {
      text: 'FAQ',
      href: getPermalink('/faq'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [
    { text: 'Get a Quote', href: getPermalink('/contact'), variant: 'primary' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Products',
      links: [
        { text: 'Bra Sets', href: getPermalink('/products/bra-sets') },
        { text: 'Bras', href: getPermalink('/products/bras') },
        { text: 'Plus Size Bras', href: getPermalink('/products/plus-size-bras') },
        { text: 'Panties', href: getPermalink('/products/panties') },
        { text: 'Silicone Bras', href: getPermalink('/products/silicone-bras') },
        { text: 'Shapewear', href: getPermalink('/products/shapewear') },
        { text: 'Sleepwear', href: getPermalink('/products/sleepwear') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Production Process', href: getPermalink('/process') },
        { text: 'FAQ', href: getPermalink('/faq') },
        { text: 'Blog', href: getPermalink('/blog') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: 'WhatsApp: +86 136 3285 6817', href: 'https://wa.me/8613632856817' },
        { text: 'Email: sales@charlizi.com', href: 'mailto:sales@charlizi.com' },
        { text: 'WeChat: charlizi_factory', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
    { text: 'Terms of Service', href: getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: 'https://wa.me/8613632856817' },
    { ariaLabel: 'Email', icon: 'tabler:mail', href: 'mailto:sales@charlizi.com' },
  ],
  footNote: `
    &copy; ${new Date().getFullYear()} Charlizi Intimate Apparel Co., Ltd. All rights reserved.
  `,
};
