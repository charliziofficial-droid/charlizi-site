(function () {
  var target = window.__pickTarget;
  var dd = [...document.querySelectorAll('.dropdown')].filter((e) => e.offsetParent !== null);
  for (var i = 0; i < dd.length; i++) {
    var cands = [...dd[i].querySelectorAll('li,[role=option],div,span,button')].filter(
      (x) => (x.innerText || '').trim() === target
    );
    if (cands.length) {
      var el = cands[cands.length - 1];
      el.scrollIntoView({ block: 'center' });
      el.click();
      return 'PICKED ' + target;
    }
  }
  return 'NOT_FOUND ' + target;
})();
