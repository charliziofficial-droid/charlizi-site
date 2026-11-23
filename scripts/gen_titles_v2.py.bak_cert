# -*- coding: utf-8 -*-
"""
gen_titles_v2.py — charlizi 标题生成（v2：批发意图为主 + 零售词为辅 + 款号收尾）

主理人规格（2026-11-23 09:17）：
  1. 批发采购意图为主：OEM / Private Label / Wholesale / Manufacturer
  2. 零售词为辅：谷歌热词 / 亚马逊大词
  3. 款号为主 — 放在标题最后，格式 `—{CODE}#`

最终标题形态：
  {颜色} {功能} {品类核心词} — {Wholesale/OEM 修饰} — {CODE}#

  示例：
  Wine Red Underwire Bra & Thong Set — Wholesale OEM Manufacturer — YS2900#

设计取舍（重要）：
  - 站点是【工厂批发站】，不是零售店。零售大词（bras for women 210万）引来的是
    买1件的消费者，零转化。所以零售词只做「辅助修饰」，绝不能做标题主干。
  - 主干 = 颜色 + 功能 + 品类（这是买家判断"这是不是我要的货"的依据）
  - 中段 = 批发意图词（这是买家判断"你是不是我要找的供应商"的依据）
  - 尾部 = 款号（买家询价时报型号，也便于内部对照报价表）

输入：src/data/product-style-content.ts + src/data/style-code-map.json
输出：src/data/style-titles-v2.json
"""
import sys, os, re, json

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(BASE, 'src', 'data', 'product-style-content.ts')
CODEMAP = os.path.join(BASE, 'src', 'data', 'style-code-map.json')
OUT = os.path.join(BASE, 'src', 'data', 'style-titles-v2.json')

# 品类核心词
CORE = {
    'bra-sets': 'Bra & Panty Set',
    'bras': 'Bra',
    'plus-size-bras': 'Plus Size Bra',
    'silicone-bras': 'Silicone Adhesive Bra',
    'panties': 'Panties',
    'camisoles': 'Camisole',
    'us-stock': 'Lingerie Set',
    'sleepwear': 'Sleepwear Set',
    'shapewear': 'Shapewear',
}

# 批发意图词（主词）—— 按品类微调，让它自然
WHOLESALE_MAIN = {
    'bra-sets': 'Wholesale OEM Manufacturer',
    'bras': 'Wholesale OEM Bra Manufacturer',
    'plus-size-bras': 'Wholesale Plus Size OEM',
    'silicone-bras': 'Wholesale OEM Supplier',
    'panties': 'Wholesale OEM Manufacturer',
    'camisoles': 'Wholesale OEM Manufacturer',
    'us-stock': 'Wholesale Ready Stock',
    'sleepwear': 'Wholesale OEM Manufacturer',
    'shapewear': 'Wholesale OEM Manufacturer',
}

# 批发意图词（短版，标题太长时降级）
WHOLESALE_SHORT = {
    'bra-sets': 'Wholesale OEM',
    'bras': 'OEM Wholesale',
    'plus-size-bras': 'OEM Wholesale',
    'silicone-bras': 'OEM Wholesale',
    'panties': 'Wholesale OEM',
    'camisoles': 'Wholesale OEM',
    'us-stock': 'Wholesale Stock',
    'sleepwear': 'Wholesale OEM',
    'shapewear': 'Wholesale OEM',
}

# 零售辅助词（辅）—— 亚马逊/谷歌真实高频词，用于补充长尾，不占主干
RETAIL_AUX = {
    'bra-sets': 'Lingerie Set for Women',
    'bras': 'Bras for Women',
    'plus-size-bras': 'Plus Size Bras for Women',
    'silicone-bras': 'Sticky Bra for Women',
    'panties': 'Underwear for Women',
    'camisoles': 'Cami Top for Women',
    'us-stock': 'Lingerie for Women',
    'sleepwear': 'Sleepwear for Women',
    'shapewear': 'Shapewear for Women',
}

