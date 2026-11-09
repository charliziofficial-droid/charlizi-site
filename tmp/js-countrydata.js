(function () {
  // 打开国家下拉前先看页面里是否有预埋的国家数据
  var out = {};

  // 1) 检查网络数据缓存：Vue app / window 上是否挂着国家列表
  var keys = Object.keys(window).filter(function (k) {
    return /country|COUNTRY|Country/i.test(k);
  });
  out.windowKeys = keys.slice(0, 20);

  // 2) 从已渲染的下拉里收集所有 option 文本
  var menu = document.querySelector('[role=menu]');
  out.menuDisplay = menu ? getComputedStyle(menu).display : 'NO_MENU';
  out.menuChildren = menu ? menu.children.length : 0;
  out.menuText = menu ? (menu.innerText || '').replace(/\s+/g, ' ').slice(0, 400) : '';

  // 3) 页面上所有 select 元素
  out.selects = [...document.querySelectorAll('select')].map(function (s) {
    return { name: s.name || s.id || '?', n: s.options.length, hasChina: [...s.options].some(function (o) { return /china/i.test(o.text); }), hasHK: [...s.options].some(function (o) { return /hong ?kong/i.test(o.text); }) };
  });

  return JSON.stringify(out, null, 1);
})();
