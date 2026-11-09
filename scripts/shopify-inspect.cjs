const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes('admin.shopify.com')) || pages[0];
  console.log('TAB: ' + tab.url);
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      return JSON.stringify({
        url: location.href,
        title: document.title,
        bodyLen: document.body.innerText.length,
        bodyHead: document.body.innerText.replace(/\\s+/g,' ').slice(0,400)
      });
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
