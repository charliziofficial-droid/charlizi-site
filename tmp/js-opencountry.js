(function () {
  var sels = [...document.querySelectorAll('.vis-select')];
  for (var i = 0; i < sels.length; i++) {
    var t = (sels[i].innerText || '').trim();
    if (/Country of company registration/i.test(t)) {
      var b = sels[i].querySelector('button') || sels[i];
      b.scrollIntoView({ block: 'center' });
      b.click();
      return 'OPENED country';
    }
  }
  return 'NOT_FOUND';
})();
