const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('admin.shopify.com'));
  if (!page) return console.log('NO ADMIN TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(async function(){
      try {
        var res = await fetch('/admin/api/2024-10/graphql.json', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({query: '{ products(first: 50) { nodes { title variants(first: 50) { nodes { title selectedOptions { name value } } } } } }'})
        });
        var j = await res.json();
        return JSON.stringify(j).slice(0, 3000);
      } catch(e) { return 'ERR: ' + e.message; }
    })()`,
    returnByValue: true,
    awaitPromise: true,
  });
  console.log(r.result.value);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
