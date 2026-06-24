// scripts/optimize-images.js
// Batch resize and convert images to responsive webp variants
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join, extname, basename, dirname } from 'path';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'factory', 'images');
const OUTPUT_DIR = join(PUBLIC_DIR, 'responsive');

const SIZES = [480, 768, 1024, 1920];

// Images to process (key images only, skip SVGs and tiny files)
const IMAGES = [
  'hero.webp',
  'factory-overview.webp',
  'factory-placeholder.jpg',
  'category-showcase.webp',
  'gallery-grid.webp',
  'step-01.webp',
  'step-02.webp',
  'step-03.webp',
  'step-04.webp',
  'step-05.webp',
  'step-06.webp',
  'step-07.webp',
];

// Category SVG images
const CATEGORY_SVGS = [
  'bra-sets.svg',
  'bras.svg',
  'plus-size-bras.svg',
  'panties.svg',
  'silicone-bras.svg',
  'shapewear.svg',
  'sleepwear.svg',
];

async function resizeImage(filename) {
  const inputPath = join(PUBLIC_DIR, filename);
  if (!existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} — not found`);
    return;
  }

  const ext = extname(filename).toLowerCase();
  const name = basename(filename, ext);
  const metadata = await sharp(inputPath).metadata();
  const originalW = metadata.width;
  const originalH = metadata.height;

  // Create output dir
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate sized variants
  for (const w of SIZES) {
    if (w >= (originalW || Infinity)) {
      // Copy original as-is if smaller than this size
      const outName = `${name}@${originalW}.webp`;
      const outPath = join(OUTPUT_DIR, outName);
      if (!existsSync(outPath)) {
        await sharp(inputPath)
          .webp({ quality: 80, effort: 4 })
          .toFile(outPath);
        console.log(`  ✅ ${outName} (original ${originalW}w → webp)`);
      }
      break;
    }
    const outName = `${name}@${w}.webp`;
    const outPath = join(OUTPUT_DIR, outName);
    if (!existsSync(outPath)) {
      await sharp(inputPath)
        .resize(w, undefined, { fit: 'cover', position: 'centre' })
        .webp({ quality: 80, effort: 4 })
        .toFile(outPath);
      console.log(`  ✅ ${outName} (${originalW}×${originalH} → ${w}w)`);
    }
  }
}

async function main() {
  console.log('🔧 Optimizing images...\n');

  // 1. Convert heavy JPGs to WebP
  const heavyJpgs = ['factory-placeholder.jpg'];
  for (const jpg of heavyJpgs) {
    const inputPath = join(PUBLIC_DIR, jpg);
    if (!existsSync(inputPath)) continue;
    const webpName = basename(jpg, '.jpg') + '.webp';
    const webpPath = join(PUBLIC_DIR, webpName);
    if (!existsSync(webpPath)) {
      await sharp(inputPath).webp({ quality: 80, effort: 4 }).toFile(webpPath);
      console.log(`✅ Converted ${jpg} → ${webpName}`);
    }
  }

  // 2. Convert 1.jpg if it exists and isn't referenced
  const oneJpg = join(PUBLIC_DIR, '1.jpg');
  if (existsSync(oneJpg)) {
    // Check if referenced in any file
    const oneWebp = join(PUBLIC_DIR, '1.webp');
    if (!existsSync(oneWebp)) {
      await sharp(oneJpg).webp({ quality: 80, effort: 4 }).toFile(oneWebp);
      console.log(`✅ Converted 1.jpg → 1.webp`);
    }
  }

  // 3. Generate responsive variants
  console.log('\n📐 Generating responsive variants...');
  for (const img of IMAGES) {
    console.log(`  Processing ${img}...`);
    await resizeImage(img);
  }

  // 4. Generate sizes JSON for templates
  const manifest = {};
  for (const img of IMAGES) {
    const ext = extname(img).toLowerCase();
    const name = basename(img, ext);
    manifest[name] = {
      webp: SIZES.map(w => ({
        width: w,
        path: `/factory/images/responsive/${name}@${w}.webp`,
      })),
      fallback: img,
    };
  }

  writeFileSync(join(PUBLIC_DIR, 'image-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\n✅ Image manifest written to image-manifest.json');

  // 5. Summary
  console.log('\n📊 Size comparison:');
  for (const img of IMAGES) {
    const inputPath = join(PUBLIC_DIR, img);
    if (!existsSync(inputPath)) continue;
    const origSize = (readFileSync(inputPath).length / 1024).toFixed(1);
    const name = basename(img, extname(img));
    const smallest = join(OUTPUT_DIR, `${name}@480.webp`);
    const smallestSize = existsSync(smallest) ? (readFileSync(smallest).length / 1024).toFixed(1) : 'N/A';
    console.log(`  ${img}: ${origSize}KB → smallest ${smallestSize}KB`);
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
