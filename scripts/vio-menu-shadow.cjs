const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 检查 shadow DOM 结构
  const r0 = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var picker=document.querySelector('s-internal-single-picker');
      if(!picker) return 'NO_PICKER';
      var out={hasShadow: !!picker.shadowRoot};
      if(picker.shadowRoot){
        out.shadowHTML = picker.shadowRoot.innerHTML.slice(0,1500);
        out.optionCount = picker.shadowRoot.querySelectorAll('s-internal-picker-option').length;
      }
      return JSON.stringify(out,null,1);
    })()`,
    returnByValue: true,
  });
  console.log('=== SHADOW ===');
  console.log(r0.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
