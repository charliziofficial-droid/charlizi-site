const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';
const hint = process.argv[2] || 'editor';
const script = process.argv[3] ? require('fs').readFileSync(process.argv[3], 'utf8') : null;

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const pages = list.filter((x) => x.type === 'page');
  const frames = list.filter((x) => x.type === 'iframe');

  console.log('=== pages ===');
  pages.forEach((p) => console.log('  ' + p.url.slice(0, 100)));
  console.log('=== iframes ===');
  frames.forEach((f) => console.log('  ' + f.url.slice(0, 100)));

  // 找编辑器 iframe
  const cands = [...frames, ...pages].filter((x) => x.url.includes(hint) || x.url.includes('theme-editor') || x.url.includes('editor'));
  if (!cands.length) {
    console.log('NO TARGET');
    return process.exit(1);
  }
  const target = cands[0];
  console.log('\nusing: ' + target.url.slice(0, 100));
  const ws = await wsConnect(target.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  const r = await send(ws, 'Runtime.evaluate', {
    expression: script || `JSON.stringify({url:location.href,len:document.body.innerText.length,txt:document.body.innerText.replace(/\\s+/g,' ').slice(0,800)})`,
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