FEATURE_RULES = [
    (r'underwire|钢圈', 'Underwire'),
    (r'wireless|no underwire|wirefree|无钢圈', 'Wireless'),
    (r'push.?up|聚拢', 'Push Up'),
    (r'unpadded|unlined|无衬垫', 'Unpadded'),
    (r'padded|moulded|molded|衬垫', 'Padded'),
    (r'full.?coverage|全罩', 'Full Coverage'),
    (r'plus.?size|大码', 'Plus Size'),
    (r'lace|蕾丝', 'Lace'),
    (r'mesh|网纱', 'Mesh'),
    (r'sheer|transparent|透明', 'Sheer'),
    (r'seamless|无缝', 'Seamless'),
    (r'strapless|无肩带', 'Strapless'),
    (r'halter|挂脖', 'Halter'),
    (r'backless|露背', 'Backless'),
    (r'bralette', 'Bralette'),
    (r'high.?waist|高腰', 'High Waist'),
    (r'thong|丁字', 'Thong'),
    (r'briefs?|三角', 'Briefs'),
    (r'bodysuit|连体', 'Bodysuit'),
    (r'teddy', 'Teddy'),
    (r'adhesive|sticky|silicone|硅胶|隐形', 'Adhesive'),
    (r'shapewear|塑身', 'Shapewear'),
    (r'deep.?[vu]|深[VU]|v.?neck', 'Deep V'),
    (r'front.?(closure|clasp)|前扣', 'Front Closure'),
    (r'multiway|multi.?way', 'Multiway'),
    (r'camisole|cami', 'Camisole'),
    (r'cotton|棉', 'Cotton'),
    (r'satin|缎', 'Satin'),
    (r'leopard|豹纹', 'Leopard'),
    (r'print|印花', 'Print'),
    (r'floral|flower', 'Floral'),
    (r'scallop|波浪', 'Scalloped'),
    (r'bandeau', 'Bandeau'),
    (r'slip|吊带裙', 'Slip'),
    (r'pajama|睡衣', 'Pajama'),
    (r'nightdress|睡裙', 'Nightdress'),
    (r'safety shorts', 'Safety Shorts'),
    (r'nipple cover|乳贴', 'Nipple Cover'),
    (r'petal', 'Petal'),
]

COLORS = ['Wine Red', 'Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Nude',
          'Beige', 'Purple', 'Yellow', 'Grey', 'Gray', 'Burgundy', 'Coral',
          'Rose', 'Ivory', 'Navy', 'Brown', 'Gold', 'Silver', 'Floral', 'Leopard',
          'Cheetah', 'Neon']


def read_site():
    src = open(SITE, encoding='utf-8').read()
    out = []
    for m in re.finditer(r'\{\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"baseTitle":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', src):
        slug, title, base, cat = m.groups()
        start = m.end()
        nxt = src.find('"slug":', start)
        chunk = src[start: nxt if nxt > 0 else start + 8000]
        specs = re.findall(r'"label":\s*"([^"]+)",\s*"value":\s*"([^"]+)"', chunk)
        out.append({'slug': slug, 'title': title, 'baseTitle': base,
                    'category': cat, 'specs': specs})
    return out


def extract_colors(text):
    found = []
    for c in COLORS:
        if re.search(r'\b' + re.escape(c) + r'\b', text, re.I):
            found.append(c)
    return found


def extract_features(text):
    got = []
    for pat, word in FEATURE_RULES:
        if re.search(pat, text, re.I) and word not in got:
            got.append(word)
    return got


def strip_colors(title, colors):
    t = title
    for c in colors:
        t = re.sub(r'\b' + re.escape(c) + r'\b', '', t, flags=re.I)
    # 清残留符号：'Set (Black)' → 'Set'；'Set ()' → 'Set'
    t = re.sub(r'\(\s*[-&,/]?\s*\)', '', t)
    t = re.sub(r'\[\s*[-&,/]?\s*\]', '', t)
    t = re.sub(r'\s*[-&,/]\s*(?=[-&,/]|$)', '', t)
    return re.sub(r'\s+', ' ', t).strip(' -&,')


def build(style, code):
    cat = style["category"]
    blob = style["title"] + " " + " ".join(str(k) + " " + str(v) for k, v in style["specs"])
    colors = extract_colors(blob)
    feats = extract_features(blob)

    core = CORE.get(cat, "Lingerie")
    core_words = set(w.lower() for w in re.findall(r"[A-Za-z]+", core))

    # ????????????????
    MUTEX = [("Underwire", "Wireless"), ("Padded", "Unpadded")]
    def conflict(word, chosen):
        for x, y in MUTEX:
            if word == x and y in chosen:
                return True
            if word == y and x in chosen:
                return True
        return False

    # ?? title ??????????????Half Cup / 2 Pairs / 4 Color Pack / Off Shoulder ??
    KEEP = [r"half cup", r"full cup", r"1/4 cup", r"off shoulder", r"cold shoulder",
            r"\d+\s*pairs?", r"\d+\s*color pack", r"\d+\s*pack", r"multipack",
            r"strappy", r"scallop\w*", r"criss.?cross", r"lace.?up", r"keyhole",
            r"lifting", r"\bwith\s+strap\b", r"adjustable strap", r"comfort"]
    keepers = []
    for pat in KEEP:
        m = re.search(pat, style["title"], re.I)
        if m:
            w = m.group(0)
            if re.search(r"\bstrap\b", w, re.I):
                if re.search(r"\bstrappy\b", style["title"], re.I):
                    continue
                w = "Adjustable Strap"
            w = w[:1].upper() + w[1:]
            if w.lower() not in [k.lower() for k in keepers]:
                keepers.append(w)

    picked = []
    # ?????????????2??????????
    for k in keepers[:2]:
        kw = " ".join(x.capitalize() if x.islower() else x for x in k.split())
        if kw.lower() not in core_words:
            picked.append(kw)
    # ?????
    for f in feats:
        if f.lower() in core_words or f in picked or conflict(f, picked):
            continue
        picked.append(f)
        if len(picked) >= 3:
            break

    trunk_parts = []
    if colors:
        trunk_parts.append(colors[0])
    trunk_parts.extend(picked)
    # ????? Plus Size ??? "Plus Size Plus Size"
    if cat == "plus-size-bras":
        ps = [i for i, x in enumerate(trunk_parts) if x.lower() == "plus size"]
        for i in reversed(ps[1:]):
            trunk_parts.pop(i)
    trunk_parts.append(core)
    # ???????
    # ????????????? 'Half Cup Cup'?'Plus Size Plus Size'
    seen_words = set()
    out_parts = []
    for x in trunk_parts:
        words = [w for w in x.split() if w.lower() not in seen_words]
        if not words:
            continue
        for w in words:
            seen_words.add(w.lower())
        out_parts.append(" ".join(words))
    trunk = " ".join(out_parts)

    ws = WHOLESALE_MAIN.get(cat, "Wholesale OEM Manufacturer")

    def assemble(mid):
        t = trunk + " \u2014 " + mid
        if code:
            t = t + " \u2014 " + str(code) + "#"
        return t

    title = assemble(ws)
    if len(title) > 110:
        title = assemble(WHOLESALE_SHORT.get(cat, "Wholesale OEM"))

    return {
        "trunk": trunk,
        "wholesale": ws,
        "colors": colors,
        "features": picked,
        "title": title,
    }


