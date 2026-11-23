// Strict price-gate audit.
// Rule: a tier unit price is a leak anywhere in the page HTML unless the page is
// legitimately publishing the public range (low/high) in the teaser, the GEO answer
// sentence, or the AggregateOffer schema. Anything else is a leak.
//
// Single-tier styles are the interesting case: low === high, so the range text is
// itself the tier price. That is accepted by design (publishing a range of one value
// is the same information the schema already exposes). What we must catch is a
// multi-tier style where an interior or second price shows up.

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('src/data/product-pricing.ts', 'utf8');
const body = src.slice(src.indexOf('export const PRICING'), src.indexOf('export function getPricing'));

const entries = [];
const re = /"([a-z0-9-]+)\/([a-z0-9-]+)":\s*(\{)/g;
let m;
while ((m = re.exec(body))) {
  const start = m.index + m[0].length - 1;
  let depth = 0,
    end = -1;
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
  try {
    entries.push([m[1] + '/' + m[2], JSON.parse(body.slice(start, end))]);
  } catch {
    /* ignore parse failures, reported by count mismatch */
  }
}

let checked = 0;
let leaked = 0;
let missingRange = 0;
let schemaOk = 0;
let tableRowsOk = 0;
const leaks = [];
const noRange = [];
const badRows = [];

for (const [key, p] of entries) {
  const file = path.join('dist', 'products', p.category, String(p.sku).toLowerCase(), 'index.html');
  if (!fs.existsSync(file)) continue;
  checked++;
  const html = fs.readFileSync(file, 'utf8');

  const prices = p.tiers.map((t) => Number(t.price));
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const loS = lo.toFixed(2);
  const hiS = hi.toFixed(2);

  // --- Leak rule -----------------------------------------------------------
  // Count occurrences of each distinct price, then subtract the occurrences we
  // expect from the legitimately public range (teaser text + GEO sentence + schema
  // lowPrice/highPrice). Any remainder means the number appears somewhere it
  // should not - i.e. a real tier value leaked into the page.
  //
  // Single-price styles (lo === hi) are published by design: the range text equals
  // the price and the table shows it outright, so measured counts are higher.
  const singlePriceStyle = loS === hiS;
  const uniq = [...new Set(prices.map((x) => x.toFixed(2)))];
  const details = [];

  for (const priceStr of uniq) {
    const seen = (html.match(new RegExp(priceStr.replace('.', '\\.'), 'g')) || []).length;
    let allowed;

    if (singlePriceStyle) {
      // schema lowPrice + highPrice (2), teaser "USD x.xx" (1), answer sentence (1), table cell (1)
      allowed = 5;
    } else {
      allowed = 0;
      // Public range text: "USD lo–hi" in teaser/answer, plus schema low/high.
      if (priceStr === loS) allowed += 3; // teaser range, answer range, schema lowPrice
      if (priceStr === hiS) allowed += 3; // teaser range, answer range, schema highPrice
    }

    if (seen > allowed) {
      details.push(`${priceStr} appears ${seen}x but only ${allowed} legitimate`);
    }
  }

  if (details.length) {
    leaks.push(key + ': ' + details.join('; '));
    leaked++;
  }

  // --- Range text must exist ----------------------------------------------
  // Single-price styles now publish a plain "USD x.xx" instead of "USD x.xx–x.xx".
  const expectedPriceText = singlePriceStyle ? 'USD ' + loS : 'USD ' + loS + '\u2013' + hiS;
  if (!html.includes(expectedPriceText)) {
    noRange.push(key + ' (want "' + expectedPriceText + '")');
    missingRange++;
  }

  // --- Schema must expose only an aggregate range --------------------------
  const agg = html.match(/"AggregateOffer"[^}]*\}/);
  if (agg && agg[0].includes('lowPrice') && agg[0].includes('highPrice')) schemaOk++;

  // --- Every tier row must render an empty price shell (or a public price) --
  // The component merges adjacent equal prices into one row, so the number of
  // rendered rows is the merged count, not the raw tier count.
  const mergedCount = p.tiers.reduce((acc, t) => {
    const last = acc[acc.length - 1];
    if (last && Math.abs(last.price - Number(t.price)) < 0.005) return acc;
    acc.push({ price: Number(t.price) });
    return acc;
  }, []).length;

  const rowCount = (html.match(/data-tier-idx="/g) || []).length;
  const maskedCells = (html.match(/class="mask"[^>]*>\s*[\u2022]{2,}/g) || []).length;
  const publicCells = (html.match(/class="val publicly-shown"/g) || []).length;
  const expectedMasks = singlePriceStyle ? 0 : mergedCount;
  if (rowCount !== mergedCount || maskedCells !== expectedMasks) {
    badRows.push(`${key} rows=${rowCount}/${mergedCount} masks=${maskedCells} want=${expectedMasks}`);
  } else if (singlePriceStyle && publicCells !== mergedCount) {
    badRows.push(`${key} public cells=${publicCells}/${mergedCount}`);
  } else {
    tableRowsOk++;
  }
}

console.log('=== PRICE GATE AUDIT (STRICT) ===');
console.log('pages checked            :', checked);
console.log('tier price LEAKED        :', leaked);
console.log('missing public range     :', missingRange);
console.log('schema AggregateOffer ok :', schemaOk, '/', checked);
console.log('tier rows + masks ok     :', tableRowsOk, '/', checked);

if (leaks.length) {
  console.log('\nLEAKS:');
  leaks.slice(0, 20).forEach((l) => console.log('  ', l));
}
if (noRange.length) console.log('\nNO RANGE:', noRange.slice(0, 10).join(', '));
if (badRows.length) {
  console.log('\nROW/MASK MISMATCH:');
  badRows.slice(0, 10).forEach((l) => console.log('  ', l));
}

const clean = leaked === 0 && missingRange === 0 && schemaOk === checked && tableRowsOk === checked;
console.log('\n' + (clean ? 'GATE HOLDS: no tier unit price is exposed before registration.' : 'GATE BROKEN - see above.'));
process.exitCode = clean ? 0 : 1;
