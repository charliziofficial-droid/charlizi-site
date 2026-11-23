# -*- coding: utf-8 -*-
"""
charlizi_blog_engine.py — Charlizi 博客自动化流水线

四个模块，可单独跑，也可串起来：
  1. trends     — 用 sellersprite 拿 Google/Amazon 趋势词 + 关键词商业价值
  2. topics     — 关键词 ↔ 产品线匹配，产出选题队列（去重，写入 state）
  3. images     — 从真实商品图 / D盘素材挑图 + 生成 16:10 头图与响应式变体
  4. publish    — 由选题 + 素材清单装配 .astro 页面 + schema 登记项

所有写操作都落盘到：
  data/blog_engine/state.json      选题队列 / 已发布索引
  data/blog_engine/drafts/<slug>.json   待审稿件
  data/blog_engine/images/index.json   图片库索引

用法：
  python scripts/charlizi_blog_engine.py trends --limit 40
  python scripts/charlizi_blog_engine.py topics --count 5
  python scripts/charlizi_blog_engine.py images --dry-run
  python scripts/charlizi_blog_engine.py publish --slug <slug> --dry-run
  python scripts/charlizi_blog_engine.py qa --slug <slug>
"""
import argparse
import io
import json
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "blog_engine")
STATE = os.path.join(DATA, "state.json")
IMG_INDEX = os.path.join(DATA, "images", "index.json")
DRAFTS = os.path.join(DATA, "drafts")
EXT_IMAGE_SRC = r"D:\文案图片素材"

# ---------------------------------------------------------------- 产品线定义
# brand-safe 的产品线 -> 站点路径 / 图片目录 / 关键词词根
PRODUCT_LINES = {
    "bras": {
        "label": "Bras",
        "url": "/products/bras",
        "img_dir": "products-cards/bras",
        "roots": ["underwire bra", "wirefree bra", "seamless bra", "push up bra", "balconette",
                  "t-shirt bra", "lace bra", "bralette", "bra"],
    },
    "bra-sets": {
        "label": "Bra Sets",
        "url": "/products/bra-sets",
        "img_dir": "products-cards/bra-sets",
        "roots": ["bra and panty set", "lingerie set", "matching set", "bra set"],
    },
    "plus-size-bras": {
        "label": "Plus Size Bras",
        "url": "/products/plus-size-bras",
        "img_dir": "products-cards/plus-size-bras",
        "roots": ["plus size bra", "full bust bra", "large cup bra", "dd bra", "ddd bra",
                  "full figure bra", "minimizer bra"],
    },
    "panties": {
        "label": "Panties",
        "url": "/products/panties",
        "img_dir": "products-cards/panties",
        "roots": ["panty", "panties", "thong", "g-string", "bikini brief", "seamless panty",
                  "high waist panty", "brief"],
    },
    "silicone-bras": {
        "label": "Silicone Bras",
        "url": "/products/silicone-bras",
        "img_dir": "products-cards/silicone-bras",
        "roots": ["sticky bra", "adhesive bra", "backless bra", "strapless bra", "silicone bra",
                  "nipple cover", "push up silicone"],
    },
    "shapewear": {
        "label": "Shapewear",
        "url": "/products/shapewear",
        "img_dir": "products-cards/shapewear",
        "roots": ["shapewear", "bodysuit", "tummy control", "waist trainer", "shaping slip",
                  "compression garment", "shaper"],
    },
    "camisoles": {
        "label": "Camisoles",
        "url": "/products/camisoles",
        "img_dir": "products-cards/camisoles",
        "roots": ["camisole", "cami", "tank top", "strappy top", "cami set"],
    },
    "sleepwear": {
        "label": "Sleepwear",
        "url": "/products/sleepwear",
        "img_dir": "products-cards/sleepwear",
        "roots": ["sleepwear", "nightgown", "chemise", "robe", "pajama", "loungewear"],
    },
}

# 已有 / 已规划文章的主题词，用于去重
EXISTING_TOPICS = [
    "bra anatomy", "bra set development", "panty fit", "shapewear manufacturing",
    "silicone bra manufacturing", "size grading", "wirefree vs underwire",
    "choosing bra manufacturer", "oeko-tex", "bulk vs small batch",
]

