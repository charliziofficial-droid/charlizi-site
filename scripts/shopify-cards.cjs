const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const frames = list.filter((x) => x.type === 'iframe');
  const themeFrame = frames.find((f) => f.url.includes('online-store-web.shopifyapps.com/themes'));
  const ws = await wsConnect(themeFrame.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var btns=[...document.querySelectorAll('a,button')].filter(b=>/编辑模板/.test((b.innerText||'').trim()));
      return JSON.stringify(btns.map(function(b,i){
        // 向上找卡片容器
        var p=b, depth=0, cardText='';
        while(p && depth<8){
          p=p.parentElement; depth++;
          if(!p) break;
          var t=(p.innerText||'').replace(/\\s+/g,' ').trim();
          if(t.length>40 && t.length<400){ cardText=t; break; }
        }
        return {i:i, href:(b.href||'').slice(0,120), card:cardText.slice(0,200)};
      }),null,1);
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
