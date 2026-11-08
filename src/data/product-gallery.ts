// src/data/product-gallery.ts
// 产品图片库（方案A：4:5 白底卡片图，保留实景）
// 数据由 scripts/make-card-images.cjs 生成，映射在此维护。
// 2026-10-30 追加：supplementByCategory（桌面商品图片整理入库）
//
// 说明：
//  - charlizi 站有 7 个分类，shapewear 由 2026-10-30 起已有图
//  - 每个款式含 front / back 两视图，用于详情页缩略图切换
//  - 图片为本地实体文件，不依赖 Shopify CDN

import { supplementByCategory } from './product-gallery-supplement';
import { dDriveByCategory } from './product-gallery-d-drive';

export interface GalleryImage {
  file: string;   // /factory/images/products-cards/<cat>/<name>.webp
  view: 'front' | 'back';
  alt: string;
}

export interface GalleryStyle {
  slug: string;         // viomisha 款式 slug，仅作标识
  title: string;        // 展示用名称
  category: string;     // 对应 ProductCategory.id
  images: GalleryImage[];
}

const C = '/factory/images/products-cards';

/** 每个分类下的款式清单 */
export const galleryByCategory: Record<string, GalleryStyle[]> = {
  'bra-sets': [
    {
      slug: 'wine-red-underwire-bra-thong-set',
      title: 'Wine Red Underwire Bra & Thong Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/wine-red-underwire-bra-thong-set-front.webp`, view: 'front', alt: 'Wine red underwire lace bra and thong set, front view' },
        { file: `${C}/bra-sets/wine-red-underwire-bra-thong-set-back.webp`, view: 'back', alt: 'Wine red underwire lace bra and thong set, back view' },
      ],
    },
    {
      slug: 'lace-bodysuit-for-women-comfortable-sexy-teddy-for-everyday-confidence',
      title: 'Lace Bodysuit Teddy Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/lace-bodysuit-for-women-comfortable-sexy-teddy-for-everyday-confidence-front.webp`, view: 'front', alt: 'Black lace bodysuit teddy lingerie, front view' },
        { file: `${C}/bra-sets/lace-bodysuit-for-women-comfortable-sexy-teddy-for-everyday-confidence-back.webp`, view: 'back', alt: 'Black lace bodysuit teddy lingerie, back view' },
      ],
    },
    {
      slug: 'viomisha-1-set-women-sticky',
      title: 'Sticky Bra & Thong Briefs Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/viomisha-1-set-women-sticky-front.webp`, view: 'front', alt: 'Adhesive sticky bra with matching thong briefs set' },
        { file: `${C}/bra-sets/viomisha-1-set-women-sticky-back.webp`, view: 'back', alt: 'Adhesive sticky bra and thong briefs set, alternate view' },
      ],
    },
    {
      slug: 'viomisha-womens-transparent-bra-and-underwear-set-perspective-mesh-underwear-bra-underwear-lace-bras-set-2-piece-set-black',
      title: 'Transparent Mesh Bra & Panty Set (Black)',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/viomisha-womens-transparent-bra-and-underwear-set-perspective-mesh-underwear-bra-underwear-lace-bras-set-2-piece-set-black-front.webp`, view: 'front', alt: 'Black transparent mesh lace bra and panty two piece set' },
        { file: `${C}/bra-sets/viomisha-womens-transparent-bra-and-underwear-set-perspective-mesh-underwear-bra-underwear-lace-bras-set-2-piece-set-black-back.webp`, view: 'back', alt: 'Black transparent mesh lace bra and panty set, alternate view' },
      ],
    },
    {
      slug: 'women-sexy-sheer-lace-bras-set-2099',
      title: 'Transparent Sexy Lace Lingerie Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/women-sexy-sheer-lace-bras-set-2099-front.webp`, view: 'front', alt: 'Sheer lace lingerie bra and panty set, front view' },
        { file: `${C}/bra-sets/women-sexy-sheer-lace-bras-set-2099-back.webp`, view: 'back', alt: 'Sheer lace lingerie bra and panty set, back view' },
      ],
    },
    {
      slug: 'viomisha-women-bra-panty-set',
      title: 'Underwire Lace Bra & Panty Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/viomisha-women-bra-panty-set-front.webp`, view: 'front', alt: 'Underwire lace bra and panty set, front view' },
        { file: `${C}/bra-sets/viomisha-women-bra-panty-set-back.webp`, view: 'back', alt: 'Underwire lace bra and panty set, back view' },
      ],
    },
  ],

  'bras': [
    {
      slug: 'womens-deep-v-neck-front',
      title: 'Deep V Neck Front Button Halter Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/womens-deep-v-neck-front-front.webp`, view: 'front', alt: 'Deep V neck front button halter bra, front view' },
        { file: `${C}/bras/womens-deep-v-neck-front-back.webp`, view: 'back', alt: 'Deep V neck front button halter bra, back view' },
      ],
    },
    {
      slug: 'viomisha-womens-sexy-lace-half',
      title: 'Sexy Lace Half Cup Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/viomisha-womens-sexy-lace-half-front.webp`, view: 'front', alt: 'Translucent mesh lace half cup bra, front view' },
        { file: `${C}/bras/viomisha-womens-sexy-lace-half-back.webp`, view: 'back', alt: 'Translucent mesh lace half cup bra, back view' },
      ],
    },
    {
      slug: 'viomisah-sexy-lace-bras-for-women-full-coverage-unlined-underwire-bra-large-size-lifting-lace-bra',
      title: 'Full Coverage Unlined Underwire Lace Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/viomisah-sexy-lace-bras-for-women-full-coverage-unlined-underwire-bra-large-size-lifting-lace-bra-front.webp`, view: 'front', alt: 'Full coverage unlined underwire lace bra, front view' },
        { file: `${C}/bras/viomisah-sexy-lace-bras-for-women-full-coverage-unlined-underwire-bra-large-size-lifting-lace-bra-back.webp`, view: 'back', alt: 'Full coverage unlined underwire lace bra, back view' },
      ],
    },
    {
      slug: 'ess-mutiway-bra-underwired-invisible',
      title: 'Push Up Strapless Multiway Lace Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/ess-mutiway-bra-underwired-invisible-front.webp`, view: 'front', alt: 'Push up strapless multiway underwire lace bra, front view' },
        { file: `${C}/bras/ess-mutiway-bra-underwired-invisible-back.webp`, view: 'back', alt: 'Push up strapless multiway underwire lace bra, back view' },
      ],
    },
    {
      slug: 'viomisha-floral-lace-halter-bralette',
      title: 'Floral Lace Halter Bralette',
      category: 'bras',
      images: [
        { file: `${C}/bras/viomisha-floral-lace-halter-bralette-front.webp`, view: 'front', alt: 'Floral lace halter bralette, front view' },
        { file: `${C}/bras/viomisha-floral-lace-halter-bralette-back.webp`, view: 'back', alt: 'Floral lace halter bralette, back view' },
      ],
    },
    {
      slug: 'womens-bras-underwire-push-up-bra',
      title: 'Sexy Push-up Half Cup Wire Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/womens-bras-underwire-push-up-bra-front.webp`, view: 'front', alt: 'Sexy push up half cup underwire bra, front view' },
        { file: `${C}/bras/womens-bras-underwire-push-up-bra-back.webp`, view: 'back', alt: 'Sexy push up half cup underwire bra, back view' },
      ],
    },
    {
      slug: 'viomisha-lace-bralettes-women-sexy-bras-mr2641',
      title: 'Lace Bralette Scalloped Trim',
      category: 'bras',
      images: [
        { file: `${C}/bras/viomisha-lace-bralettes-women-sexy-bras-mr2641-front.webp`, view: 'front', alt: 'Scalloped trim lace bralette in green, front view' },
        { file: `${C}/bras/viomisha-lace-bralettes-women-sexy-bras-mr2641-back.webp`, view: 'back', alt: 'Scalloped trim lace bralette in green, back view' },
      ],
    },
    {
      slug: 'underwire-black-deep-u-push-up-bra',
      title: 'Underwire Black Deep U Push Up Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/underwire-black-deep-u-push-up-bra-front.webp`, view: 'front', alt: 'Black deep U underwire push up bra, front view' },
        { file: `${C}/bras/underwire-black-deep-u-push-up-bra-back.webp`, view: 'back', alt: 'Black deep U underwire push up bra, back view' },
      ],
    },
    {
      slug: 'womens-strapless-halter-bras-bandeau-underwear-backless-bra-top',
      title: 'Strapless Halter Bandeau Backless Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/womens-strapless-halter-bras-bandeau-underwear-backless-bra-top-front.webp`, view: 'front', alt: 'Strapless halter bandeau backless bra top, front view' },
        { file: `${C}/bras/womens-strapless-halter-bras-bandeau-underwear-backless-bra-top-back.webp`, view: 'back', alt: 'Strapless halter bandeau backless bra top, back view' },
      ],
    },
  ],

  'plus-size-bras': [
    {
      slug: 'viomisha-women-plus-size-bras',
      title: 'Full Coverage No Wire Plus Size Bra',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/viomisha-women-plus-size-bras-front.webp`, view: 'front', alt: 'Full coverage wirefree plus size bra, front view' },
        { file: `${C}/plus-size-bras/viomisha-women-plus-size-bras-back.webp`, view: 'back', alt: 'Full coverage wirefree plus size bra, back view' },
      ],
    },
    {
      slug: 'women-plus-size-wireless-sleep-bras',
      title: 'Plus Size Wireless Seamless Comfort Bra',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/women-plus-size-wireless-sleep-bras-front.webp`, view: 'front', alt: 'Plus size wireless seamless comfort sleep bra, front view' },
        { file: `${C}/plus-size-bras/women-plus-size-wireless-sleep-bras-back.webp`, view: 'back', alt: 'Plus size wireless seamless comfort sleep bra, back view' },
      ],
    },
  ],

  'panties': [
    {
      slug: 'womens-panties-shorts-undershorts-woman',
      title: "Women's Safety Shorts (4-Pack)",
      category: 'panties',
      images: [
        { file: `${C}/panties/womens-panties-shorts-undershorts-woman-front.webp`, view: 'front', alt: "Women's seamless safety shorts 4-pack, front view" },
        { file: `${C}/panties/womens-panties-shorts-undershorts-woman-back.webp`, view: 'back', alt: "Women's seamless safety shorts 4-pack, back view" },
      ],
    },
    {
      slug: 'viomisha-womens-underwear-sexy-lace',
      title: 'Plus Size Lace Panties Multipack',
      category: 'panties',
      images: [
        { file: `${C}/panties/viomisha-womens-underwear-sexy-lace-front.webp`, view: 'front', alt: 'Plus size lace panties multipack, front view' },
        { file: `${C}/panties/viomisha-womens-underwear-sexy-lace-back.webp`, view: 'back', alt: 'Plus size lace panties multipack, back view' },
      ],
    },
  ],

  'silicone-bras': [
    {
      slug: 'viomisha-adhesive-bra-invisible-strapless-bra',
      title: 'Adhesive Invisible Lifting Bra (2 Pairs)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/viomisha-adhesive-bra-invisible-strapless-bra-front.webp`, view: 'front', alt: 'Adhesive invisible lifting silicone bra, 2 pairs, front view' },
        { file: `${C}/silicone-bras/viomisha-adhesive-bra-invisible-strapless-bra-back.webp`, view: 'back', alt: 'Adhesive invisible lifting silicone bra, packaged view' },
      ],
    },
    {
      slug: 'sticky-bra-push-up-for-women-strapless-invisible-adhesive-bra-with',
      title: 'Sticky Push Up Bra with Strap',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/sticky-bra-push-up-for-women-strapless-invisible-adhesive-bra-with-front.webp`, view: 'front', alt: 'Sticky push up strapless adhesive bra with clear strap, front view' },
        { file: `${C}/silicone-bras/sticky-bra-push-up-for-women-strapless-invisible-adhesive-bra-with-back.webp`, view: 'back', alt: 'Sticky push up adhesive bra with strap, alternate view' },
      ],
    },
    {
      slug: 'women-sticky-bra-backless-strapless-push-up',
      title: 'Backless Strapless Push Up Sticky Bra',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/women-sticky-bra-backless-strapless-push-up-front.webp`, view: 'front', alt: 'Backless strapless push up sticky bra, front view' },
        { file: `${C}/silicone-bras/women-sticky-bra-backless-strapless-push-up-back.webp`, view: 'back', alt: 'Backless strapless push up sticky bra, back view' },
      ],
    },
    {
      slug: 'invisible-adhesive-bra-rabbit-nipple',
      title: 'Rabbit Nipple Cover (2 pcs)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/invisible-adhesive-bra-rabbit-nipple-front.webp`, view: 'front', alt: 'Rabbit ear silicone nipple cover, 2 pieces, front view' },
        { file: `${C}/silicone-bras/invisible-adhesive-bra-rabbit-nipple-back.webp`, view: 'back', alt: 'Rabbit ear silicone nipple cover, packaging view' },
      ],
    },
    {
      slug: 'viomisha-sticky-lace-bra-2',
      title: 'Adhesive Lace Sticky Bra',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/viomisha-sticky-lace-bra-2-front.webp`, view: 'front', alt: 'Adhesive lace sticky bra, front view' },
        { file: `${C}/silicone-bras/viomisha-sticky-lace-bra-2-back.webp`, view: 'back', alt: 'Adhesive lace sticky bra, back view' },
      ],
    },
    {
      slug: 'silicone-strapless-bra-stickers-fabric-one-piece-seamless-sticky-bra',
      title: 'Silicone Strapless Nipple Stickers',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-strapless-bra-stickers-fabric-one-piece-seamless-sticky-bra-front.webp`, view: 'front', alt: 'Silicone strapless nipple stickers, seamless one piece, front view' },
        { file: `${C}/silicone-bras/silicone-strapless-bra-stickers-fabric-one-piece-seamless-sticky-bra-back.webp`, view: 'back', alt: 'Silicone strapless nipple stickers, alternate view' },
      ],
    },
    {
      slug: 'viomisha-sticky-bra-strapless-backless-push-up-bra-for-women-invisible-lifting-silicone',
      title: 'Sticky Backless Push Up Silicone Bra',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/viomisha-sticky-bra-strapless-backless-push-up-bra-for-women-invisible-lifting-silicone-front.webp`, view: 'front', alt: 'Sticky backless push up silicone bra, front view' },
        { file: `${C}/silicone-bras/viomisha-sticky-bra-strapless-backless-push-up-bra-for-women-invisible-lifting-silicone-back.webp`, view: 'back', alt: 'Sticky backless push up silicone bra, back view' },
      ],
    },
  ],

  // shapewear: 暂无图，用户后期补充
  'shapewear': [],

  'sleepwear': [
    {
      slug: 'women-slip-satin-sleepwear',
      title: 'White Satin Slip Nightdress',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/women-slip-satin-sleepwear-front.webp`, view: 'front', alt: 'White satin slip nightdress with heart print, front view' },
        { file: `${C}/sleepwear/women-slip-satin-sleepwear-back.webp`, view: 'back', alt: 'White satin slip nightdress with heart print, back view' },
      ],
    },
    {
      slug: 'silky-pajama-strappy-shorts-nightwear',
      title: 'Silky Pajama Set — Strappy Cami & Shorts',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/silky-pajama-strappy-shorts-nightwear-front.webp`, view: 'front', alt: 'Silky pajama set with strappy cami and shorts, front view' },
        { file: `${C}/sleepwear/silky-pajama-strappy-shorts-nightwear-back.webp`, view: 'back', alt: 'Silky pajama set with strappy cami and shorts, back view' },
      ],
    },
    {
      slug: 'women-pure-cotton-underwear-suspender-short-nightdress',
      title: 'Cotton Suspender Nightdress',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/women-pure-cotton-underwear-suspender-short-nightdress-front.webp`, view: 'front', alt: 'Pure cotton suspender nightdress with moon print, front view' },
        { file: `${C}/sleepwear/women-pure-cotton-underwear-suspender-short-nightdress-back.webp`, view: 'back', alt: 'Pure cotton suspender nightdress with moon print, back view' },
      ],
    },
  ],
};

