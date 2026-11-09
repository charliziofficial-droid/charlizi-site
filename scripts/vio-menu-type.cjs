const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await send(ws, 'Input.enable').catch(() => {});
  await sleep(400);

  // 聚焦链接输入框并输入，触发真实键盘事件
  const focus = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(!i) return 'NO';
      i.focus(); i.select();
      return 'OK:'+i.value;
    })()`,
    returnByValue: true,
  });
  console.log('focus: ' + focus.result.value);

  await sleep(600);

  // 用真实键盘输入，触发 React 事件
  await send(ws, 'Input.insertText', { text: 'https://charlizi.com' });
  await sleep(2500);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out={};
      out.opts=[...document.querySelectorAll('[role=option],[role=listbox] *[tabindex]')].map(function(o){return (o.innerText||'').replace(/\\s+/g,' ').trim().slice(0,70);}).filter(Boolean).slice(0,12);
      out.listboxes=document.querySelectorAll('[role=listbox]').length;
      out.menus=[...document.querySelectorAll('[role=menu]')].filter(function(m){return m.offsetParent!==null;}).length;
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      out.linkVal = i ? i.value : 'N/A';
      return JSON.stringify(out,null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER TYPING ===');
  console.log(r.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
