# -*- coding: utf-8 -*-
"""
build_review_sheet.py — 把款号候选匹配结果做成人可核对的交互清单

输入：src/data/style-code-candidates.json（match_codes.py 产出）
      src/data/product-style-content.ts（站点 68 款）
      src/data/quotation.json（328 款报价）
输出：public/style-code-review.html（静态页，可用浏览器打开逐条勾选）
      src/data/style-code-review.csv（Excel 可开的核对表）

目标：把人工核对从「从 328 款里翻」降为「从 5 个候选里点」。
"""
import sys, os, re, json, csv, html

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAND = os.path.join(BASE, 'src', 'data', 'style-code-candidates.json')
QUOTE = os.path.join(BASE, 'src', 'data', 'quotation.json')
OUT_HTML = os.path.join(BASE, 'public', 'style-code-review.html')
OUT_CSV = os.path.join(BASE, 'src', 'data', 'style-code-review.csv')


def load():
    cands = json.load(open(CAND, encoding='utf-8'))
    quote = json.load(open(QUOTE, encoding='utf-8'))
    # 款号 -> 详情（用于展示参考信息）
    qmap = {}
    for cid, cat in quote['categories'].items():
        for st in cat['styles']:
            qmap[str(st['code'])] = {
                'category': cid,
                'colors': st.get('colors') or [],
                'sizeRange': st.get('sizeRange'),
                'property': st.get('property'),
                'material': st.get('material'),
                'tiers': [round(t['usd'], 2) for t in st.get('tiers') or []],
                'stockTotal': st.get('stockTotal'),
            }
    return cands, qmap


def write_csv(cands, qmap):
    with open(OUT_CSV, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['站点slug', '站点品类', '站点标题', '推荐款号', '打分',
                    '候选2', '候选3', '候选4', '候选5', '人工确认款号', '备注'])
        for slug, v in cands.items():
            cs = v['candidates']
            row = [slug, v['category'], v['siteTitle']]
            if cs:
                row += [str(cs[0]['code']), cs[0]['score']]
                row += [f"{c['code']}({c['score']})" for c in cs[1:5]]
            else:
                row += ['', ''] + [''] * 4
            row += ['', '']  # 人工确认款号 / 备注
            w.writerow(row)
    print(f'WROTE {OUT_CSV}')


