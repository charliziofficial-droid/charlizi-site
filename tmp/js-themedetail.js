JSON.stringify({
  url: location.href.slice(0, 80),
  len: document.body.innerText.length,
  txt: document.body.innerText.replace(/\s+/g, ' ').slice(0, 900),
  links: [...document.querySelectorAll('a')].map((a) => ({ t: (a.innerText || '').trim().slice(0, 30), h: (a.href || '').slice(0, 90) })).filter((x) => x.t).slice(0, 40),
});
