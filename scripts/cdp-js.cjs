// 读取 JS 文件并在页面里 eval
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const fs = require('fs');

const tabHint = process.argv[2];
const jsFile = process.argv[3];

(async () => {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes(tabHint)) || pages[pages.length - 1];
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  const expr = fs.readFileSync(jsFile, 'utf8');
  const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) {
    console.log('EXC: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description));
  } else {
    console.log(typeof r.result.value === 'object' ? JSON.stringify(r.result.value, null, 1) : String(r.result.value));
  }
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
