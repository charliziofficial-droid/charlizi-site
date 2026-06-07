import rss from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Charlizi Journal',
    description: 'Style guides, fit tips, and inspiration from Charlizi',
    site: context.site,
    items: [
      { title: 'How to Find Your Perfect Bralette Fit', pubDate: new Date('2026-06-01'), link: '/blog/perfect-bralette-fit' },
      { title: '5 Sleepwear Trends for Summer', pubDate: new Date('2026-05-25'), link: '/blog/sleepwear-trends-summer' },
      { title: 'Caring for Lace: A Simple Guide', pubDate: new Date('2026-05-18'), link: '/blog/caring-for-lace' },
    ],
  });
}
