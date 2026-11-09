const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 打开 popover
  const pos = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(!i) return 'NO';
      i.focus();
      var rc=i.getBoundingClientRect();
      return JSON.stringify({x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2)});
    })()`,
    returnByValue: true,
  });
  console.log('pos: ' + pos.result.value);
  const p = JSON.parse(pos.result.value);

  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y });
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await sleep(2500);

  // 列出 popover 中每个可点元素的坐标和 class
  const els = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var pop=document.querySelector('[class*="Popover__PopoverOverlay"]');
      if(!pop) return JSON.stringify({no:'pop'});
      var nodes=[...pop.querySelectorAll('*')].filter(function(e){
        var rc=e.getBoundingClientRect();
        return rc.width>20 && rc.height>10 && (e.innerText||'').trim();
      }).map(function(e){
        var rc=e.getBoundingClientRect();
        return {tag:e.tagName, cls:(e.className||'').toString().slice(0,50), t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,50), x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2), w:Math.round(rc.width), h:Math.round(rc.height)};
      });
      // 只保留最深层（面积最小的）
      return JSON.stringify({total:nodes.length, nodes:nodes.slice(0,40)},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== POPOVER NODES ===');
  console.log(els.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
