# -*- coding: utf-8 -*-
"""
gen_titles_extra.py — 为 styleExtra 的 70 个「款号即 slug」页面生成标题

背景（关键发现 2026-11-23）：
  styleExtra 里有 70 个页面，slug 本身就是款号（b6043 / a5032 / 1340 ...），
  标题却是 "Bra B6043" 这种占位串，内容全是模板话术。
  其中 11 个能直接在报价表找到真实数据（颜色/尺码/材质/属性）。

策略：
  - 能对上报价表的（11 个）：用真实属性生成标题，信息量最高
  - 对不上的（59 个）：用 slug 里能解析出的品类 + 款号生成，不编造卖点

输出：src/data/style-titles-extra.json（结构与 style-titles-v2.json 一致，便于同一覆盖层使用）
"""
import sys, os, re, json

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTRA = os.path.join(BASE, 'src', 'data', 'product-style-content-extra.ts')
QUOTE = os.path.join(BASE, 'src', 'data', 'quotation.json')
OUT = os.path.join(BASE, 'src', 'data', 'style-titles-extra.json')

CORE = {
    'bra-sets': 'Bra & Panty Set', 'bras': 'Bra', 'plus-size-bras': 'Plus Size Bra',
    'silicone-bras': 'Silicone Adhesive Bra', 'panties': 'Panties',
    'camisoles': 'Camisole', 'us-stock': 'Lingerie Set', 'sleepwear': 'Sleepwear Set',
    'shapewear': 'Shapewear',
}
WHOLESALE_MAIN = {
    'bra-sets': 'Wholesale OEM Manufacturer', 'bras': 'Wholesale OEM Bra Manufacturer',
    'plus-size-bras': 'Wholesale Plus Size OEM', 'silicone-bras': 'Wholesale OEM Supplier',
    'panties': 'Wholesale OEM Manufacturer', 'camisoles': 'Wholesale OEM Manufacturer',
    'us-stock': 'Wholesale Ready Stock', 'sleepwear': 'Wholesale OEM Manufacturer',
    'shapewear': 'Wholesale OEM Manufacturer',
}
WHOLESALE_SHORT = {
    'bra-sets': 'Wholesale OEM', 'bras': 'OEM Wholesale', 'plus-size-bras': 'OEM Wholesale',
    'silicone-bras': 'OEM Wholesale', 'panties': 'Wholesale OEM', 'camisoles': 'Wholesale OEM',
    'us-stock': 'Wholesale Stock', 'sleepwear': 'Wholesale OEM', 'shapewear': 'Wholesale OEM',
}

# 中文属性 → 英文（报价表 property 字段）
PROP_MAP = [
    (r'钢圈', 'Underwire'), (r'无钢圈', 'Wireless'),
    (r'衬垫', 'Padded'), (r'无衬垫', 'Unpadded'),
    (r'前扣|前排扣|front.?clos', 'Front Closure'),
    (r'聚拢|push.?up', 'Push Up'),
    (r'蕾丝|lace', 'Lace'),
    (r'网纱|mesh', 'Mesh'),
    (r'棉|cotton', 'Cotton'),
]

# ???? -> ????????????? 48 ????
COLOR_MAP = {
    "黑色": "Black", "黑": "Black", "黑粉色": "Black Pink", "黑白": "Black White", "黑色灰色粉色": "Black Grey Pink",
    "白色": "White", "白": "White", "白紫色": "White Purple", "白蓝色": "White Blue",
    "红色": "Red", "红": "Red", "大红": "Red", "枣红色": "Burgundy", "酒红色": "Burgundy", "酒红": "Burgundy",
    "蓝色": "Blue", "蓝": "Blue", "藏青": "Navy",
    "绿色": "Green", "绿": "Green", "绿灰色": "Green Grey",
    "粉色": "Pink", "粉": "Pink", "浅粉色": "Light Pink", "玫瑰粉": "Rose Pink", "西瓜粉": "Watermelon Pink", "花粉色": "Floral Pink",
    "肤色": "Nude", "肤": "Nude", "杏色": "Apricot", "咖色": "Coffee", "焦糖色": "Caramel", "焦糖": "Caramel", "棕": "Brown",
    "灰色": "Grey", "灰": "Grey", "浅灰色": "Light Grey",
    "紫色": "Purple", "浅紫色": "Light Purple",
    "黄色": "Yellow", "黄": "Yellow", "姜黄色": "Ginger Yellow",
    "豹纹": "Leopard", "印花": "Print", "花色": "Floral",
    "豆沙": "Bean Paste", "玫瑰": "Rose", "玫红": "Rose Red",
    "香槟色": "Champagne", "大地色": "Earth Tone", "如图": None,
}
def read_extra():
    src = open(EXTRA, encoding='utf-8').read()
    out = []
    for m in re.finditer(r'"([a-z-]+/[^"]+)":\s*\{\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"baseTitle":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', src):
        key, slug, title, base, cat = m.groups()
        start = m.end()
        nxt = src.find('"slug":', start)
        chunk = src[start: nxt if nxt > 0 else start + 9000]
        specs = re.findall(r'"label":\s*"([^"]+)",\s*"value":\s*"([^"]+)"', chunk)
        out.append({'key': key, 'slug': slug, 'title': title, 'baseTitle': base,
                    'category': cat, 'specs': specs})
    return out


