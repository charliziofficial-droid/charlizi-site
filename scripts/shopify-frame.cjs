const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  // 找 iframe target
  const frames = list.filter((x) => x.type === 'iframe');
  console.log('=== iframe targets ===');
  frames.forEach((f) => console.log('  ' + f.url.slice(0, 110)));

  const themeFrame = frames.find((f) => f.url.includes('online-store-web'));
  if (!themeFrame) {
    console.log('NO THEME IFRAME');
    return process.exit(1);
  }
  console.log('\nusing: ' + themeFrame.url.slice(0, 100));
  const ws = await wsConnect(themeFrame.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({url:location.href,len:document.body.innerText.length,txt:document.body.innerText.replace(/\\s+/g,' ').slice(0,1200)})`,
    returnByValue: true,
  });
  console.log(r.result.value);
  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
