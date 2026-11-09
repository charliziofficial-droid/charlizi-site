(function () {
  var out = [];
  document.querySelectorAll('input,select,textarea').forEach(function (e, i) {
    if (e.offsetParent === null) return;
    var lab = '';
    if (e.id) {
      var l = document.querySelector('label[for="' + e.id + '"]');
      if (l) lab = l.innerText.trim();
    }
    if (!lab && e.labels && e.labels[0]) lab = e.labels[0].innerText.trim();
    if (!lab) {
      var p = e.closest('div');
      if (p && p.previousElementSibling) lab = (p.previousElementSibling.innerText || '').trim();
    }
    out.push({
      i: i,
      id: e.id || '',
      name: e.name || '',
      type: e.type,
      tag: e.tagName,
      lab: lab.slice(0, 50),
      ph: e.placeholder || '',
    });
  });
  return JSON.stringify(out, null, 1);
})();
