JSON.stringify({
  url: location.href.slice(0, 60),
  bodyLen: document.body.innerText.length,
  allText: document.body.innerText.replace(/\s+/g, ' ').slice(0, 600),
  sidebarItems: [...document.querySelectorAll('[role=treeitem],li,[class*=section],[class*=Section]')]
    .map((e) => (e.innerText || '').replace(/\s+/g, ' ').trim())
    .filter((t) => t && t.length < 50)
    .slice(0, 60),
  iframesInside: [...document.querySelectorAll('iframe')].map((f) => f.src.slice(0, 70)),
});
