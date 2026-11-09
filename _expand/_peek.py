# -*- coding: utf-8 -*-
import io
p = r'C:\Users\Administrator\.openclaw\workspace\charlizi-new\_expand\p_round4.py'
s = io.open(p, encoding='utf-8').read()
for k, ln in enumerate(s.split('\n'), 1):
    print('%4d|%s' % (k, ln))
