const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('pages/113181884556'));
  if (!page) return console.log('NO TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(500);

  // 1) 先看有哪些按钮
  const r1 = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var btns=[...document.querySelectorAll('button, input[type=submit]')].map(function(b){
        return {txt:(b.innerText||b.value||'').replace(/\\s+/g,' ').trim().slice(0,30), dis:!!b.disabled, vis:b.offsetParent!==null};
      }).filter(function(b){return b.vis && b.txt;});
      return JSON.stringify(btns.slice(0,30),null,1);
    })()`,
    returnByValue: true,
  });
  console.log('=== BUTTONS ===');
  console.log(r1.result.value);

  // 2) 找保存按钮并点击
  const r2 = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var all=[...document.querySelectorAll('button, input[type=submit]')];
      var save=all.filter(function(b){
        var t=(b.innerText||b.value||'').trim();
        return /^(Save|保存|Publikasikan|儲存)$/i.test(t) && b.offsetParent!==null && !b.disabled;
      });
      if(!save.length) return JSON.stringify({err:'NO_SAVE_BTN', found: all.map(function(b){return (b.innerText||b.value||'').trim();}).filter(Boolean).slice(0,20)});
      save[0].click();
      return JSON.stringify({ok:true, clicked:save[0].innerText.trim()});
    })()`,
    returnByValue: true,
  });
  console.log('\n=== SAVE CLICK ===');
  console.log(r2.result.value);

  await sleep(4000);

  // 3) 检查是否保存成功
  const r3 = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var bodyTxt=document.body.innerText||'';
      var toast=[...document.querySelectorAll('[role=status],[role=alert],.PolarisToast,.PolarisBanner')].map(function(e){return (e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,120);}).filter(Boolean);
      return JSON.stringify({url:location.href, toasts:toast.slice(0,5)});
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER SAVE ===');
  console.log(r3.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
