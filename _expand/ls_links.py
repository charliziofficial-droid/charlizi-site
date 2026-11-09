# -*- coding: utf-8 -*-
import io, os, re, glob

BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'
for p in sorted(glob.glob(os.path.join(BLOG, '*.astro'))):
    name = os.path.basename(p)
    if name.startswith('['):
        continue
    s = io.open(p, encoding='utf-8').read()
    inner = sorted(set(re.findall(r'href="(/blog/[^"#]+)"', s)))
    print('%-34s %d  %s' % (name, len(inner), ', '.join(x.replace('/blog/', '') for x in inner)))
