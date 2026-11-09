const https = require('https');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

https
  .get('https://www.viomisha.com/?cb=' + Date.now(), { headers: { 'User-Agent': UA, 'Cache-Control': 'no-cache' } }, (res) => {
    console.log('status=' + res.statusCode);
    let b = '';
    res.on('data', (d) => (b += d));
    res.on('end', () => {
      const hasW = b.indexOf('Wholesale') >= 0;
      console.log('has "Wholesale": ' + hasW);

      // 找 footer 中 Company 栏
      const i = b.indexOf('About Us');
      if (i > 0) {
        const seg = b.slice(i, i + 2500);
        const links = [...seg.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
        console.log('\n=== footer Company 链接 ===');
        links.slice(0, 8).forEach((m) => {
          const t = m[2].replace(/<[^>]+>/g, '').trim();
          console.log('  ' + (t || '(no text)').padEnd(28) + ' -> ' + m[1]);
        });
      }

      // 找 charlizi 外链
      const anchors = [...b.matchAll(/<a\b[^>]*charlizi\.com[^>]*>/gi)].map((m) => m[0]);
      console.log('\n=== charlizi 外链 (' + anchors.length + ') ===');
      anchors.forEach((a) => console.log('  ' + a));
    });
  })
  .on('error', (e) => console.log('ERR ' + e.message));
