const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('menus/236953370764'));
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(300);

  // 确保输入完整 URL 且 popover 打开
  await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var i=[...document.querySelectorAll('input[type=text]')].find(function(x){return x.offsetParent!==null && x.placeholder && x.placeholder.indexOf('链接')>=0;});
      if(i){ i.focus(); var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); }
      return 'ok';
    })()`,
    returnByValue: true,
  });
  await sleep(400);
  for (const ch of 'https://charlizi.com') {
    await send(ws, 'Input.dispatchKeyEvent', { type: 'char', text: ch });
    await sleep(40);
  }
  await sleep(3500);

  // 用 JS 派发完整指针事件序列到目标元素及其所有祖先
  const r = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var opt=document.querySelector('[class*="ResultOption"]');
      if(!opt) return JSON.stringify({err:'NO_OPT'});

      function fire(el, type, extra){
        var rc=el.getBoundingClientRect();
        var cx=rc.x+rc.width/2, cy=rc.y+rc.height/2;
        var opts={bubbles:true, cancelable:true, composed:true, view:window, clientX:cx, clientY:cy, screenX:cx, screenY:cy, button:0, buttons: type.indexOf('down')>=0?1:0, pointerId:1, pointerType:'mouse', isPrimary:true};
        if(extra) Object.keys(extra).forEach(function(k){opts[k]=extra[k];});
        var ev;
        if(type.indexOf('pointer')===0) ev=new PointerEvent(type, opts);
        else if(type.indexOf('mouse')===0) ev=new MouseEvent(type, opts);
        else ev=new Event(type, opts);
        el.dispatchEvent(ev);
      }

      // 目标元素链
      var chain=[];
      var n=opt;
      while(n && n!==document.body){ chain.push(n); n=n.parentElement; }

      var log=[];
      chain.forEach(function(el,i){
        ['pointerover','pointerenter','pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){
          try{ fire(el,t); log.push(i+':'+t); }catch(e){}
        });
      });

      return JSON.stringify({ok:true, chainLen:chain.length, fired:log.length, optText:(opt.innerText||'').trim()});
    })()`,
    returnByValue: true,
  });
  console.log('dispatch: ' + r.result.value);

  await sleep(3000);

  const after = await send(ws, 'Runtime.evaluate', {
    expression: `(function(){
      var txt=document.body.innerText||'';
      var items=[...document.querySelectorAll('button')].filter(function(b){return b.offsetParent!==null&&(b.innerText||'').trim();}).map(function(b){return (b.innerText||'').replace(/\\s+/g,' ').trim().slice(0,40);});
      var inputs=[...document.querySelectorAll('input[type=text]')].filter(function(i){return i.offsetParent!==null;}).map(function(i){return {ph:i.placeholder,val:i.value.slice(0,60)};});
      return JSON.stringify({hasWholesale:txt.indexOf('Wholesale')>=0, items:items.slice(0,20), inputs:inputs},null,1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== AFTER DISPATCH ===');
  console.log(after.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
