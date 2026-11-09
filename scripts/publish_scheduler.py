# -*- coding: utf-8 -*-
"""
publish_scheduler.py — Charlizi 博客发布排期（每周 4-6 篇，美区最佳时间点）

美国站买手 / B2B 采购的阅读高峰（以美国东部时间为准）：
  Tue 10:00 ET、Wed 10:00 ET、Thu 10:00 ET  → 周中最稳，采购在上班后第一波查资料
  Tue 14:00 ET                              → 西海岸采购上班
  Sun 20:00 ET                              → 周末决策型阅读，竞争内容最少

按当前日期顺延生成未来 N 周的排期，自动避开已占用日期。

用法:
  python scripts/publish_scheduler.py --weeks 4
  python scripts/publish_scheduler.py --weeks 4 --json
"""
import argparse
import io
import json
import os
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "blog_engine")
PLAN = os.path.join(DATA, "publish_plan.json")

# 说明：Google 重新抓取不要求秒级对准美区上班时间，只要文章在美东工作日白天的抓取
# 窗口之前已经上线即可。因此实际发布动作落在北京时间的白天（由本机任务触发），
# 目标上线时间仍按美东黄金位计算，两者相差 >= 6 小时，安全。

# 美东时区（考虑夏令时切换：3 月第二个周日 ~ 11 月第一个周日 为 EDT/-4，其余 EST/-5）
# 为避免手动判断，直接用 zoneinfo（Python 3.9+）；不可用时退化为固定 -4。
try:
    from zoneinfo import ZoneInfo
    ET = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    ET = timezone(timedelta(hours=-4))

# 每周发布槽位：(星期几 0=Mon, 美东时间, 说明)
SLOTS = [
    (1, "10:00", "周二上午 — 采购上班第一波行业检索，全网竞争最低的黄金位"),
    (2, "10:00", "周三上午 — 周中阅读高峰，B2B 询盘转化最好的时段"),
    (3, "10:00", "周四上午 — 承接周三热度，适合深度技术文"),
    (1, "14:00", "周二下午 — 西海岸采购上班，覆盖 PST 受众"),
    (6, "20:00", "周日晚 — 决策型长文阅读，几乎无同质内容竞争"),
]
# 需要 4 篇的周：取前 4 个；5 篇：全部；6 篇：再加周一上午
EXTRA_SLOT = (0, "10:00", "周一上午 — 补位（6 篇/周时启用）")
CADENCE = [5, 5, 4, 5, 6]  # 按周轮转，收敛在 4-6 篇


def _cst_exec_date(et_dt, hour_cst=10):
    """按北京时间的白天执行：取美东目标日期的前一天或当天，落到 hour_cst。
    保证执行时间 <= 美东目标时间减 6 小时。"""
    cst = et_dt.astimezone(timezone(timedelta(hours=8)))
    # 美东 10:00 对应北京 23:00，同一天；美东 14:00 对应北京次日 03:00
    # 统一改到北京时间当天的 hour_cst，若已在目标前 >=6h 则用当天，否则用前一天
    base = cst if cst.hour >= 12 else cst - timedelta(days=1)
    cand = base.replace(hour=hour_cst, minute=0, second=0, microsecond=0)
    if cand >= et_dt - timedelta(hours=6):
        cand -= timedelta(days=1)
    return cand


def _slot_dt(week_start_monday, weekday, hhmm):
    h, m = hhmm.split(":")
    d = week_start_monday + timedelta(days=weekday)
    return datetime(d.year, d.month, d.day, int(h), int(m), tzinfo=ET)


def build_plan(weeks=4, start=None):
    now_et = (start or datetime.now(timezone.utc)).astimezone(ET)
    # 从下周一算起
    days_to_monday = (7 - now_et.weekday()) % 7 or 7
    monday = (now_et + timedelta(days=days_to_monday)).date()

    plan = []
    for w in range(weeks):
        ws = monday + timedelta(weeks=w)
        n = CADENCE[w % len(CADENCE)]
        slots = list(SLOTS[: min(n, len(SLOTS))])
        if n > len(SLOTS):
            slots.append(EXTRA_SLOT)
        for weekday, hhmm, why in slots:
            dt = _slot_dt(ws, weekday, hhmm)
            if dt <= now_et:
                continue
            exec_cst = _cst_exec_date(dt)
            plan.append({
                "publish_at_et": dt.isoformat(),
                "publish_at_cst": dt.astimezone(timezone(timedelta(hours=8))).isoformat(),
                "exec_at_cst": exec_cst.isoformat(),
                "weekday": dt.strftime("%a"),
                "date": dt.strftime("%Y-%m-%d"),
                "time_et": hhmm,
                "why": why,
                "topics": [],      # 由调度时填充
            })
    # 按时间升序
    plan.sort(key=lambda x: x["publish_at_et"])
    return plan


def load_used_dates():
    """已发布文章的日期（从 blog-schema.ts 粗提取），避免同日重复。"""
    used = set()
    p = os.path.join(ROOT, "src", "data", "blog-schema.ts")
    if os.path.exists(p):
        import re
        with io.open(p, encoding="utf-8") as f:
            for m in re.finditer(r"date:\s*'(\d{4}-\d{2}-\d{2})'", f.read()):
                used.add(m.group(1))
    return used


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weeks", type=int, default=4)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--write", action="store_true", help="写入 data/blog_engine/publish_plan.json")
    args = ap.parse_args()

    plan = build_plan(args.weeks)
    used = load_used_dates()
    for p in plan:
        if p["date"] in used:
            p["warn"] = "该日期已有文章，建议顺延"

    if args.write:
        os.makedirs(DATA, exist_ok=True)
        with io.open(PLAN, "w", encoding="utf-8", newline="\n") as f:
            json.dump(plan, f, ensure_ascii=False, indent=2)

    if args.json:
        print(json.dumps(plan, ensure_ascii=False, indent=2))
        return

    total = len(plan)
    weeks = len({p["date"][:7] + str(((datetime.strptime(p["date"], "%Y-%m-%d").day_of_week
                                       if hasattr(datetime, "day_of_week") else 0))) for p in plan}) if False else args.weeks
    print("=" * 78)
    print("Charlizi 博客发布排期 — 未来 %d 周，共 %d 篇（%.1f 篇/周）" % (args.weeks, total, total / args.weeks))
    print("=" * 78)
    cur_week = None
    for p in plan:
        wk = p["date"]
        print("  执行 %s CST  |  美东目标 %s %s ET  |  %s%s" % (
            p["exec_at_cst"][5:16].replace("T", " "),
            p["weekday"], p["time_et"],
            p["why"][:34], ("  ⚠ " + p["warn"]) if p.get("warn") else ""))
    print()
    print("时区说明：ET = 美国东部（纽约），CST = 北京时间。已自动处理夏令时。")


if __name__ == "__main__":
    main()
