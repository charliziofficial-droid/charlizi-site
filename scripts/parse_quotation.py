# -*- coding: utf-8 -*-
"""
parse_quotation.py — 解析 charlizi 报价表 Excel → 结构化 JSON

数据源：C:\\Users\\Administrator\\Desktop\\charlizi网站报价表.xlsx
        7 个产品 sheet，约 395 条款号行（同款不同色各占一行）

输出：src/data/quotation.json
  结构：{ meta: {...}, categories: { <catId>: { styles: [ {code, colors, ...} ] } } }

【重要】本脚本只做「读 + 归一化」，不写任何业务判断（如是否展示价格）。
        价格是受保护数据，写进独立 JSON，由受保护子应用读取，不进静态页 HTML。

列映射（各 sheet 不同，按表头动态识别，见 SHEET_SPECS）
阶梯价：EDW$ = CNY ÷ 汇率 × 累进加价
  - 档位从「量大→价低」到「量小→价高」：500-1000 / 300-500 / 100-300 / 30-100
  - 表格里的 H→K 列已经是正确顺序（H 最便宜 = 量最大），无需反转
"""
import json
import os
import re
import sys

import openpyxl
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'src', 'data', 'quotation.json')

DESKTOP = os.path.expanduser(r'~\Desktop')
SRC_CANDIDATES = ['charlizi网站报价表.xlsx']


def find_src():
    """定位报价表（用 unicode 转义避免 PowerShell/GBK 编码坑）"""
    want = '\u7f51\u7ad9'  # 网站
    for f in os.listdir(DESKTOP):
        if f.endswith('.xlsx') and want in f:
            return os.path.join(DESKTOP, f)
    raise FileNotFoundError('报价表未找到：桌面下含「网站」的 .xlsx')


def cell(ws, row, col):
    if col is None:
        return None
    v = ws.cell(row, col).value
    if isinstance(v, str):
        v = v.strip()
        return v or None
    return v


def clean(v):
    """去首尾空白、压缩多空格"""
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return v
    s = re.sub(r'\s+', ' ', str(v)).strip()
    return s or None


def split_color(v):
    """'黑色 Black' → ('黑色','Black')
    '黑/红/蓝  Black/Red/Blue' → ('黑/红/蓝','Black/Red/Blue')
    '黑粉色 BlackPink' → ('黑粉色','BlackPink')
    【关键】保留 / 分隔符，因为多色组合款靠它表达，而不是当分隔符吃掉。
    """
    if not v:
        return None, None
    s = clean(v)
    # 中文区：中文字符 + 分隔符（/ 、 ， + 及空格不属区边界而属同一串）
    zh_m = re.search(r'[\u4e00-\u9fff][\u4e00-\u9fff/、+\s]*', s)
    zh = re.sub(r'\s+', '', zh_m.group(0)) if zh_m else None
    # 英文区：从第一个 ASCII 字母开始到串尾
    en_m = re.search(r'[A-Za-z][A-Za-z/\-\s]*$', s)
    en = re.sub(r'\s+', ' ', en_m.group(0)).strip() if en_m else None
    if zh and not en:
        return zh, None
    if en and not zh:
        return None, en
    return zh, en


def make_tier(raw_label, usd):
    """'EXW报价/$ EXW 500-1000order' → {'label':'500-1000','minQty':500,'maxQty':1000,'usd':3.414}
    主理人确认：H→K 列为 500-1000 / 300-500 / 100-300 / 30-100，量大价低。
    """
    lab = raw_label or ''
    m = re.search(r'(\d+)\s*[-~\u2014]\s*(\d+)', lab)
    if m:
        lo, hi = int(m.group(1)), int(m.group(2))
        return {'label': f'{lo}-{hi}', 'minQty': lo, 'maxQty': hi, 'usd': usd}
    m2 = re.search(r'(\d+)', lab)
    if m2:
        lo = int(m2.group(1))
        return {'label': f'{lo}+', 'minQty': lo, 'maxQty': None, 'usd': usd}
    return {'label': lab.strip() or None, 'minQty': None, 'maxQty': None, 'usd': usd}


def parse_size_label(v):
    """'S/70B/A' → 'S / 70B / A'（仅规范化空格，保留原义）"""
    if not v:
        return None
    s = clean(v)
    return s.replace('/', ' / ')


def num(v):
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        try:
            return float(v.replace(',', '').replace('$', '').replace('¥', ''))
        except ValueError:
            return None
    return None


