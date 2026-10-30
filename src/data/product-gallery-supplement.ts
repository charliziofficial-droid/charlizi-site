// src/data/product-gallery-supplement.ts
// 2026-10-30 新增：桌面「商品图片」文件夹 44 张产品图整理入库
// 说明：图源经视觉模型识别 + 感知哈希去重 + 定向配对确认，无重复图；
//       产品图统一 900x1125 (4:5)，白底补边不裁切。
//       注意：本文件按分类「追加」到 galleryByCategory，不覆盖原有款式。

import type { GalleryStyle } from './product-gallery';

const C = '/factory/images/products-cards';

export const supplementByCategory: Record<string, GalleryStyle[]> = {
  'bras': [
    {
      slug: 'floral-lace-halter-bra-red-black',
      title: 'Floral Lace Halter Bra (Red / Black)',
      category: 'bras',
      images: [
        { file: `${C}/bras/floral-lace-halter-bra-red-black-front.webp`, view: 'front', alt: 'Floral lace halter neck bra with deep V front, shown in red and black' },
        { file: `${C}/bras/floral-lace-halter-bra-black-back.webp`, view: 'back', alt: 'Floral lace halter bra in black and red, back view' },
      ],
    },
    {
      slug: 'grey-cotton-wirefree-bra',
      title: 'Grey Cotton Wirefree Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/grey-cotton-wirefree-bra-front.webp`, view: 'front', alt: 'Grey cotton wirefree bra, front view' },
      ],
    },
    {
      slug: 'grey-underwire-bra-black-brief-set',
      title: 'Grey Underwire Bra & Black Brief Set',
      category: 'bras',
      images: [
        { file: `${C}/bras/grey-underwire-bra-black-brief-set-front.webp`, view: 'front', alt: 'Grey underwire bra paired with black brief, front view' },
      ],
    },
    {
      slug: 'cheetah-print-wirefree-bra',
      title: 'Cheetah Print Wirefree Bra',
      category: 'bras',
      images: [
        { file: `${C}/bras/cheetah-print-wirefree-bra-front.webp`, view: 'front', alt: 'Black and white cheetah print wirefree bra, front view' },
      ],
    },
    {
      slug: 'floral-print-wirefree-bra-black',
      title: 'Floral Print Wirefree Bra (Black)',
      category: 'bras',
      images: [
        { file: `${C}/bras/floral-print-wirefree-bra-black-front.webp`, view: 'front', alt: 'Black wirefree bra with blue and purple floral print, front view' },
      ],
    },
  ],

  'plus-size-bras': [
    {
      slug: 'white-floral-underwire-bra-plus-size',
      title: 'White Floral Underwire Bra — Plus Size',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/white-floral-underwire-bra-plus-size-front.webp`, view: 'front', alt: 'White floral print underwire bra in plus size fit, front view' },
      ],
    },
    {
      slug: 'black-lace-deep-v-bra-plus-size',
      title: 'Black Lace Deep V Bra — Plus Size',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/black-lace-deep-v-bra-plus-size-front.webp`, view: 'front', alt: 'Black lace deep V wirefree bra in plus size fit, front view' },
      ],
    },
    {
      slug: 'black-wirefree-bra-plus-size',
      title: 'Black Wirefree Bra — Plus Size',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/black-wirefree-bra-plus-size-back.webp`, view: 'back', alt: 'Black cotton wirefree bra in plus size fit, back view' },
      ],
    },
    {
      slug: 'beige-wirefree-bra-plus-size',
      title: 'Beige Wirefree Bra — Plus Size',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/beige-wirefree-bra-plus-size-front.webp`, view: 'front', alt: 'Beige wirefree bra in plus size fit, front view' },
      ],
    },
    {
      slug: 'pink-lace-halter-bra-panty-set-plus-size',
      title: 'Pink Lace Halter Bra & Panty Set — Plus Size',
      category: 'plus-size-bras',
      images: [
        { file: `${C}/plus-size-bras/pink-lace-halter-bra-panty-set-plus-size-front.webp`, view: 'front', alt: 'Pink lace halter bra with matching panty in plus size fit, front view' },
      ],
    },
  ],

  'bra-sets': [
    {
      slug: 'leopard-lace-underwire-bra-set',
      title: 'Leopard Lace Underwire Bra Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/leopard-lace-underwire-bra-set-front.webp`, view: 'front', alt: 'Black and white leopard lace underwire bra and panty set, front view' },
      ],
    },
    {
      slug: 'black-white-print-cotton-bra-set',
      title: 'Black & White Print Cotton Bra Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/black-white-print-cotton-bra-set-front.webp`, view: 'front', alt: 'Black and white printed cotton bra and panty set, front view' },
      ],
    },
    {
      slug: 'red-lace-bow-bra-thong-set',
      title: 'Red Lace Bow Bra & Thong Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/red-lace-bow-bra-thong-set-front.webp`, view: 'front', alt: 'Red lace halter bra with satin bow and matching thong, front view' },
        { file: `${C}/bra-sets/red-lace-bow-bra-thong-set-back.webp`, view: 'back', alt: 'Red lace bow bra and thong set, back view' },
      ],
    },
    {
      slug: 'pink-lace-bra-panty-set',
      title: 'Pink Lace Bra & Panty Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/pink-lace-bra-panty-set-front.webp`, view: 'front', alt: 'Pink lace deep V wirefree bra and panty set, front view' },
      ],
    },
    {
      slug: 'black-lace-deep-v-bra-set',
      title: 'Black Lace Deep V Bra Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/black-lace-deep-v-bra-set-front.webp`, view: 'front', alt: 'Black lace deep V underwire bra and panty set, front view' },
      ],
    },
    {
      slug: 'grey-cotton-wirefree-bra-set',
      title: 'Grey Cotton Wirefree Bra Set',
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/grey-cotton-wirefree-bra-set-front.webp`, view: 'front', alt: 'Grey cotton wirefree strapless bra and panty set, side view' },
      ],
    },
  ],

  'panties': [
    {
      slug: 'lace-panties-4-color-pack',
      title: 'Lace High Waist Panties — 4 Color Pack',
      category: 'panties',
      images: [
        { file: `${C}/panties/lace-panties-4-color-pack-front.webp`, view: 'front', alt: 'Four lace high waist panties in black, wine red, pink and blue' },
      ],
    },
    {
      slug: 'black-red-lace-panties',
      title: 'Black & Red Lace Panties',
      category: 'panties',
      images: [
        { file: `${C}/panties/black-red-lace-panties-front.webp`, view: 'front', alt: 'Black and red lace panties on white background' },
      ],
    },
    {
      slug: 'black-green-lace-high-waist-panties',
      title: 'Black Lace High Waist Panties (Neon Trim)',
      category: 'panties',
      images: [
        { file: `${C}/panties/black-green-lace-high-waist-panties-front.webp`, view: 'front', alt: 'Black high waist panties with neon green lace trim' },
      ],
    },
    {
      slug: 'leopard-print-high-waist-panties-3-pack',
      title: 'Leopard Print High Waist Panties — 3 Pack',
      category: 'panties',
      images: [
        { file: `${C}/panties/leopard-print-high-waist-panties-3-pack-front.webp`, view: 'front', alt: 'Three leopard print high waist panties in black, brown and monochrome' },
      ],
    },
    {
      slug: 'cotton-high-waist-panties-5-pack',
      title: 'Cotton High Waist Panties — 5 Pack',
      category: 'panties',
      images: [
        { file: `${C}/panties/cotton-high-waist-panties-5-pack-front.webp`, view: 'front', alt: 'Five cotton high waist panties in grey, pink, blue, yellow and orange' },
      ],
    },
    {
      slug: 'lace-high-waist-panties-3-pack',
      title: 'Lace High Waist Panties — 3 Pack',
      category: 'panties',
      images: [
        { file: `${C}/panties/lace-high-waist-panties-3-pack-front.webp`, view: 'front', alt: 'Three lace and mesh high waist panties in pink, red and white' },
      ],
    },
  ],

  'silicone-bras': [
    {
      slug: 'adhesive-strapless-bra-black-nude',
      title: 'Adhesive Strapless Silicone Bra (Black / Nude)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/adhesive-strapless-bra-black-nude-front.webp`, view: 'front', alt: 'Adhesive strapless silicone bra shown in black and nude' },
      ],
    },
    {
      slug: 'adhesive-bra-push-up-nude',
      title: 'Adhesive Push Up Silicone Bra (Nude)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/adhesive-bra-push-up-nude-front.webp`, view: 'front', alt: 'Nude adhesive push up silicone bra, front view' },
      ],
    },
    {
      slug: 'silicone-nipple-covers-black-nude',
      title: 'Silicone Nipple Covers (Black / Nude)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-nipple-covers-black-nude-front.webp`, view: 'front', alt: 'Silicone nipple covers shown in black and nude' },
      ],
    },
    {
      slug: 'silicone-adhesive-front-clasp-bra',
      title: 'Silicone Adhesive Front Clasp Bra',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-adhesive-front-clasp-bra-front.webp`, view: 'front', alt: 'Silicone adhesive bra with front clasp in nude' },
      ],
    },
    {
      slug: 'silicone-adhesive-bra-nude',
      title: 'Silicone Adhesive Bra (Nude)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-adhesive-bra-nude-front.webp`, view: 'front', alt: 'Nude silicone adhesive strapless bra' },
      ],
    },
    {
      slug: 'silicone-adhesive-bra-black-nude-pair',
      title: 'Silicone Adhesive Bra (Black / Nude)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-adhesive-bra-black-nude-pair-front.webp`, view: 'front', alt: 'Two silicone adhesive strapless bras in black and nude' },
      ],
    },
    {
      slug: 'silicone-strap-on-breast-petals',
      title: 'Silicone Strap-on Breast Petals',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-strap-on-breast-petals-front.webp`, view: 'front', alt: 'Nude silicone strap-on breast petals' },
      ],
    },
    {
      slug: 'silicone-front-clasp-adhesive-bra',
      title: 'Silicone Front Clasp Adhesive Bra (Nude / Black)',
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/silicone-front-clasp-adhesive-bra-front.webp`, view: 'front', alt: 'Silicone front clasp adhesive bra in nude and black' },
      ],
    },
  ],

  'sleepwear': [
    {
      slug: 'pink-floral-v-neck-nightdress',
      title: 'Pink Floral V-Neck Nightdress',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/pink-floral-v-neck-nightdress-front.webp`, view: 'front', alt: 'Pink floral print V-neck short sleeve cotton nightdress' },
      ],
    },
    {
      slug: 'pink-floral-pajama-set',
      title: 'Pink Tee & Printed Pants Pajama Set',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/pink-floral-pajama-set-front.webp`, view: 'front', alt: 'Pink tee shirt with printed lounge pants pajama set' },
      ],
    },
    {
      slug: 'white-cotton-suspender-nightdress',
      title: 'White Cotton Suspender Nightdress',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/white-cotton-suspender-nightdress-front.webp`, view: 'front', alt: 'White cotton suspender strap nightdress' },
      ],
    },
    {
      slug: 'black-leopard-sheer-cami-nightdress',
      title: 'Black Leopard Sheer Cami Nightdress',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/black-leopard-sheer-cami-nightdress-front.webp`, view: 'front', alt: 'Black sheer mesh cami nightdress with leopard print' },
      ],
    },
    {
      slug: 'leopard-print-slip',
      title: 'Leopard Print Mesh Slip',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/leopard-print-slip-front.webp`, view: 'front', alt: 'Black leopard print mesh slip dress' },
      ],
    },
    {
      slug: 'leopard-cotton-cami-slip',
      title: 'Leopard Cotton Cami Slip',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/leopard-cotton-cami-slip-front.webp`, view: 'front', alt: 'Leopard print cotton cami slip' },
      ],
    },
    {
      slug: 'black-mesh-cami-slit-nightdress',
      title: 'Black Mesh Cami Slit Nightdress',
      category: 'sleepwear',
      images: [
        { file: `${C}/sleepwear/black-mesh-cami-slit-nightdress-front.webp`, view: 'front', alt: 'Black mesh cami with deep V neckline and slit skirt' },
      ],
    },
  ],

  'shapewear': [
    {
      slug: 'deep-v-lace-bodysuit-multi-color',
      title: 'Deep V Lace Bodysuit (Multi Color)',
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/deep-v-lace-bodysuit-multi-color-front.webp`, view: 'front', alt: 'Deep V mesh bodysuit shown in black, red and off-white' },
      ],
    },
    {
      slug: 'black-off-shoulder-bodysuit',
      title: 'Black Off Shoulder Bodysuit',
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/black-off-shoulder-bodysuit-front.webp`, view: 'front', alt: 'Black off shoulder bodysuit, front view' },
      ],
    },
    {
      slug: 'black-mesh-deep-v-bodysuit',
      title: 'Black Mesh Deep V Bodysuit',
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/black-mesh-deep-v-bodysuit-front.webp`, view: 'front', alt: 'Black mesh deep V bodysuit, front view' },
      ],
    },
  ],
};
