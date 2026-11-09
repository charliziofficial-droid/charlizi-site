// 用 CDP 真实键盘输入
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');

const tabHint = process.argv[2];
const text = process.argv[3];

(async () => {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes(tabHint)) || pages[pages.length - 1];
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  // 聚焦搜索框
  const focus = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){var i=[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null)[0];if(!i)return 'NO_INPUT';i.focus();i.select&&i.select();return 'FOCUSED';})()`,
    returnByValue: true,
  });
  console.log('focus: ' + focus.result.value);

  // 清空
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2, windowsVirtualKeyCode: 65 });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2, windowsVirtualKeyCode: 65 });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  await new Promise((r) => setTimeout(r, 300));

  for (const ch of text) {
    await send(ws, 'Input.insertText', { text: ch });
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 2000));

  const after = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){var i=[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null)[0];
      var dd=[...document.querySelectorAll('.dropdown')].filter(e=>e.offsetParent!==null);
      return JSON.stringify({val:i?i.value:'',items:dd.map(d=>[...d.querySelectorAll('*')].map(x=>(x.innerText||'').trim()).filter(t=>t&&t.length<40).slice(0,10))});})()`,
    returnByValue: true,
  });
  console.log(after.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
