(function () {
  var inp = [...document.querySelectorAll('input.search-input')].filter((e) => e.offsetParent !== null)[0];
  var out = { found: !!inp };
  if (inp) {
    var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    inp.focus();
    setter.call(inp, 'China');
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
    out.typed = inp.value;
  }
  // 读取当前可见下拉项
  var dd = [...document.querySelectorAll('.dropdown')].filter((e) => e.offsetParent !== null);
  out.items = dd.map((d) =>
    [...d.querySelectorAll('*')]
      .map((x) => (x.innerText || '').trim())
      .filter((t) => t && t.length < 40)
      .slice(0, 12)
  );
  return JSON.stringify(out, null, 1);
})();
