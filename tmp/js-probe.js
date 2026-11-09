(function () {
  // 找所有含 employee 的容器，dump 其 HTML 结构
  var hits = [];
  var all = document.querySelectorAll('*');
  for (var i = 0; i < all.length; i++) {
    var e = all[i];
    if (e.offsetParent === null) continue;
    var t = (e.innerText || '').trim();
    if (/Choose your employee count/.test(t) && t.length < 120) {
      hits.push(e.tagName + '.' + (e.className || '').toString().slice(0, 60) + ' [' + t.length + ']');
    }
  }
  // 检查是否出现了下拉面板
  var panels = [...document.querySelectorAll('[role=listbox],[role=menu],[class*=dropdown],[class*=Dropdown],[class*=menu],[class*=Menu]')]
    .filter((e) => e.offsetParent !== null)
    .map((e) => ({
      tag: e.tagName,
      cls: (e.className || '').toString().slice(0, 50),
      items: [...e.querySelectorAll('li,[role=option],button,div')]
        .map((x) => (x.innerText || '').trim())
        .filter((t) => t && t.length < 40)
        .slice(0, 12),
    }));
  return JSON.stringify({ hits: hits.slice(0, 10), panels: panels.slice(0, 5) }, null, 1);
})();
