const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const frames = list.filter((x) => x.type === 'iframe');
  const themeFrame = frames.find((f) => f.url.includes('online-store-web.shopifyapps.com/themes'));
  const ws = await wsConnect(themeFrame.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  // 找到已发布主题卡片的"编辑模板"按钮
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out=[];
      document.querySelectorAll('button,a').forEach(function(b){
        var t=(b.innerText||'').trim();
        if(/编辑模板|Customize/.test(t)) out.push({t:t,tag:b.tagName});
      });
      // 找已发布区块
      var published = [...document.querySelectorAll('*')].filter(e=>{
        var t=(e.innerText||'').trim();
        return t && t.length<200 && /当前|已发布|正在使用|Current theme/i.test(t);
      }).map(e=>e.tagName+':'+(e.innerText||'').replace(/\\s+/g,' ').slice(0,100));
      return JSON.stringify({customizeBtns:out, publishedHints:published.slice(0,8)});
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
