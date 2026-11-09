const https = require('https');

const url = 'https://www.viomisha.com/pages/about-women-story-in-stem-fieldsus';

https
  .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0 Safari/537.36' } }, (res) => {
    console.log('status=' + res.statusCode);
    let b = '';
    res.on('data', (d) => (b += d));
    res.on('end', () => {
      // 找 main content
      const m = b.match(/<main[\s\S]*?<\/main>/i);
      const main = m ? m[0] : b;
      const text = main
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      console.log('\n=== PAGE TEXT (first 1500) ===');
      console.log(text.slice(0, 1500));
    });
  })
  .on('error', (e) => console.log('ERR: ' + e.message));
