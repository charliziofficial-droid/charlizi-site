// 打开页面并截图 + 导出表单结构，用于判断当前在哪一步
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const fs = require('fs');

const url = process.argv[2];
const shotName = process.argv[3] || 'tmp/reg.png';

(async () => {
  let tab;
  if (url && url !== '-') {
    tab = await httpGet('/json/new?' + encodeURIComponent(url), 'PUT');
  } else {
    const want = process.argv[4] || null;
    const list = await httpGet('/json/list');
    const pages = list.filter((x) => x.type === 'page');
    tab = want ? pages.find((p) => p.url.includes(want)) || pages[pages.length - 1] : pages[pages.length - 1];
  }
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');
  await new Promise((r) => setTimeout(r, 7000));

  const info = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({
      url: location.href,
      title: document.title,
      text: (document.body?document.body.innerText:'').slice(0,3000),
      inputs: [...document.querySelectorAll('input,textarea,select')].map(e=>({
        tag:e.tagName, type:e.type||'', name:e.name||'', id:e.id||'',
        ph:e.placeholder||'', label:(e.labels&&e.labels[0]?e.labels[0].innerText:'')||'',
        aria:e.getAttribute('aria-label')||'', vis:e.offsetParent!==null
      })).filter(x=>x.vis),
      buttons: [...document.querySelectorAll('button,a[role=button],input[type=submit]')].map(b=>({t:(b.innerText||b.value||'').trim().slice(0,40),vis:b.offsetParent!==null})).filter(x=>x.t&&x.vis)
    })`,
    returnByValue: true,
  });

  const d = JSON.parse(info.result.value);
  console.log('URL: ' + d.url);
  console.log('TITLE: ' + d.title);
  console.log('\n--- 表单输入框 ---');
  d.inputs.forEach((i, n) => console.log(`  [${n}] ${i.tag} type=${i.type} name=${i.name} ph="${i.ph}" label="${i.label}" aria="${i.aria}"`));
  console.log('\n--- 可见按钮 ---');
  d.buttons.forEach((b, n) => console.log(`  (${n}) ${b.t}`));
  console.log('\n--- 页面文字 ---');
  console.log(d.text.slice(0, 1800));

  const shot = await send(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync(shotName, Buffer.from(shot.data, 'base64'));
  console.log('\n[screenshot] ' + shotName);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
