(function () {
  var inp = [...document.querySelectorAll('input.search-input')].filter((e) => e.offsetParent !== null)[0];
  if (!inp) return 'NO_SEARCH_INPUT';
  var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  inp.focus();
  setter.call(inp, 'China');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return 'TYPED China';
})();