# B2B 采购意图词——只有带这些意图的词才值得写 ToB 文章
B2B_INTENT = ["manufacturer", "supplier", "factory", "wholesale", "oem", "odm", "private label",
              "vendor", "sourcing", "supply", "moq", "bulk", "custom", "china"]


# ---------------------------------------------------------------- 工具
def _ensure_dirs():
    for d in (DATA, os.path.dirname(IMG_INDEX), DRAFTS):
        os.makedirs(d, exist_ok=True)


def load_state():
    _ensure_dirs()
    if os.path.exists(STATE):
        with io.open(STATE, encoding="utf-8") as f:
            return json.load(f)
    return {
        "created": datetime.now(timezone.utc).isoformat(),
        "trend_keywords": [],
        "topic_queue": [],
        "published": [],
        "rejected": [],
    }


def save_state(st):
    _ensure_dirs()
    st["updated"] = datetime.now(timezone.utc).isoformat()
    with io.open(STATE, "w", encoding="utf-8", newline="\n") as f:
        json.dump(st, f, ensure_ascii=False, indent=2)


def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", (s or "").lower()).strip()


def slugify(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", (s or "").lower())).strip("-")


def match_product_line(keyword):
    """返回 (line_key, score)。词根命中越靠前、越长，分越高。"""
    k = norm(keyword)
    best, best_score = None, 0
    for key, cfg in PRODUCT_LINES.items():
        for i, root in enumerate(cfg["roots"]):
            if root in k:
                # 靠前的词根权重高，长词根权重高
                score = (len(cfg["roots"]) - i) * 10 + len(root)
                if score > best_score:
                    best, best_score = key, score
    return best, best_score


def is_b2b(keyword):
    k = norm(keyword)
    return any(w in k for w in B2B_INTENT)


# ToB 内容主题簇：把消费搜索词映射成 B2B 制造商视角的可写角度。
# 这样即使趋势词本身是 C 端词，也能产出有询盘价值的工厂侧文章。
def topic_angle(keyword, line):
    k = norm(keyword)
    LABEL = PRODUCT_LINES[line]["label"]
    if any(w in k for w in ["insert", "pad", "padding", "cutlet", "fillet"]):
        return ("Bra Inserts and Push-Up Pads: Sourcing the Component Behind the Shape",
                "ToB angle on insert materials, foam grades, thickness specs and how pads move unit cost")
    if any(w in k for w in ["sticky", "adhesive", "backless", "strapless", "silicone"]):
        return ("%s Manufacturing: What Buyers Get Wrong in the Spec" % LABEL,
                "ToB angle on silicone/adhesive construction, adhesive chemistry, edge thickness and wash survival")
    if any(w in k for w in ["push up", "balconette", "plunge", "jelly"]):
        return ("Inside %s Production: Cup Construction and Unit Cost" % LABEL,
                "ToB angle on cup types, push-up padding, tooling cost and how construction drives price")
    if any(w in k for w in ["minimizer", "full figure", "plus size", "large cup", "dd", "ddd"]):
        return ("%s Sourcing Guide: Grading, Wires and Size Range Risk" % LABEL,
                "ToB angle on grading above D cup, wire gauge, strap width and range ceiling")
    if any(w in k for w in ["posture", "support", "nursing", "pumping"]):
        return ("Functional %s: Building Support Structures That Survive Wear" % LABEL,
                "ToB angle on support engineering, panel structure and durability testing")
    if any(w in k for w in ["shapermint", "shapewear", "tummy", "waist"]):
        return ("%s Manufacturing: Compression, Bonding and QC" % LABEL,
                "ToB angle on compression zoning, bonded seam failure modes and process control")
    if any(w in k for w in ["lace", "mesh", "sheer"]):
        return ("Working With Lace in %s Production: Cost, Yield and QC" % LABEL,
                "ToB angle on lace sourcing, fabric yield, scallop matching and defect rates")
    if any(w in k for w in ["cotton", "seamless", "wirefree", "comfort"]):
        return ("Seamless and Wirefree %s: What Changes on the Line" % LABEL,
                "ToB angle on bonding vs stitching, support structures and grading cost")
    return ("%s Manufacturing: A Buyer's Production Guide" % LABEL,
            "General ToB manufacturing angle: components, MOQ, QC and lead time")


def is_duplicate(keyword, state):
    k = norm(keyword)
    seen = list(EXISTING_TOPICS) + [norm(t.get("keyword", "")) for t in state.get("topic_queue", [])]
    seen += [norm(t.get("keyword", "")) for t in state.get("published", [])]
    for s in seen:
        if not s:
            continue
        # 双向包含即视为重复（"bra manufacturer" vs "bra manufacturers"）
        if s in k or k in s:
            return True
    return False


# ---------------------------------------------------------------- 1. trends
def cmd_trends(args):
    """从 sellersprite MCP 拉趋势词。由 Agent 侧调用工具，本函数负责落盘与归一。"""
    _ensure_dirs()
    path = args.input
    if not path or not os.path.exists(path):
        print(json.dumps({
            "action": "need_mcp_fetch",
            "hint": "Agent 应先调用 sellersprite__aba_research_weekly / keyword_miner，"
                    "把结果 JSON 写到 data/blog_engine/raw_trends.json，再执行 trends --input",
            "expected_shape": {
                "items": [
                    {"keyword": "bra manufacturer", "searches": 1200, "purchases": 40,
                     "purchaseRate": 0.03, "bid": 0.85, "monopolyClickRate": 0.4,
                     "products": 320, "spr": 12}
                ]
            },
        }, ensure_ascii=False, indent=2))
        return 0

    with io.open(path, encoding="utf-8") as f:
        raw = json.load(f)
    items = raw.get("items") or raw.get("data") or raw
    if isinstance(items, dict):
        items = items.get("list") or items.get("records") or []

    state = load_state()
    kept = []
    for it in items:
        kw = it.get("keyword") or it.get("searchTerm") or it.get("title")
        if not kw:
            continue
        line, score = match_product_line(kw)
        if not line:
            continue
        row = {
            "keyword": kw.strip(),
            "searches": it.get("searches") or it.get("searchVolume") or 0,
            "purchases": it.get("purchases") or 0,
            "purchaseRate": it.get("purchaseRate") or 0,
            "bid": it.get("bid") or 0,
            "competition": it.get("products") or 0,
            "spr": it.get("spr") or 0,
            "product_line": line,
            "line_score": score,
            "b2b_intent": is_b2b(kw),
            "fetched": datetime.now(timezone.utc).isoformat(),
        }
        kept.append(row)

    # 综合分：需求 × 购买率 × B2B 意图，竞争度做惩罚
    for r in kept:
        demand = float(r["searches"] or 0)
        prate = float(r["purchaseRate"] or 0)
        comp = float(r["competition"] or 1) or 1
        bonus = 1.6 if r["b2b_intent"] else 1.0
        r["score"] = round((demand ** 0.5) * (1 + prate * 8) * bonus / (comp ** 0.15), 2)

    kept.sort(key=lambda x: -x["score"])
    state["trend_keywords"] = kept[: args.limit]
    save_state(state)
    print("trends: kept %d / %d (limit %d)" % (len(state["trend_keywords"]), len(kept), args.limit))
    for r in state["trend_keywords"][:15]:
        print("  %7.1f  %-42s %-16s se=%-7s b2b=%s" % (
            r["score"], r["keyword"][:42], r["product_line"], r["searches"], r["b2b_intent"]))
    return 0


# ---------------------------------------------------------------- 2. topics
def cmd_topics(args):
    state = load_state()
    pool = state.get("trend_keywords", [])
    if not pool:
        print("topics: 没有趋势词，先跑 trends")
        return 1

    picked = []
    per_line = {}
    seen_headline = {t.get("headline") for t in state.get("topic_queue", [])}
    for r in pool:
        if is_duplicate(r["keyword"], state):
            continue
        line = r["product_line"]
        if per_line.get(line, 0) >= 2:  # 单次最多 2 篇同品类，避免选题挤在一起
            continue
        headline, angle = topic_angle(r["keyword"], line)
        if headline in seen_headline:  # 同一 B2B 角度只出一条，避免两篇撞题
            continue
        seen_headline.add(headline)
        picked.append((r, headline, angle))
        per_line[line] = per_line.get(line, 0) + 1
        if len(picked) >= args.count:
            break

    for r, headline, angle in picked:
        cfg = PRODUCT_LINES[r["product_line"]]
        state["topic_queue"].append({
            "slug": slugify(headline)[:60],
            "keyword": r["keyword"],
            "headline": headline,
            "angle": angle,
            "product_line": r["product_line"],
            "product_url": cfg["url"],
            "score": r["score"],
            "status": "queued",
            "created": datetime.now(timezone.utc).isoformat(),
        })
    save_state(state)

    print("topics: queued %d" % len(picked))
    for t in state["topic_queue"][-len(picked):]:
        print("  [%s] seed=%s" % (t["product_line"], t["keyword"]))
        print("        -> %s" % t["headline"])
    return 0


# ---------------------------------------------------------------- 3. images
def cmd_images(args):
    """建立图片库索引：真实商品图 + D盘素材，标注品类，供选题配图。"""
    _ensure_dirs()
    img_root = os.path.join(ROOT, "public", "factory", "images")
    products_root = os.path.join(img_root, "products-cards")

    index = {"products": {}, "external": [], "generated": [], "built": datetime.now(timezone.utc).isoformat()}

    # 商品图：按品类目录归类
    if os.path.isdir(products_root):
        for line_key, cfg in PRODUCT_LINES.items():
            d = os.path.join(products_root, os.path.basename(cfg["img_dir"] or ""))
            if not os.path.isdir(d):
                continue
            files = [f for f in os.listdir(d) if f.lower().endswith((".webp", ".jpg", ".png"))]
            index["products"][line_key] = sorted(files)

    # D盘素材：只登记，不自动使用（需人工/规则确认与文章匹配）
    if os.path.isdir(EXT_IMAGE_SRC):
        for f in sorted(os.listdir(EXT_IMAGE_SRC)):
            if not f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                continue
            index["external"].append({
                "file": f,
                "path": os.path.join(EXT_IMAGE_SRC, f),
                "bytes": os.path.getsize(os.path.join(EXT_IMAGE_SRC, f)),
                "product_line": None,   # 待标注
                "usable": None,          # 待审：品类是否匹配
            })

    with io.open(IMG_INDEX, "w", encoding="utf-8", newline="\n") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print("images: 商品图 %d 个品类 / %d 张 | D盘素材 %d 张" % (
        len(index["products"]), sum(len(v) for v in index["products"].values()), len(index["external"])))
    for k, v in index["products"].items():
        print("  %-16s %3d 张" % (k, len(v)))
    return 0


# ---------------------------------------------------------------- 4. publish (装配)
def cmd_publish(args):
    """校验草稿是否齐全，并给出装配预览。真正的 .astro 由 Agent 按模板写入。"""
    slug = args.slug
    draft_path = os.path.join(DRAFTS, "%s.json" % slug)
    if not os.path.exists(draft_path):
        print("publish: 缺少草稿 %s" % draft_path)
        return 1
    with io.open(draft_path, encoding="utf-8") as f:
        d = json.load(f)

    required = ["slug", "headline", "shortTitle", "description", "date", "image", "imageAlt",
                "keywords", "section", "readMinutes", "related", "faq", "body_html"]
    missing = [k for k in required if not d.get(k)]
    problems = []
    if missing:
        problems.append("缺字段: %s" % ", ".join(missing))
    if d.get("description") and len(d["description"]) > 165:
        problems.append("description 太长 (%d > 160)" % len(d["description"]))
    if d.get("faq") and len(d["faq"]) < 4:
        problems.append("FAQ 少于 4 组 (%d)" % len(d["faq"]))
    if d.get("headline") and len(d["headline"]) > 70:
        problems.append("headline 超过 70 字符")
    if d.get("image") and not os.path.exists(os.path.join(ROOT, "public", d["image"].lstrip("/"))):
        problems.append("头图不存在: %s" % d["image"])

    if problems:
        print("publish: %s 未通过" % slug)
        for p in problems:
            print("   ✗", p)
        return 1

    print("publish: %s 字段齐全 ✅  可装配" % slug)
    print("   headline : %s" % d["headline"])
    print("   section  : %s" % d["section"])
    print("   images   : %s" % d["image"])
    print("   faq      : %d 组" % len(d["faq"]))
    print("   related  : %d 条" % len(d["related"]))
    return 0


# ---------------------------------------------------------------- 5. qa (发布前审查)
def cmd_qa(args):
    """发布前审查：AI 味检测 + 事实一致性 + schema 完整性。"""
    slug = args.slug
    draft_path = os.path.join(DRAFTS, "%s.json" % slug)
    if not os.path.exists(draft_path):
        print("qa: 缺少草稿 %s" % draft_path)
        return 1
    with io.open(draft_path, encoding="utf-8") as f:
        d = json.load(f)

    body = d.get("body_html") or ""
    text = re.sub(r"<[^>]+>", " ", body)
    text = re.sub(r"\s+", " ", text).strip()
    words = [w for w in text.split() if re.search(r"[A-Za-z]{2,}", w)]

    fails, warns = [], []

    # --- AI 味检测（LLM 高频套话）
    AI_TELLS = [
        "in today's fast-paced", "in the ever-evolving", "it's important to note",
        "it is worth noting", "delve into", "dive into", "unlock the potential",
        "game-changer", "game changer", "seamless experience", "in conclusion",
        "in summary", "furthermore", "moreover", "additionally,", "navigating the",
        "landscape of", "tapestry", "testament to", "elevate your", "empower",
        "robust solution", "cutting-edge", "state-of-the-art", "leverage",
        "synergy", "holistic", "myriad of", "plethora", "embark on",
        "at the end of the day", "when it comes to", "look no further",
        "rest assured", "we understand that", "our team of experts",
    ]
    low = text.lower()
    hits = [t for t in AI_TELLS if t in low]
    if hits:
        fails.append("AI 套话命中 %d 个: %s" % (len(hits), ", ".join(hits[:6])))

    # 段落全部等长 → 典型的模型输出节奏
    paras = [p for p in re.split(r"</p>", body) if p.strip()]
    if len(paras) >= 4:
        lens = [len(re.sub(r"<[^>]+>", "", p)) for p in paras]
        avg = sum(lens) / len(lens)
        if avg and max(lens) / avg < 1.45:
            warns.append("段落长度过于均匀（模型味），建议制造长短句反差")

    # 第一句不能是"XX is a ..."的定义句堆砌
    first = text.split(".")[0]
    if re.match(r"^[A-Z][a-z]+ (is|are) (a|an|the) ", first):
        warns.append("首句是定义模板句，建议换成工厂现场视角")

    # --- 事实一致性（品牌硬数据）
    if "200" not in text and "MOQ" in text:
        warns.append("提到 MOQ 但未出现 200 pcs 的具体数字")
    for bad in ["ISO 14001", "WRAP certified", "GOTS certified", "SEDEX certified"]:
        if bad.lower() in low:
            fails.append("使用了未持有的认证: %s" % bad)

    # --- 长度 / 结构
    if len(words) < 900:
        warns.append("正文只有 %d 词，建议 ≥ 1200 词" % len(words))
    if body.count("<h2") < 3:
        warns.append("H2 少于 3 个，结构过平")
    if not re.search(r"<(ul|ol)", body):
        warns.append("没有列表，GEO 抓取效果差")

    # --- 内链
    internal = re.findall(r'href="(/[^"]*)"', body)
    if len(internal) < 2:
        warns.append("站内链接少于 2 条")

    print("=" * 62)
    print("QA  %s   (%d 词, %d 段, %d H2, %d 内链)" % (
        slug, len(words), len(paras), body.count("<h2"), len(internal)))
    print("=" * 62)
    for w in warns:
        print("  ⚠ ", w)
    for f in fails:
        print("  ✗ ", f)
    if not fails:
        print("  ✅ 无阻断问题" if not warns else "  ✅ 可发布（有提醒项）")
    return 1 if fails else 0


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("trends"); p.add_argument("--input"); p.add_argument("--limit", type=int, default=40)
    p.set_defaults(func=cmd_trends)

    p = sub.add_parser("topics"); p.add_argument("--count", type=int, default=5)
    p.set_defaults(func=cmd_topics)

    p = sub.add_parser("images"); p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_images)

    p = sub.add_parser("publish"); p.add_argument("--slug", required=True); p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_publish)

    p = sub.add_parser("qa"); p.add_argument("--slug", required=True)
    p.set_defaults(func=cmd_qa)

    args = ap.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
