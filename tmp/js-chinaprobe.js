(function () {
  var out = [];
  document.querySelectorAll('.vis-select').forEach(function (s, i) {
    if (!s.classList.contains('open')) return;
    out.push('=== open select #' + i + ' ===');
    var dd = s.querySelector('.dropdown');
    if (!dd) {
      out.push('no .dropdown inside; siblings:');
      var p = s.parentElement;
      dd = p ? p.querySelector('.dropdown') : null;
    }
    if (dd) {
      out.push('dd html: ' + dd.innerHTML.slice(0, 1500));
    } else {
      out.push('dd still null. select html: ' + s.innerHTML.slice(0, 1200));
    }
  });
  // 全局找任意含 China 的元素
  var all = [...document.querySelectorAll('*')].filter(
    (e) => e.offsetParent !== null && /^China$/.test((e.innerText || '').trim())
  );
  out.push('elements with exact text "China": ' + all.length);
  all.slice(0, 5).forEach((e) => out.push('  ' + e.tagName + '.' + (e.className || '').toString().slice(0, 40)));
  return JSON.stringify(out, null, 1);
})();
