const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

async function key(ws, code, vk, text) {
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, key: text || code, code });
  await sleep(50);
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, key: text || code, code });
  await sleep(150);
}

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 1. 点输入框打开 popover
  const pos = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(!i) return 'NO';
      var rc=i.getBoundingClientRect();
      return JSON.stringify({x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2)});
    })()`,
    returnByValue: true,
  });
  const p = JSON.parse(pos.result.value);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y });
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await sleep(800);

  // 2. 全选清空后输入
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: 65, key: 'a', code: 'KeyA', modifiers: 2 });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 65, key: 'a', code: 'KeyA', modifiers: 2 });
  await sleep(150);
  await key(ws, 'Backspace', 8, 'Backspace');
  await sleep(400);

  for (const ch of 'charlizi.com') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(50);
  }
  await sleep(2500);

  // 3. 确认 popover 打开且有结果
  let st = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var pop=document.querySelector('[class*="Popover__PopoverOverlay"]');
      return JSON.stringify({pop: !!pop, txt: pop?(pop.innerText||'').replace(/\\n+/g,' | ').slice(0,200):''});
    })()`,
    returnByValue: true,
  });
  console.log('popover: ' + st.result.value);

  // 4. 向下箭头 → 回车
  await key(ws, 'ArrowDown', 40, 'ArrowDown');
  await sleep(500);
  await key(ws, 'ArrowDown', 40, 'ArrowDown');
  await sleep(300);
  await key(ws, 'Enter', 13, 'Enter');
  await sleep(3000);

  // 5. 结果
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var txt=document.body.innerText||'';
      var items=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null&&(b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,40);});
      var inputs=[...document.querySelectorAll('input[type=text]')].filter(function(i){return i.offsetParent!==null;}).map(function(i){return {ph:i.placeholder,val:i.value.slice(0,60)};});
      return JSON.stringify({hasWholesale:txt.indexOf('Wholesale')>=0, items:items.slice(0,20), inputs:inputs},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== RESULT ===');
  console.log(r.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
