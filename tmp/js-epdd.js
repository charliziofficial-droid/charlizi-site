(function () {
  var out = { selects: [], dropdowns: [] };
  document.querySelectorAll('select').forEach(function (e, i) {
    if (e.offsetParent === null) return;
    out.selects.push({
      i: i,
      opts: [...e.options].map((o) => o.text.trim()).slice(0, 15),
      val: e.value,
    });
  });
  // 自定义下拉触发器
  document.querySelectorAll('button,[role=combobox],[role=listbox],[class*=select]').forEach(function (e) {
    if (e.offsetParent === null) return;
    var t = (e.innerText || '').trim();
    if (/Choose|Select|China|sector|Sector/i.test(t) && t.length < 60) out.dropdowns.push(t);
  });
  return JSON.stringify(out, null, 1);
})();
