# -*- coding: utf-8 -*-
"""
match_codes.py — 为站点 68 个 style 生成「款号候选匹配表」（供人工核对）

背景（2026-11-23）：
  报价表有 328 款/387 色，站点有 68 个 style 页，两边【无任何映射关系】。
  68 个 slug 里只有 1 个天然带款号（mr2641）。剩下 67 个必须靠人工，
  但可以自动生成候选，把人工核对从「从 328 款里翻」降为「从 5 个候选里挑」。

匹配信号（按权重）：
  品类一致        —— 硬门槛，不同品类直接排除
  功能词重合      —— underwire / lace / push up / strapless / seamless ...
  颜色一致        —— 站点 title 里的颜色与报价表 colorEn 对上
  尺寸区间一致    —— S-XL / Plus Size 等
  标题词重合度    —— 最后的兜底打分

输出：src/data/style-code-candidates.json
"""
import sys, os, re, json
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUOTE = os.path.join(BASE, 'src', 'data', 'quotation.json')
SITE = os.path.join(BASE, 'src', 'data', 'product-style-content.ts')
OUT = os.path.join(BASE, 'src', 'data', 'style-code-candidates.json')

# 站点品类 → 报价表品类（注意命名差异）
CAT_MAP = {
    'bra-sets': ['bra-sets'],
    'bras': ['bras'],
    'plus-size-bras': ['plus-size-bras'],
    'silicone-bras': ['silicone-bras'],
    'panties': ['panties'],
    'camisoles': ['camisoles', 'bras'],
    'us-stock': ['us-stock'],
    'sleepwear': ['camisoles', 'us-stock'],   # 报价表无 sleepwear sheet
    'shapewear': ['us-stock', 'camisoles'],
}

FEATURE_SYNONYMS = {
    'underwire': ['underwire', '钢圈', 'wire'],
    'wireless': ['wireless', 'no wire', '无钢圈', 'wirefree', 'no underwire'],
    'push up': ['push up', 'push-up', 'pushup', '聚拢'],
    'padded': ['padded', '衬垫', 'moulded', 'molded'],
    'unpadded': ['unpadded', '无衬垫', 'unlined'],
    'full coverage': ['full coverage', '全罩'],
    'lace': ['lace', '蕾丝'],
    'mesh': ['mesh', '网纱'],
    'sheer': ['sheer', 'transparent', '透明'],
    'seamless': ['seamless', '无缝'],
    'strapless': ['strapless', '无肩带'],
    'halter': ['halter', '挂脖'],
    'backless': ['backless', '露背'],
    'bralette': ['bralette'],
    'high waist': ['high waist', '高腰'],
    'thong': ['thong', '丁字'],
    'bodysuit': ['bodysuit', '连体'],
    'adhesive': ['adhesive', 'sticky', 'silicone', '硅胶', '隐形'],
    'plus size': ['plus size', '大码', 'plus-size'],
    'cotton': ['cotton', '棉'],
    'satin': ['satin', '缎'],
    'leopard': ['leopard', '豹纹'],
    'print': ['print', '印花'],
    'deep v': ['deep v', 'deep u', '深v', '深u', 'v-neck'],
    'multiway': ['multiway', 'multi-way'],
    'front closure': ['front closure', 'front clasp', '前扣'],
}

COLORS = ['black', 'white', 'red', 'blue', 'green', 'pink', 'nude', 'beige',
          'purple', 'yellow', 'grey', 'gray', 'burgundy', 'coral', 'rose',
          'ivory', 'navy', 'brown', 'gold', 'silver', 'wine', 'leopard']


def norm(s):
    return re.sub(r'\s+', ' ', str(s or '')).strip().lower()


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
                    'category': cat, 'specs': specs, 'blob': norm(title + ' ' + base + ' ' + ' '.join(k + ' ' + v for k, v in specs))})
    return out


def site_features(blob):
    got = set()
    for feat, syns in FEATURE_SYNONYMS.items():
        for sy in syns:
            if sy in blob:
                got.add(feat)
                break
    return got


