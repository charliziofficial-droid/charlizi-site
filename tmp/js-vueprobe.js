(function () {
  var inp = [...document.querySelectorAll('input.search-input')].filter((e) => e.offsetParent !== null)[0];
  if (!inp) return 'NO_INPUT';

  // 查 Vue 实例绑定的 props/事件
  var out = { tag: inp.outerHTML.slice(0, 400) };

  // 找父级 Vue 组件
  var el = inp;
  var chain = [];
  for (var i = 0; i < 6 && el; i++) {
    var vm = el.__vueParentComponent || el.__vue__;
    if (vm) {
      chain.push({
        level: i,
        name: (vm.type && (vm.type.__name || vm.type.name)) || 'anon',
        props: vm.props ? Object.keys(vm.props).slice(0, 20) : [],
        emits: vm.emits ? Object.keys(vm.emits).slice(0, 20) : [],
      });
    }
    el = el.parentElement;
  }
  out.vueChain = chain;

  // 该组件的所有国家选项是否已经加载在内存里
  var menu = document.querySelector('[role=menu]');
  out.menuHTML = menu ? menu.outerHTML.slice(0, 600) : 'NO_MENU';
  out.menuDisplay = menu ? getComputedStyle(menu).display : '';
  out.menuParent = menu && menu.parentElement ? menu.parentElement.className : '';
  return JSON.stringify(out, null, 1);
})();
