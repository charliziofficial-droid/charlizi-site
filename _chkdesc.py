# -*- coding: utf-8 -*-
import io, re
s = io.open('src/data/blog-schema.ts', encoding='utf-8').read()
for slug in ('bra-set-development', 'wirefree-vs-underwire'):
    i = s.find("slug: '" + slug + "'")
    seg = s[i:i + 900]
    m = re.search(r"description:\s*\n?\s*'([^']*)'", seg)
    print(slug, '=>', len(m.group(1)), '|', m.group(1))
