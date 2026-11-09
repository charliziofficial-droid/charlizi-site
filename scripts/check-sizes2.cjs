const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } }, (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      })
      .on('error', (e) => resolve({ status: 0, body: '' }));
  });
}

(async () => {
  const urls = [
    'https://charlizi.com/size-guide/',
    'https://charlizi.com/products/plus-size-bras/',
    'https://charlizi.com/faq',
  ];
  for (const u of urls) {
    const { status, body } = await get(u);
    const text = body
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    const sizes = [...new Set((text.match(/\b(?:28|30|32|34|36|38|40|42|44|46|48)\s?[A-H]{1,3}\b/gi) || []).map((s) => s.replace(/\s+/g, '').toUpperCase()))];
    console.log('=== ' + u + ' status=' + status + ' ===');
    console.log('sizes: ' + (sizes.join(', ') || '(none)'));
    console.log('');
  }
})();
