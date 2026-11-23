# -*- coding: utf-8 -*-
"""
gen_titles.py — 为 charlizi 站点 68 个 style 生成 SEO/GEO 标题
主理人规格（2026-11-23 09:11）：`Wine Red Underwire Bra & Thong Set —YS2900#`
即：【卖点 + 功能 + 词库/趋势热词】+ ` —{款号}#`

输入：
  src/data/product-style-content.ts  站点现有 68 款（slug/title/baseTitle/category/specs/attrs）
  src/data/quotation.json            报价表结构化数据（有款号，但缺映射）
  data/kw_database.sqlite            关键词库（B2B 意图词）

输出：
  src/data/style-titles.json         每款的新标题 + SEO title + description
  src/data/style-code-map.json       款号↔slug 映射骨架（待人工补全）
"""
import sys, os, re, json, sqlite3

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_TITLES = os.path.join(BASE, 'src', 'data', 'style-titles.json')
OUT_MAP = os.path.join(BASE, 'src', 'data', 'style-code-map.json')
KWDB = os.path.join(os.path.dirname(BASE), 'data', 'kw_database.sqlite')

# ---- B2B 采购意图词库（批发站应该抢的词，不是零售词）----
# 说明：站是工厂批发站，"bras for women"（210万搜索）是零售词，
#   引来的是买1件的消费者，零转化。必须用采购意图词。
B2B_MODIFIERS = {
    'default': ['OEM', 'Private Label', 'Wholesale', 'Custom Manufacturer'],
    'bra-sets': ['OEM Bra Set Manufacturer', 'Private Label Lingerie Set', 'Wholesale Bra Panty Set'],
    'bras': ['OEM Bra Manufacturer', 'Private Label Bra', 'Wholesale Bras'],
    'plus-size-bras': ['Plus Size Bra Manufacturer', 'OEM Full Figure Bra', 'Custom Plus Size Lingerie'],
    'silicone-bras': ['Silicone Bra Manufacturer', 'Adhesive Bra OEM', 'Custom Sticky Bra'],
    'panties': ['OEM Panties Manufacturer', 'Private Label Underwear', 'Wholesale Panties'],
    'camisoles': ['OEM Camisole Manufacturer', 'Private Label Cami Top', 'Wholesale Camisoles'],
    'us-stock': ['US Stock Wholesale', 'Ready to Ship Lingerie'],
    'sleepwear': ['OEM Sleepwear Manufacturer', 'Private Label Pajama Set'],
    'shapewear': ['Shapewear OEM Manufacturer', 'Custom Shapewear Wholesale'],
}

# 卖点/功能 词表：从 spec 与 attrs 提炼英文功能短语
FEATURE_RULES = [
    (r'underwire|钢圈', 'Underwire'),
    (r'wireless|no underwire|无钢圈', 'Wireless'),
    (r'push.?up|聚拢', 'Push Up'),
    (r'padded|有衬垫|衬垫', 'Padded'),
    (r'unpadded|无衬垫', 'Unpadded'),
    (r'full.?coverage|全罩', 'Full Coverage'),
    (r'plus.?size|大码', 'Plus Size'),
    (r'lace|蕾丝', 'Lace'),
    (r'mesh|网纱', 'Mesh'),
    (r'sheer|透明', 'Sheer'),
    (r'seamless|无缝', 'Seamless'),
    (r'strapless|无肩带', 'Strapless'),
    (r'halter|挂脖', 'Halter'),
    (r'backless|露背', 'Backless'),
    (r'bralette|无衬垫轻薄', 'Bralette'),
    (r'high.?waist|高腰', 'High Waist'),
    (r'thong|丁字', 'Thong'),
    (r'briefs?|三角', 'Briefs'),
    (r'bodysuit|连体', 'Bodysuit'),
    (r'teddy', 'Teddy'),
    (r'adhesive|sticky|硅胶|隐形', 'Adhesive'),
    (r'shapewear|塑身', 'Shapewear'),
    (r'deep.?[uv]|深V|深U', 'Deep V'),
    (r'front.?closure|前扣', 'Front Closure'),
    (r'multiway|多way', 'Multiway'),
    (r'camisole|cami', 'Camisole'),
]

COLOR_WORDS = ['Wine Red', 'Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Nude',
               'Beige', 'Purple', 'Yellow', 'Grey', 'Gray', 'Burgundy', 'Coral',
               'Rose', 'Ivory', 'Navy', 'Brown', 'Gold', 'Silver', 'Floral', 'Leopard']


def read_styles():
    """从 TS 文件读 68 个 style 的基础信息"""
    src_path = os.path.join(BASE, 'src', 'data', 'product-style-content.ts')
    src = open(src_path, encoding='utf-8').read()
    out = []
    for m in re.finditer(r'\{\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"baseTitle":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', src):
        slug, title, base, cat = m.groups()
        # 抓这个块内的 specs / attrs（到下一个 "slug" 为止）
        start = m.end()
        nxt = src.find('"slug":', start)
        chunk = src[start: nxt if nxt > 0 else start + 6000]
        specs = re.findall(r'"label":\s*"([^"]+)",\s*"value":\s*"([^"]+)"', chunk)
        attrs = re.findall(r'"attrs":\s*\[(.*?)\]', chunk, re.S)
        attr_list = re.findall(r'"([^"]+)"', attrs[0]) if attrs else []
        out.append({'slug': slug, 'title': title, 'baseTitle': base,
                    'category': cat, 'specs': specs, 'attrs': attr_list})
    return out