def seo_pair(style, built, code):
    """SEO title ≤60；description ≤158。SEO title 里批发词优先，零售词占位不足时才补。"""
    cat = style['category']
    trunk = built['trunk']
    ws_short = WHOLESALE_SHORT.get(cat, 'Wholesale OEM')
    retail = RETAIL_AUX.get(cat, 'for Women')

    # SEO title：主干 + 批发短词 + 款号（款号为主，必须进 SEO title）
    code_tag = (' ' + str(code) + '#') if code else ''
    candidates = [
        trunk + ' ' + ws_short + code_tag,
        trunk + code_tag,
        trunk + ' OEM' + code_tag,
        (trunk[:max(10, 60 - len(code_tag))] + code_tag) if code else trunk,
        trunk,
    ]
    seo = next((c for c in candidates if len(c) <= 62), trunk[:60])

    # JSON-LD name：批发主词 + 款号（结构化数据里型号要完整）
    ld_name = f'{trunk} \u2014 {WHOLESALE_MAIN.get(cat, "Wholesale OEM")}'
    if code:
        ld_name += f' \u2014 {code}#'

    # description：批发为主句，零售词做自然补充
    desc = (f'{trunk} from our own Guangdong factory. OEM & private label welcome, '
            f'custom fabric/colour/size. MOQ 200. BSCI & OEKO-TEX. Request wholesale quote.')
    if len(desc) > 158:
        desc = desc[:155].rsplit(' ', 1)[0] + '.'
    return seo, desc, ld_name, retail


def main():
    styles = read_site()
    cmap = json.load(open(CODEMAP, encoding='utf-8')) if os.path.exists(CODEMAP) else {}
    # 允许人工确认表覆盖（style-code-confirmed.json 优先）
    confirmed_path = os.path.join(BASE, 'src', 'data', 'style-code-confirmed.json')
    confirmed = json.load(open(confirmed_path, encoding='utf-8')) if os.path.exists(confirmed_path) else {}

    out = {}
    n_code = 0
    for s in styles:
        code = confirmed.get(s['slug']) or (cmap.get(s['slug']) or {}).get('code')
        b = build(s, code)
        seo, desc, ld, retail = seo_pair(s, b, code)
        if code:
            n_code += 1
        out[s['slug']] = {
            'category': s['category'],
            'oldTitle': s['title'],
            'newTitle': b['title'],
            'trunk': b['trunk'],
            'wholesaleTerm': b['wholesale'],
            'retailAux': retail,
            'code': code,
            'colors': b['colors'],
            'features': b['features'],
            'seoTitle': seo,
            'seoDescription': desc,
            'ldName': ld,
            'hasCode': bool(code),
        }

    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'WROTE {OUT}')
    print(f'标题带款号: {n_code}/{len(out)}  (其余待候选表确认)')

    over = [(k, v['newTitle'], len(v['newTitle'])) for k, v in out.items() if len(v['newTitle']) > 110]
    print(f'标题 >110 字符: {len(over)}')
    for x in over[:5]:
        print('   ', x[2], x[1])

    print('\n=== 样例（每品类 2 条）===')
    seen = {}
    for slug, v in out.items():
        cat = v['category']
        seen.setdefault(cat, [])
        if len(seen[cat]) < 2:
            seen[cat].append(v)
    for cat, lst in seen.items():
        print(f'\n[{cat}]')
        for v in lst:
            print(f"  old: {v['oldTitle']}")
            print(f"  new: {v['newTitle']}")
            print(f"  seo: {v['seoTitle']}  ({len(v['seoTitle'])}c)")
    return 0


if __name__ == '__main__':
    sys.exit(main())
