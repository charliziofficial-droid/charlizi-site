# -*- coding: utf-8 -*-
"""打印指定文件的待匹配段落原文（用于对齐 anchor）"""
import io, os, sys

BLOG = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\src\pages\blog'
slug = sys.argv[1]
needle = sys.argv[2]
s = io.open(os.path.join(BLOG, slug + '.astro'), encoding='utf-8').read()
i = s.find(needle)
if i < 0:
    print('NOT FOUND:', needle)
    sys.exit(1)
start = s.rfind('<p>', 0, i)
end = s.find('</p>', i) + 4
print(repr(s[start:end]))
