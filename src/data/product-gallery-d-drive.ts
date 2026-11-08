// src/data/product-gallery-d-drive.ts
// 2026-11-08 新增：D:\网站图片 155 张产品图整理入库
// 说明：原图按款号分组，front/back/multi-view；白底 4:5 卡片 (900x1125)，不裁切
//       本文件按分类「追加」到 galleryByCategory，不覆盖原有款式。

import type { GalleryStyle } from './product-gallery';

const C = '/factory/images/products-cards';

export const dDriveByCategory: Record<string, GalleryStyle[]> = {
  'bras': [
    {
      slug: '1340',
      title: "Bra 1340",
      category: 'bras',
      images: [
        { file: `${C}/bras/1340-front.webp`, view: 'front', alt: "Bra 1340, front view" },
      ],
    },
    {
      slug: '1500-7',
      title: "Bra 1500-7",
      category: 'bras',
      images: [
        { file: `${C}/bras/1500-7-front.webp`, view: 'front', alt: "Bra 1500-7, front view" },
      ],
    },
    {
      slug: 'a5032',
      title: "Bra A5032",
      category: 'bras',
      images: [
        { file: `${C}/bras/a5032-front.webp`, view: 'front', alt: "Bra A5032, front view" },
        { file: `${C}/bras/a5032-back.webp`, view: 'back', alt: "Bra A5032, back view" },
      ],
    },
    {
      slug: 'a5034',
      title: "Bra A5034",
      category: 'bras',
      images: [
        { file: `${C}/bras/a5034-front.webp`, view: 'front', alt: "Bra A5034, front view" },
        { file: `${C}/bras/a5034-back.webp`, view: 'back', alt: "Bra A5034, back view" },
      ],
    },
    {
      slug: 'b1133',
      title: "Bra B1133",
      category: 'bras',
      images: [
        { file: `${C}/bras/b1133-front.webp`, view: 'front', alt: "Bra B1133, front view" },
        { file: `${C}/bras/b1133-back.webp`, view: 'back', alt: "Bra B1133, back view" },
      ],
    },
    {
      slug: 'b2019',
      title: "Bra B2019",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2019-front.webp`, view: 'front', alt: "Bra B2019, front view" },
        { file: `${C}/bras/b2019-back.webp`, view: 'back', alt: "Bra B2019, back view" },
        { file: `${C}/bras/b2019-view3.webp`, view: 'view3', alt: "Bra B2019, view3 view" },
      ],
    },
    {
      slug: 'b2048',
      title: "Bra B2048",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2048-front.webp`, view: 'front', alt: "Bra B2048, front view" },
        { file: `${C}/bras/b2048-back.webp`, view: 'back', alt: "Bra B2048, back view" },
      ],
    },
    {
      slug: 'b2049',
      title: "Bra B2049",
      category: 'bras',
      images: [
        { file: `${C}/bras/b2049-front.webp`, view: 'front', alt: "Bra B2049, front view" },
        { file: `${C}/bras/b2049-back.webp`, view: 'back', alt: "Bra B2049, back view" },
      ],
    },
    {
      slug: 'b269',
      title: "Bra B269",
      category: 'bras',
      images: [
        { file: `${C}/bras/b269-front.webp`, view: 'front', alt: "Bra B269, front view" },
        { file: `${C}/bras/b269-back.webp`, view: 'back', alt: "Bra B269, back view" },
      ],
    },
    {
      slug: 'b6043',
      title: "Bra B6043",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6043-front.webp`, view: 'front', alt: "Bra B6043, front view" },
        { file: `${C}/bras/b6043-back.webp`, view: 'back', alt: "Bra B6043, back view" },
        { file: `${C}/bras/b6043-view3.webp`, view: 'view3', alt: "Bra B6043, view3 view" },
        { file: `${C}/bras/b6043-view4.webp`, view: 'view4', alt: "Bra B6043, view4 view" },
      ],
    },
    {
      slug: 'b6103',
      title: "Bra B6103",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6103-front.webp`, view: 'front', alt: "Bra B6103, front view" },
        { file: `${C}/bras/b6103-back.webp`, view: 'back', alt: "Bra B6103, back view" },
        { file: `${C}/bras/b6103-view3.webp`, view: 'view3', alt: "Bra B6103, view3 view" },
      ],
    },
    {
      slug: 'b6111',
      title: "Bra B6111",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6111-front.webp`, view: 'front', alt: "Bra B6111, front view" },
        { file: `${C}/bras/b6111-back.webp`, view: 'back', alt: "Bra B6111, back view" },
      ],
    },
    {
      slug: 'b6113',
      title: "Bra B6113",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6113-front.webp`, view: 'front', alt: "Bra B6113, front view" },
        { file: `${C}/bras/b6113-back.webp`, view: 'back', alt: "Bra B6113, back view" },
      ],
    },
    {
      slug: 'b6134',
      title: "Bra B6134",
      category: 'bras',
      images: [
        { file: `${C}/bras/b6134-front.webp`, view: 'front', alt: "Bra B6134, front view" },
        { file: `${C}/bras/b6134-back.webp`, view: 'back', alt: "Bra B6134, back view" },
      ],
    },
    {
      slug: 'c8820',
      title: "Bra C8820",
      category: 'bras',
      images: [
        { file: `${C}/bras/c8820-front.webp`, view: 'front', alt: "Bra C8820, front view" },
        { file: `${C}/bras/c8820-back.webp`, view: 'back', alt: "Bra C8820, back view" },
      ],
    },
    {
      slug: 'r044',
      title: "Bra R044",
      category: 'bras',
      images: [
        { file: `${C}/bras/r044-front.webp`, view: 'front', alt: "Bra R044, front view" },
        { file: `${C}/bras/r044-back.webp`, view: 'back', alt: "Bra R044, back view" },
      ],
    },
    {
      slug: 'u03',
      title: "Bra U03",
      category: 'bras',
      images: [
        { file: `${C}/bras/u03-front.webp`, view: 'front', alt: "Bra U03, front view" },
        { file: `${C}/bras/u03-back.webp`, view: 'back', alt: "Bra U03, back view" },
        { file: `${C}/bras/u03-view3.webp`, view: 'view3', alt: "Bra U03, view3 view" },
      ],
    },
    {
      slug: 'u056',
      title: "Bra U056",
      category: 'bras',
      images: [
        { file: `${C}/bras/u056-front.webp`, view: 'front', alt: "Bra U056, front view" },
        { file: `${C}/bras/u056-back.webp`, view: 'back', alt: "Bra U056, back view" },
      ],
    },
    {
      slug: 'u06',
      title: "Bra U06",
      category: 'bras',
      images: [
        { file: `${C}/bras/u06-front.webp`, view: 'front', alt: "Bra U06, front view" },
        { file: `${C}/bras/u06-back.webp`, view: 'back', alt: "Bra U06, back view" },
      ],
    },
    {
      slug: 'u204',
      title: "Bra U204",
      category: 'bras',
      images: [
        { file: `${C}/bras/u204-front.webp`, view: 'front', alt: "Bra U204, front view" },
        { file: `${C}/bras/u204-back.webp`, view: 'back', alt: "Bra U204, back view" },
      ],
    },
    {
      slug: 'u210',
      title: "Bra U210",
      category: 'bras',
      images: [
        { file: `${C}/bras/u210-front.webp`, view: 'front', alt: "Bra U210, front view" },
        { file: `${C}/bras/u210-back.webp`, view: 'back', alt: "Bra U210, back view" },
      ],
    },
    {
      slug: 'ys03',
      title: "Bra YS03",
      category: 'bras',
      images: [
        { file: `${C}/bras/ys03-front.webp`, view: 'front', alt: "Bra YS03, front view" },
        { file: `${C}/bras/ys03-back.webp`, view: 'back', alt: "Bra YS03, back view" },
      ],
    },
    {
      slug: 'ys04',
      title: "Bra YS04",
      category: 'bras',
      images: [
        { file: `${C}/bras/ys04-front.webp`, view: 'front', alt: "Bra YS04, front view" },
        { file: `${C}/bras/ys04-back.webp`, view: 'back', alt: "Bra YS04, back view" },
      ],
    },
  ],
  'bra-sets': [
    {
      slug: '10751',
      title: "Bra Set 10751",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/10751-front.webp`, view: 'front', alt: "Bra Set 10751, front view" },
      ],
    },
    {
      slug: 'a1112',
      title: "Bra Set A1112",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a1112-front.webp`, view: 'front', alt: "Bra Set A1112, front view" },
        { file: `${C}/bra-sets/a1112-back.webp`, view: 'back', alt: "Bra Set A1112, back view" },
        { file: `${C}/bra-sets/a1112-view3.webp`, view: 'view3', alt: "Bra Set A1112, view3 view" },
      ],
    },
    {
      slug: 'a1119',
      title: "Bra Set A1119",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a1119-front.webp`, view: 'front', alt: "Bra Set A1119, front view" },
        { file: `${C}/bra-sets/a1119-back.webp`, view: 'back', alt: "Bra Set A1119, back view" },
        { file: `${C}/bra-sets/a1119-view3.webp`, view: 'view3', alt: "Bra Set A1119, view3 view" },
      ],
    },
    {
      slug: 'a1130',
      title: "Bra Set A1130",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a1130-front.webp`, view: 'front', alt: "Bra Set A1130, front view" },
        { file: `${C}/bra-sets/a1130-back.webp`, view: 'back', alt: "Bra Set A1130, back view" },
        { file: `${C}/bra-sets/a1130-view3.webp`, view: 'view3', alt: "Bra Set A1130, view3 view" },
      ],
    },
    {
      slug: 'a1558',
      title: "Bra Set A1558",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a1558-front.webp`, view: 'front', alt: "Bra Set A1558, front view" },
        { file: `${C}/bra-sets/a1558-back.webp`, view: 'back', alt: "Bra Set A1558, back view" },
        { file: `${C}/bra-sets/a1558-view3.webp`, view: 'view3', alt: "Bra Set A1558, view3 view" },
      ],
    },
    {
      slug: 'a2099',
      title: "Bra Set A2099",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2099-front.webp`, view: 'front', alt: "Bra Set A2099, front view" },
        { file: `${C}/bra-sets/a2099-back.webp`, view: 'back', alt: "Bra Set A2099, back view" },
        { file: `${C}/bra-sets/a2099-view3.webp`, view: 'view3', alt: "Bra Set A2099, view3 view" },
        { file: `${C}/bra-sets/a2099-view4.webp`, view: 'view4', alt: "Bra Set A2099, view4 view" },
        { file: `${C}/bra-sets/a2099-view5.webp`, view: 'view5', alt: "Bra Set A2099, view5 view" },
        { file: `${C}/bra-sets/a2099-view6.webp`, view: 'view6', alt: "Bra Set A2099, view6 view" },
      ],
    },
    {
      slug: 'a2124',
      title: "Bra Set A2124",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2124-front.webp`, view: 'front', alt: "Bra Set A2124, front view" },
        { file: `${C}/bra-sets/a2124-back.webp`, view: 'back', alt: "Bra Set A2124, back view" },
      ],
    },
    {
      slug: 'a2138',
      title: "Bra Set A2138",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a2138-front.webp`, view: 'front', alt: "Bra Set A2138, front view" },
        { file: `${C}/bra-sets/a2138-back.webp`, view: 'back', alt: "Bra Set A2138, back view" },
      ],
    },
    {
      slug: 'a3136',
      title: "Bra Set A3136",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a3136-front.webp`, view: 'front', alt: "Bra Set A3136, front view" },
        { file: `${C}/bra-sets/a3136-back.webp`, view: 'back', alt: "Bra Set A3136, back view" },
      ],
    },
    {
      slug: 'a4001',
      title: "Bra Set A4001",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/a4001-front.webp`, view: 'front', alt: "Bra Set A4001, front view" },
        { file: `${C}/bra-sets/a4001-back.webp`, view: 'back', alt: "Bra Set A4001, back view" },
      ],
    },
    {
      slug: 'b2046',
      title: "Bra Set B2046",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/b2046-front.webp`, view: 'front', alt: "Bra Set B2046, front view" },
        { file: `${C}/bra-sets/b2046-back.webp`, view: 'back', alt: "Bra Set B2046, back view" },
      ],
    },
    {
      slug: 'b2050',
      title: "Bra Set B2050",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/b2050-front.webp`, view: 'front', alt: "Bra Set B2050, front view" },
        { file: `${C}/bra-sets/b2050-back.webp`, view: 'back', alt: "Bra Set B2050, back view" },
      ],
    },
    {
      slug: 'b6112',
      title: "Bra Set B6112",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/b6112-front.webp`, view: 'front', alt: "Bra Set B6112, front view" },
        { file: `${C}/bra-sets/b6112-back.webp`, view: 'back', alt: "Bra Set B6112, back view" },
      ],
    },
    {
      slug: 'c2703',
      title: "Bra Set C2703",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/c2703-front.webp`, view: 'front', alt: "Bra Set C2703, front view" },
        { file: `${C}/bra-sets/c2703-back.webp`, view: 'back', alt: "Bra Set C2703, back view" },
      ],
    },
    {
      slug: 'u092',
      title: "Bra Set U092",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/u092-front.webp`, view: 'front', alt: "Bra Set U092, front view" },
        { file: `${C}/bra-sets/u092-back.webp`, view: 'back', alt: "Bra Set U092, back view" },
      ],
    },
    {
      slug: 'u098',
      title: "Bra Set U098",
      category: 'bra-sets',
      images: [
        { file: `${C}/bra-sets/u098-front.webp`, view: 'front', alt: "Bra Set U098, front view" },
        { file: `${C}/bra-sets/u098-back.webp`, view: 'back', alt: "Bra Set U098, back view" },
      ],
    },
  ],
  'silicone-bras': [
    {
      slug: '10761',
      title: "Silicone Bra 10761\u91d1\u8272",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/10761-front.webp`, view: 'front', alt: "Silicone Bra 10761\u91d1\u8272, front view" },
      ],
    },
    {
      slug: '71hhdj7wwbl-ac-sx679',
      title: "Silicone Bra 71HHDJ7WWBL._AC_SX679_",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/71hhdj7wwbl-ac-sx679-front.webp`, view: 'front', alt: "Silicone Bra 71HHDJ7WWBL._AC_SX679_, front view" },
      ],
    },
    {
      slug: 'j1074',
      title: "Silicone Bra J1074",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j1074-front.webp`, view: 'front', alt: "Silicone Bra J1074, front view" },
      ],
    },
    {
      slug: 'j10741',
      title: "Silicone Bra J10741",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10741-front.webp`, view: 'front', alt: "Silicone Bra J10741, front view" },
        { file: `${C}/silicone-bras/j10741-back.webp`, view: 'back', alt: "Silicone Bra J10741, back view" },
      ],
    },
    {
      slug: 'j10744',
      title: "Silicone Bra J10744",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10744-front.webp`, view: 'front', alt: "Silicone Bra J10744, front view" },
      ],
    },
    {
      slug: 'j10749',
      title: "Silicone Bra J10749",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10749-front.webp`, view: 'front', alt: "Silicone Bra J10749, front view" },
        { file: `${C}/silicone-bras/j10749-back.webp`, view: 'back', alt: "Silicone Bra J10749, back view" },
      ],
    },
    {
      slug: 'j10751',
      title: "Silicone Bra J10751",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10751-front.webp`, view: 'front', alt: "Silicone Bra J10751, front view" },
        { file: `${C}/silicone-bras/j10751-back.webp`, view: 'back', alt: "Silicone Bra J10751, back view" },
      ],
    },
    {
      slug: 'j10765',
      title: "Silicone Bra J10765",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10765-front.webp`, view: 'front', alt: "Silicone Bra J10765, front view" },
        { file: `${C}/silicone-bras/j10765-back.webp`, view: 'back', alt: "Silicone Bra J10765, back view" },
      ],
    },
    {
      slug: 'j10773',
      title: "Silicone Bra J10773",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10773-front.webp`, view: 'front', alt: "Silicone Bra J10773, front view" },
        { file: `${C}/silicone-bras/j10773-back.webp`, view: 'back', alt: "Silicone Bra J10773, back view" },
      ],
    },
    {
      slug: 'j10782',
      title: "Silicone Bra J10782",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10782-front.webp`, view: 'front', alt: "Silicone Bra J10782, front view" },
        { file: `${C}/silicone-bras/j10782-back.webp`, view: 'back', alt: "Silicone Bra J10782, back view" },
      ],
    },
    {
      slug: 'j10794',
      title: "Silicone Bra J10794",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/j10794-front.webp`, view: 'front', alt: "Silicone Bra J10794, front view" },
        { file: `${C}/silicone-bras/j10794-back.webp`, view: 'back', alt: "Silicone Bra J10794, back view" },
      ],
    },
    {
      slug: 'ja1066',
      title: "Silicone Bra JA1066",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/ja1066-front.webp`, view: 'front', alt: "Silicone Bra JA1066, front view" },
        { file: `${C}/silicone-bras/ja1066-back.webp`, view: 'back', alt: "Silicone Bra JA1066, back view" },
      ],
    },
    {
      slug: 'ja23372',
      title: "Silicone Bra JA23372",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/ja23372-front.webp`, view: 'front', alt: "Silicone Bra JA23372, front view" },
        { file: `${C}/silicone-bras/ja23372-back.webp`, view: 'back', alt: "Silicone Bra JA23372, back view" },
        { file: `${C}/silicone-bras/ja23372-view3.webp`, view: 'view3', alt: "Silicone Bra JA23372, view3 view" },
      ],
    },
    {
      slug: 'ja2662',
      title: "Silicone Bra JA2662",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/ja2662-front.webp`, view: 'front', alt: "Silicone Bra JA2662, front view" },
        { file: `${C}/silicone-bras/ja2662-back.webp`, view: 'back', alt: "Silicone Bra JA2662, back view" },
      ],
    },
    {
      slug: 'jc2431',
      title: "Silicone Bra JC2431",
      category: 'silicone-bras',
      images: [
        { file: `${C}/silicone-bras/jc2431-front.webp`, view: 'front', alt: "Silicone Bra JC2431, front view" },
        { file: `${C}/silicone-bras/jc2431-back.webp`, view: 'back', alt: "Silicone Bra JC2431, back view" },
      ],
    },
  ],
  'panties': [
    {
      slug: 'c209',
      title: "Panty C209",
      category: 'panties',
      images: [
        { file: `${C}/panties/c209-front.webp`, view: 'front', alt: "Panty C209, front view" },
        { file: `${C}/panties/c209-back.webp`, view: 'back', alt: "Panty C209, back view" },
        { file: `${C}/panties/c209-view3.webp`, view: 'view3', alt: "Panty C209, view3 view" },
      ],
    },
    {
      slug: 'c312',
      title: "Panty C312",
      category: 'panties',
      images: [
        { file: `${C}/panties/c312-front.webp`, view: 'front', alt: "Panty C312, front view" },
        { file: `${C}/panties/c312-back.webp`, view: 'back', alt: "Panty C312, back view" },
      ],
    },
    {
      slug: 'c3307',
      title: "Panty C3307",
      category: 'panties',
      images: [
        { file: `${C}/panties/c3307-front.webp`, view: 'front', alt: "Panty C3307, front view" },
        { file: `${C}/panties/c3307-back.webp`, view: 'back', alt: "Panty C3307, back view" },
        { file: `${C}/panties/c3307-view3.webp`, view: 'view3', alt: "Panty C3307, view3 view" },
        { file: `${C}/panties/c3307-view4.webp`, view: 'view4', alt: "Panty C3307, view4 view" },
      ],
    },
    {
      slug: 'c390',
      title: "Panty C390",
      category: 'panties',
      images: [
        { file: `${C}/panties/c390-front.webp`, view: 'front', alt: "Panty C390, front view" },
        { file: `${C}/panties/c390-back.webp`, view: 'back', alt: "Panty C390, back view" },
      ],
    },
    {
      slug: 'c8591',
      title: "Panty C8591",
      category: 'panties',
      images: [
        { file: `${C}/panties/c8591-front.webp`, view: 'front', alt: "Panty C8591, front view" },
      ],
    },
    {
      slug: 'c878',
      title: "Panty C878",
      category: 'panties',
      images: [
        { file: `${C}/panties/c878-front.webp`, view: 'front', alt: "Panty C878, front view" },
      ],
    },
    {
      slug: 'c967',
      title: "Panty C967",
      category: 'panties',
      images: [
        { file: `${C}/panties/c967-front.webp`, view: 'front', alt: "Panty C967, front view" },
      ],
    },
  ],
  'shapewear': [
    {
      slug: 'a8168',
      title: "Shapewear / Bodysuit A8168",
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/a8168-front.webp`, view: 'front', alt: "Shapewear / Bodysuit A8168, front view" },
        { file: `${C}/shapewear/a8168-back.webp`, view: 'back', alt: "Shapewear / Bodysuit A8168, back view" },
        { file: `${C}/shapewear/a8168-view3.webp`, view: 'view3', alt: "Shapewear / Bodysuit A8168, view3 view" },
        { file: `${C}/shapewear/a8168-view4.webp`, view: 'view4', alt: "Shapewear / Bodysuit A8168, view4 view" },
        { file: `${C}/shapewear/a8168-view5.webp`, view: 'view5', alt: "Shapewear / Bodysuit A8168, view5 view" },
      ],
    },
    {
      slug: 'a8805',
      title: "Shapewear / Bodysuit A8805",
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/a8805-front.webp`, view: 'front', alt: "Shapewear / Bodysuit A8805, front view" },
        { file: `${C}/shapewear/a8805-back.webp`, view: 'back', alt: "Shapewear / Bodysuit A8805, back view" },
      ],
    },
    {
      slug: 'a8808',
      title: "Shapewear / Bodysuit A8808",
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/a8808-front.webp`, view: 'front', alt: "Shapewear / Bodysuit A8808, front view" },
        { file: `${C}/shapewear/a8808-back.webp`, view: 'back', alt: "Shapewear / Bodysuit A8808, back view" },
        { file: `${C}/shapewear/a8808-view3.webp`, view: 'view3', alt: "Shapewear / Bodysuit A8808, view3 view" },
        { file: `${C}/shapewear/a8808-view4.webp`, view: 'view4', alt: "Shapewear / Bodysuit A8808, view4 view" },
        { file: `${C}/shapewear/a8808-view5.webp`, view: 'view5', alt: "Shapewear / Bodysuit A8808, view5 view" },
        { file: `${C}/shapewear/a8808-view6.webp`, view: 'view6', alt: "Shapewear / Bodysuit A8808, view6 view" },
      ],
    },
    {
      slug: 'ys01',
      title: "Shapewear / Bodysuit YS01",
      category: 'shapewear',
      images: [
        { file: `${C}/shapewear/ys01-front.webp`, view: 'front', alt: "Shapewear / Bodysuit YS01, front view" },
        { file: `${C}/shapewear/ys01-back.webp`, view: 'back', alt: "Shapewear / Bodysuit YS01, back view" },
      ],
    },
  ],
  'camisoles': [
    {
      slug: 'b6051',
      title: "Camisole Set B6051",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/b6051-front.webp`, view: 'front', alt: "Camisole Set B6051, front view" },
        { file: `${C}/camisoles/b6051-back.webp`, view: 'back', alt: "Camisole Set B6051, back view" },
        { file: `${C}/camisoles/b6051-view3.webp`, view: 'view3', alt: "Camisole Set B6051, view3 view" },
      ],
    },
    {
      slug: 'm001',
      title: "Camisole Set M001",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m001-front.webp`, view: 'front', alt: "Camisole Set M001, front view" },
        { file: `${C}/camisoles/m001-back.webp`, view: 'back', alt: "Camisole Set M001, back view" },
      ],
    },
    {
      slug: 'm002',
      title: "Camisole Set M002",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m002-front.webp`, view: 'front', alt: "Camisole Set M002, front view" },
        { file: `${C}/camisoles/m002-back.webp`, view: 'back', alt: "Camisole Set M002, back view" },
      ],
    },
    {
      slug: 'm13',
      title: "Camisole Set M13",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/m13-front.webp`, view: 'front', alt: "Camisole Set M13, front view" },
        { file: `${C}/camisoles/m13-back.webp`, view: 'back', alt: "Camisole Set M13, back view" },
      ],
    },
    {
      slug: 'u018',
      title: "Camisole Set U018",
      category: 'camisoles',
      images: [
        { file: `${C}/camisoles/u018-front.webp`, view: 'front', alt: "Camisole Set U018, front view" },
        { file: `${C}/camisoles/u018-back.webp`, view: 'back', alt: "Camisole Set U018, back view" },
      ],
    },
  ],
};
