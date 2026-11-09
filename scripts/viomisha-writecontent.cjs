const { httpGet, wsConnect, send } = require('./cdp-lib.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = process.env.CDP_PORT || '58802';

const NEW_PARA = `<p>Every Viomisha piece is developed and produced in Puning, Guangdong — a region that has specialised in lingerie manufacturing for over three decades. Our primary production partner is <a href="https://charlizi.com" target="_blank" rel="noopener">Charlizi Factory</a>, a BSCI-certified manufacturer with a 5,000 m² facility and an annual capacity of more than 5 million pieces. Working directly with the factory rather than through trading companies is what allows us to control wire placement, cup grading and fabric handfeel at the source — and to keep the fit consistent across the core band and cup sizes our customers in the US, Europe and the Middle East actually buy.</p>`;

(async () => {
  const list = await httpGet('/json/list', 'GET', PORT);
  const page = list.find((x) => x.type === 'page' && x.url.includes('pages/113181884556'));
  if (!page) return console.log('NO PAGE TAB');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await send(ws, 'Runtime.enable');
  await sleep(800);

  const script = `(function(){
    var np = ${JSON.stringify(NEW_PARA)};
    var ifr=document.querySelector('iframe.tox-edit-area__iframe');
    if(!ifr || !ifr.contentDocument) return JSON.stringify({err:'NO_IFRAME'});
    var doc=ifr.contentDocument;
    var body=doc.body;
    var before=body.innerHTML;
    if(before.indexOf('charlizi.com')>=0) return JSON.stringify({err:'ALREADY_PRESENT', len:before.length});

    body.insertAdjacentHTML('beforeend', np);

    var tm = window.tinymce && window.tinymce.get('page-content-rq');
    if(tm){ tm.setContent(body.innerHTML); tm.save(); tm.fire('change'); }

    var ta=document.querySelector('textarea[name="page.body"]');
    if(ta){
      var setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;
      setter.call(ta, body.innerHTML);
      ta.dispatchEvent(new Event('input',{bubbles:true}));
      ta.dispatchEvent(new Event('change',{bubbles:true}));
    }

    return JSON.stringify({ok:true, beforeLen:before.length, afterLen:body.innerHTML.length, tmFound:!!tm, hasCharlizi: body.innerHTML.indexOf('charlizi.com')>=0});
  })()`;

  const r = await send(ws, 'Runtime.evaluate', { expression: script, returnByValue: true });
  console.log(r.result.value);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('ERR: ' + e.message);
  process.exit(1);
});
