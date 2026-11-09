const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes('new-company')) || pages[pages.length - 1];
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  // 1) 程序化派发打开下拉（此法此前有效）
  const open = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var sels=[...document.querySelectorAll('.vis-select')];
      var target=null;
      for(var i=0;i<sels.length;i++){ if((sels[i].innerText||'').indexOf('Country of company registration')>=0){target=sels[i];break;} }
      if(!target) return 'NOT_FOUND';
      var btn=target.querySelector('button')||target;
      btn.scrollIntoView({block:'center'});
      var r=btn.getBoundingClientRect();
      var o={bubbles:true,cancelable:true,view:window,clientX:r.left+r.width/2,clientY:r.top+r.height/2,button:0};
      btn.dispatchEvent(new PointerEvent('pointerdown',o));
      btn.dispatchEvent(new MouseEvent('mousedown',o));
      btn.dispatchEvent(new PointerEvent('pointerup',o));
      btn.dispatchEvent(new MouseEvent('mouseup',o));
      btn.dispatchEvent(new MouseEvent('click',o));
      btn.focus();
      return 'OPENED';
    })()`,
    returnByValue: true,
  });
  console.log('open: ' + open.result.value);
  await sleep(1800);

  // 2) 查搜索框是否出来，并聚焦（用 CDP focus + 真实键入）
  const st = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({opens:[...document.querySelectorAll('.vis-select.open')].length,si:[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null).length})`,
    returnByValue: true,
  });
  console.log('state: ' + st.result.value);

  const foc = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){var i=[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null)[0];if(!i)return 'NO';i.focus();return 'FOCUSED';})()`,
    returnByValue: true,
  });
  console.log('focus: ' + foc.result.value);
  if (foc.result.value !== 'FOCUSED') return ws.close();

  await sleep(300);
  for (const ch of 'China') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(220);
  }
  await sleep(3000);

  const res = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){var i=document.querySelector('input.search-input');var m=document.querySelector('[role=menu]');return JSON.stringify({val:i?i.value:'',menu:m?(m.innerText||'').replace(/\\s+/g,' ').slice(0,300):'',nodes:m?m.querySelectorAll('*').length:0});})()`,
    returnByValue: true,
  });
  console.log('typed: ' + res.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
