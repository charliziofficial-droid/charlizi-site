const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('/pages'));
  if (!page) return console.log('NO PAGE TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var rows=[...document.querySelectorAll('tr')];
      var out=[];
      rows.forEach(function(tr){
        var t=(tr.innerText||'').replace(/\\s+/g,' ').trim();
        if(t.indexOf('Our Company')>=0){
          var a=tr.querySelector('a');
          out.push({row:t.slice(0,100), href:a?a.href:''});
        }
      });
      // 也找所有指向 pages 的链接
      var links=[...document.querySelectorAll('a')].map(a=>a.href).filter(h=>/\\/pages\\//.test(h)).slice(0,10);
      return JSON.stringify({ourCompany:out, sampleLinks:links},null,1);
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
