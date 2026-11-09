const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

const LABEL = 'Wholesale (30 pcs MOQ)';
const URL_ = 'https://charlizi.com';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(500);

  const script = `(function(){
    var inputs=[...document.querySelectorAll('input[type=text]')].filter(function(i){return i.offsetParent!==null;});
    var titleInput = inputs.find(function(i){return i.placeholder && i.placeholder.indexOf('关于我们')>=0;});
    var linkInput  = inputs.find(function(i){return i.placeholder && i.placeholder.indexOf('链接')>=0;});
    if(!titleInput || !linkInput) return JSON.stringify({err:'INPUT_NOT_FOUND', n:inputs.length, phs:inputs.map(function(i){return i.placeholder;})});

    function setVal(el, v){
      var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      s.call(el, v);
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    }
    setVal(titleInput, ${JSON.stringify(LABEL)});
    setVal(linkInput, ${JSON.stringify(URL_)});

    return JSON.stringify({ok:true, title:titleInput.value, link:linkInput.value});
  })()`;

  const r = await send(ws, 'Runtime.evaluate', { expression: script, returnByValue: true });
  console.log('fill: ' + r.result.value);

  await sleep(3000);

  // 看是否有搜索结果下拉 / 添加按钮
  const r2 = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var out={};
      out.btns=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null && (b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,30);}).slice(0,25);
      out.opts=[...document.querySelectorAll('[role=option],li[role],a[role=option]')].map(function(o){return (o.innerText||'').replace(/\\s+/g,' ').trim().slice(0,60);}).slice(0,15);
      out.inputs=[...document.querySelectorAll('input[type=text]')].filter(function(i){return i.offsetParent!==null;}).map(function(i){return {ph:i.placeholder, val:i.value.slice(0,60)};});
      return JSON.stringify(out,null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== STATE ===');
  console.log(r2.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
