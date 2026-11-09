// 打开页面并抓取可读内容
const { httpGet, wsConnect, send, PORT } = require('./cdp-lib.cjs');

const url = process.argv[2];
const mode = process.argv[3] || 'text'; // text | html | links

(async () => {
  // 新建标签
  const tab = await httpGet('/json/new?' + encodeURIComponent(url), 'PUT');
  const ws = await wsConnect(tab.webSocketDebuggerUrl);

  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');
  // 等加载
  await new Promise((r) => setTimeout(r, 6000));

  const expr =
    mode === 'links'
      ? `JSON.stringify([...document.querySelectorAll('a')].map(a=>({t:(a.innerText||'').trim().slice(0,60),h:a.href})).filter(x=>x.t))`
      : mode === 'html'
      ? `document.documentElement.outerHTML`
      : `document.body ? document.body.innerText : ''`;

  const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: false });

  console.log('URL: ' + url);
  console.log('TITLE: ' + ((await send(ws, 'Runtime.evaluate', { expression: 'document.title', returnByValue: true })).result.value || ''));
  console.log('---');
  const v = r.result.value || '';
  if (mode === 'links') {
    JSON.parse(v).forEach((x) => console.log('  ' + x.t + '  ->  ' + x.h));
  } else if (mode === 'html') {
    const out = process.argv[4] || 'tmp/page.html';
    require('fs').mkdirSync('tmp', { recursive: true });
    require('fs').writeFileSync(out, v);
    console.log('saved ' + out + ' (' + v.length + ' bytes)');
  } else {
    console.log(v.slice(0, 6000));
  }

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
