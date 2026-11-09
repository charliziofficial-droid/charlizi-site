# -*- coding: utf-8 -*-
import io, os, sys
BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'
slug = sys.argv[1]
s = io.open(os.path.join(BLOG, slug + '.astro'), encoding='utf-8').read()
import re
for m in re.finditer(r'<p>(.*?)</p>', s, re.S):
    body = re.sub(r'<[^>]+>', '', m.group(1)).strip()
    if len(body) > 40:
        print('---')
        print(body[:300])
