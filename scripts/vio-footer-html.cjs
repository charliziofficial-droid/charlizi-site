const https = require('https');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

https
  .get('https://www.viomisha.com/', { headers: { 'User-Agent': UA } }, (res) => {
    let b = '';
    res.on('data', (d) => (b += d));
    res.on('end', () => {
      // 找 footer 里 Company 那一段完整 HTML
      const k = b.indexOf('About Us');
      if (k > 0) {
        console.log('=== Company 菜单区 HTML ===');
        console.log(b.slice(Math.max(0, k - 1200), k + 1200));
      } else {
        console.log('not found');
      }
    });
  })
  .on('error', (e) => console.log('ERR ' + e.message));
