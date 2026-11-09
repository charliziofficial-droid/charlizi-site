const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const fs = require('fs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  // 截取外层 page（包含整体编辑器）
  const page = list.find((x) => x.type === 'page' && x.url.includes('/editor'));
  if (!page) return console.log('NO EDITOR PAGE');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  const shot = await send(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync('tmp/viomisha-editor.png', Buffer.from(shot.data, 'base64'));
  console.log('saved tmp/viomisha-editor.png');
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
