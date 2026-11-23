# -*- coding: utf-8 -*-
"""一次性的计划表对齐：把已上线文章日期标成 used，清掉早于今天的槽位，
并把队列里「已上线」和「撞题」的选题从 queued 里移除。用法: python tmp/fix_plan.py --apply
"""
import io, json, os, sys
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "blog_engine")
PLAN = os.path.join(DATA, "publish_plan.json")
STATE = os.path.join(DATA, "state.json")
CST = timezone(timedelta(hours=8))
TODAY = datetime.now(CST).date()

plan = json.load(io.open(PLAN, encoding="utf-8"))
state = json.load(io.open(STATE, encoding="utf-8"))

shipped = {"silicone-cup-moulding-process": "2026-11-17",
           "bra-pads-and-inserts-sourcing": "2026-12-03",
           "shapewear-qc-and-durability-testing": "2026-12-10"}
drop = {
    "silicone-cup-moulding-process": "已上线",
    "bra-inserts-and-push-up-pads-sourcing-the-component-behind-t": "已被 bra-pads-and-inserts-sourcing 取代",
    "shapewear-manufacturing-compression-bonding-and-qc": "改题为 shapewear-qc-and-durability-testing 并已上线",
}

before_slots = len(plan)
dropped = 0
kept = []
for s in plan:
    d = datetime.fromisoformat(s["publish_at_et"]).astimezone(CST).date()
    # 槽位对应的北京执行日
    ex = datetime.fromisoformat(s["exec_at_cst"]).date()
    if ex < TODAY:
        dropped += 1
        continue
    kept.append(s)

# 标记已占用日期
for s in kept:
    d = datetime.fromisoformat(s["publish_at_et"]).astimezone(CST).date().isoformat()
    for slug, day in shipped.items():
        if d == day:
            s["booked_by"] = slug

q_before = len(state.get("topic_queue", []))
state["topic_queue"] = [t for t in state.get("topic_queue", []) if t["slug"] not in drop]

print("plan slots: %d -> %d (dropped %d past slots)" % (before_slots, len(kept), dropped))
print("queue: %d -> %d" % (q_before, len(state["topic_queue"])))
for t in state["topic_queue"]:
    print("  queued:", t["slug"], "|", t["headline"])
for slug, why in drop.items():
    print("  dropped:", slug, "->", why)

if "--apply" in sys.argv:
    json.dump(kept, io.open(PLAN, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=2)
    json.dump(state, io.open(STATE, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=2)
    print("APPLIED")
else:
    print("dry-run (add --apply to write)")
