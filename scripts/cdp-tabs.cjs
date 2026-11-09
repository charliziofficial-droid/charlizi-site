// 通过 CDP 操作 AdsPower 浏览器
const http = require('http');

const PORT = process.argv[2] || 63158;

function cdpTargets() {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port: PORT, path: '/json/list' }, (res) => {
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => {
          try {
            resolve(JSON.parse(b));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

(async () => {
  const t = await cdpTargets();
  console.log('=== 浏览器标签页 ===');
  t.filter((x) => x.type === 'page').forEach((x) => console.log('  ' + x.url + '  |  ' + x.title));
})();
