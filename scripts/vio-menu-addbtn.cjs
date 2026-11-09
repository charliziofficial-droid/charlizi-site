const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  // 找输入框附近所有可点元素
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var linkInput=[...document.querySelectorAll('input[type=text]')].find(function(i){return i.offsetParent!==null && i.placeholder && i.placeholder.indexOf('链接')>=0;});
      if(!linkInput) return JSON.stringify({err:'NO_LINK_INPUT'});

      var out={};
      // 向上找容器
      var box = linkInput.closest('div');
      for(var up=0; up<5 && box; up++){
        var btns=[...box.querySelectorAll('button')].map(function(b){
          var rc=b.getBoundingClientRect();
          return {t:(b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,30), aria:b.getAttribute('aria-label')||'', dis:!!b.disabled, x:Math.round(rc.x), y:Math.round(rc.y)};
        });
        if(btns.length){ out['level'+up]=btns; break; }
        box = box.parentElement ? box.parentElement.closest('div') : null;
      }
      // 全页面找 aria-label 含 添加 的
      out.addBtns=[...document.querySelectorAll('button')].filter(function(b){
        var t=(b.getAttribute('aria-label')||'')+(b.innerText||'');
        return /添加|Add/i.test(t) && b.offsetParent!==null;
      }).map(function(b){var rc=b.getBoundingClientRect();return {t:(b.innerText||'').trim().slice(0,20), aria:b.getAttribute('aria-label')||'', x:Math.round(rc.x),y:Math.round(rc.y),dis:!!b.disabled};});
      return JSON.stringify(out,null,1);
    })()`,
    returnByValue: true,
  });
  console.log(r.result.value);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
