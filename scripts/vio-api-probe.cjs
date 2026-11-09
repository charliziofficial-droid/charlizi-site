const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('admin.shopify.com'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      // 找页面里的 shopify 全局对象 / 内嵌数据
      var out={};
      out.keys=Object.keys(window).filter(function(k){return /shopify|Shopify|__/i.test(k);}).slice(0,30);
      // 找 meta 里的 api key
      var metas=[...document.querySelectorAll('meta')].map(function(m){return m.name+'='+(m.content||'').slice(0,60);}).filter(function(x){return /shopify|token|api/i.test(x);});
      out.metas=metas.slice(0,10);
      // localStorage keys
      try{ out.ls=Object.keys(localStorage).slice(0,30); }catch(e){ out.ls='ERR'; }
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
