(function () {
  // 打开「Delivery area」下拉
  var sels = [...document.querySelectorAll('.vis-select')];
  for (var i = 0; i < sels.length; i++) {
    var t = (sels[i].innerText || '').trim();
    if (/Delivery area/i.test(t)) {
      var b = sels[i].querySelector('button') || sels[i];
      b.scrollIntoView({ block: 'center' });
      b.click();
      return 'OPENED delivery';
    }
  }
  return 'NOT_FOUND';
})();
