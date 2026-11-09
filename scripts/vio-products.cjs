const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('admin.shopify.com'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await send(ws, 'Page.enable');

  await send(ws, 'Page.navigate', { url: 'https://admin.shopify.com/store/fwmabi-vk/products' });
  await sleep(7000);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var rows=[...document.querySelectorAll('tr')];
      var out=rows.map(function(tr){
        var t=(tr.innerText||'').replace(/\\s+/g,' ').trim();
        return t;
      }).filter(function(t){return t.length>10;});
      return JSON.stringify({count:out.length, rows:out.slice(0,25)},null,1);
    })()`,
    returnByValue: true,
  });
  console.log(r.result.value);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
