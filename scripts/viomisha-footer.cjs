const https = require('https');

https
  .get('https://www.viomisha.com/', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } }, (res) => {
    let b = '';
    res.on('data', (d) => (b += d));
    res.on('end', () => {
      // 找 footer 区块
      const i = b.lastIndexOf('<footer');
      const j = b.indexOf('</footer>', i);
      let foot = i >= 0 ? b.slice(i, j > 0 ? j + 9 : i + 20000) : 'NO_FOOTER_TAG';
      // 去标签取文字
      const text = foot
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<[^>]+>/g, '\n')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      console.log('=== FOOTER TEXT ===');
      console.log([...new Set(text)].slice(0, 60).join('\n'));
      console.log('\n=== FOOTER LINKS ===');
      const links = [...foot.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
      links.slice(0, 40).forEach((m) => {
        const t = m[2].replace(/<[^>]+>/g, '').trim();
        console.log((t || '(no text)').padEnd(30) + ' -> ' + m[1].slice(0, 60));
      });
    });
  })
  .on('error', (e) => console.log('ERR: ' + e.message));
