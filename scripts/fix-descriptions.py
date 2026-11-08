"""精简产品详情页 description 到 <=155 字符，并按分类定制措辞（避免 138 页千篇一律）。"""
import json
import re
import os

CAT_PHRASE = {
    'bras': 'OEM bras',
    'bra-sets': 'OEM bra sets',
    'plus-size-bras': 'plus-size bra OEM',
    'panties': 'OEM panties',
    'silicone-bras': 'silicone bra OEM',
    'shapewear': 'shapewear OEM',
    'sleepwear': 'sleepwear OEM',
    'camisoles': 'camisole set OEM',
}


def shorten(desc, cat, code):
    phrase = CAT_PHRASE.get(cat, 'intimate apparel OEM')
    cands = [
        f'{phrase} {code}: custom fabric, colour and sizing. BSCI & OEKO-TEX. MOQ 200 pcs. Request a quote today.',
        f'{phrase} {code} — custom fabric, colour, sizing. BSCI & OEKO-TEX. MOQ 200 pcs. Get a quote.',
        f'{phrase} {code}: custom fabric & sizing. BSCI & OEKO-TEX certified. MOQ 200 pcs.',
        f'{phrase} {code}. Custom fabric, colour, sizing. MOQ 200 pcs. BSCI certified.',
        f'{phrase} {code} from Charlizi Factory. Custom sizing, MOQ 200 pcs.',
    ]
    for c in cands:
        if len(c) <= 155:
            return c
    return cands[-1][:152] + '...'


def fix_file(path, key_re, is_json):
    src = open(path, encoding='utf-8').read()
    orig = src
    changes = 0

    def repl(m):
        nonlocal changes
        full = m.group(0)
        desc = m.group('d')
        # 从上下文推断 category 与 code
        start = max(0, m.start() - 3000)
        ctx = src[start:m.start()]
        cat_m = re.findall(r'"?category"?\s*:\s*"([a-z-]+)"', ctx)
        code_m = re.findall(r'"?slug"?\s*:\s*"([a-z0-9-]+)"', ctx)
        cat = cat_m[-1] if cat_m else ''
        code = code_m[-1] if code_m else ''
        if not cat or not code:
            return full
        new = shorten(desc, cat, code)
        if new == desc:
            return full
        changes += 1
        return full.replace(desc, new)

    if is_json:
        src = re.sub(r'"seoDescription":\s*"(?P<d>[^"]*)"', repl, src)
    else:
        src = re.sub(r'seoDescription:\s*"(?P<d>[^"]*)"', repl, src)

    if src != orig:
        open(path, 'w', encoding='utf-8').write(src)
    return changes


n1 = fix_file('src/data/product-style-content.ts', None, True)
n2 = fix_file('src/data/product-style-content-extra.ts', None, False)
print('style-content.ts     修改:', n1)
print('style-content-extra.ts 修改:', n2)

# 校验长度
for p in ['src/data/product-style-content.ts', 'src/data/product-style-content-extra.ts']:
    t = open(p, encoding='utf-8').read()
    ds = re.findall(r'"?seoDescription"?\s*:\s*"([^"]*)"', t)
    over = [d for d in ds if len(d) > 155]
    print(f'{p}: 共 {len(ds)} 条, 超 155 字符 {len(over)} 条, 最长 {max(len(d) for d in ds) if ds else 0}')