# 每个 sheet 的定位策略：先找含「款号」的表头行，再按表头文字识别列
def locate_columns(ws, hdr_row):
    """返回 dict: 语义名 → 列号（1-based）"""
    hdr = {}
    for c in range(1, (ws.max_column or 1) + 1):
        t = clean(ws.cell(hdr_row, c).value) or ''
        hdr[c] = t
    out = {}
    price_cols = []
    size_cols = []
    for c, t in hdr.items():
        low = t.lower()
        if '款号' in t or 'style number' in low:
            out['code'] = c
        elif '图片' in t or low.startswith('picture'):
            out['image'] = c
        elif '码数' in t or ('size' in low and 'style' not in low):
            out['size_range'] = c
        elif '颜色' in t or low.startswith('color'):
            out['color'] = c
        elif '属性' in t or low.startswith('property'):
            out['property'] = c
        elif '材质' in t or 'material' in low:
            out['material'] = c
        elif '备注' in t or low.startswith('remark'):
            out['remark'] = c
        elif 'EXW' in t:
            if '¥' in t or 'rmb' in low or 'cny' in low:
                out['price_cny'] = c
            else:
                price_cols.append((c, t))
    # 阶梯价列按列号排序（左→右 = 量大→量小 = 价低→价高）
    out['price_tiers'] = [c for c, t in sorted(price_cols)]
    out['_price_tier_labels'] = [t for c, t in sorted(price_cols)]
    # 库存总数列：表头含「库存」或下面一行是「总数/total」
    for c, t in hdr.items():
        if '总数' in t or t.lower().startswith('total'):
            out['stock_total'] = c
            break
    if 'stock_total' not in out:
        for c, t in hdr.items():
            if '库存' in t or 'inventory' in t.lower():
                out['stock_total'] = c
                break

    # 码数明细列：可能是「表头行」本身，也可能是「表头行 + 1」（两种 sheet 都存在）
    known = {v for v in out.values() if isinstance(v, int)}
    for probe in (hdr_row, hdr_row + 1):
        size_cols = []
        for c in range(1, (ws.max_column or 1) + 1):
            if c in known:
                continue
            v = clean(ws.cell(probe, c).value)
            if not isinstance(v, str):
                continue
            if v.lower().startswith('total') or '总数' in v:
                continue
            if '库存' in v or 'inventory' in v.lower():
                continue
            # 码数特征：S/70B/A、XL、One Size、90C/1XL、A-D 等
            if re.fullmatch(r'[A-Za-z0-9/\s\-\.]{1,14}', v) and not v.lower().startswith('exw'):
                size_cols.append((c, v))
        # 至少识别到 2 个才算有效码数行
        if len(size_cols) >= 2:
            break
    out['_size_detail'] = size_cols
    return out


def parse_sheet(ws, cat_id, cat_name):
    # 1. 找表头行
    hdr_row = None
    for r in range(1, 8):
        row_txt = ' '.join(str(ws.cell(r, c).value or '') for c in range(1, min(ws.max_column, 8) + 1))
        if '款号' in row_txt:
            hdr_row = r
            break
    if hdr_row is None:
        return [], None

    cols = locate_columns(ws, hdr_row)

    # 2. 汇率（表头行里找 6.xx 这类数字，通常在「实时汇率」右侧）
    rate = None
    for r in (hdr_row - 1, hdr_row):
        for c in range(1, (ws.max_column or 1) + 1):
            t = clean(ws.cell(r, c).value)
            if isinstance(t, str) and ('汇率' in t or 'exchange' in t.lower()):
                nv = num(ws.cell(r, c + 1).value)
                if nv and 5 < nv < 10:
                    rate = nv
                    break
        if rate:
            break
    if rate is None:
        # 兜底：扫表头行附近所有 6~8 之间的数字
        for r in (hdr_row - 1, hdr_row):
            for c in range(1, (ws.max_column or 1) + 1):
                nv = num(ws.cell(r, c).value)
                if nv and 6 <= nv <= 8:
                    rate = nv
                    break
            if rate:
                break

    # 3. 逐行解析
    rows = []
    data_start = hdr_row + 2  # 跳过「总数/total」码数表头行
    for r in range(data_start, ws.max_row + 1):
        code = clean(cell(ws, r, cols.get('code')))
        if not code or code in ('总数/total', 'total'):
            continue
        zh, en = split_color(cell(ws, r, cols.get('color')))
        tiers = []
        for c, lab in zip(cols['price_tiers'], cols['_price_tier_labels']):
            tiers.append(make_tier(clean(lab), num(cell(ws, r, c))))
        stock = []
        for c, lab in cols['_size_detail']:
            if r_lab_lower(lab):
                v = num(cell(ws, r, c))
                if v is not None:
                    stock.append({'size': lab, 'qty': int(v)})
        rows.append({
            'code': code,
            'sizeRange': clean(cell(ws, r, cols.get('size_range'))),
            'color': zh,
            'colorEn': en,
            'property': clean(cell(ws, r, cols.get('property'))),
            'material': clean(cell(ws, r, cols.get('material'))),
            'remark': clean(cell(ws, r, cols.get('remark'))),
            'priceCny': num(cell(ws, r, cols.get('price_cny'))),
            'tiers': [t for t in tiers if t['usd'] is not None],
            'stockBySize': stock,
            'stockTotal': int(num(cell(ws, r, cols.get('stock_total'))) or 0),
        })

    meta = {'headerRow': hdr_row, 'rate': rate,
            'priceCols': cols['price_tiers'],
            'tierLabels': cols['_price_tier_labels'],
            'sizeLabels': [l for _, l in cols['_size_detail']]}
    return [x for x in rows if x['code']], meta


