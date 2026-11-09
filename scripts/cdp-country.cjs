// 真实键盘输入到国家搜索框
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');

const tabHint = 'new-company';
const text = process.argv[2] || 'China';

(async () => {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes(tabHint)) || pages[pages.length - 1];
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  // 1. 用真实鼠标点开国家下拉
  const box = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var sels=[...document.querySelectorAll('.vis-select')];
      var el=null;
      for(var i=0;i<sels.length;i++){ if((sels[i].innerText||'').indexOf('Country of company registration')>=0){el=sels[i];break;} }
      if(!el) return null;
      el.scrollIntoView({block:'center'});
      var b=el.getBoundingClientRect();
      return JSON.stringify({x:Math.round(b.left+b.width/2),y:Math.round(b.top+b.height/2)});
    })()`,
    returnByValue: true,
  });
  if (!box.result.value) return console.log('ERR no select');
  const { x, y } = JSON.parse(box.result.value);
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send(ws, 'Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
  }
  await new Promise((r) => setTimeout(r, 2000));

  // 2. 用真实鼠标点搜索框
  const sbox = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){var i=[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null)[0];if(!i)return null;var b=i.getBoundingClientRect();return JSON.stringify({x:Math.round(b.left+b.width/2),y:Math.round(b.top+b.height/2)});})()`,
    returnByValue: true,
  });
  if (!sbox.result.value) return console.log('ERR no search input');
  const sp = JSON.parse(sbox.result.value);
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send(ws, 'Input.dispatchMouseEvent', { type, x: sp.x, y: sp.y, button: 'left', clickCount: 1 });
  }
  await new Promise((r) => setTimeout(r, 600));

  // 3. 清空 + 逐字真实输入
  for (const k of [8, 8, 8, 8, 8]) {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
    await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  }
  for (const ch of text) {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await new Promise((r) => setTimeout(r, 180));
  }
  await new Promise((r) => setTimeout(r, 2500));

  // 4. 检查结果
  const res = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){var menu=document.querySelector('[role=menu]');var i=[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null)[0];return JSON.stringify({val:i?i.value:'',menuText:menu?(menu.innerText||'').replace(/\\s+/g,' ').slice(0,300):'',menuNodes:menu?menu.querySelectorAll('*').length:0,menuDisplay:menu?getComputedStyle(menu).display:''});})()`,
    returnByValue: true,
  });
  console.log(res.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
