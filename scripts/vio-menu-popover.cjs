const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  // 读 popover 里所有可点项
  async function dump(label) {
    const r = await send(ws, 'Runtime.evaluate', {
      expression: `(function(){
        var pop=document.querySelector('.Polaris-Popover__PopoverOverlay');
        if(!pop) return JSON.stringify({noPopover:true});
        var items=[...pop.querySelectorAll('li,button,[role=option],[role=menuitem],a')].map(function(e){
          var rc=e.getBoundingClientRect();
          return {t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,60), tag:e.tagName, role:e.getAttribute('role')||'', x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2), vis:rc.width>0};
        }).filter(function(x){return x.t && x.vis;});
        return JSON.stringify({items:items.slice(0,20)},null,1);
      })()`,
      returnByValue: true,
    });
    console.log('=== ' + label + ' ===');
    console.log(r.result.value);
    return r.result.value;
  }

  await dump('popover now');
  await sleep(4000);
  await dump('popover after 4s');

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
