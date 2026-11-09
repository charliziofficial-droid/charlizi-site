const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(500);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var btns=[...document.querySelectorAll('button')];
      var add=btns.find(function(b){return (b.innerText||'').trim()==='添加菜单项';});
      if(!add) return JSON.stringify({err:'NO_ADD_BTN'});
      add.click();
      return JSON.stringify({ok:true});
    })()`,
    returnByValue: true,
  });
  console.log('click: ' + r.result.value);
  await sleep(3500);

  const r2 = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out={};
      out.dialogs=[...document.querySelectorAll('[role=dialog]')].map(function(d){return (d.innerText||'').replace(/\\s+/g,' ').trim().slice(0,300);});
      out.inputs=[...document.querySelectorAll('input,select,textarea')].filter(function(i){return i.offsetParent!==null;}).map(function(i){return {tag:i.tagName,type:i.type||'',name:i.name||'',ph:i.placeholder||'',val:(i.value||'').slice(0,50),label:(i.getAttribute('aria-label')||'').slice(0,40)};}).slice(0,15);
      out.visibleBtns=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null && (b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,25);}).slice(0,25);
      return JSON.stringify(out,null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER CLICK ===');
  console.log(r2.result.value);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
