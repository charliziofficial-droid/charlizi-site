(function () {
  var res = [];
  document.querySelectorAll('.vis-select.open').forEach(function (s) {
    res.push('OPEN:' + (s.innerText || '').replace(/\s+/g, ' ').slice(0, 100));
    res.push('HTML:' + s.innerHTML.slice(0, 1200));
  });
  return JSON.stringify(res, null, 1);
})();
