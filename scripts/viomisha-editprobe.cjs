const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('pages/113181884556'));
  if (!page) return console.log('NO TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(3000);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out={};
      // 富文本 iframe
      var ifr=[...document.querySelectorAll('iframe')];
      out.iframes=ifr.map(function(f){return {src:f.src.slice(0,70), id:f.id||'', cls:(f.className||'').slice(0,30), w:f.offsetWidth,h:f.offsetHeight};});
      // 可编辑区域
      var eds=[...document.querySelectorAll('[contenteditable=true]')];
      out.contentEditables=eds.map(function(e){return {tag:e.tagName, cls:(e.className||'').slice(0,40), len:(e.innerText||'').length, head:(e.innerText||'').slice(0,100)};});
      // textarea
      out.textareas=[...document.querySelectorAll('textarea')].map(function(t){return {name:t.name, len:t.value.length, head:t.value.slice(0,80)};});
      // 标题输入
      out.titleInputs=[...document.querySelectorAll('input')].filter(function(i){return i.offsetParent!==null&&i.type==='text';}).map(function(i){return {name:i.name||'', val:i.value.slice(0,60), ph:i.placeholder||''};}).slice(0,8);
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
