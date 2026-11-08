"""从 product-style-content.ts 中精确删除指定 key 的整个对象块，并清理 related 引用。"""
import re
import sys

TARGET = 'shapewear/deep-v-lace-bodysuit-multi-color'
SLUG = 'deep-v-lace-bodysuit-multi-color'
PATH = 'src/data/product-style-content.ts'

text = open(PATH, encoding='utf-8').read()
lines = text.split('\n')

# 定位 key 行
start = None
for i, ln in enumerate(lines):
    if '"%s"' % TARGET in ln and ln.strip().startswith('"%s"' % TARGET):
        start = i
        break
if start is None:
    print('KEY NOT FOUND'); sys.exit(1)

# 从 key 行的 '{' 开始做括号配平（考虑字符串内的括号）
depth = 0
end = None
in_str = False
esc = False
started = False
for i in range(start, len(lines)):
    for ch in lines[i]:
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == '{':
            depth += 1
            started = True
        elif ch == '}':
            depth -= 1
            if started and depth == 0:
                end = i
                break
    if end is not None:
        break

if end is None:
    print('BLOCK END NOT FOUND'); sys.exit(1)

# 若块结束行以 '},' 结尾，一并去掉逗号；同时删除紧随的空行
removed_lines = end - start + 1
print('删除行 %d..%d (%d 行)' % (start + 1, end + 1, removed_lines))

del lines[start:end + 1]

text2 = '\n'.join(lines)

# 清理 related 里对该 slug 的引用（形如 { "slug": "...", "title": "..." },）
before = text2.count('"%s"' % SLUG)
block_re = re.compile(r'^\s*\{\s*"slug":\s*"%s",\s*"title":\s*"[^"]*"\s*\},?\s*\n' % re.escape(SLUG), re.M)
text2, n = block_re.subn('', text2)
print('清理 related 引用:', n, '处')

open(PATH, 'w', encoding='utf-8').write(text2)
after = text2.count('"%s"' % SLUG)
print('残余引用 (应为 0 或仅注释):', after)
