# -*- coding: utf-8 -*-
"""批量扩写剩余短文。用法: python _expand/p_rest.py [slug]"""
import io, os, re, sys

ROOT = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new'
BLOG = os.path.join(ROOT, 'src', 'pages', 'blog')

# (slug, before_anchor, html)
JOBS = []

JOBS.append(('panty-fit-guide', '      <h2>', '''HEAD'''))
