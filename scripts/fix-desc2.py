"""精简产品详情页 description 到 <=155 字符，按分类定制。兼容 JSON 与 TS 两种写法。"""
import re

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


def shorten(cat, code):
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


for path in ['src/data/product-style-content.ts', 'src/data/product-style-content-extra.ts']:
    src = open(path, encoding='utf-8').read()
    # 按每个条目块处理：找到 seoDescription，再回溯本块内的 category 与 slug
    out = []
    pos = 0
    n = 0
    for m in re.finditer(r'"seoDescription"\s*:\s*"([^"]*)"', src):
        block_start = max(0, m.start() - 2000)
        ctx = src[block_start:m.start()]
        cats = re.findall(r'"category"\s*:\s*"([a-z-]+)"', ctx)
        slugs = re.findall(r'"slug"\s*:\s*"([a-z0-9-]+)"', ctx)
        if not cats or not slugs:
            continue
        cat, code = cats[-1], slugs[-1]
        new = shorten(cat, code)
        if new == m.group(1):
            continue
        out.append(src[pos:m.start(1)])
        out.append(new)
        pos = m.end(1)
        n += 1
    out.append(src[pos:])
    if n:
        open(path, 'w', encoding='utf-8').write(''.join(out))
    t = open(path, encoding='utf-8').read()
    ds = re.findall(r'"seoDescription"\s*:\s*"([^"]*)"', t)
    over = [d for d in ds if len(d) > 155]
    print(f'{path}: 改 {n} 条 | 共 {len(ds)} | 超155: {len(over)} | 最长 {max(len(d) for d in ds) if ds else 0}')