def load_quote():
    q = json.load(open(QUOTE, encoding='utf-8'))
    m = {}
    for cid, cat in q['categories'].items():
        for st in cat['styles']:
            m[str(st['code']).strip().upper()] = dict(st, _cat=cid)
    return m


def feats_from_property(prop):
    if not prop:
        return []
    got = []
    for pat, word in PROP_MAP:
        if re.search(pat, prop, re.I) and word not in got:
            got.append(word)
    # 互斥处理：Wireless 优先于 Underwire，Unpadded 优先于 Padded（报价表里写的是实际构造）
    if 'Wireless' in got and 'Underwire' in got:
        got.remove('Underwire')
    if 'Unpadded' in got and 'Padded' in got:
        got.remove('Padded')
    return got


def zh_colors_to_en(colors):
    out = []
    for c in colors or []:
        c = str(c)
        # 拆分多色
        for piece in re.split(r'[+，,/、\s]+', c):
            piece = piece.strip()
            if not piece:
                continue
            if piece in COLOR_MAP:
                e = COLOR_MAP[piece]
                if e not in out:
                    out.append(e)
    return out


def build_title(rec, qrec):
    cat = rec['category']
    code = str(rec['slug']).upper()
    core = CORE.get(cat, 'Lingerie')
    ws = WHOLESALE_MAIN.get(cat, 'Wholesale OEM Manufacturer')

    parts = []
    if qrec:
        # 有真实数据：颜色 + 属性 + 核心词
        ens = zh_colors_to_en(qrec.get('colors'))
        if ens:
            parts.append(ens[0])
        parts.extend(feats_from_property(qrec.get('property'))[:3])
    parts.append(core)

    # 全局词级去重
    seen, kept = set(), []
    for x in parts:
        words = [w for w in x.split() if w.lower() not in seen]
        if not words:
            continue
        for w in words:
            seen.add(w.lower())
        kept.append(' '.join(words))
    trunk = ' '.join(kept)

    def assemble(mid):
        return f'{trunk} \u2014 {mid} \u2014 {code}#'

    title = assemble(ws)
    if len(title) > 110:
        title = assemble(WHOLESALE_SHORT.get(cat, 'Wholesale OEM'))
    return trunk, title


def main():
    recs = read_extra()
    qmap = load_quote()
    print(f'extra 页面: {len(recs)}, 报价表款号: {len(qmap)}')

    out = {}
    matched = 0
    for rec in recs:
        code = str(rec['slug']).upper()
        qrec = qmap.get(code)
        if qrec:
            matched += 1
        trunk, title = build_title(rec, qrec)

        cat = rec['category']
        ws_short = WHOLESALE_SHORT.get(cat, 'Wholesale OEM')
        # ?????????? ? SEO title ??????
        # ????trunk + ???? + ??  >  trunk + ??  >  trunk ?? + ??
        code_tag = f' {code}#'
        cands = [
            f'{trunk} {ws_short}{code_tag}',
            f'{trunk}{code_tag}',
            f'{trunk[:max(10, 60 - len(code_tag))]}{code_tag}',
        ]
        seo = next((c for c in cands if len(c) <= 62), cands[-1])

        if qrec:
            mat = qrec.get('material') or ''
            sizes = qrec.get('sizeRange') or ''
            extra_bits = []
            if sizes:
                extra_bits.append(f'sizes {sizes}')
            if mat:
                extra_bits.append(f'{mat}')
            extra_str = (' ' + ', '.join(extra_bits) + '.') if extra_bits else ''
            desc = (f'{trunk} (style {code}) from our own Guangdong factory. '
                    f'OEM & private label welcome.{extra_str} MOQ 200 pcs. BSCI & OEKO-TEX.')
        else:
            desc = (f'{trunk} from our own Guangdong factory. OEM & private label welcome. '
                    f'Custom fabric, colour and sizing. MOQ 200 pcs. BSCI & OEKO-TEX.')

        if len(desc) > 158:
            desc = desc[:155].rsplit(' ', 1)[0] + '.'

        out[rec['key']] = {
            'category': cat,
            'oldTitle': rec['title'],
            'newTitle': title,
            'trunk': trunk,
            'wholesaleTerm': WHOLESALE_MAIN.get(cat, 'Wholesale OEM Manufacturer'),
            'retailAux': '',
            'code': rec['slug'].upper(),
            'colors': zh_colors_to_en(qrec.get('colors')) if qrec else [],
            'features': feats_from_property(qrec.get('property')) if qrec else [],
            'seoTitle': seo,
            'seoDescription': desc,
            'ldName': title,
            'hasCode': True,
            'hasQuoteData': bool(qrec),
        }

    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'WROTE {OUT}')
    print(f'能对上报价表真实数据: {matched}/{len(recs)}')

    print('\n=== 有真实数据的样例 ===')
    n = 0
    for k, v in out.items():
        if v['hasQuoteData']:
            print(f"  old: {v['oldTitle']}")
            print(f"  new: {v['newTitle']}")
            print(f"  desc: {v['seoDescription'][:120]}")
            n += 1
            if n >= 4:
                break
    print('\n=== 无真实数据的样例 ===')
    n = 0
    for k, v in out.items():
        if not v['hasQuoteData']:
            print(f"  old: {v['oldTitle']:28s} new: {v['newTitle']}")
            n += 1
            if n >= 4:
                break
    return 0


if __name__ == '__main__':
    sys.exit(main())
