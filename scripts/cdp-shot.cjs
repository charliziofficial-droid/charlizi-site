const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const fs = require('fs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';
const hint = process.argv[2] || '';
const outFile = process.argv[3] || 'tmp/shot.png';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const pages = list.filter((x) => x.type === 'page');
  const tab = hint ? pages.find((p) => p.url.includes(hint)) || pages[0] : pages[0];
  console.log('TAB: ' + tab.url);
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  const shot = await send(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outFile, Buffer.from(shot.data, 'base64'));
  console.log('saved ' + outFile);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
