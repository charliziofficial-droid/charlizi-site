const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 清空 + 输入完整 URL
  await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(i){ i.focus(); var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); }
      return 'ok';
    })()`,
    returnByValue: true,
  });
  await sleep(400);
  for (const ch of 'https://charlizi.com') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(40);
  }
  await sleep(3500);

  // 定位并点击 ResultOption
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var opt=document.querySelector('[class*="ResultOption"]');
      if(!opt) return JSON.stringify({err:'NO_RESULT_OPTION'});
      var rc=opt.getBoundingClientRect();
      return JSON.stringify({t:(opt.innerText||'').replace(/\\s+/g,' ').trim(), title:opt.getAttribute('title')||'', x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2), w:Math.round(rc.width), h:Math.round(rc.height)});
    })()`,
    returnByValue: true,
  });
  console.log('resultOption: ' + r.result.value);
  const o = JSON.parse(r.result.value);
  if (o.err) { ws.close(); process.exit(0); }

  // 完整鼠标事件序列（含 pointer 事件）
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: o.x, y: o.y, button: 'none' });
  await sleep(150);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mousePressed', x: o.x, y: o.y, button: 'left', buttons: 1, clickCount: 1 });
  await sleep(120);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x: o.x, y: o.y, button: 'left', buttons: 0, clickCount: 1 });
  await sleep(3500);

  const after = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var txt=document.body.innerText||'';
      var items=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null&&(b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,40);});
      return JSON.stringify({hasWholesale:txt.indexOf('Wholesale')>=0, items:items.slice(0,20)},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER ===');
  console.log(after.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