def write_html(cands, qmap):
    os.makedirs(os.path.dirname(OUT_HTML), exist_ok=True)
    order = ['bra-sets', 'bras', 'plus-size-bras', 'silicone-bras',
             'panties', 'camisoles', 'sleepwear', 'shapewear', 'us-stock']
    grouped = {}
    for slug, v in cands.items():
        grouped.setdefault(v['category'], []).append((slug, v))
    for k in grouped:
        grouped[k].sort(key=lambda x: x[0])

    total = len(cands)
    high = sum(1 for v in cands.values() if v['candidates'] and v['candidates'][0]['score'] >= 0.6)

    rows = []
    for cat in order:
        if cat not in grouped:
            continue
        rows.append(f'<tr class="sechead"><td colspan="6">{html.escape(cat)} '
                    f'<span class="cnt">({len(grouped[cat])} 款)</span></td></tr>')
        for slug, v in grouped[cat]:
            cs = v['candidates']
            opts = ['<option value="">— 请选择 —</option>']
            for c in cs:
                c['code'] = str(c['code'])
                q = qmap.get(c['code'], {})
                label = (f"{c['code']}  |  {c['score']:.2f}  |  "
                         f"{'、'.join(q.get('colors') or [])[:22]}  |  "
                         f"{q.get('sizeRange') or '-'}  |  "
                         f"{(q.get('property') or '-')[:26]}  |  "
                         f"${q['tiers'][0] if q.get('tiers') else '-'}")
                opts.append(f'<option value="{html.escape(c["code"])}">{html.escape(label)}</option>')
            # 永远给一个手填选项
            opts.append('<option value="__OTHER__">其他（手填下方）</option>')
            rows.append(
                '<tr>'
                f'<td class="slug"><a href="https://charlizi.com/products/{html.escape(cat)}/{html.escape(slug)}" target="_blank">{html.escape(slug[:44])}</a></td>'
                f'<td class="title">{html.escape(v["siteTitle"])}</td>'
                f'<td class="feat">{" ".join(html.escape(x) for x in v["siteFeatures"][:5])}</td>'
                f'<td><select data-slug="{html.escape(slug)}">{"".join(opts)}</select></td>'
                f'<td><input class="manual" data-slug="{html.escape(slug)}" placeholder="手填款号"></td>'
                f'<td class="markscore">{("%.2f" % cs[0]["score"]) if cs else "-"}</td>'
                '</tr>')

    doc = f'''<!doctype html>
<html lang="zh"><head><meta charset="utf-8">
<title>款号 ↔ 站点页面 核对表</title>
<style>
body{{font-family:-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;margin:0;background:#f6f7f9;color:#1a1a1a}}
header{{position:sticky;top:0;background:#053C32;color:#fff;padding:14px 22px;z-index:9;display:flex;align-items:center;gap:18px;flex-wrap:wrap}}
header h1{{font-size:16px;margin:0;font-weight:600}}
header .stat{{font-size:13px;opacity:.85}}
header button{{background:#D8A551;border:0;color:#053C32;font-weight:700;padding:8px 16px;border-radius:6px;cursor:pointer}}
header button:hover{{background:#e8bb6e}}
table{{border-collapse:collapse;width:100%;background:#fff;font-size:13px}}
th,td{{padding:7px 10px;border-bottom:1px solid #e8e8e8;text-align:left;vertical-align:middle}}
th{{background:#eef1f0;position:sticky;top:58px;z-index:8;font-size:12px;font-weight:600}}
.sechead td{{background:#dfe7e4;font-weight:700;color:#053C32}}
.sechead .cnt{{font-weight:400;opacity:.7}}
.slug a{{color:#053C32;text-decoration:none;font-family:ui-monospace,Consolas,monospace;font-size:11.5px}}
.slug a:hover{{text-decoration:underline}}
.title{{max-width:250px}}
.feat{{color:#666;font-size:11.5px;max-width:150px}}
select{{max-width:330px;padding:5px;font-size:12px;border:1px solid #ccc;border-radius:4px;background:#fff}}
input.manual{{width:110px;padding:5px;font-size:12px;border:1px solid #ccc;border-radius:4px}}
.markscore{{color:#999;font-size:11px;text-align:center}}
tr.done{{background:#f0f9f4}}
</style></head><body>
<header>
  <h1>款号 ↔ 站点页面 核对表</h1>
  <span class="stat">共 {total} 个页面 · 有可用候选 {high} 个 · 每行选一个款号，或手填</span>
  <button onclick="exportJSON()">导出已选结果</button>
  <button onclick="clearAll()" style="background:#8a9a95">清空</button>
</header>
<table>
<thead><tr><th style="width:22%">站点 slug</th><th style="width:20%">站点标题</th>
<th style="width:12%">站点功能词</th><th style="width:30%">候选款号（按匹配分排序）</th>
<th style="width:10%">手填</th><th style="width:6%">分</th></tr></thead>
<tbody>
{"".join(rows)}
</tbody></table>
<script>
const KEY='charlizi_code_map_v1';
function load(){{try{{return JSON.parse(localStorage.getItem(KEY)||'{{}}')}}catch(e){{return {{}}}}}}
function save(){{localStorage.setItem(KEY,JSON.stringify(collect()));paint()}}
function collect(){{
  const out={{}};
  document.querySelectorAll('select[data-slug]').forEach(s=>{{
    const slug=s.dataset.slug, man=document.querySelector('input.manual[data-slug="'+slug+'"]');
    const v=(man.value||'').trim()||s.value;
    if(v) out[slug]=v;
  }});
  return out;
}}
function paint(){{
  const st=load();
  document.querySelectorAll('select[data-slug]').forEach(s=>{{
    const slug=s.dataset.slug;
    if(st[slug]){{s.closest('tr').classList.add('done')}}else{{s.closest('tr').classList.remove('done')}}
  }});
}}
document.addEventListener('change',e=>{{if(e.target.matches('select[data-slug],input.manual'))save()}});
document.addEventListener('input',e=>{{if(e.target.matches('input.manual'))save()}});
function exportJSON(){{
  const d=collect();
  const blob=new Blob([JSON.stringify(d,null,2)],{{type:'application/json'}});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='style-code-confirmed.json';a.click();
}}
function clearAll(){{if(confirm('清空所有已选？（不可恢复）')){{localStorage.removeItem(KEY);location.reload()}}}}
(function(){{const st=load();
  document.querySelectorAll('select[data-slug]').forEach(s=>{{
    const slug=s.dataset.slug;
    if(!st[slug])return;
    const man=document.querySelector('input.manual[data-slug="'+slug+'"]');
    if([...s.options].some(o=>o.value===st[slug])){{s.value=st[slug]}}else{{man.value=st[slug]}}
  }});
  paint();
}})();
</script></body></html>'''
    open(OUT_HTML, 'w', encoding='utf-8').write(doc)
    print(f'WROTE {OUT_HTML}  ({len(doc):,} chars)')


def main():
    cands, qmap = load()
    write_csv(cands, qmap)
    write_html(cands, qmap)
    print(f'\n页面数 {len(cands)}')
    no_cand = [k for k, v in cands.items() if not v['candidates']]
    print(f'无候选（品类在报价表里找不到对应 sheet）: {len(no_cand)}')
    for k in no_cand[:10]:
        print('   ', k, '|', cands[k]['category'])
    return 0


if __name__ == '__main__':
    sys.exit(main())
