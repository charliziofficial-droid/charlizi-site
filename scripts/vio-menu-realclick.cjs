const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

async function realClick(ws, x, y) {
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await sleep(80);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await sleep(60);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  // 拿输入框坐标
  const pos = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(!i) return 'NO';
      var rc=i.getBoundingClientRect();
      return JSON.stringify({x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2), w:Math.round(rc.width), h:Math.round(rc.height)});
    })()`,
    returnByValue: true,
  });
  console.log('pos: ' + pos.result.value);
  const p = JSON.parse(pos.result.value);

  // 真实鼠标点击输入框
  await realClick(ws, p.x, p.y);
  await sleep(800);

  // 清空重打
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: 65, key: 'a', code: 'KeyA', modifiers: 2 });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 65, key: 'a', code: 'KeyA', modifiers: 2 });
  await sleep(200);
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: 8, key: 'Backspace', code: 'Backspace' });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 8, key: 'Backspace', code: 'Backspace' });
  await sleep(300);

  // 逐字符真实输入
  for (const ch of 'charlizi.com') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(60);
  }
  await sleep(2500);

  const state = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      var opts=[...document.querySelectorAll('[role=option]')].map(function(o){return (o.innerText||'').replace(/\\s+/g,' ').trim().slice(0,80);});
      var anyPanel=[...document.querySelectorAll('[id*="Popover"],[class*="Popover"],[class*="UrlPicker"]')].filter(function(e){return e.offsetParent!==null;}).map(function(e){return {cls:(e.className||'').toString().slice(0,60), txt:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,120)};});
      return JSON.stringify({val:i?i.value:'', dataState:i?i.getAttribute('data-state'):'', optCount:opts.length, opts:opts.slice(0,8), panels:anyPanel.slice(0,5)},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== STATE ===');
  console.log(state.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
