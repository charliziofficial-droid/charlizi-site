// 用 CDP 真实鼠标事件完整打开国家下拉并选择 China
const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const list = await httpGet('/json/list');
  const pages = list.filter((x) => x.type === 'page');
  const tab = pages.find((p) => p.url.includes('new-company')) || pages[pages.length - 1];
  const ws = await wsConnect(tab.webSocketDebuggerUrl);
  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  async function rectOf(expr) {
    const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
    if (!r.result.value) return null;
    return JSON.parse(r.result.value);
  }

  async function realClick(x, y) {
    await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await sleep(120);
    await send(ws, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await sleep(80);
    await send(ws, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  }

  // 1) 打开国家下拉
  const selBox = await rectOf(`(function(){
    var sels=[...document.querySelectorAll('.vis-select')];
    for(var i=0;i<sels.length;i++){
      if((sels[i].innerText||'').indexOf('Country of company registration')>=0){
        sels[i].scrollIntoView({block:'center'});
        var b=sels[i].getBoundingClientRect();
        return JSON.stringify({x:Math.round(b.left+b.width/2),y:Math.round(b.top+b.height/2)});
      }
    }
    return null;
  })()`);
  if (!selBox) return console.log('ERR: select not found');
  await realClick(selBox.x, selBox.y);
  await sleep(2200);

  let st = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({opens:[...document.querySelectorAll('.vis-select.open')].length, searchInputs:[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null).length})`,
    returnByValue: true,
  });
  console.log('after open: ' + st.result.value);

  // 2) 点搜索框
  const inpBox = await rectOf(`(function(){
    var i=[...document.querySelectorAll('input.search-input')].filter(e=>e.offsetParent!==null)[0];
    if(!i) return null;
    var b=i.getBoundingClientRect();
    return JSON.stringify({x:Math.round(b.left+b.width/2),y:Math.round(b.top+b.height/2)});
  })()`);
  if (!inpBox) return console.log('ERR: search input not visible');
  await realClick(inpBox.x, inpBox.y);
  await sleep(500);

  // 3) 逐字输入
  for (const ch of 'China') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(200);
  }
  await sleep(3000);

  // 4) 结果
  const res = await send(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({val:(document.querySelector('input.search-input')||{}).value,menu:(document.querySelector('[role=menu]')||{}).innerText||'',nodes:(document.querySelector('[role=menu]')||{querySelectorAll:()=>[]}).querySelectorAll('*').length})`,
    returnByValue: true,
  });
  console.log('after type: ' + res.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
