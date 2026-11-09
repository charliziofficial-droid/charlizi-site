// 在指定标签页执行：填表 + 点击
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');

const target = process.argv[2]; // URL 片段，用于找标签
const raw = process.argv[3];
const actions = raw.trim().startsWith('[')
  ? JSON.parse(raw)
  : JSON.parse(require('fs').readFileSync(raw, 'utf8'));

async function findTab() {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  return pages.find((p) => p.url.includes(target)) || pages[pages.length - 1];
}

(async () => {
  const tab = await findTab();
  console.log('TAB: ' + tab.url);
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  for (const a of actions) {
    if (a.wait) {
      await new Promise((r) => setTimeout(r, a.wait));
      console.log('  ..wait ' + a.wait);
    } else if (a.click) {
      const expr = `(function(){
        var e = document.querySelector(${JSON.stringify(a.click)});
        if(!e) return 'NOT_FOUND';
        e.scrollIntoView({block:'center'}); e.click(); return 'OK';
      })()`;
      const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
      console.log('  click ' + a.click + ' -> ' + r.result.value);
    } else if (a.sel) {
      // 用原生 setter 触发 React/Vue 的 onChange
      const expr = `(function(){
        var e = document.querySelector(${JSON.stringify(a.sel)});
        if(!e) return 'NOT_FOUND';
        var proto = e.tagName==='TEXTAREA' ? HTMLTextAreaElement.prototype
                  : e.tagName==='SELECT' ? HTMLSelectElement.prototype
                  : HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto,'value').set;
        e.focus();
        setter.call(e, ${JSON.stringify(a.val)});
        e.dispatchEvent(new Event('input',{bubbles:true}));
        e.dispatchEvent(new Event('change',{bubbles:true}));
        e.dispatchEvent(new Event('blur',{bubbles:true}));
        return e.value;
      })()`;
      const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
      console.log('  fill ' + a.sel + ' = "' + r.result.value + '"');
    } else if (a.eval) {
      const r = await send(ws, 'Runtime.evaluate', { expression: a.eval, returnByValue: true, awaitPromise: true });
      console.log('  eval -> ' + JSON.stringify(r.result.value).slice(0, 800));
    }
  }

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
