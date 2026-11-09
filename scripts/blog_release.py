# -*- coding: utf-8 -*-
"""
blog_release.py — 发布闸门 + 上线动作（q1 审查不过就不许部署）

用法:
  python scripts/blog_release.py gate --slug adhesive-bra-spec-guide
  python scripts/blog_release.py gate --all
  python scripts/blog_release.py build          # astro build
  python scripts/blog_release.py check --url https://charlizi.com/blog/<slug>/
  python scripts/blog_release.py ship --slug <slug>   # gate -> build -> check -> git push

设计：任何一步失败即中止，不 push。
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA_TS = os.path.join(ROOT, "src", "data", "blog-schema.ts")
BLOG_DIR = os.path.join(ROOT, "src", "pages", "blog")
DATA = os.path.join(ROOT, "data", "blog_engine")
LEDGER = os.path.join(DATA, "published_ledger.json")

AI_TELLS = [
    "in today's fast-paced", "in the ever-evolving", "it's important to note",
    "it is worth noting", "delve into", "dive into", "unlock the potential",
    "game-changer", "game changer", "seamless experience", "in conclusion",
    "in summary", "furthermore", "moreover", "navigating the", "landscape of",
    "tapestry", "testament to", "elevate your", "robust solution",
    "cutting-edge", "state-of-the-art", "synergy", "holistic", "myriad of",
    "plethora", "embark on", "at the end of the day", "when it comes to",
    "look no further", "rest assured", "we understand that",
    "our team of experts", "elevate", "revolutionize", "unparalleled",
]
FORBIDDEN_CERTS = ["ISO 14001", "WRAP certified", "GOTS certified", "SEDEX certified",
                   "ISO 9001 certified"]


# ------------------------------------------------------------------ helpers
def read(p):
    with io.open(p, encoding="utf-8") as f:
        return f.read()


def parse_schema_ts():
    """从 blog-schema.ts 抽出每个 slug 的字段（够用的正则解析）。"""
    src = read(SCHEMA_TS)
    entries = {}
    for m in re.finditer(r"\{\s*slug:\s*'([^']+)'", src):
        slug = m.group(1)
        start = m.start()
        nxt = src.find("{ slug:", m.end())
        block = src[start: nxt if nxt > 0 else len(src)]
        d = {"slug": slug}
        for key in ("headline", "description", "date", "image", "section"):
            mm = re.search(key + r":\s*'([^']*)'", block)
            if mm:
                d[key] = mm.group(1)
        mm = re.search(r"date:\s*'([^']*)'", block)
        if mm:
            d["date"] = mm.group(1)
        d["faq_count"] = len(re.findall(r"\{\s*q:", block))
        d["related_count"] = len(re.findall(r"\{\s*label:", block))
        d["keywords"] = re.findall(r"'([^']+)'", (re.search(r"keywords:\s*\[(.*?)\]", block, re.S) or type("", (), {"group": lambda s, i: ""})()).group(1))
        # 多行写法 keywords: [\n 'a', 'b',\n ] 也能抓到
        d["has_body"] = os.path.exists(os.path.join(BLOG_DIR, slug + ".astro"))
        entries[slug] = d
    return entries


def find_body(slug):
    p = os.path.join(BLOG_DIR, slug + ".astro")
    return read(p) if os.path.exists(p) else ""


# ------------------------------------------------------------------ gate
def gate(slug, verbose=True):
    """返回 (ok, fails, warns, stats)"""
    entries = parse_schema_ts()
    fails, warns = [], []
    if slug not in entries:
        return False, ["blog-schema.ts 里没有这个 slug"], [], {}
    e = entries[slug]
    body = find_body(slug)
    if not body:
        return False, ["缺少页面文件 src/pages/blog/%s.astro" % slug], [], {}

    plain = re.sub(r"<script[^>]*>.*?</script>", " ", body, flags=re.S)
    plain = re.sub(r"<[^>]+>", " ", plain)
    plain = re.sub(r"\s+", " ", plain).strip()
    words = [w for w in plain.split() if re.search(r"[A-Za-z]{2,}", w)]
    stats = {
        "words": len(words),
        "h2": len(re.findall(r"<h2", body)),
        "h3": len(re.findall(r"<h3", body)),
        "internal_links": len(set(re.findall(r'href="(/[^"#]*)"', body))),
        "faq": e.get("faq_count", 0),
        "related": e.get("related_count", 0),
        "date": e.get("date"),
    }

    # --- 1. schema 完整性
    if "BlogSchema" not in body:
        fails.append("页面未挂载 BlogSchema 组件")
    if e.get("faq_count", 0) < 4:
        fails.append("FAQ 少于 4 组（当前 %d）" % e.get("faq_count", 0))
    if "<time" not in body:
        fails.append("缺少 <time> 发布日期元素")
    if not body.count('class="breadcrumb"'):
        fails.append("缺少面包屑导航")

    # --- 2. AI 味
    low = plain.lower()
    hits = [t for t in AI_TELLS if t in low]
    if hits:
        fails.append("AI 套话命中 %d 个: %s" % (len(hits), ", ".join(sorted(set(hits))[:6])))

    # 段落等长 = 模型节奏
    paras = re.findall(r"<p[^>]*>(.*?)</p>", body, re.S)
    if len(paras) >= 4:
        lens = [len(re.sub(r"<[^>]+>", "", p)) for p in paras]
        avg = sum(lens) / len(lens)
        if avg and max(lens) / avg < 1.45:
            warns.append("段落长度过于均匀（模型味），建议制造长短句反差")
        if len(set(lens)) < len(lens) * 0.5:
            warns.append("段落长度重复度过高")

    # --- 3. 事实一致性
    for bad in FORBIDDEN_CERTS:
        if bad.lower() in low:
            fails.append("使用了未持有的认证: %s" % bad)
    if "BSCI" in plain and "OEKO" not in plain:
        warns.append("只提 BSCI 未提 OEKO-TEX，可补一处增强可信度")
    if re.search(r"\bMOQ\b", plain) and "200" not in plain:
        warns.append("提到 MOQ 但没有落具体数字（本站口径 200-300 pcs）")

    # --- 4. 结构与 GEO
    if stats["words"] < 1100:
        warns.append("正文 %d 词，建议 >= 1200" % stats["words"])
    if stats["h2"] < 3:
        warns.append("H2 少于 3 个")
    if not re.search(r"<(ul|ol)", body):
        fails.append("没有列表——GEO/AI 抓取效果差")
    if stats["internal_links"] < 3:
        warns.append("站内链接只有 %d 条，建议 >= 3" % stats["internal_links"])

    # --- 5. SEO 元数据
    if len(e.get("description", "")) > 165:
        fails.append("description %d 字符 > 165" % len(e.get("description", "")))
    if len(e.get("headline", "")) > 70:
        warns.append("headline %d 字符 > 70，可能被截断" % len(e.get("headline", "")))
    if not e.get("image"):
        fails.append("缺少头图")
    elif not os.path.exists(os.path.join(ROOT, "public", e["image"].lstrip("/"))):
        fails.append("头图文件不存在: %s" % e["image"])

    ok = not fails
    if verbose:
        print("=" * 70)
        print("GATE  %s" % slug)
        print("       %d 词 | %d H2 | %d 内链 | %d FAQ | 日期 %s" % (
            stats["words"], stats["h2"], stats["internal_links"], stats["faq"], stats["date"]))
        print("=" * 70)
        for w in warns:
            print("  ⚠  ", w)
        for f in fails:
            print("  ✗  ", f)
        print("  ✅ 通过，可发布" if ok else "  ❌ 阻断：%d 项必须修复" % len(fails))
    return ok, fails, warns, stats


# ------------------------------------------------------------------ build / check
def run(cmd, cwd=ROOT, timeout=900):
    p = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=timeout)
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def build():
    print("[1/2] astro build …")
    rc, out = run("npm run build")
    tail = "\n".join(out.strip().splitlines()[-12:])
    print(tail)
    return rc == 0


def check_live(slug):
    import urllib.request
    url = "https://charlizi.com/blog/%s/" % slug
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 charlizi-qa"})
        html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    except Exception as ex:
        print("  ✗ 无法获取 %s: %s" % (url, ex))
        return False
    checks = {
        "Article": '"Article"' in html,
        "FAQPage": '"FAQPage"' in html,
        "Breadcrumb": '"BreadcrumbList"' in html,
        "visibleFAQ": "Frequently asked questions" in html,
        "canonical": 'rel="canonical"' in html,
        "og:title": 'property="og:title"' in html,
    }
    bad = [k for k, v in checks.items() if not v]
    print("  LIVE %s %s" % (slug, checks))
    if bad:
        print("  ✗ 缺失: %s" % ", ".join(bad))
    return not bad


def ship(slugs, dry=False):
    entries = parse_schema_ts()
    gates = [(s, gate(s)) for s in slugs]
    blocked = [s for s, (ok, *_rest) in gates if not ok]
    if blocked:
        print("\n已阻断，不构建不推送: %s" % ", ".join(blocked))
        return 1
    if dry:
        print("\n--dry-run: 全过，跳过构建与推送")
        return 0
    if not build():
        print("\n构建失败，中止")
        return 1
    # 记录台账
    os.makedirs(DATA, exist_ok=True)
    ledger = {}
    if os.path.exists(LEDGER):
        ledger = json.load(io.open(LEDGER, encoding="utf-8"))
    for s in slugs:
        ledger[s] = {"shipped_at": datetime.now(timezone.utc).isoformat(),
                     "date": entries.get(s, {}).get("date")}
    json.dump(ledger, io.open(LEDGER, "w", encoding="utf-8", newline="\n"),
              ensure_ascii=False, indent=2)
    print("\n[2/2] git commit + push …")
    rc, out = run('git add -A && git commit -m "content(blog): add %s" && git push origin main'
                  % ", ".join(slugs))
    print(out.strip()[-1200:])
    return rc


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("gate"); g.add_argument("--slug"); g.add_argument("--all", action="store_true")
    b = sub.add_parser("build")
    c = sub.add_parser("check"); c.add_argument("--slug", required=True)
    s = sub.add_parser("ship"); s.add_argument("--slug", nargs="+", required=True); s.add_argument("--dry-run", action="store_true")
    l = sub.add_parser("list"); l.add_argument("--pending", action="store_true")

    a = ap.parse_args()

    if a.cmd == "gate":
        entries = parse_schema_ts()
        slugs = list(entries) if a.all else [a.slug]
        bad = 0
        for x in slugs:
            ok, fails, warns, stats = gate(x)
            if not ok:
                bad += 1
        print("\n%d/%d 通过" % (len(slugs) - bad, len(slugs)))
        sys.exit(1 if bad else 0)

    if a.cmd == "build":
        sys.exit(0 if build() else 1)

    if a.cmd == "check":
        sys.exit(0 if check_live(a.slug) else 1)

    if a.cmd == "ship":
        sys.exit(ship(a.slug, a.dry_run))

    if a.cmd == "list":
        entries = parse_schema_ts()
        print("%-34s %-12s %-6s %-6s %s" % ("SLUG", "DATE", "FAQ", "BODY", "SECTION"))
        for slug, e in sorted(entries.items(), key=lambda kv: kv[1].get("date") or ""):
            print("%-34s %-12s %-6s %-6s %s" % (
                slug, e.get("date", "?"), e.get("faq_count", 0),
                "Y" if e.get("has_body") else "N", e.get("section", "")))


if __name__ == "__main__":
    main()
