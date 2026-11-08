// scripts/verify-live-all.cjs  线上全量校验
const https = require('https');

function get(u) {
  return new Promise((res, rej) => {
    https.get(u + '?cb=' + Math.random(), (r) => {
      let b = '';
      r.on('data', (d) => (b += d));
      r.on('end', () => res({ s: r.statusCode, b, loc: r.headers.location }));
    }).on('error', rej);
  });
}

const cats = ['bras', 'bra-sets', 'panties', 'silicone-bras', 'shapewear', 'sleepwear', 'plus-size-bras', 'camisoles'];

(async () => {
  let total = 0;
  const bad = [];
  for (const c of cats) {
    const r = await get('https://charlizi.com/products/' + c + '/');
    if (r.s !== 200) { bad.push('CAT ' + c + ' HTTP ' + r.s); continue; }
    const re = new RegExp('href="/products/' + c + '/([a-z0-9-]+)/?"', 'g');
    const slugs = [...new Set([...r.b.matchAll(re)].map((m) => m[1]))];
    let ok = 0;
    for (const s of slugs) {
      total++;
      const d = await get('https://charlizi.com/products/' + c + '/' + s + '/');
      if (d.s === 200 && d.b.length > 2000) ok++;
      else bad.push(`${c}/${s} HTTP ${d.s} len=${d.b.length}`);
    }
    console.log(c.padEnd(16), `links: ${String(slugs.length).padStart(2)}  OK: ${ok}`);
  }
  console.log('\nTOTAL links:', total, '| FAILED:', bad.length);
  if (bad.length) console.log(bad.slice(0, 30).join('\n'));
})();
