const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var pops=[...document.querySelectorAll('[class*="Popover__PopoverOverlay"]')];
      var out=pops.map(function(p){
        var rc=p.getBoundingClientRect();
        return {
          txt:(p.innerText||'').replace(/\\n+/g,' | ').slice(0,600),
          rect:{x:Math.round(rc.x),y:Math.round(rc.y),w:Math.round(rc.width),h:Math.round(rc.height)},
          htmlHead:(p.innerHTML||'').slice(0,1200)
        };
      });
      var inp=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      return JSON.stringify({popoverCount:pops.length, pops:out, inputVal: inp?inp.value:'', inputState: inp?inp.getAttribute('data-state'):''},null,1);
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
