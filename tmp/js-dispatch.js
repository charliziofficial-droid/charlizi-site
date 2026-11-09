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
  var btn = target.querySelector('button') || target.querySelector('input') || target;
  btn.scrollIntoView({ block: 'center' });

  var r = btn.getBoundingClientRect();
  var cx = r.left + r.width / 2;
  var cy = r.top + r.height / 2;
  var opts = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, button: 0 };

  btn.dispatchEvent(new PointerEvent('pointerdown', opts));
  btn.dispatchEvent(new MouseEvent('mousedown', opts));
  btn.dispatchEvent(new PointerEvent('pointerup', opts));
  btn.dispatchEvent(new MouseEvent('mouseup', opts));
  btn.dispatchEvent(new MouseEvent('click', opts));
  btn.focus();

  return 'dispatched on ' + btn.tagName + ' cls=' + (btn.className || '');
})();
