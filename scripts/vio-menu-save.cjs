const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 检查新菜单项的实际链接
  const chk = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var btns=[...document.querySelectorAll('button')];
      var ws_=btns.filter(function(b){return /Wholesale/.test(b.innerText||'');});
      // 找该菜单项所在行的链接显示
      var out=[];
      ws_.forEach(function(b){
        var row=b.closest('div');
        for(var k=0;k<4&&row;k++){
          var t=(row.innerText||'').replace(/\\s+/g,' ').trim();
          if(t.length>15){ out.push(t.slice(0,120)); break; }
          row=row.parentElement;
        }
      });
      return JSON.stringify({found:ws_.length, rows:out},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('=== ITEM CHECK ===');
  console.log(chk.result.value);

  // 点击保存
  const save = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var b=[...document.querySelectorAll('button')].filter(function(x){return (x.innerText||'').trim()==='保存' && x.offsetParent!==null && !x.disabled;});
      if(!b.length) return 'NO_SAVE';
      b[b.length-1].click();
      return 'CLICKED n='+b.length;
    })()`,
    returnByValue: true,
  });
  console.log('\nsave: ' + save.result.value);
  await sleep(5000);

  const after = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var toasts=[...document.querySelectorAll('[role=status],[role=alert]')].map(function(e){return (e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,80);}).filter(Boolean);
      return JSON.stringify({url:location.href, toasts:toasts.slice(0,3)});
    })()`,
    returnByValue: true,
  });
  console.log('after save: ' + after.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
