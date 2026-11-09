(function () {
  var sels = [...document.querySelectorAll('.vis-select')];
  var target = null;
  for (var i = 0; i < sels.length; i++) {
    if ((sels[i].innerText || '').indexOf('Country of company registration') >= 0) {
      target = sels[i];
      break;
    }
  }
  if (!target) return 'NOT_FOUND';
  var btn = target.querySelector('button') || target;
  btn.scrollIntoView({ block: 'center' });
  var r = btn.getBoundingClientRect();
  var o = { bubbles: true, cancelable: true, view: window, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, button: 0 };
  btn.dispatchEvent(new PointerEvent('pointerdown', o));
  btn.dispatchEvent(new MouseEvent('mousedown', o));
  btn.dispatchEvent(new PointerEvent('pointerup', o));
  btn.dispatchEvent(new MouseEvent('mouseup', o));
  btn.dispatchEvent(new MouseEvent('click', o));
  btn.focus();
  return 'OPENED';
})();
