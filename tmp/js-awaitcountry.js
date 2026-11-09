(async function () {
  var inp = [...document.querySelectorAll('input.search-input')].filter((e) => e.offsetParent !== null)[0];
  if (!inp) return JSON.stringify({ err: 'NO_INPUT' });

  var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  inp.focus();
  setter.call(inp, 'china');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('compositionstart', { bubbles: true }));
  inp.dispatchEvent(new Event('compositionend', { bubbles: true }));
  inp.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));

  var snapshots = [];
  for (var t = 0; t < 8; t++) {
    await new Promise((r) => setTimeout(r, 1200));
    var menu = document.querySelector('[role=menu]');
    var txt = menu ? (menu.innerText || '').trim() : '';
    var n = menu ? menu.querySelectorAll('*').length : 0;
    snapshots.push({ t: t, len: txt.length, nodes: n, sample: txt.replace(/\s+/g, ' ').slice(0, 120) });
    if (/China/.test(txt)) break;
  }
  return JSON.stringify({ val: inp.value, snapshots: snapshots }, null, 1);
})();
