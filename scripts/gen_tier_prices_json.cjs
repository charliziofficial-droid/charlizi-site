// Build-time generator: data/tier-prices.json - tier unit price table.
//
// Why data/ and not public/:
//   Anything under public/ is copied to dist/ and served as a static asset, so
//   /data/tier-prices.json would be downloadable by anyone and the price gate
//   would be pure theatre. Files in data/ are inlined into the Pages Function
//   bundle by the bundler and are never reachable as a URL.
//
// Run via: node scripts/gen_tier_prices_json.cjs
// CommonJS (.cjs) because package.json has type:module.
// Wired into package.json build so it always runs before astro build.

const fs = require('fs');

const SRC = 'src/data/product-pricing.ts';
const OUT = 'data/tier-prices.json';

const src = fs.readFileSync(SRC, 'utf8');
const body = src.slice(src.indexOf('export const PRICING'), src.indexOf('export function getPricing'));

const entries = {};
const re = /"([a-z0-9-]+)\/([a-z0-9-]+)":\s*(\{)/g;
let m;
while ((m = re.exec(body))) {
  const start = m.index + m[0].length - 1;
  let depth = 0;
  let end = -1;
  for (let i = start; i < body.length; i++) {
    if (body[i] === '{') depth++;
    else if (body[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) continue;
  let rec;
  try {
    rec = JSON.parse(body.slice(start, end));
  } catch {
    continue;
  }
  const sku = String(rec.sku || m[2]).toUpperCase();
  entries[sku] = {
    category: rec.category || m[1],
    slug: rec.slug || m[2],
    tiers: rec.tiers || [],
    moq: rec.moq ?? null,
    stock: rec.stock ?? null,
  };
}

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(entries));

const count = Object.keys(entries).length;
const bytes = fs.statSync(OUT).size;
console.log(`[tier-prices] ${count} styles -> ${OUT} (${(bytes / 1024).toFixed(1)} KB)`);
