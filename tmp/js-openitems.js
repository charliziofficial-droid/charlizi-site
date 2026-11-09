(function () {
  var out = { open: [], items: [] };
  document.querySelectorAll('.vis-select.open').forEach(function (s) {
    out.open.push((s.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 200));
    var dd = s.querySelector('.dropdown') || s.nextElementSibling;
    if (dd) {
      out.items.push(
        [...dd.querySelectorAll('*')]
          .map((x) => (x.innerText || '').trim())
          .filter((t) => t && t.length < 40)
          .slice(0, 15)
      );
    }
  });
  return JSON.stringify(out, null, 1);
})();
