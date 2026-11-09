const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  // 重新输入，模拟完整的人工输入（逐字符 + 回车）
  await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(i){ i.focus(); var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); }
      return 'cleared';
    })()`,
    returnByValue: true,
  });
  await sleep(500);

  // 逐字符插入
  for (const ch of 'https://charlizi.com') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(30);
  }
  await sleep(2000);

  // 检查下拉
  let r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      var opts=[...document.querySelectorAll('[role=option]')].map(function(o){return (o.innerText||'').replace(/\\s+/g,' ').trim().slice(0,70);});
      return JSON.stringify({val:i?i.value:'N/A', optCount:opts.length, opts:opts.slice(0,10)});
    })()`,
    returnByValue: true,
  });
  console.log('after char-input: ' + r.result.value);

  // 回车
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, key: 'Enter', code: 'Enter' });
  await send(ws, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, key: 'Enter', code: 'Enter' });
  await sleep(2500);

  // 检查菜单项是否已添加
  r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var txt=document.body.innerText||'';
      var btns=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null && (b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,30);});
      var inputs=[...document.querySelectorAll('input[type=text]')].filter(function(i){return i.offsetParent!==null;}).map(function(i){return {ph:i.placeholder,val:i.value.slice(0,50)};});
      return JSON.stringify({hasWholesale: txt.indexOf('Wholesale')>=0, btns:btns.slice(0,20), inputs:inputs},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER ENTER ===');
  console.log(r.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