/** 取某分类的款式清单（基础 + 2026-10-30 新增 + 2026-11-08 D盘新增） */
export function getGallery(categoryId: string): GalleryStyle[] {
  const base = galleryByCategory[categoryId] ?? [];
  const extra = supplementByCategory[categoryId] ?? [];
  const dDrive = dDriveByCategory[categoryId] ?? [];
  const seen = new Set(base.map((s) => s.slug));
  const merged = [...base];
  for (const list of [extra, dDrive]) {
    for (const s of list) {
      if (seen.has(s.slug)) continue;
      seen.add(s.slug);
      merged.push(s);
    }
  }
  return merged;
}

/** 取某分类的首图（用于分类卡片展示） */
export function getCoverImage(categoryId: string): string | null {
  const list = getGallery(categoryId);
  const first = list.find(s => s.images.length > 0);
  return first?.images[0]?.file ?? null;
}

/** 取某分类的封面图集（分类页展示用，取每款首图，最多 n 张） */
export function getCovers(categoryId: string, n = 6): GalleryImage[] {
  return getGallery(categoryId)
    .map(s => s.images.find(i => i.view === 'front') ?? s.images[0])
    .filter(Boolean)
    .slice(0, n);
}

/** 总款式数（不含空分类） */
export const totalStyles = Object.values(galleryByCategory)
  .reduce((sum, list) => sum + list.length, 0);
