const https = require('https');

https
  .get(
    'https://www.viomisha.com/',
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } },
    (res) => {
      let b = '';
      res.on('data', (d) => (b += d));
      res.on('end', () => {
        const re = /<a[^>]+href="([^"]*)"[^>]*>\s*Our Company\s*<\/a>/gi;
        const m = [...b.matchAll(re)];
        console.log('=== Our Company links found: ' + m.length + ' ===');
        m.forEach((x) => console.log('  -> ' + x[1]));

        const k = b.indexOf('Our Company');
        if (k > 0) {
          console.log('\n=== context ===');
          console.log(b.slice(Math.max(0, k - 400), k + 150).replace(/\s+/g, ' '));
        }

        // 检查 footer 中是否已含 charlizi
        console.log('\n=== charlizi mentions in page: ' + (b.match(/charlizi/gi) || []).length + ' ===');
      });
    }
  )
  .on('error', (e) => console.log('ERR: ' + e.message));
