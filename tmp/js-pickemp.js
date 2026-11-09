(function () {
  var dd = [...document.querySelectorAll('.dropdown')].filter((e) => e.offsetParent !== null);
  for (var i = 0; i < dd.length; i++) {
    var items = [...dd[i].querySelectorAll('li,[role=option],div,span,button')].filter((x) => (x.innerText || '').trim() === '200-499');
    if (items.length) {
      var el = items[items.length - 1];
      el.scrollIntoView({ block: 'center' });
      el.click();
      return 'PICKED 200-499';
    }
  }
  return 'NOT_FOUND';
})();
