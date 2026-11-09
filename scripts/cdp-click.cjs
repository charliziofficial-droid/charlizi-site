// 用 CDP 真实鼠标点击坐标
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');

const tabHint = process.argv[2];
const selector = process.argv[3];

(async () => {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes(tabHint)) || pages[pages.length - 1];
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  // 滚动到元素并取坐标
  const box = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var sels=[...document.querySelectorAll('.vis-select')];
      var el=null;
      var want=${JSON.stringify(selector)};
      for(var i=0;i<sels.length;i++){ if((sels[i].innerText||'').indexOf(want)>=0) { el=sels[i]; break; } }
      if(!el) return null;
      el.scrollIntoView({block:'center'});
      var b=el.getBoundingClientRect();
      return JSON.stringify({x:Math.round(b.left+b.width/2),y:Math.round(b.top+b.height/2)});
    })()`,
    returnByValue: true,
  });
  if (!box.result.value) {
    console.log('ELEMENT_NOT_FOUND');
    ws.close();
    return process.exit(1);
  }
  const { x, y } = JSON.parse(box.result.value);
  console.log('click at ' + x + ',' + y);

  for (const type of ['mousePressed', 'mouseReleased']) {
    await send(ws, 'Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
  }
  await new Promise((r) => setTimeout(r, 2500));

  const after = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({open:[...document.querySelectorAll('.vis-select.open')].map(e=>(e.innerText||'').replace(/\\s+/g,' ').slice(0,80)),ddVisible:[...document.querySelectorAll('.dropdown')].filter(e=>e.offsetParent!==null).length})`,
    returnByValue: true,
  });
  console.log(after.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
