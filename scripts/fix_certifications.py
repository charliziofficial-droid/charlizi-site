# -*- coding: utf-8 -*-
"""
fix_certifications.py — 认证信息纠错（2026-11-23）

主理人指令：网站只允许出现 Sedex / SMETA 认证。
现有站点虚构了 BSCI / OEKO-TEX Standard 100 / ISO 9001 / FAMA / GOTS / WRAP，
属于欺诈性 B2B 宣传（客户会索要审核报告），必须全部清除。

策略：
  1. 源头文件（b2b.ts / products-b2b.js / certifications.json / faq.json 等）语义化改写
  2. 批量派生文件（product-style-content*.ts / style-titles*.json）正则替换
  3. 删除整篇 OEKO-TEX 博客及其索引
  4. 自检：全站 0 处 BSCI / OEKO-TEX / ISO 9001 / FAMA / GOTS / WRAP（历史 blog 除外时显式报出）

用法: python -X utf8 scripts/fix_certifications.py [--apply]
不带 --apply 只报告。
"""
import sys, os, re, json, shutil, datetime

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLY = '--apply' in sys.argv

# 扫描范围
ROOTS = ['src', 'public', 'scripts']
EXTS = ('.astro', '.ts', '.js', '.json', '.md', '.txt', '.py', '.mjs', '.xml')
SKIP_DIRS = ('node_modules', 'dist', '.git', '.astro')

# 要清除的虚构认证
FAKE = {
    'BSCI':  re.compile(r'BSCI', re.I),
    'OEKO':  re.compile(r'OEKO[\s-]?TEX(\s+Standard\s+100)?', re.I),
    'ISO':   re.compile(r'ISO\s*9001(:?2015)?', re.I),
    'FAMA':  re.compile(r'(Disney\s+)?FAMA', re.I),
    'GOTS':  re.compile(r'GOTS(?:/OCS)?', re.I),
    'WRAP':  re.compile(r'\bWRAP\b'),
}

# ---- 语义化替换（长句优先，顺序敏感）----
PHRASE_RULES = [
    # 认证并列 → 统一 Sedex / SMETA
    (re.compile(r'BSCI\s*&\s*OEKO-?TEX\s*certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'BSCI\s*/\s*OEKO-?TEX\s*certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'BSCI\s*and\s*OEKO-?TEX\s*(Standard\s*100\s*)?certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'BSCI\s*Certified', re.I), 'Sedex SMETA Audited'),
    (re.compile(r'BSCI\s*certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'OEKO-?TEX\s*Standard\s*100\s*certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'OEKO-?TEX\s*certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'ISO\s*9001(:?2015)?\s*certified', re.I), 'Sedex SMETA audited'),
    (re.compile(r'BSCI', re.I), 'Sedex'),
    (re.compile(r'OEKO-?TEX(\s+Standard\s+100)?', re.I), 'SMETA'),
    (re.compile(r'ISO\s*9001(:?2015)?', re.I), 'SMETA'),
    (re.compile(r'(Disney\s+)?FAMA', re.I), 'SMETA'),
    (re.compile(r'GOTS(?:/OCS)?(?:/OEKO-?TEX)?\s*certified\s*mills', re.I), 'SMETA audited mills'),
    (re.compile(r'GOTS(?:/OCS)?', re.I), 'SMETA'),
    (re.compile(r'\bWRAP\b'), 'SMETA'),
]

# 需要整体替换的认证清单（JSON/TS 数组）
CERT_BLOCK_TS = """export const certifications = [
  { name: 'Sedex', desc: 'Supplier Ethical Data Exchange — ethical trade membership' },
  { name: 'SMETA', desc: 'Sedex Members Ethical Trade Audit — 4-pillar social compliance audit' },
];"""


def iter_files():
    for root in ROOTS:
        for dp, dns, fns in os.walk(os.path.join(BASE, root)):
            dns[:] = [d for d in dns if d not in SKIP_DIRS]
            for fn in fns:
                if fn.endswith(EXTS):
                    yield os.path.join(dp, fn)


def rel(p):
    return os.path.relpath(p, BASE).replace('\\', '/')


def scan():
    """返回 {认证: [(file, count)]}"""
    out = {}
    for p in iter_files():
        try:
            t = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for name, pat in FAKE.items():
            n = len(pat.findall(t))
            if n:
                out.setdefault(name, []).append((rel(p), n))
    return out


def apply_text_fixes():
    changed = []
    for p in iter_files():
        try:
            t = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        orig = t
        for pat, rep in PHRASE_RULES:
            t = pat.sub(rep, t)
        if t != orig:
            if APPLY:
                shutil.copy2(p, p + '.bak_cert')
                open(p, 'w', encoding='utf-8').write(t)
            changed.append(rel(p))
    return changed


def delete_oeko_blog():
    targets = [
        os.path.join(BASE, 'src', 'pages', 'blog', 'oeko-tex-certification.astro'),
    ]
    done = []
    for p in targets:
        if os.path.exists(p):
            if APPLY:
                trash = os.path.join(BASE, '.trash_cert')
                os.makedirs(trash, exist_ok=True)
                dst = os.path.join(trash, os.path.basename(p))
                shutil.move(p, dst)
                done.append(f'{rel(p)} -> .trash_cert/')
            else:
                done.append(f'WOULD DELETE {rel(p)}')
    return done


def purge_blog_index():
    """从 blog 索引里摘掉 OEKO-TEX 那篇"""
    hits = []
    for p in iter_files():
        if p.endswith(('.astro', '.ts', '.js', '.json')):
            t = open(p, encoding='utf-8', errors='ignore').read()
            if 'oeko-tex-certification' in t:
                hits.append(rel(p))
    return hits


def main():
    print('=' * 66)
    print(f'认证纠错 {"【APPLY 模式】" if APPLY else "【DRY RUN，不改文件】"}')
    print('=' * 66)

    before = scan()
    print('\n--- 修改前 ---')
    total_before = 0
    for name in ['BSCI', 'OEKO', 'ISO', 'FAMA', 'GOTS', 'WRAP']:
        lst = before.get(name, [])
        n = sum(c for _, c in lst)
        total_before += n
        print(f'  {name:6s}: {n:5d} 处 / {len(lst):2d} 文件')
    print(f'  {"合计":6s}: {total_before:5d} 处')

    print('\n--- 受影响的博客索引 ---')
    idx = purge_blog_index()
    for h in idx:
        print('   ', h)

    print('\n--- 删除 OEKO-TEX 博客 ---')
    for d in delete_oeko_blog():
        print('   ', d)

    print('\n--- 批量文本替换 ---')
    changed = apply_text_fixes()
    print(f'   改写 {len(changed)} 个文件')

    if APPLY:
        after = scan()
        print('\n--- 修改后 ---')
        total_after = 0
        for name in ['BSCI', 'OEKO', 'ISO', 'FAMA', 'GOTS', 'WRAP']:
            lst = after.get(name, [])
            n = sum(c for _, c in lst)
            total_after += n
            flag = '' if n == 0 else '  <-- 仍有残留'
            print(f'  {name:6s}: {n:5d} 处 / {len(lst):2d} 文件{flag}')
            for f, c in lst[:5]:
                print(f'        {c:3d}  {f}')
        print(f'\n  剩余合计: {total_after}')
        print('\n  ✅ 清零' if total_after == 0 else '\n  ⚠️ 需人工复核残留')
    else:
        print('\n（DRY RUN 结束。加 --apply 实际执行）')
    return 0


if __name__ == '__main__':
    sys.exit(main())
