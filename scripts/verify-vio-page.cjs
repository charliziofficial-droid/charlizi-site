const https = require('https');

function get(url, depth = 0) {
  return new Promise((resolve) => {
    if (depth > 5) return resolve({ status: 0, body: '', url });
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          const next = res.headers.location.startsWith('http') ? res.headers.location : 'https://www.viomisha.com' + res.headers.location;
          return resolve(get(next, depth + 1));
        }
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve({ status: res.statusCode, body: b, url }));
      }
    );
    req.on('error', () => resolve({ status: 0, body: '', url }));
  });
}

(async () => {
  const url = 'https://www.viomisha.com/pages/about-women-story-in-stem-fieldsus?v=' + Date.now();
  const r = await get(url);
  console.log('status=' + r.status + ' len=' + r.body.length);
  const has = r.body.indexOf('charlizi.com') >= 0;
  console.log('has charlizi link: ' + has);
  if (has) {
    const k = r.body.indexOf('Puning');
    console.log('\n=== snippet ===');
    console.log(r.body.slice(Math.max(0, k - 200), k + 900).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  } else {
    console.log('NOT YET — 可能缓存或未保存成功');
  }
})();
