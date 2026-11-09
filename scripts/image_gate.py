# -*- coding: utf-8 -*-
"""
image_gate.py — 配图闸门

规则（来自主理人 2026-11-09 指令）：
  1. 优先用站点自有商品图（products-cards/<品类>/）
  2. D:\\文案图片素材 可用，但必须先过视觉审查：品类匹配 + 无文字水印 + 无 AI 手部畸形
  3. 头图必须与文章所属品类一致；图文不符一律不许上线

用法：
  python scripts/image_gate.py register --file <素材名> --line silicone-bras --usable yes --shot product-only --why "说明"
  python scripts/image_gate.py pick --line silicone-bras --count 1 --prefer external
  python scripts/image_gate.py audit         列出所有 usable=false 与未标注素材
"""
import argparse
import io
import json
import os
import shutil
from datetime import datetime, timezone
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "blog_engine")
INDEX = os.path.join(DATA, "images", "index.json")
IMG_OUT = os.path.join(ROOT, "public", "factory", "images")
RESPO = os.path.join(IMG_OUT, "responsive")
PRODUCTS = os.path.join(IMG_OUT, "products-cards")
EXT_SRC = r"D:\文案图片素材"

W, H = 1600, 1000

# 品类 -> 可用 shot 类型（只有这些能当配图）
ALLOWED_SHOTS = {
    "hero": {"product-only", "product-on-model", "studio"},
    "body": {"product-only", "product-on-model", "material-detail", "studio", "factory-detail"},
}
BLOCKED_SHOTS = {"consumer-howto", "before-after", "infographic", "collage-with-text"}


def load_index():
    if not os.path.exists(INDEX):
        return {"products": {}, "external": [], "review_policy": ""}
    return json.load(io.open(INDEX, encoding="utf-8"))


def save_index(idx):
    os.makedirs(DATA, exist_ok=True)
    json.dump(idx, io.open(INDEX, "w", encoding="utf-8", newline="\n"),
              ensure_ascii=False, indent=2)


def crop_16_10(src, out_name):
    im = Image.open(src).convert("RGB")
    sw, sh = im.size
    tr = W / H
    if (sw / sh) > tr:
        nw = int(sh * tr)
        l = (sw - nw) // 2
        im = im.crop((l, 0, l + nw, sh))
    else:
        nh = int(sw / tr)
        t = max(0, (sh - nh) // 2)
        im = im.crop((0, t, sw, t + nh))
    im = im.resize((W, H), Image.LANCZOS)
    os.makedirs(RESPO, exist_ok=True)
    p = os.path.join(IMG_OUT, out_name)
    im.save(p, "WEBP", quality=88, method=6)
    for w in (480, 768, 1024):
        im.resize((w, int(H * w / W)), Image.LANCZOS).save(
            os.path.join(RESPO, out_name.replace(".webp", "@%d.webp" % w)),
            "WEBP", quality=85, method=6)
    return p


def cmd_register(a):
    idx = load_index()
    if os.path.isabs(a.file):
        path = a.file
        name = os.path.basename(a.file)
    else:
        path = os.path.join(EXT_SRC, a.file)
        name = a.file
    if not os.path.exists(path):
        print("素材不存在:", path)
        return 1
    if a.usable == "yes" and a.shot in BLOCKED_SHOTS:
        print("❌ %s 属于消费端说明/拼贴类型，不能用于博客配图" % a.shot)
        return 1
    rec = {"file": name, "path": path, "bytes": os.path.getsize(path),
           "product_line": a.line, "usable": a.usable == "yes",
           "shot": a.shot, "why": a.why,
           "reviewed_at": datetime.now(timezone.utc).isoformat()}
    idx["external"] = [e for e in idx.get("external", []) if e.get("file") != name] + [rec]
    save_index(idx)
    print("已登记 %s -> %s / usable=%s / shot=%s" % (name, a.line, rec["usable"], a.shot))
    return 0


def cmd_pick(a):
    idx = load_index()
    picks = []
    # 商品图优先
    pool = []
    for f in idx.get("products", {}).get(a.line, []):
        pool.append({"file": f, "path": os.path.join(PRODUCTS, a.line, f), "src": "product"})
    if a.prefer == "external":
        for e in idx.get("external", []):
            if e.get("usable") and e.get("product_line") == a.line and e.get("shot") in ALLOWED_SHOTS["body"]:
                pool.insert(0, {"file": e["file"], "path": e["path"], "src": "external"})
    for p in pool[: a.count]:
        picks.append(p)
        print("%-8s %s" % (p["src"], os.path.basename(p["path"])))
    if not picks:
        print("❌ 品类 %s 没有可用素材" % a.line)
        return 1
    return 0


def cmd_audit(a):
    idx = load_index()
    ext = idx.get("external", [])
    usable = [e for e in ext if e.get("usable") is True]
    blocked = [e for e in ext if e.get("usable") is False]
    unknown = [e for e in ext if e.get("usable") is None]
    print("D盘素材共 %d 张 | 可用 %d | 已判不可用 %d | 未审 %d" % (
        len(ext), len(usable), len(blocked), len(unknown)))
    if unknown:
        print("\n未审（禁止使用）：")
        for e in unknown[:20]:
            print("  -", e["file"])
    if blocked:
        print("\n已判不可用：")
        for e in blocked[:20]:
            print("  - %-40s %s" % (e["file"], e.get("why", "")))
    print("\n各品类商品图：")
    for k, v in idx.get("products", {}).items():
        print("  %-16s %3d 张" % (k, len(v)))
    return 0


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    r = sub.add_parser("register")
    r.add_argument("--file", required=True)
    r.add_argument("--line", required=True)
    r.add_argument("--usable", choices=["yes", "no"], required=True)
    r.add_argument("--shot", required=True)
    r.add_argument("--why", default="")
    r.set_defaults(func=cmd_register)

    p = sub.add_parser("pick")
    p.add_argument("--line", required=True)
    p.add_argument("--count", type=int, default=1)
    p.add_argument("--prefer", choices=["product", "external"], default="product")
    p.set_defaults(func=cmd_pick)

    u = sub.add_parser("audit")
    u.set_defaults(func=cmd_audit)

    a = ap.parse_args()
    raise SystemExit(a.func(a))


if __name__ == "__main__":
    main()
