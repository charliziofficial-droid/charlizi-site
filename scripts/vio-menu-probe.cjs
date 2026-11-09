const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  if (!page) return console.log('NO TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(1200);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out={};
      out.buttons=[...document.querySelectorAll('button')].map(function(b){return {t:(b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,40), vis:b.offsetParent!==null, dis:!!b.disabled, aria:b.getAttribute('aria-label')||''};}).filter(function(b){return b.vis && (b.t||b.aria);}).slice(0,40);
      out.links=[...document.querySelectorAll('a')].map(function(a){return {t:(a.innerText||'').replace(/\\s+/g,' ').trim().slice(0,50), h:(a.getAttribute('href')||'').slice(0,60)};}).filter(function(a){return a.t&&a.h;}).slice(0,25);
      return JSON.stringify(out,null,1);
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
