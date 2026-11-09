// 自定义 JS 求值
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');

const url = process.argv[2];
const expr = process.argv[3];

(async () => {
  let tab;
  if (url && url !== '-') {
    tab = await httpGet('/json/new?' + encodeURIComponent(url), 'PUT');
  } else {
    const want = process.argv[4] || null;
    const list = await httpGet('/json/list');
    const pages = list.filter((x) => x.type === 'page');
    if (want) {
      tab = pages.find((p) => p.url.includes(want)) || pages[pages.length - 1];
    } else {
      tab = pages[pages.length - 1];
    }
  }
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');
  await new Promise((r) => setTimeout(r, 7000));

  const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  console.log(typeof r.result.value === 'object' ? JSON.stringify(r.result.value, null, 2) : String(r.result.value));
  if (r.exceptionDetails) console.log('EXC: ' + JSON.stringify(r.exceptionDetails).slice(0, 500));

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
