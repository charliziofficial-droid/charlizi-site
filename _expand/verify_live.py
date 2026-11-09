# -*- coding: utf-8 -*-
"""线上验证 v2：用 <article> 提取正文"""
import re
import subprocess

SITE = 'https://charlizi.com'
SLUGS = [
    'silicone-cup-moulding-process', 'adhesive-bra-spec-guide', 'bra-anatomy',
    'bra-set-development', 'panty-fit-guide', 'shapewear-manufacturing',
    'silicone-bra-manufacturing', 'size-grading', 'wirefree-vs-underwire',
    'choosing-bra-manufacturer', 'oeko-tex-certification', 'bulk-vs-small-batch',
]


def fetch(url):
    r = subprocess.run(['curl.exe', '-sL', '--max-time', '60', url],
                       capture_output=True)
    return r.stdout.decode('utf-8', 'replace')


def main():
    ok = 0
    for slug in SLUGS:
        html = fetch('%s/blog/%s' % (SITE, slug))
        m = re.search(r'<article\b.*?</article>', html, re.S)
        art = m.group(0) if m else ''
        txt = re.sub(r'<script.*?</script>', ' ', art, flags=re.S)
        txt = re.sub(r'<[^>]+>', ' ', txt)
        words = len(re.findall(r"[A-Za-z][A-Za-z'-]*", txt))
        types = set(re.findall(r'"@type"\s*:\s*"([A-Za-z]+)"', html))
        canon = re.search(r'<link rel="canonical" href="([^"]+)"', html)
        ogt = re.search(r'property="og:title" content="([^"]*)"', html)
        desc = re.search(r'<meta name="description" content="([^"]*)"', html)
        h2 = len(re.findall(r'<h2', art))
        inner = len(set(re.findall(r'href="(/blog/[^"#]+)"', art)))
        flags = {
            'words>=1100': words >= 1100,
            'Article': 'Article' in types,
            'FAQPage': 'FAQPage' in types,
            'Breadcrumb': 'BreadcrumbList' in types,
            'canonical': bool(canon),
            'og:title': bool(ogt),
            'desc<=165': bool(desc) and len(desc.group(1)) <= 165,
            'inner>=3': inner >= 3,
        }
        bad = [k for k, v in flags.items() if not v]
        if not bad:
            ok += 1
        print('%-32s w=%-5d h2=%-2d inner=%-2d desc=%-3d %s' % (
            slug, words, h2, inner,
            len(desc.group(1)) if desc else -1,
            'OK' if not bad else 'FAIL ' + ','.join(bad)))
    print('----')
    print('%d/%d 通过' % (ok, len(SLUGS)))


if __name__ == '__main__':
    main()
