// src/data/product-gallery-d-drive-2.ts
// 2026-11-22 新增：D:\Charlizi网站图片 三个类目（背心内衣 / 文胸 / 文胸套装）新增款式入库
// 说明：已按「已上架/以上架」子文件夹做 SKU 去重，不重复上架。
//       图片统一 900x1125 (4:5) 居中裁切 webp，无白边。
//       本文件按分类「追加」到 galleryByCategory，不覆盖原有款式。
//
// 入库统计：camisoles 22 款 / bras 80 款 / bra-sets 45 款 = 147 款

import type { GalleryStyle } from './product-gallery';

const C = '/factory/images/products-cards';

export const dDrive2ByCategory: Record<string, GalleryStyle[]> = {
  'camisoles': [
    {
      slug: 'm003',
      title: "Grey Seamless Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m003-grey-1.webp`, view: 'front', alt: "Grey Seamless Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m003-grey-2.webp`, view: 'back', alt: "Grey Seamless Bra and Panty Set, back view" },
        { file: `${C}/camisoles/m003-black-1.webp`, view: 'view3', alt: "Black Seamless Bra and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m003-black-2.webp`, view: 'view4', alt: "Black Seamless Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm004',
      title: "Grey Seamless Scoop Neck Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m004-grey-1.webp`, view: 'front', alt: "Grey Seamless Scoop Neck Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m004-grey-2.webp`, view: 'back', alt: "Grey Seamless Scoop Neck Bra and Panty Set, back view" },
        { file: `${C}/camisoles/m004-black-1.webp`, view: 'view3', alt: "Black Seamless Scoop Neck Bra and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m004-black-2.webp`, view: 'view4', alt: "Black Seamless Scoop Neck Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm006',
      title: "Grey Seamless Bralette and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m006-grey-1.webp`, view: 'front', alt: "Grey Seamless Bralette and Panty Set, front view" },
        { file: `${C}/camisoles/m006-grey-2.webp`, view: 'back', alt: "Grey Seamless Bralette and Panty Set, back view" },
        { file: `${C}/camisoles/m006-black-1.webp`, view: 'view3', alt: "Black Seamless Bralette and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m006-black-2.webp`, view: 'view4', alt: "Black Seamless Bralette and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm008',
      title: "Grey Seamless Tank Top and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m008-grey-1.webp`, view: 'front', alt: "Grey Seamless Tank Top and Panty Set, front view" },
        { file: `${C}/camisoles/m008-grey-2.webp`, view: 'back', alt: "Grey Seamless Tank Top and Panty Set, back view" },
      ],
    },
    {
      slug: 'm012',
      title: "Grey Seamless Heathered Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m012-grey-1.webp`, view: 'front', alt: "Grey Seamless Heathered Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m012-grey-2.webp`, view: 'back', alt: "Grey Seamless Heathered Bra and Panty Set, back view" },
        { file: `${C}/camisoles/m012-black-1.webp`, view: 'view3', alt: "Black Seamless Heathered Bra and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m012-black-2.webp`, view: 'view4', alt: "Black Seamless Heathered Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm013',
      title: "Grey Seamless High Neck Tank Top and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m013-grey-1.webp`, view: 'front', alt: "Grey Seamless High Neck Tank Top and Panty Set, front view" },
        { file: `${C}/camisoles/m013-grey-2.webp`, view: 'back', alt: "Grey Seamless High Neck Tank Top and Panty Set, back view" },
        { file: `${C}/camisoles/m013-black-1.webp`, view: 'view3', alt: "Black Seamless High Neck Tank Top and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m013-black-2.webp`, view: 'view4', alt: "Black Seamless High Neck Tank Top and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm023',
      title: "Pink Seamless Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m023-pink-1.webp`, view: 'front', alt: "Pink Seamless Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m023-pink-2.webp`, view: 'back', alt: "Pink Seamless Bra and Panty Set, back view" },
        { file: `${C}/camisoles/m023-black-1.webp`, view: 'view3', alt: "Black Seamless Bra and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m023-black-2.webp`, view: 'view4', alt: "Black Seamless Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm029',
      title: "Pink Seamless Sports Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m029-pink-1.webp`, view: 'front', alt: "Pink Seamless Sports Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m029-pink-2.webp`, view: 'back', alt: "Pink Seamless Sports Bra and Panty Set, back view" },
        { file: `${C}/camisoles/m029-black-1.webp`, view: 'view3', alt: "Black Seamless Sports Bra and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m029-black-2.webp`, view: 'view4', alt: "Black Seamless Sports Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm034',
      title: "White Seamless Camisole and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m034-1.webp`, view: 'front', alt: "White Seamless Camisole and Panty Set, front view" },
        { file: `${C}/camisoles/m034-2.webp`, view: 'back', alt: "White Seamless Camisole and Panty Set, back view" },
      ],
    },
    {
      slug: 'm035',
      title: "Pink Mesh Crop Top",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m035-pink-1.webp`, view: 'front', alt: "Pink Mesh Crop Top, front view" },
        { file: `${C}/camisoles/m035-pink-2.webp`, view: 'back', alt: "Pink Mesh Crop Top, back view" },
      ],
    },
    {
      slug: 'm037',
      title: "Black Seamless Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m037-black-1.webp`, view: 'front', alt: "Black Seamless Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m037-black-2.webp`, view: 'back', alt: "Black Seamless Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'm041',
      title: "White Seamless Bralette and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m041-green-1.webp`, view: 'front', alt: "Green Seamless Bralette and Panty Set, front view" },
        { file: `${C}/camisoles/m041-green-2.webp`, view: 'back', alt: "Green Seamless Bralette and Panty Set, back view" },
        { file: `${C}/camisoles/m041-black-1.webp`, view: 'view3', alt: "Black Seamless Bralette and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m041-black-2.webp`, view: 'view4', alt: "Black Seamless Bralette and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm042',
      title: "Black Seamless Longline Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m042-1.webp`, view: 'front', alt: "Black Seamless Longline Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m042-2.webp`, view: 'back', alt: "Black Seamless Longline Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'm044',
      title: "White Seamless Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m044-green-1.webp`, view: 'front', alt: "Green Seamless Bra and Panty Set, front view" },
        { file: `${C}/camisoles/m044-green-2.webp`, view: 'back', alt: "Green Seamless Bra and Panty Set, back view" },
        { file: `${C}/camisoles/m044-black-1.webp`, view: 'view3', alt: "Black Seamless Bra and Panty Set, view 3 view" },
        { file: `${C}/camisoles/m044-black-2.webp`, view: 'view4', alt: "Black Seamless Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'm047',
      title: "Green Seamless Crop Top",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m047-green-1.webp`, view: 'front', alt: "Green Seamless Crop Top, front view" },
        { file: `${C}/camisoles/m047-green-2.webp`, view: 'back', alt: "Green Seamless Crop Top, back view" },
        { file: `${C}/camisoles/m047-black-1.webp`, view: 'view3', alt: "Black Seamless Crop Top, view 3 view" },
        { file: `${C}/camisoles/m047-black-2.webp`, view: 'view4', alt: "Black Seamless Crop Top, view 4 view" },
      ],
    },
    {
      slug: 'm048',
      title: "Green Seamless Tank Top",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m048-green-1.webp`, view: 'front', alt: "Green Seamless Tank Top, front view" },
        { file: `${C}/camisoles/m048-green-2.webp`, view: 'back', alt: "Green Seamless Tank Top, back view" },
      ],
    },
    {
      slug: 'm049',
      title: "Green Seamless Bra",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m049-green-1.webp`, view: 'front', alt: "Green Seamless Bra, front view" },
        { file: `${C}/camisoles/m049-green-2.webp`, view: 'back', alt: "Green Seamless Bra, back view" },
        { file: `${C}/camisoles/m049-black-1.webp`, view: 'view3', alt: "Black Seamless Bra, view 3 view" },
        { file: `${C}/camisoles/m049-black-2.webp`, view: 'view4', alt: "Black Seamless Bra, view 4 view" },
      ],
    },
    {
      slug: 'm051',
      title: "Black Seamless Crop Top",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m051-black-1.webp`, view: 'front', alt: "Black Seamless Crop Top, front view" },
        { file: `${C}/camisoles/m051-black-2.webp`, view: 'back', alt: "Black Seamless Crop Top, back view" },
      ],
    },
    {
      slug: 'm6031',
      title: "Grey Seamless Camisole and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m6031-1.webp`, view: 'front', alt: "Grey Seamless Camisole and Panty Set, front view" },
        { file: `${C}/camisoles/m6031-2.webp`, view: 'back', alt: "Grey Seamless Camisole and Panty Set, back view" },
      ],
    },
    {
      slug: 'm902',
      title: "Beige Lace Bralette",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m902-1.webp`, view: 'front', alt: "Beige Lace Bralette, front view" },
        { file: `${C}/camisoles/m902-2.webp`, view: 'back', alt: "Beige Lace Bralette, back view" },
      ],
    },
    {
      slug: 'z416',
      title: "Green Seamless Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/z416-1.webp`, view: 'front', alt: "Green Seamless Bra and Panty Set, front view" },
        { file: `${C}/camisoles/z416-2.webp`, view: 'back', alt: "Green Seamless Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'z418',
      title: "Black Seamless Ribbed Bra and Panty Set",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/z418-1.webp`, view: 'front', alt: "Black Seamless Ribbed Bra and Panty Set, front view" },
        { file: `${C}/camisoles/z418-2.webp`, view: 'back', alt: "Black Seamless Ribbed Bra and Panty Set, back view" },
      ],
    },
  ],
  'bras': [
    {
      slug: 'a1123',
      title: "Wine Red Lace Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/a1123-wine-red-1.webp`, view: 'front', alt: "Wine red Lace Bralette, front view" },
        { file: `${C}/bras/a1123-wine-red-2.webp`, view: 'back', alt: "Wine red Lace Bralette, back view" },
        { file: `${C}/bras/a1123-black-2.webp`, view: 'view3', alt: "Black Lace Bralette, view 3 view" },
        { file: `${C}/bras/a1123-black-1.webp`, view: 'view4', alt: "Black Lace Bralette, view 4 view" },
      ],
    },
    {
      slug: 'a2172',
      title: "Black Lace Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/a2172-1.webp`, view: 'front', alt: "Black Lace Balconette Bra, front view" },
        { file: `${C}/bras/a2172-2.webp`, view: 'back', alt: "Black Lace Balconette Bra, back view" },
        { file: `${C}/bras/a2172-wine-red-1.webp`, view: 'view3', alt: "Wine red Lace Balconette Bra, view 3 view" },
        { file: `${C}/bras/a2172-wine-red-2.webp`, view: 'view4', alt: "Wine red Lace Balconette Bra, view 4 view" },
      ],
    },
    {
      slug: 'a2748',
      title: "White Lace Longline Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/a2748-1.webp`, view: 'front', alt: "White Lace Longline Bra, front view" },
        { file: `${C}/bras/a2748-2.webp`, view: 'back', alt: "White Lace Longline Bra, back view" },
        { file: `${C}/bras/a2748-3.webp`, view: 'view3', alt: "White Lace Longline Bra, view 3 view" },
      ],
    },
    {
      slug: 'a3139',
      title: "Black Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/a3139-1.webp`, view: 'front', alt: "Black Lace Plunge Bra, front view" },
        { file: `${C}/bras/a3139-2.webp`, view: 'back', alt: "Black Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'a3166',
      title: "Black Lace Scalloped Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/a3166-black-1.webp`, view: 'front', alt: "Black Lace Scalloped Balconette Bra, front view" },
        { file: `${C}/bras/a3166-black-2.webp`, view: 'back', alt: "Black Lace Scalloped Balconette Bra, back view" },
      ],
    },
    {
      slug: 'b2014',
      title: "Blue Seamless Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2014-1.webp`, view: 'front', alt: "Blue Seamless Plunge Bra, front view" },
        { file: `${C}/bras/b2014-2.webp`, view: 'back', alt: "Blue Seamless Plunge Bra, back view" },
      ],
    },
    {
      slug: 'b2449',
      title: "Black Lace Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2449-1.webp`, view: 'front', alt: "Black Lace Bralette, front view" },
        { file: `${C}/bras/b2449-2.webp`, view: 'back', alt: "Black Lace Bralette, back view" },
      ],
    },
    {
      slug: 'b2763',
      title: "Black Smooth Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2763-1.webp`, view: 'front', alt: "Black Smooth Plunge Bra, front view" },
        { file: `${C}/bras/b2763-2.webp`, view: 'back', alt: "Black Smooth Plunge Bra, back view" },
      ],
    },
    {
      slug: 'b2825',
      title: "Blue Smooth Full Cup Bra and Panty Set",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2825-1.webp`, view: 'front', alt: "Blue Smooth Full Cup Bra and Panty Set, front view" },
        { file: `${C}/bras/b2825-2.webp`, view: 'back', alt: "Blue Smooth Full Cup Bra and Panty Set, back view" },
        { file: `${C}/bras/b2825-3.webp`, view: 'view3', alt: "Blue Smooth Full Cup Bra and Panty Set, view 3 view" },
      ],
    },
    {
      slug: 'b2949',
      title: "Black Lace Mesh Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2949-1.webp`, view: 'front', alt: "Black Lace Mesh Plunge Bra, front view" },
        { file: `${C}/bras/b2949-2.webp`, view: 'back', alt: "Black Lace Mesh Plunge Bra, back view" },
      ],
    },
    {
      slug: 'b6030',
      title: "Black Satin Longline Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6030-1.webp`, view: 'front', alt: "Black Satin Longline Bra, front view" },
        { file: `${C}/bras/b6030-2.webp`, view: 'back', alt: "Black Satin Longline Bra, back view" },
      ],
    },
    {
      slug: 'b6036',
      title: "Wine Red Smooth Longline Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6036-1.webp`, view: 'front', alt: "Wine Red Smooth Longline Bra, front view" },
        { file: `${C}/bras/b6036-2.webp`, view: 'back', alt: "Wine Red Smooth Longline Bra, back view" },
      ],
    },
    {
      slug: 'b6068',
      title: "Black Smooth Plunge Bra B6068",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6068-1.webp`, view: 'front', alt: "Black Smooth Plunge Bra B6068, front view" },
        { file: `${C}/bras/b6068-2.webp`, view: 'back', alt: "Black Smooth Plunge Bra B6068, back view" },
      ],
    },
    {
      slug: 'b6075',
      title: "Purple Seamless Demi Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6075-purple-1.webp`, view: 'front', alt: "Purple Seamless Demi Bra, front view" },
        { file: `${C}/bras/b6075-purple-2.webp`, view: 'back', alt: "Purple Seamless Demi Bra, back view" },
        { file: `${C}/bras/b6075-nude-1.webp`, view: 'view3', alt: "Nude Seamless Demi Bra, view 3 view" },
        { file: `${C}/bras/b6075-nude-2.webp`, view: 'view4', alt: "Nude Seamless Demi Bra, view 4 view" },
        { file: `${C}/bras/b6075-blue-1.webp`, view: 'view5', alt: "Blue Seamless Demi Bra, view 5 view" },
        { file: `${C}/bras/b6075-blue-2.webp`, view: 'view6', alt: "Blue Seamless Demi Bra, view 6 view" },
      ],
    },
    {
      slug: 'b6107',
      title: "Black Lace Longline Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6107-1.webp`, view: 'front', alt: "Black Lace Longline Bra, front view" },
        { file: `${C}/bras/b6107-2.webp`, view: 'back', alt: "Black Lace Longline Bra, back view" },
      ],
    },
    {
      slug: 'b6130',
      title: "Black Smooth Plunge Sports Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6130-1.webp`, view: 'front', alt: "Black Smooth Plunge Sports Bra, front view" },
        { file: `${C}/bras/b6130-2.webp`, view: 'back', alt: "Black Smooth Plunge Sports Bra, back view" },
      ],
    },
    {
      slug: 'b905',
      title: "White Lace Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/b905-white-1.webp`, view: 'front', alt: "White Lace Balconette Bra, front view" },
        { file: `${C}/bras/b905-white-2.webp`, view: 'back', alt: "White Lace Balconette Bra, back view" },
        { file: `${C}/bras/b905-nude-1.webp`, view: 'view3', alt: "Nude Lace Balconette Bra, view 3 view" },
        { file: `${C}/bras/b905-nude-2.webp`, view: 'view4', alt: "Nude Lace Balconette Bra, view 4 view" },
      ],
    },
    {
      slug: 'c3046',
      title: "Black Mesh Plunge Sports Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/c3046-1.webp`, view: 'front', alt: "Black Mesh Plunge Sports Bra, front view" },
        { file: `${C}/bras/c3046-2.webp`, view: 'back', alt: "Black Mesh Plunge Sports Bra, back view" },
      ],
    },
    {
      slug: 'j2028',
      title: "Wine Red Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/j2028-1.webp`, view: 'front', alt: "Wine Red Lace Plunge Bra, front view" },
        { file: `${C}/bras/j2028-2.webp`, view: 'back', alt: "Wine Red Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'j2496',
      title: "Blue Smooth Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/j2496-blue-1.webp`, view: 'front', alt: "Blue Smooth Plunge Bra, front view" },
        { file: `${C}/bras/j2496-blue-2.webp`, view: 'back', alt: "Blue Smooth Plunge Bra, back view" },
        { file: `${C}/bras/j2496-black-1.webp`, view: 'view3', alt: "Black Smooth Plunge Bra, view 3 view" },
        { file: `${C}/bras/j2496-black-2.webp`, view: 'view4', alt: "Black Smooth Plunge Bra, view 4 view" },
      ],
    },
    {
      slug: 'j3056',
      title: "Black and Red Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/j3056-1.webp`, view: 'front', alt: "Black and Red Lace Plunge Bra, front view" },
        { file: `${C}/bras/j3056-2.webp`, view: 'back', alt: "Black and Red Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'j3092',
      title: "Black Seamless Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/j3092-1.webp`, view: 'front', alt: "Black Seamless Plunge Bra, front view" },
        { file: `${C}/bras/j3092-2.webp`, view: 'back', alt: "Black Seamless Plunge Bra, back view" },
      ],
    },
    {
      slug: 'l2380',
      title: "Black Lace Longline Bra L2380",
      category: 'bras',
      images: [
        { file: `${C}/bras/l2380-1.webp`, view: 'front', alt: "Black Lace Longline Bra L2380, front view" },
        { file: `${C}/bras/l2380-2.webp`, view: 'back', alt: "Black Lace Longline Bra L2380, back view" },
      ],
    },
    {
      slug: 'l2538',
      title: "Red Smooth Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/l2538-1.webp`, view: 'front', alt: "Red Smooth Balconette Bra, front view" },
        { file: `${C}/bras/l2538-2.webp`, view: 'back', alt: "Red Smooth Balconette Bra, back view" },
      ],
    },
    {
      slug: 'l2957',
      title: "Wine Red Lace Plunge Bra L2957",
      category: 'bras',
      images: [
        { file: `${C}/bras/l2957-1.webp`, view: 'front', alt: "Wine Red Lace Plunge Bra L2957, front view" },
        { file: `${C}/bras/l2957-2.webp`, view: 'back', alt: "Wine Red Lace Plunge Bra L2957, back view" },
      ],
    },
    {
      slug: 'm2796',
      title: "Black Lace Full Cup Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/m2796-2.webp`, view: 'front', alt: "Black Lace Full Cup Bra, front view" },
      ],
    },
    {
      slug: 'mr2562',
      title: "White and Blue Lace Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2562-1.webp`, view: 'front', alt: "White and Blue Lace Balconette Bra, front view" },
        { file: `${C}/bras/mr2562-2.webp`, view: 'back', alt: "White and Blue Lace Balconette Bra, back view" },
      ],
    },
    {
      slug: 'mr2598',
      title: "Blue and White Mesh Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2598-1.webp`, view: 'front', alt: "Blue and White Mesh Bralette, front view" },
        { file: `${C}/bras/mr2598-2.webp`, view: 'back', alt: "Blue and White Mesh Bralette, back view" },
      ],
    },
    {
      slug: 'mr2635',
      title: "Pink Mesh Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2635-pink-1.webp`, view: 'front', alt: "Pink Mesh Plunge Bra, front view" },
        { file: `${C}/bras/mr2635-pink-2.webp`, view: 'back', alt: "Pink Mesh Plunge Bra, back view" },
        { file: `${C}/bras/mr2635-pink-3.webp`, view: 'view3', alt: "Pink Mesh Plunge Bra, view 3 view" },
      ],
    },
    {
      slug: 'mr2639',
      title: "Green Smooth Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2639-1.webp`, view: 'front', alt: "Green Smooth Balconette Bra, front view" },
        { file: `${C}/bras/mr2639-2.webp`, view: 'back', alt: "Green Smooth Balconette Bra, back view" },
      ],
    },
    {
      slug: 'mr2641',
      title: "White Lace Plunge Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2641-yellow-1.webp`, view: 'front', alt: "Yellow Lace Plunge Bralette, front view" },
        { file: `${C}/bras/mr2641-yellow-2.webp`, view: 'back', alt: "Yellow Lace Plunge Bralette, back view" },
      ],
    },
    {
      slug: 'mr2659',
      title: "Brown and Black Mesh Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2659-1.webp`, view: 'front', alt: "Brown and Black Mesh Balconette Bra, front view" },
        { file: `${C}/bras/mr2659-2.webp`, view: 'back', alt: "Brown and Black Mesh Balconette Bra, back view" },
      ],
    },
    {
      slug: 'mr2694',
      title: "Black Seamless Full Cup Sports Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2694-1.webp`, view: 'front', alt: "Black Seamless Full Cup Sports Bra, front view" },
        { file: `${C}/bras/mr2694-2.webp`, view: 'back', alt: "Black Seamless Full Cup Sports Bra, back view" },
      ],
    },
    {
      slug: 'mr2702',
      title: "Blue Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2702-1.webp`, view: 'front', alt: "Blue Lace Plunge Bra, front view" },
        { file: `${C}/bras/mr2702-2.webp`, view: 'back', alt: "Blue Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr2709',
      title: "Pink Lace Plunge Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2709-1.webp`, view: 'front', alt: "Pink Lace Plunge Bralette, front view" },
        { file: `${C}/bras/mr2709-2.webp`, view: 'back', alt: "Pink Lace Plunge Bralette, back view" },
      ],
    },
    {
      slug: 'mr2726',
      title: "Black Satin Triangle Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2726-1.webp`, view: 'front', alt: "Black Satin Triangle Bra, front view" },
        { file: `${C}/bras/mr2726-2.webp`, view: 'back', alt: "Black Satin Triangle Bra, back view" },
      ],
    },
    {
      slug: 'mr2752',
      title: "Grey and White Cotton Full Cup Sports Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2752-2.webp`, view: 'front', alt: "Grey and White Cotton Full Cup Sports Bra, front view" },
      ],
    },
    {
      slug: 'mr2754',
      title: "Grey and White Cotton V-Neck Full Cup Sports Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2754-1.webp`, view: 'front', alt: "Grey and White Cotton V-Neck Full Cup Sports Bra, front view" },
      ],
    },
    {
      slug: 'mr2767',
      title: "Pink and White Lace Plunge Bra and Panty Set",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2767-1.webp`, view: 'front', alt: "Pink and White Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bras/mr2767-2.webp`, view: 'back', alt: "Pink and White Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'mr2796',
      title: "Black Lace Push-Up Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2796-1.webp`, view: 'front', alt: "Black Lace Push-Up Plunge Bra, front view" },
        { file: `${C}/bras/mr2796-3.webp`, view: 'back', alt: "Black Lace Push-Up Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr2803',
      title: "Nude Seamless Longline Camisole",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2803-1.webp`, view: 'front', alt: "Nude Seamless Longline Camisole, front view" },
        { file: `${C}/bras/mr2803-2.webp`, view: 'back', alt: "Nude Seamless Longline Camisole, back view" },
      ],
    },
    {
      slug: 'mr2824',
      title: "Brown Smooth Plunge Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2824-1.webp`, view: 'front', alt: "Brown Smooth Plunge Bralette, front view" },
        { file: `${C}/bras/mr2824-2.webp`, view: 'back', alt: "Brown Smooth Plunge Bralette, back view" },
        { file: `${C}/bras/mr2824-bean-pink-1.webp`, view: 'view3', alt: "Bean pink Smooth Plunge Bralette, view 3 view" },
        { file: `${C}/bras/mr2824-bean-pink-2.webp`, view: 'view4', alt: "Bean pink Smooth Plunge Bralette, view 4 view" },
      ],
    },
    {
      slug: 'mr2840',
      title: "Black Smooth Demi Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2840-1.webp`, view: 'front', alt: "Black Smooth Demi Bra, front view" },
        { file: `${C}/bras/mr2840-2.webp`, view: 'back', alt: "Black Smooth Demi Bra, back view" },
      ],
    },
    {
      slug: 'mr2868',
      title: "Green Cotton Triangle Camisole",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2868-1.webp`, view: 'front', alt: "Green Cotton Triangle Camisole, front view" },
        { file: `${C}/bras/mr2868-2.webp`, view: 'back', alt: "Green Cotton Triangle Camisole, back view" },
      ],
    },
    {
      slug: 'mr2872',
      title: "Black Lace Sheer Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2872-1.webp`, view: 'front', alt: "Black Lace Sheer Bralette, front view" },
        { file: `${C}/bras/mr2872-2.webp`, view: 'back', alt: "Black Lace Sheer Bralette, back view" },
      ],
    },
    {
      slug: 'mr2956',
      title: "Pink Sheer Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2956-1.webp`, view: 'front', alt: "Pink Sheer Balconette Bra, front view" },
        { file: `${C}/bras/mr2956-2.webp`, view: 'back', alt: "Pink Sheer Balconette Bra, back view" },
        { file: `${C}/bras/mr2956-purple-1.webp`, view: 'view3', alt: "Purple Sheer Balconette Bra, view 3 view" },
        { file: `${C}/bras/mr2956-purple-2.webp`, view: 'view4', alt: "Purple Sheer Balconette Bra, view 4 view" },
        { file: `${C}/bras/mr2956-yellow-1.webp`, view: 'view5', alt: "Yellow Sheer Balconette Bra, view 5 view" },
        { file: `${C}/bras/mr2956-yellow-2.webp`, view: 'view6', alt: "Yellow Sheer Balconette Bra, view 6 view" },
      ],
    },
    {
      slug: 'mr2973',
      title: "Black Lace Strappy Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2973-1.webp`, view: 'front', alt: "Black Lace Strappy Balconette Bra, front view" },
        { file: `${C}/bras/mr2973-2.webp`, view: 'back', alt: "Black Lace Strappy Balconette Bra, back view" },
      ],
    },
    {
      slug: 'mr2974',
      title: "Red and Black Lace Plunge Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2974-1.webp`, view: 'front', alt: "Red and Black Lace Plunge Bralette, front view" },
        { file: `${C}/bras/mr2974-2.webp`, view: 'back', alt: "Red and Black Lace Plunge Bralette, back view" },
      ],
    },
    {
      slug: 'mr2975',
      title: "White Seamless Longline Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2975-1.webp`, view: 'front', alt: "White Seamless Longline Bra, front view" },
        { file: `${C}/bras/mr2975-2.webp`, view: 'back', alt: "White Seamless Longline Bra, back view" },
      ],
    },
    {
      slug: 'mr2982',
      title: "Red Lace Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2982-1.webp`, view: 'front', alt: "Red Lace Bralette, front view" },
        { file: `${C}/bras/mr2982-2.webp`, view: 'back', alt: "Red Lace Bralette, back view" },
      ],
    },
    {
      slug: 'mr2986',
      title: "Red Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr2986-1.webp`, view: 'front', alt: "Red Lace Plunge Bra, front view" },
        { file: `${C}/bras/mr2986-2.webp`, view: 'back', alt: "Red Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3009',
      title: "Black Lace Triangle Camisole",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3009-1.webp`, view: 'front', alt: "Black Lace Triangle Camisole, front view" },
        { file: `${C}/bras/mr3009-2.webp`, view: 'back', alt: "Black Lace Triangle Camisole, back view" },
      ],
    },
    {
      slug: 'mr3019',
      title: "Black Satin Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3019-1.webp`, view: 'front', alt: "Black Satin Plunge Bra, front view" },
        { file: `${C}/bras/mr3019-2.webp`, view: 'back', alt: "Black Satin Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3023',
      title: "Black Lace Scalloped Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3023-1.webp`, view: 'front', alt: "Black Lace Scalloped Bralette, front view" },
        { file: `${C}/bras/mr3023-2.webp`, view: 'back', alt: "Black Lace Scalloped Bralette, back view" },
      ],
    },
    {
      slug: 'mr3025',
      title: "Purple Lace Longline Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3025-1.webp`, view: 'front', alt: "Purple Lace Longline Bralette, front view" },
        { file: `${C}/bras/mr3025-2.webp`, view: 'back', alt: "Purple Lace Longline Bralette, back view" },
      ],
    },
    {
      slug: 'mr3051',
      title: "Black Smooth Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3051-1.webp`, view: 'front', alt: "Black Smooth Bralette, front view" },
        { file: `${C}/bras/mr3051-2.webp`, view: 'back', alt: "Black Smooth Bralette, back view" },
      ],
    },
    {
      slug: 'mr3074',
      title: "Blue Mesh Bralette and Panty Set",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3074-1.webp`, view: 'front', alt: "Blue Mesh Bralette and Panty Set, front view" },
        { file: `${C}/bras/mr3074-2.webp`, view: 'back', alt: "Blue Mesh Bralette and Panty Set, back view" },
      ],
    },
    {
      slug: 'mr3402',
      title: "White Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3402-1.webp`, view: 'front', alt: "White Lace Plunge Bra, front view" },
        { file: `${C}/bras/mr3402-2.webp`, view: 'back', alt: "White Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3403',
      title: "Black Smooth Halter Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3403-1.webp`, view: 'front', alt: "Black Smooth Halter Bralette, front view" },
        { file: `${C}/bras/mr3403-2.webp`, view: 'back', alt: "Black Smooth Halter Bralette, back view" },
        { file: `${C}/bras/mr3403-3.webp`, view: 'view3', alt: "Black Smooth Halter Bralette, view 3 view" },
      ],
    },
    {
      slug: 'mr3407',
      title: "Black Lace Strapless Longline Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3407-1.webp`, view: 'front', alt: "Black Lace Strapless Longline Bra, front view" },
        { file: `${C}/bras/mr3407-2.webp`, view: 'back', alt: "Black Lace Strapless Longline Bra, back view" },
      ],
    },
    {
      slug: 'mr3410',
      title: "Black and White Satin Balconette Camisole",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3410-1.webp`, view: 'front', alt: "Black and White Satin Balconette Camisole, front view" },
        { file: `${C}/bras/mr3410-2.webp`, view: 'back', alt: "Black and White Satin Balconette Camisole, back view" },
      ],
    },
    {
      slug: 'mr3417',
      title: "White Seamless Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3417-1.webp`, view: 'front', alt: "White Seamless Bralette, front view" },
        { file: `${C}/bras/mr3417-2.webp`, view: 'back', alt: "White Seamless Bralette, back view" },
        { file: `${C}/bras/mr3417-3.webp`, view: 'view3', alt: "White Seamless Bralette, view 3 view" },
      ],
    },
    {
      slug: 'mr3459',
      title: "Black Smooth Push-Up Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3459-1.webp`, view: 'front', alt: "Black Smooth Push-Up Plunge Bra, front view" },
        { file: `${C}/bras/mr3459-2.webp`, view: 'back', alt: "Black Smooth Push-Up Plunge Bra, back view" },
        { file: `${C}/bras/mr3459-3.webp`, view: 'view3', alt: "Black Smooth Push-Up Plunge Bra, view 3 view" },
      ],
    },
    {
      slug: 'mr3466',
      title: "Green Lace Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3466-1.webp`, view: 'front', alt: "Green Lace Plunge Bra, front view" },
        { file: `${C}/bras/mr3466-2.webp`, view: 'back', alt: "Green Lace Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3467',
      title: "Black Seamless Buckle Full Cup Sports Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3467-1.webp`, view: 'front', alt: "Black Seamless Buckle Full Cup Sports Bra, front view" },
        { file: `${C}/bras/mr3467-2.webp`, view: 'back', alt: "Black Seamless Buckle Full Cup Sports Bra, back view" },
        { file: `${C}/bras/mr3467-3.webp`, view: 'view3', alt: "Black Seamless Buckle Full Cup Sports Bra, view 3 view" },
      ],
    },
    {
      slug: 'mr3488',
      title: "Wine Red Smooth Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3488-1.webp`, view: 'front', alt: "Wine Red Smooth Plunge Bra, front view" },
        { file: `${C}/bras/mr3488-2.webp`, view: 'back', alt: "Wine Red Smooth Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3491',
      title: "Beige Lace Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3491-1.webp`, view: 'front', alt: "Beige Lace Balconette Bra, front view" },
        { file: `${C}/bras/mr3491-2.webp`, view: 'back', alt: "Beige Lace Balconette Bra, back view" },
        { file: `${C}/bras/mr3491-3.webp`, view: 'view3', alt: "Beige Lace Balconette Bra, view 3 view" },
      ],
    },
    {
      slug: 'mr3500',
      title: "Black Mesh Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3500-1.webp`, view: 'front', alt: "Black Mesh Plunge Bra, front view" },
        { file: `${C}/bras/mr3500-2.webp`, view: 'back', alt: "Black Mesh Plunge Bra, back view" },
        { file: `${C}/bras/mr3500-3.webp`, view: 'view3', alt: "Black Mesh Plunge Bra, view 3 view" },
      ],
    },
    {
      slug: 'mr3505',
      title: "Pink Lace Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3505-1.webp`, view: 'front', alt: "Pink Lace Balconette Bra, front view" },
        { file: `${C}/bras/mr3505-2.webp`, view: 'back', alt: "Pink Lace Balconette Bra, back view" },
      ],
    },
    {
      slug: 'mr3512',
      title: "Black and Beige Mesh Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3512-1.webp`, view: 'front', alt: "Black and Beige Mesh Plunge Bra, front view" },
        { file: `${C}/bras/mr3512-2.webp`, view: 'back', alt: "Black and Beige Mesh Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3529',
      title: "Nude Smooth Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3529-1.webp`, view: 'front', alt: "Nude Smooth Plunge Bra, front view" },
        { file: `${C}/bras/mr3529-2.webp`, view: 'back', alt: "Nude Smooth Plunge Bra, back view" },
        { file: `${C}/bras/mr3529-3.webp`, view: 'view3', alt: "Nude Smooth Plunge Bra, view 3 view" },
      ],
    },
    {
      slug: 'mr3535',
      title: "Pink Lace Full Cup Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3535-1.webp`, view: 'front', alt: "Pink Lace Full Cup Bralette, front view" },
        { file: `${C}/bras/mr3535-2.webp`, view: 'back', alt: "Pink Lace Full Cup Bralette, back view" },
      ],
    },
    {
      slug: 'mr3573',
      title: "Black Lace Jewel Trim Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3573-1.webp`, view: 'front', alt: "Black Lace Jewel Trim Plunge Bra, front view" },
        { file: `${C}/bras/mr3573-2.webp`, view: 'back', alt: "Black Lace Jewel Trim Plunge Bra, back view" },
      ],
    },
    {
      slug: 'mr3590',
      title: "Black and White Satin Bralette",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3590-1.webp`, view: 'front', alt: "Black and White Satin Bralette, front view" },
        { file: `${C}/bras/mr3590-2.webp`, view: 'back', alt: "Black and White Satin Bralette, back view" },
      ],
    },
    {
      slug: 'mr3612',
      title: "White Lace Plunge Bra and Panty Set",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3612-1.webp`, view: 'front', alt: "White Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bras/mr3612-2.webp`, view: 'back', alt: "White Lace Plunge Bra and Panty Set, back view" },
        { file: `${C}/bras/mr3612-3.webp`, view: 'view3', alt: "White Lace Plunge Bra and Panty Set, view 3 view" },
      ],
    },
    {
      slug: 'mr3727',
      title: "Black Smooth Front-Clasp Plunge Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/mr3727-1.webp`, view: 'front', alt: "Black Smooth Front-Clasp Plunge Bra, front view" },
        { file: `${C}/bras/mr3727-2.webp`, view: 'back', alt: "Black Smooth Front-Clasp Plunge Bra, back view" },
      ],
    },
    {
      slug: 'u05',
      title: "Beige Seamless Triangle Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/u05-nude-1.webp`, view: 'front', alt: "Nude Seamless Triangle Bra, front view" },
        { file: `${C}/bras/u05-nude-2.webp`, view: 'back', alt: "Nude Seamless Triangle Bra, back view" },
        { file: `${C}/bras/u05-black-1.webp`, view: 'view3', alt: "Black Seamless Triangle Bra, view 3 view" },
        { file: `${C}/bras/u05-black-2.webp`, view: 'view4', alt: "Black Seamless Triangle Bra, view 4 view" },
      ],
    },
    {
      slug: 'u055',
      title: "Black Lace Plunge Bra and Panty Set",
      category: 'bras',
      images: [
        { file: `${C}/bras/u055-1.webp`, view: 'front', alt: "Black Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bras/u055-2.webp`, view: 'back', alt: "Black Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'ys2450',
      title: "Black and Beige Lace Balconette Bra",
      category: 'bras',
      images: [
        { file: `${C}/bras/ys2450-1.webp`, view: 'front', alt: "Black and Beige Lace Balconette Bra, front view" },
        { file: `${C}/bras/ys2450-2.webp`, view: 'back', alt: "Black and Beige Lace Balconette Bra, back view" },
      ],
    },
    {
      slug: 'ys2902',
      title: "Black Lace Bralette YS2902",
      category: 'bras',
      images: [
        { file: `${C}/bras/ys2902-1.webp`, view: 'front', alt: "Black Lace Bralette YS2902, front view" },
        { file: `${C}/bras/ys2902-2.webp`, view: 'back', alt: "Black Lace Bralette YS2902, back view" },
      ],
    },
  ],
  'bra-sets': [
    {
      slug: 'a2135',
      title: "Pink Smooth Demi Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2135-pink-1.webp`, view: 'front', alt: "Pink Smooth Demi Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2135-pink-2.webp`, view: 'back', alt: "Pink Smooth Demi Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a2137',
      title: "White and Blue Smooth Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2137-1.webp`, view: 'front', alt: "White and Blue Smooth Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2137-2.webp`, view: 'back', alt: "White and Blue Smooth Balconette Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a2148',
      title: "Leopard Print Smooth Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2148-1.webp`, view: 'front', alt: "Leopard Print Smooth Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2148-2.webp`, view: 'back', alt: "Leopard Print Smooth Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a2161',
      title: "Red and Black Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2161-red-1.webp`, view: 'front', alt: "Red and Black Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2161-red-2.webp`, view: 'back', alt: "Red and Black Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a2168',
      title: "Black Lace Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2168-1.webp`, view: 'front', alt: "Black Lace Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2168-2.webp`, view: 'back', alt: "Black Lace Balconette Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a2173',
      title: "White Smooth Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2173-white-1.webp`, view: 'front', alt: "White Smooth Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2173-white-2.webp`, view: 'back', alt: "White Smooth Balconette Bra and Panty Set, back view" },
        { file: `${C}/bra-sets/a2173-blue-1.webp`, view: 'view3', alt: "Blue Smooth Balconette Bra and Panty Set, view 3 view" },
        { file: `${C}/bra-sets/a2173-blue-2.webp`, view: 'view4', alt: "Blue Smooth Balconette Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'a2174',
      title: "Black Lace Plunge Bra and Panty Set A2174",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2174-1.webp`, view: 'front', alt: "Black Lace Plunge Bra and Panty Set A2174, front view" },
        { file: `${C}/bra-sets/a2174-2.webp`, view: 'back', alt: "Black Lace Plunge Bra and Panty Set A2174, back view" },
      ],
    },
    {
      slug: 'a2205',
      title: "Black and Pink Lace Bralette and Shorts Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2205-1.webp`, view: 'front', alt: "Black and Pink Lace Bralette and Shorts Set, front view" },
        { file: `${C}/bra-sets/a2205-2.webp`, view: 'back', alt: "Black and Pink Lace Bralette and Shorts Set, back view" },
      ],
    },
    {
      slug: 'a2577',
      title: "Beige and White Smooth Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2577-1.webp`, view: 'front', alt: "Beige and White Smooth Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a2577-2.webp`, view: 'back', alt: "Beige and White Smooth Balconette Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3103',
      title: "Leopard Print and Black Lace Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3103-1.webp`, view: 'front', alt: "Leopard Print and Black Lace Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3103-2.webp`, view: 'back', alt: "Leopard Print and Black Lace Balconette Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3113',
      title: "Black and Red Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3113-1.webp`, view: 'front', alt: "Black and Red Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3113-2.webp`, view: 'back', alt: "Black and Red Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3116',
      title: "Black and Yellow Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3116-1.webp`, view: 'front', alt: "Black and Yellow Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3116-2.webp`, view: 'back', alt: "Black and Yellow Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3120',
      title: "Leopard Print Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3120-1.webp`, view: 'front', alt: "Leopard Print Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3120-2.webp`, view: 'back', alt: "Leopard Print Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3127',
      title: "Red Lace Demi Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3127-1.webp`, view: 'front', alt: "Red Lace Demi Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3127-2.webp`, view: 'back', alt: "Red Lace Demi Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3131',
      title: "Red and Pink Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3131-1.webp`, view: 'front', alt: "Red and Pink Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3131-2.webp`, view: 'back', alt: "Red and Pink Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3139',
      title: "Brown and Black Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3139-1.webp`, view: 'front', alt: "Brown and Black Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3139-2.webp`, view: 'back', alt: "Brown and Black Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3140',
      title: "Black and Yellow Lace Garter Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3140-1.webp`, view: 'front', alt: "Black and Yellow Lace Garter Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3140-2.webp`, view: 'back', alt: "Black and Yellow Lace Garter Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3151',
      title: "Leopard Print Smooth Molded Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3151-1.webp`, view: 'front', alt: "Leopard Print Smooth Molded Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3151-2.webp`, view: 'back', alt: "Leopard Print Smooth Molded Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3155',
      title: "White Smooth Demi Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3155-white-1.webp`, view: 'front', alt: "White Smooth Demi Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/a3155-white-2.webp`, view: 'back', alt: "White Smooth Demi Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'a3211',
      title: "Red and Black Lace Plunge Bra and Panty Set A3211",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3211-1.webp`, view: 'front', alt: "Red and Black Lace Plunge Bra and Panty Set A3211, front view" },
        { file: `${C}/bra-sets/a3211-2.webp`, view: 'back', alt: "Red and Black Lace Plunge Bra and Panty Set A3211, back view" },
      ],
    },
    {
      slug: 'b2360',
      title: "Black Lace Full Cup Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/b2360-1.webp`, view: 'front', alt: "Black Lace Full Cup Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/b2360-2.webp`, view: 'back', alt: "Black Lace Full Cup Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'b2631',
      title: "Beige and Pink Lace Demi Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/b2631-1.webp`, view: 'front', alt: "Beige and Pink Lace Demi Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/b2631-2.webp`, view: 'back', alt: "Beige and Pink Lace Demi Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'j1106',
      title: "Black Lace Plunge Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/j1106-1.webp`, view: 'front', alt: "Black Lace Plunge Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/j1106-2.webp`, view: 'back', alt: "Black Lace Plunge Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'j2022',
      title: "Wine Red Lace Bralette and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/j2022-1.webp`, view: 'front', alt: "Wine Red Lace Bralette and Panty Set, front view" },
        { file: `${C}/bra-sets/j2022-2.webp`, view: 'back', alt: "Wine Red Lace Bralette and Panty Set, back view" },
      ],
    },
    {
      slug: 'j3061',
      title: "Pink and Black Lace Plunge Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/j3061-1.webp`, view: 'front', alt: "Pink and Black Lace Plunge Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/j3061-2.webp`, view: 'back', alt: "Pink and Black Lace Plunge Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'l093',
      title: "Black Lace Criss-Cross Plunge Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/l093-1.webp`, view: 'front', alt: "Black Lace Criss-Cross Plunge Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/l093-2.webp`, view: 'back', alt: "Black Lace Criss-Cross Plunge Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'mr2669',
      title: "Black Mesh Longline Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr2669-1.webp`, view: 'front', alt: "Black Mesh Longline Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/mr2669-2.webp`, view: 'back', alt: "Black Mesh Longline Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'mr2938',
      title: "Olive Smooth Demi Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr2938-yellow-1.webp`, view: 'front', alt: "Yellow Smooth Demi Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/mr2938-yellow-2.webp`, view: 'back', alt: "Yellow Smooth Demi Bra and Panty Set, back view" },
        { file: `${C}/bra-sets/mr2938-nude-1.webp`, view: 'view3', alt: "Nude Smooth Demi Bra and Panty Set, view 3 view" },
        { file: `${C}/bra-sets/mr2938-nude-2.webp`, view: 'view4', alt: "Nude Smooth Demi Bra and Panty Set, view 4 view" },
      ],
    },
    {
      slug: 'mr2990',
      title: "Blue Lace Plunge Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr2990-1.webp`, view: 'front', alt: "Blue Lace Plunge Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/mr2990-2.webp`, view: 'back', alt: "Blue Lace Plunge Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'mr3026',
      title: "Black Lace Full Cup Bra and Panty Set MR3026",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3026-1.webp`, view: 'front', alt: "Black Lace Full Cup Bra and Panty Set MR3026, front view" },
        { file: `${C}/bra-sets/mr3026-2.webp`, view: 'back', alt: "Black Lace Full Cup Bra and Panty Set MR3026, back view" },
      ],
    },
    {
      slug: 'mr3057',
      title: "Wine Red Lace Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3057-1.webp`, view: 'front', alt: "Wine Red Lace Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/mr3057-2.webp`, view: 'back', alt: "Wine Red Lace Plunge Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'mr3082',
      title: "Black and Red Lace Bralette and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3082-1.webp`, view: 'front', alt: "Black and Red Lace Bralette and Panty Set, front view" },
        { file: `${C}/bra-sets/mr3082-2.webp`, view: 'back', alt: "Black and Red Lace Bralette and Panty Set, back view" },
      ],
    },
    {
      slug: 'mr3414',
      title: "White Lace Bralette and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3414-1.webp`, view: 'front', alt: "White Lace Bralette and Panty Set, front view" },
        { file: `${C}/bra-sets/mr3414-2.webp`, view: 'back', alt: "White Lace Bralette and Panty Set, back view" },
      ],
    },
    {
      slug: 'mr3449',
      title: "White and Pink Mesh Balconette Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3449-1.webp`, view: 'front', alt: "White and Pink Mesh Balconette Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/mr3449-2.webp`, view: 'back', alt: "White and Pink Mesh Balconette Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'mr3520',
      title: "Wine Red Lace Strappy Bralette and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3520-1.webp`, view: 'front', alt: "Wine Red Lace Strappy Bralette and Panty Set, front view" },
        { file: `${C}/bra-sets/mr3520-2.webp`, view: 'back', alt: "Wine Red Lace Strappy Bralette and Panty Set, back view" },
      ],
    },
    {
      slug: 'mr3524',
      title: "Black Lace Balconette Bra and Thong Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3524-1.webp`, view: 'front', alt: "Black Lace Balconette Bra and Thong Set, front view" },
        { file: `${C}/bra-sets/mr3524-2.webp`, view: 'back', alt: "Black Lace Balconette Bra and Thong Set, back view" },
      ],
    },
    {
      slug: 'mr3597',
      title: "Nude Seamless Full Cup Bra and Shorts Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3597-1.webp`, view: 'front', alt: "Nude Seamless Full Cup Bra and Shorts Set, front view" },
        { file: `${C}/bra-sets/mr3597-2.webp`, view: 'back', alt: "Nude Seamless Full Cup Bra and Shorts Set, back view" },
      ],
    },
    {
      slug: 'mr3865',
      title: "White Mesh Bralette and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/mr3865-2.webp`, view: 'front', alt: "White Mesh Bralette and Panty Set, front view" },
      ],
    },
    {
      slug: 'ys2450',
      title: "Black and Nude Lace Longline Bralette and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys2450-1.webp`, view: 'front', alt: "Black and Nude Lace Longline Bralette and Panty Set, front view" },
      ],
    },
    {
      slug: 'ys2451',
      title: "Black and Nude Lace Longline Bralette and Panty Set YS2451",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys2451-2.webp`, view: 'front', alt: "Black and Nude Lace Longline Bralette and Panty Set YS2451, front view" },
      ],
    },
    {
      slug: 'ys2900',
      title: "Black Lace Demi Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys2900-1.webp`, view: 'front', alt: "Black Lace Demi Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/ys2900-2.webp`, view: 'back', alt: "Black Lace Demi Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'ys2965',
      title: "White Lace Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys2965-1.webp`, view: 'front', alt: "White Lace Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/ys2965-2.webp`, view: 'back', alt: "White Lace Balconette Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'ys2991',
      title: "Black and Blue Mesh Balconette Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys2991-1.webp`, view: 'front', alt: "Black and Blue Mesh Balconette Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/ys2991-2.webp`, view: 'back', alt: "Black and Blue Mesh Balconette Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'ys3034',
      title: "Black Mesh Full Cup Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys3034-1.webp`, view: 'front', alt: "Black Mesh Full Cup Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/ys3034-2.webp`, view: 'back', alt: "Black Mesh Full Cup Bra and Panty Set, back view" },
      ],
    },
    {
      slug: 'ys3047',
      title: "Red Mesh Plunge Bra and Panty Set",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/ys3047-1.webp`, view: 'front', alt: "Red Mesh Plunge Bra and Panty Set, front view" },
        { file: `${C}/bra-sets/ys3047-2.webp`, view: 'back', alt: "Red Mesh Plunge Bra and Panty Set, back view" },
      ],
    },
  ],
};
