(function () {
  var sels = [...document.querySelectorAll('.vis-select')];
  var res = [];
  sels.forEach(function (s) {
    var txt = (s.innerText || '').trim().replace(/\s+/g, ' ');
    res.push(txt.slice(0, 45) + ' || open=' + s.classList.contains('open'));
  });
  return JSON.stringify(res, null, 1);
})();
