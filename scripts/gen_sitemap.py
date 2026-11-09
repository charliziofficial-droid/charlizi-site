# -*- coding: utf-8 -*-
"""
gen_sitemap.py — 构建后扫描 dist/ 生成权威 sitemap.xml

为什么这么做：Astro 的 @astrojs/sitemap 只生成 sitemap-index.xml + sitemap-0.xml，
而 /sitemap.xml 原本 404（404 页面是 HTML），Google Search Console 因此报
"Sitemap is in HTML format"。这里直接在构建产物上扫一遍，保证 100% 覆盖、
100% XML、永不漂移。

用法（在 npm run build 之后执行）：
  python scripts/gen_sitemap.py
"""
import io
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
SITE = "https://charlizi.com"

# 永不收录
BLOCK_PREFIX = ("/admin", "/dashboard", "/manage", "/decapcms", "/cgi-bin",
                "/404", "/500", "/offline", "/_")
BLOCK_EXACT = {"/sitemap.xml", "/sitemap-index.xml", "/robots.txt"}


def collect():
    urls = []
    for dirpath, dirnames, filenames in os.walk(DIST):
        dirnames[:] = [d for d in dirnames if not d.startswith("_")]
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(dirpath, fn), DIST).replace("\\", "/")
            if rel == "index.html":
                u = "/"
            elif rel.endswith("/index.html"):
                u = "/" + rel[: -len("/index.html")] + "/"
            else:
                u = "/" + rel  # 非目录式页面（如 404.html）
            urls.append(u)
    return urls


def is_blocked(u):
    if u in BLOCK_EXACT:
        return True
    return any(u == b or u.startswith(b + "/") for b in BLOCK_PREFIX)


def main():
    if not os.path.isdir(DIST):
        print("dist/ 不存在，请先 npm run build")
        return 1
    all_urls = collect()
    keep = sorted(set(u for u in all_urls if not is_blocked(u)))
    dropped = sorted(set(all_urls) - set(keep))

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    parts = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in keep:
        loc = SITE + u
        parts.append("<url><loc>%s</loc><lastmod>%s</lastmod></url>" % (loc, now))
    parts.append("</urlset>")
    body = "".join(parts)

    out = os.path.join(DIST, "sitemap.xml")
    with io.open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(body)

    # 同步到 public/，避免下次构建时被旧文件覆盖（本脚本是构建后处理，无需此步，
    # 但保留一份便于本地核对）
    pub = os.path.join(ROOT, "public", "sitemap.xml")
    with io.open(pub, "w", encoding="utf-8", newline="\n") as f:
        f.write(body)

    print("sitemap.xml 生成完成：%d 个 URL" % len(keep))
    if dropped:
        print("已排除 %d 个（后台/错误页）: %s" % (len(dropped), ", ".join(dropped[:8])))
    # 自检
    assert body.startswith('<?xml version="1.0" encoding="UTF-8"?>')
    assert "<html" not in body
    assert body.count("<loc>") == len(keep)
    print("自检通过：纯 XML，无 <html> 标签")
    return 0


if __name__ == "__main__":
    sys.exit(main())
