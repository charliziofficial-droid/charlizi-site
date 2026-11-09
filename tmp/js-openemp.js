(function () {
  var btns = [...document.querySelectorAll('button')].filter((b) => /Choose your employee count/i.test((b.innerText || '').trim()));
  if (!btns.length) return 'NOT_FOUND';
  btns[0].scrollIntoView({ block: 'center' });
  btns[0].click();
  return 'OPENED: ' + btns.length;
})();
