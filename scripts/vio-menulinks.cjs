const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('/menus'));
  if (!page) return console.log('NO MENUS TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(1000);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var links=[...document.querySelectorAll('a')].map(function(a){return {t:(a.innerText||'').replace(/\\s+/g,' ').trim(), h:a.href};}).filter(function(x){return /menus\\/\\d+/.test(x.h);});
      return JSON.stringify(links,null,1);
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
