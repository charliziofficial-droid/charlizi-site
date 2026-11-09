const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('pages/113181884556'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  // 找到 tinymce iframe 的 frame id
  const tree = await send(ws, 'Page.enable').then(() => send(ws, 'Page.getFrameTree'));
  function walk(node, depth) {
    const f = node.frame;
    console.log(' '.repeat(depth) + f.id + ' | ' + (f.url || '(empty)').slice(0, 70));
    (node.childFrames || []).forEach((c) => walk(c, depth + 2));
  }
  walk(tree.frameTree, 0);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
