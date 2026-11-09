const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } }, (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve(b));
      })
      .on('error', reject);
  });
}

(async () => {
  const html = await get('https://charlizi.com/products/bras/');
  // 提取尺码相关信息
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const sizes = [...new Set((text.match(/\b(?:28|30|32|34|36|38|40|42|44|46)\s?[A-H]{1,3}\b/gi) || []).map((s) => s.replace(/\s+/g, '').toUpperCase()))];
  console.log('=== sizes found on /products/bras/ ===');
  console.log(sizes.join(', ') || '(none)');

  const bandHits = [...new Set((text.match(/\b(28|30|32|34|36|38|40|42|44|46)\b/g) || []))];
  console.log('\nbands: ' + bandHits.join(', '));
  const cupHits = [...new Set((text.match(/\b(AA|A|B|C|D|DD|DDD|E|F|G)\b/g) || []))];
  console.log('cups: ' + cupHits.join(', '));
})();
