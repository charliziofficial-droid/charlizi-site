const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('pages/113181884556'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(1000);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out={hasTinymce: typeof window.tinymce !== 'undefined'};
      if(window.tinymce && window.tinymce.editors){
        out.editorCount = window.tinymce.editors.length;
        out.editors = window.tinymce.editors.map(function(e){
          return {id:e.id, len:(e.getContent()||'').length, head:(e.getContent()||'').slice(0,200)};
        });
      }
      // Shopify 新版可能用其他编辑器：找 iframe 的 contentDocument
      var ifr=document.querySelector('iframe.tox-edit-area__iframe');
      if(ifr && ifr.contentDocument){
        out.iframeDocAccessible=true;
        out.iframeBodyHTML=(ifr.contentDocument.body.innerHTML||'').slice(0,800);
      } else {
        out.iframeDocAccessible=false;
      }
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
