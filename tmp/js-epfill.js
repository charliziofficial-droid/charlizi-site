(function () {
  function byLabel(text, tag) {
    var list = document.querySelectorAll(tag || 'input');
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.offsetParent === null) continue;
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
      if (lab === text) return e;
    }
    return null;
  }

  function setVal(e, v) {
    var proto =
      e.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : e.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    e.focus();
    setter.call(e, v);
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    e.dispatchEvent(new Event('blur', { bubbles: true }));
    return e.value;
  }

  var data = {
    'Company name': 'Charlizi Factory',
    'VAT number': '',
    'Street and number': 'Shiqiaotou Industry District No.102, Junbu Town',
    'Address (optional)': '',
    'Postal code': '515300',
    City: 'Puning',
    'Company email': 'charlizi.official@gmail.com',
    'Company website (optional)': 'https://charlizi.com',
    'Company phone number': '+8613352743559',
  };

  var res = [];
  Object.keys(data).forEach(function (k) {
    var e = byLabel(k);
    if (!e) {
      res.push(k + ' -> NOT_FOUND');
      return;
    }
    res.push(k + ' -> ' + setVal(e, data[k]));
  });
  return JSON.stringify(res, null, 1);
})();
