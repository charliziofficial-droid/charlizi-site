const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const fs = require('fs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await sleep(300);

  const shot = await send(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tmp/vio-menu.png', Buffer.from(shot.data, 'base64'));
  console.log('saved tmp/vio-menu.png');

  // 同时 dump 输入框周围的完整 HTML
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(!i) return 'NO';
      var p=i; for(var k=0;k<6;k++){ p=p.parentElement; if(!p) break; }
      return p ? p.outerHTML.slice(0,2500) : 'NO_PARENT';
    })()`,
    returnByValue: true,
  });
  console.log('\n=== WRAPPER HTML ===');
  console.log(r.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
