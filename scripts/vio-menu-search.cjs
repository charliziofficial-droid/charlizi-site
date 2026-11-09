const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 输入 charlizi 搜索
  await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(i){ i.focus(); var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); }
      return 'ok';
    })()`,
    returnByValue: true,
  });
  await sleep(500);
  for (const ch of 'charlizi') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(50);
  }
  await sleep(3000);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var pop=document.querySelector('[class*="Popover__PopoverOverlay"]');
      if(!pop) return JSON.stringify({no:'pop'});
      var opts=[...pop.querySelectorAll('[class*="Option"]')].map(function(e){
        var rc=e.getBoundingClientRect();
        return {t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,60), title:e.getAttribute('title')||'', x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2), w:Math.round(rc.width), h:Math.round(rc.height)};
      }).filter(function(o){return o.w>20;});
      return JSON.stringify({count:opts.length, opts:opts},null,1);
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