def site_colors(blob):
    return {c for c in COLORS if c in blob}


def quote_features(style):
    parts = [style.get('property') or '', style.get('material') or '',
             style.get('remark') or '', style.get('sizeRange') or '']
    blob = norm(' '.join(str(p) for p in parts))
    # 报价表 property 是中英混写，如 '钢圈/无衬垫 Underwire/Unpadded'
    return site_features(blob)


def score(site, qstyle):
    s_feat = site['_feat']
    q_feat = quote_features(qstyle)
    if not s_feat or not q_feat:
        feat_score = 0.0
    else:
        feat_score = len(s_feat & q_feat) / max(len(s_feat | q_feat), 1)

    s_col = site['_colors']
    q_col = {norm(c) for c in (qstyle.get('colorsEn') or [])}
    col_score = 1.0 if (s_col and q_col and (s_col & q_col)) else 0.0

    # 品类完全一致的额外分
    cat_score = 1.0 if site['category'] in {qstyle.get('_sheetCat')} else 0.5

    total = feat_score * 0.55 + col_score * 0.25 + cat_score * 0.20
    return total, {'feature': round(feat_score, 3), 'color': round(col_score, 3), 'category': round(cat_score, 3)}


def main():
    site = read_site()
    quote = json.load(open(QUOTE, encoding='utf-8'))

    # 扁平化报价表所有款，标注来源 sheet 品类
    pool = []
    for cid, cat in quote['categories'].items():
        for st in cat['styles']:
            st = dict(st)
            st['_sheetCat'] = cid
            pool.append(st)
    print(f'site styles: {len(site)}, quote styles: {len(pool)}')

    for s in site:
        s['_feat'] = site_features(s['blob'])
        s['_colors'] = site_colors(s['blob'])

    result = {}
    for s in site:
        allowed = CAT_MAP.get(s['category'], [s['category']])
        cands = []
        for q in pool:
            if q['_sheetCat'] not in allowed:
                continue
            sc, detail = score(s, q)
            cands.append({
                'code': q['code'],
                'sheetCategory': q['_sheetCat'],
                'colors': q.get('colors') or [],
                'sizeRange': q.get('sizeRange'),
                'property': q.get('property'),
                'tiers': [round(t['usd'], 3) for t in q.get('tiers') or []],
                'score': round(sc, 3),
                'detail': detail,
            })
        cands.sort(key=lambda x: -x['score'])
        top = cands[:5]
        result[s['slug']] = {
            'category': s['category'],
            'siteTitle': s['title'],
            'siteFeatures': sorted(s['_feat']),
            'siteColors': sorted(s['_colors']),
            'candidates': top,
            'status': 'AUTO_MATCHED_HIGH' if top and top[0]['score'] >= 0.75 else 'NEEDS_REVIEW',
        }

    json.dump(result, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'WROTE {OUT}')

    high = sum(1 for v in result.values() if v['status'] == 'AUTO_MATCHED_HIGH')
    print(f'\nauto high-confidence (>=0.75): {high} / {len(result)}')
    print(f'need review: {len(result) - high}')

    print('\n--- 高置信候选样例 ---')
    for slug, v in list(result.items()):
        if v['status'] == 'AUTO_MATCHED_HIGH':
            print(f"  {slug[:44]:46s} → {v['candidates'][0]['code']} (score {v['candidates'][0]['score']})")
            if len([1]) > 5:
                break
    print('\n--- 低置信样例（需人工）---')
    n = 0
    for slug, v in result.items():
        if v['status'] != 'AUTO_MATCHED_HIGH' and v['candidates']:
            c = v['candidates'][0]
            print(f"  {slug[:40]:42s} → {c['code']} (score {c['score']}, feat={c['detail']['feature']}, col={c['detail']['color']})")
            n += 1
            if n >= 8:
                break
    return 0


if __name__ == '__main__':
    sys.exit(main())
