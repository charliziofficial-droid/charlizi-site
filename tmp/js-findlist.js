(function () {
  // 不开搜索，直接找国家列表容器里的 China 项
  var menu = document.querySelector('[role=menu]');
  var out = {
    menuDisplay: menu ? getComputedStyle(menu).display : 'NO_MENU',
    menuNodes: menu ? menu.querySelectorAll('*').length : 0,
    menuTextLen: menu ? (menu.innerText || '').length : 0,
  };

  // 找所有可见的、含大量国家名的滚动容器
  var scrollers = [...document.querySelectorAll('div,ul')].filter(function (e) {
    if (e.offsetParent === null) return false;
    var t = (e.innerText || '').trim();
    return t.length > 200 && /China|Albania|Austria/i.test(t) && e.children.length > 3;
  });
  out.scrollerCount = scrollers.length;
  out.scrollers = scrollers.slice(0, 3).map(function (e) {
    return {
      cls: (e.className || '').toString().slice(0, 50),
      items: e.children.length,
      first: (e.children[0] ? e.children[0].innerText : '').trim().slice(0, 20),
      last: (e.children[e.children.length - 1] ? e.children[e.children.length - 1].innerText : '').trim().slice(0, 20),
      hasChina: /(^|\n)\s*China\s*($|\n)/m.test(e.innerText || ''),
    };
  });
  return JSON.stringify(out, null, 1);
})();