def extract_colors(title):
    return [c for c in COLOR_WORDS if c.lower() in title.lower()]


def extract_features(style):
    """从 title + specs + attrs 提炼功能词，去重保序"""
    blob = ' '.join([style['title'], ' '.join(f'{k} {v}' for k, v in style['specs']),
                     ' '.join(style['attrs'])])
    got = []
    for pat, word in FEATURE_RULES:
        if re.search(pat, blob, re.I) and word not in got:
            got.append(word)
    return got


def strip_color(title, colors):
    t = title
    for c in colors:
        t = re.sub(re.escape(c), '', t, flags=re.I)
    # ??????????? / ??????? 'Bra Set (Black)' ? 'Bra Set ()'?
    t = re.sub(r'\(\s*[-&,/]?\s*\)', '', t)
    t = re.sub(r'\[\s*[-&,/]?\s*\]', '', t)
    t = re.sub(r'\s*[-&,/]\s*(?=[-&,/]|$)', '', t)
    return re.sub(r'\s+', ' ', t).strip(' -&,')


def build_title(style, code=None):
    """???{??}{??}{?????} ?{??}#
    ??????Wine Red Underwire Bra & Thong Set ?YS2900#
    """
    cat = style["category"]
    colors = extract_colors(style["title"])
    feats = extract_features(style)
    bare = strip_color(style["title"], colors)

    CORE = {
        "bra-sets": "Bra & Panty Set", "bras": "Bra", "plus-size-bras": "Plus Size Bra",
        "silicone-bras": "Silicone Adhesive Bra", "panties": "Panties",
        "camisoles": "Camisole", "us-stock": "Lingerie Set", "sleepwear": "Sleepwear Set",
        "shapewear": "Shapewear",
    }
    core = CORE.get(cat, "Lingerie")

    # ???? baseTitle ???????????????????????
    if bare and 3 <= len(bare) <= 62:
        head = bare
    else:
        head = " ".join(([colors[0]] if colors else []) + feats[:3] + [core])
    # ??????????????????????????
    if colors and colors[0].lower() not in head.lower():
        head = colors[0] + " " + head
    head = head.strip(" -&,")
    head = head[:1].upper() + head[1:] if head else core

    title = head
    if code:
        title = title + " \u2014" + code + "#"
    return title, colors, feats


def seo_meta(style, new_title):
    """SEO title ≤60 字符偏好，description ≤155"""
    cat = style['category']
    mod = B2B_MODIFIERS.get(cat, B2B_MODIFIERS['default'])[0]
    base = re.sub(r'\s*\u2014[^#]*#$', '', new_title).strip()
    # ??? B2B ???????????????????????
    SHORT = {'bra-sets': 'OEM Bra Set', 'bras': 'OEM Bra', 'plus-size-bras': 'OEM Plus Size Bra',
             'silicone-bras': 'OEM Silicone Bra', 'panties': 'OEM Panties',
             'camisoles': 'OEM Camisole', 'us-stock': 'Wholesale', 'sleepwear': 'OEM Sleepwear',
             'shapewear': 'OEM Shapewear'}
    short = SHORT.get(cat, 'OEM')
    if len(base) + 1 + len(mod) <= 60:
        seo = f'{base} {mod}'
    elif len(base) + 1 + len(short) <= 60:
        seo = f'{base} {short}'
    else:
        seo = base
    desc = (f'{base} from a BSCI & OEKO-TEX certified OEM factory. '
            f'Custom fabric, colour and sizing. MOQ 200 pcs. Request a wholesale quote.')
    if len(desc) > 158:
        desc = desc[:155].rsplit(' ', 1)[0] + '.'
    return seo, desc


def main():
    styles = read_styles()
    print(f'read {len(styles)} styles from product-style-content.ts')

    # 款号映射骨架：只识别 slug 里天然含有的款号，其余留空待人工
    code_map = {}
    for s in styles:
        m = re.search(r'([a-z]{1,3}\d{3,5})', s['slug'], re.I)
        code = m.group(1).upper() if m else None
        code_map[s['slug']] = {
            'category': s['category'],
            'siteTitle': s['title'],
            'code': code,
            'source': 'slug-embedded' if code else 'NEEDS_MANUAL_MAPPING',
        }
    mapped = sum(1 for v in code_map.values() if v['code'])
    print(f'code map: {mapped}/{len(styles)} auto-detected, {len(styles)-mapped} need manual mapping')

    titles = {}
    for s in styles:
        code = code_map[s['slug']]['code']
        nt, colors, feats = build_title(s, code)
        seo, desc = seo_meta(s, nt)
        titles[s['slug']] = {
            'category': s['category'],
            'oldTitle': s['title'],
            'newTitle': nt,
            'seoTitle': seo,
            'seoDescription': desc,
            'code': code,
            'colors': colors,
            'features': feats,
        }

    os.makedirs(os.path.dirname(OUT_TITLES), exist_ok=True)
    json.dump(titles, open(OUT_TITLES, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    json.dump(code_map, open(OUT_MAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'WROTE {OUT_TITLES}')
    print(f'WROTE {OUT_MAP}')

    print('\n--- sample titles ---')
    for slug, v in list(titles.items())[:10]:
        print(f"  [{v['category']:14s}] {v['newTitle']}")
        print(f"      seo: {v['seoTitle']}  ({len(v['seoTitle'])}c)")
    return 0


if __name__ == '__main__':
    sys.exit(main())