def r_lab_lower(lab):
    """码数表头排除「总数/total」，非字符串一律排除"""
    if not isinstance(lab, str):
        return False
    return not (lab.lower().startswith('total') or '总数' in lab)


SHEET_MAP = {
    '\u6587\u80f8\u5957\u88c5-Bra Set': ('bra-sets', 'Bra Sets'),
    '\u5927\u7801\u7248\u6587\u80f8-Plus-size bras': ('plus-size-bras', 'Plus Size Bras'),
    '\u5355\u6587\u80f8-Bra': ('bras', 'Bras'),
    '\u5185\u88e4-Panties': ('panties', 'Panties'),
    '\u7845\u80f6\u6587\u80f8-Adhesive bras': ('silicone-bras', 'Adhesive Bras'),
    'M\u80cc\u5fc3\u6b3e': ('camisoles', 'Camisoles'),
    '\u7f8e\u56fd\u8d27\u76d8-US local warehouse': ('us-stock', 'US Local Warehouse'),
}


def main():
    src = find_src()
    print('SOURCE:', src)
    wb = openpyxl.load_workbook(src, data_only=True)

    result = {'meta': {'source': os.path.basename(src),
                       'generatedBy': 'scripts/parse_quotation.py',
                       'note': '价格/库存属受保护数据，不得进入静态页 HTML'},
              'categories': {}}
    total = 0
    for sheet_name, (cat_id, cat_name) in SHEET_MAP.items():
        ws = None
        for sn in wb.sheetnames:
            if sn.strip() == sheet_name or sn.startswith(sheet_name.split('-')[0]):
                ws = wb[sn]
                break
        if ws is None:
            print('  [SKIP] sheet not found:', sheet_name)
            continue
        rows, meta = parse_sheet(ws, cat_id, cat_name)
        total += len(rows)
        result['categories'][cat_id] = {
            'name': cat_name,
            'sheet': ws.title,
            'parseMeta': meta,
            'rowCount': len(rows),
            'styles': rows,
        }
        uniq = len({r['code'] for r in rows})
        print(f'  {cat_name:22s} rows={len(rows):4d}  uniqueCodes={uniq:4d}  rate={meta["rate"]}')

    result['meta']['totalRows'] = total

    # ---- 同款号聚合成一个 style，颜色归入 variants（主理人指令：同款号=多颜色）----
    # 价格冲突取【高价】（主理人指令）；同名色合并，不同色保留为 variant
    conflict = []
    for cid, cat in result['categories'].items():
        by_code = {}
        for s in cat['styles']:
            by_code.setdefault(str(s['code']).strip(), []).append(s)
        merged = []
        for code, group in by_code.items():
            base = dict(group[0])
            variants = []
            prices_seen = []
            for g in group:
                tiers = g['tiers']
                # 取高价：比较第一档（最便宜量级）的 usd
                prices_seen.append([t['usd'] for t in tiers])
                variants.append({
                    'color': g['color'], 'colorEn': g['colorEn'],
                    'tiers': tiers, 'priceCny': g['priceCny'],
                    'stockBySize': g['stockBySize'], 'stockTotal': g['stockTotal'],
                    'material': g['material'], 'property': g['property'], 'remark': g['remark'],
                })
            # 去重variant（同色同价只留一个）
            seen = {}
            for v in variants:
                k = (_norm(v['color']), tuple(round(t['usd'], 6) for t in v['tiers']))
                seen.setdefault(k, v)
            variants = list(seen.values())

            # 主价格 = 所有 variant 中最高（保守报价，不对外低估）
            def tier_key(v):
                return [t['usd'] for t in v['tiers']]
            top = max(variants, key=lambda v: tier_key(v)[0] if tier_key(v) else 0)

            uniq_prices = {tuple(round(x, 6) for x in tier_key(v)) for v in variants}
            if len(uniq_prices) > 1:
                conflict.append({'category': cid, 'code': code,
                                 'variants': [v['color'] for v in variants],
                                 'prices': [tier_key(v) for v in variants],
                                 'picked': 'highest'})

            base['tiers'] = top['tiers']
            base['priceCny'] = top['priceCny']
            base['material'] = top['material'] or next((v['material'] for v in variants if v['material']), None)
            base['property'] = top['property'] or next((v['property'] for v in variants if v['property']), None)
            base['variants'] = variants
            base['colors'] = [v['color'] for v in variants if v['color']]
            base['colorsEn'] = [v['colorEn'] for v in variants if v['colorEn']]
            base['stockTotal'] = sum(v['stockTotal'] or 0 for v in variants)
            merged.append(base)
        cat['styles'] = merged
    result['meta']['priceConflicts'] = conflict

    # 去重统计（按聚合后的款号）
    dups = []
    for cid, cat in result['categories'].items():
        seen = {}
        for s in cat['styles']:
            seen.setdefault(_norm(s['code']), []).append(s)
        for k, v in seen.items():
            if len(v) > 1:
                dups.append({'category': cid, 'code': v[0]['code'], 'count': len(v)})
    result['meta']['duplicates'] = dups

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f'\nWROTE {OUT}  ({os.path.getsize(OUT):,} bytes, {total} rows)')

    # ---- 自检：逐行回比 Excel 原始价格 ----
    ok, msg = verify(src, result)
    print(('\n[VERIFY] PASS  ' if ok else '\n[VERIFY] FAIL  ') + msg)
    cf = result['meta'].get('priceConflicts') or []
    if cf:
        print(f'[PRICE CONFLICT] {len(cf)} 款同款号内颜色价不同，已取高价：')
        for d in cf[:8]:
            print(f"   {d['category']}/{d['code']}  colors={d['variants']}")
    if dups:
        print(f'[DUPLICATES] {len(dups)} 个款号在 JSON 内重复（不应发生）')
    return 0 if ok else 1


