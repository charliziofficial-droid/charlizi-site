const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(400);

  // 拿选项坐标
  const pos = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var opt=document.querySelector('[class*="ResultOption"][title="https://charlizi.com"]');
      if(!opt) return JSON.stringify({err:'NO_OPT'});
      var rc=opt.getBoundingClientRect();
      return JSON.stringify({x:Math.round(rc.x+rc.width/2), y:Math.round(rc.y+rc.height/2), w:Math.round(rc.width), h:Math.round(rc.height), txt:(opt.innerText||'').trim()});
    })()`,
    returnByValue: true,
  });
  console.log('opt: ' + pos.result.value);
  const p = JSON.parse(pos.result.value);
  if (p.err) { ws.close(); process.exit(0); }

  // 真实鼠标点击
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y });
  await sleep(120);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await sleep(80);
  await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await sleep(3000);

  // 检查菜单项
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var txt=document.body.innerText||'';
      var items=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null && (b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,40);});
      var inputs=[...document.querySelectorAll('input[type=text]')].filter(function(i){return i.offsetParent!==null;}).map(function(i){return {ph:i.placeholder,val:i.value.slice(0,60)};});
      return JSON.stringify({hasWholesale:txt.indexOf('Wholesale')>=0, hasCharliziTxt:txt.indexOf('charlizi')>=0, items:items.slice(0,20), inputs:inputs},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER OPTION CLICK ===');
  console.log(r.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
