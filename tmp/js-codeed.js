JSON.stringify({
  url: location.href.slice(0, 60),
  editorReady: !!document.querySelector('.monaco-editor'),
  monacoCount: document.querySelectorAll('.monaco-editor').length,
  fileTree: [...document.querySelectorAll('[role=treeitem],[class*=explorer] *, .monaco-list-row')]
    .map((e) => (e.innerText || '').trim())
    .filter((t) => t && t.length < 40)
    .slice(0, 60),
  globals: typeof window.monaco !== 'undefined' ? 'yes' : 'no',
});
