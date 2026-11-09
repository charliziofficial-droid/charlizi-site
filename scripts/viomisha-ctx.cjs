const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';
const FRAME_ID = '87C11ADC4409482C7ECF23A1D89A5E6A';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('pages/113181884556'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');

  const r = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({bodyHTML: document.body.innerHTML.slice(0,3000), bodyText: document.body.innerText.slice(0,1500)})`,
    returnByValue: true,
    contextId: undefined,
  });
  // 需要在 frame 上下文中执行 → 用 Runtime.evaluate with uniqueContextId 不行，改用 DOM
  // 换法：直接用 frame 的 executionContextId
  console.log('--- try via frame context ---');

  // 获取所有 execution contexts
  const ctxs = [];
  const onCtx = (raw) => {
    const m = JSON.parse(raw);
    if (m.method === 'Runtime.executionContextCreated') ctxs.push(m.params.context);
  };
  ws.on('message', onCtx);
  await send(ws, 'Runtime.enable');
  await sleep(1500);
  console.log('contexts:');
  ctxs.forEach((c) => console.log('  id=' + c.id + ' name=' + c.name + ' origin=' + (c.origin || '').slice(0, 50) + ' auxData=' + JSON.stringify(c.auxData || {})));

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