def _norm(x):
    """归一化：去空白/逗号/顿号/加号并小写，用于宽松匹配颜色串"""
    return re.sub(r'[\s,\uff0c\u3001+]+', '', str(x or '')).lower()


def _verify_one(ws, hr, price_cols, cid, code, sv, box):
    """校验单个 variant 的四档价是否能在 Excel 中找到完全一致的行"""
    wc, wcol = _norm(code), _norm(sv.get('color'))
    cands = []
    for r in range(hr + 1, ws.max_row + 1):
        if _norm(ws.cell(r, 1).value) != wc:
            continue
        ec = _norm(ws.cell(r, 4).value)
        if wcol and not (wcol in ec or ec.startswith(wcol)):
            continue
        tmp = [ws.cell(r, c).value for c in price_cols]
        tmp = [v for v in tmp if isinstance(v, (int, float))]
        if tmp:
            cands.append(tmp)
    mine = [t['usd'] for t in sv['tiers']]
    matched = any(len(c) == len(mine) and all(abs(a - b) <= 1e-6 for a, b in zip(c, mine))
                  for c in cands)
    if not matched:
        box['miss'] = True
        box.setdefault('details', []).append(f"{cid}/{code}/{sv.get('color')} excel={cands} json={mine}")


def verify(src, result):
    """回比：JSON 的 tiers 必须与 Excel 里对应行的 EXW$ 单元格完全一致"""
    wb = openpyxl.load_workbook(src, data_only=True)
    checked = miss = 0
    details_box = {'miss': False, 'details': []}
    for cid, cat in result['categories'].items():
        ws = None
        for sn in wb.sheetnames:
            if sn.strip() == cat['sheet'].strip():
                ws = wb[sn]
                break
        if ws is None:
            continue
        hr = cat['parseMeta']['headerRow']
        price_cols = cat['parseMeta'].get('priceCols') or []
        if not price_cols:
            # 兜底：按表头文字取（含 EXW 且含 $）
            price_cols = [c for c in range(1, (ws.max_column or 1) + 1)
                          if 'EXW' in str(ws.cell(hr, c).value or '')
                          and '$' in str(ws.cell(hr, c).value or '')]
        for s in cat['styles']:
            # 聚合后一个 style 带多个 variant，逐个校验
            vs = s.get('variants') or [s]
            for sv in vs:
                _verify_one(ws, hr, price_cols, cid, s['code'], sv, details_box)
                checked += 1
                if details_box['miss']:
                    miss += 1
                    details_box['miss'] = False
    if miss == 0:
        return True, f'{checked} variants, price 100% matches Excel'
    return False, f'{checked} variants, {miss} mismatches | ' + ' ; '.join(details_box['details'][:5])


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
