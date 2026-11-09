const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';
const hint = process.argv[2] || '';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const pages = list.filter((x) => x.type === 'page');
  const tab = hint ? pages.find((p) => p.url.includes(hint)) || pages[0] : pages[0];
  console.log('TAB: ' + tab.url);
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  await send(ws, 'Page.reload', { ignoreCache: true });
  await sleep(4000);
  for (let i = 0; i < 6; i++) {
    const r = await send(ws, 'Runtime.evaluate', {
      expression: `JSON.stringify({len:document.body.innerText.length,ready:document.readyState})`,
      returnByValue: true,
    });
    console.log('t' + i + ': ' + r.result.value);
    if (JSON.parse(r.result.value).len > 600) break;
    await sleep(4000);
  }
  const fin = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({len:document.body.innerText.length,txt:document.body.innerText.replace(/\\s+/g,' ').slice(0,900)})`,
    returnByValue: true,
  });
  console.log(fin.result.value);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
