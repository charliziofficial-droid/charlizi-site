(function () {
  var menu = document.querySelector('[role=menu]');
  if (!menu) return 'NO_MENU';
  var items = [...menu.querySelectorAll('*')]
    .map(function (e) { return (e.innerText || '').trim(); })
    .filter(function (t) { return t && t.length < 60 && !t.includes('\n'); });
  var uniq = [...new Set(items)];
  var hits = uniq.filter(function (t) { return /china|hong|macau|macao|taiwan|singapore|asia/i.test(t); });
  return JSON.stringify({
    total: uniq.length,
    asiaHits: hits,
    list: uniq,
  }, null, 1);
})();
