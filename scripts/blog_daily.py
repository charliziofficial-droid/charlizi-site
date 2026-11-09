# -*- coding: utf-8 -*-
"""
blog_daily.py — 每日发布任务（由 Task Scheduler 触发，北京时间 10:00）

流程：
  1. 读 publish_plan.json，看今天是否排期日
  2. 如果是：取队列中下一个未发布选题
  3. 有空草稿 -> 走向导；无草稿 -> 提示 Agent 撰写（返回 SLOT_OPEN 状态）
  4. 起草完成后跑 gate，通过则 ship（build + push）
  5. 结果写 data/blog_engine/daily_log.jsonl，并生成一条飞书/控制台摘要

用法：
  python scripts/blog_daily.py --check          只报告今天该不该发
  python scripts/blog_daily.py --run            执行（无草稿时提示）
  python scripts/blog_daily.py --run --slug X   直接发布指定稿
"""
import argparse
import io
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "blog_engine")
PLAN = os.path.join(DATA, "publish_plan.json")
STATE = os.path.join(DATA, "state.json")
DRAFTS = os.path.join(DATA, "drafts")
LOG = os.path.join(DATA, "daily_log.jsonl")
CST = timezone(timedelta(hours=8))


def load(p, default):
    if not os.path.exists(p):
        return default
    return json.load(io.open(p, encoding="utf-8"))


def today_slots():
    now = datetime.now(CST)
    plan = load(PLAN, [])
    out = []
    for s in plan:
        try:
            ex = datetime.fromisoformat(s["exec_at_cst"])
        except Exception:
            continue
        if ex.date() == now.date():
            out.append(s)
    return out, plan


def next_topic(state):
    for t in state.get("topic_queue", []):
        if t.get("status") == "queued":
            return t
    return None


def log_entry(rec):
    os.makedirs(DATA, exist_ok=True)
    with io.open(LOG, "a", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def run_gate(slug):
    r = subprocess.run([sys.executable, "-X", "utf8",
                        os.path.join(ROOT, "scripts", "blog_release.py"),
                        "gate", "--slug", slug],
                       cwd=ROOT, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    return r.returncode == 0, (r.stdout or "") + (r.stderr or "")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--run", action="store_true")
    ap.add_argument("--slug")
    a = ap.parse_args()

    slots, plan = today_slots()
    now = datetime.now(CST)

    if a.slug:
        ok, out = run_gate(a.slug)
        print(out.strip())
        log_entry({"ts": now.isoformat(), "slug": a.slug, "gate": ok})
        sys.exit(0 if ok else 1)

    if not slots:
        nxt = None
        for s in plan:
            ex = datetime.fromisoformat(s["exec_at_cst"])
            if ex > now:
                nxt = s
                break
        msg = "今天(%s)无排期。" % now.strftime("%Y-%m-%d")
        if nxt:
            msg += " 下一个窗口: %s (CST)" % nxt["exec_at_cst"][:16].replace("T", " ")
        print(msg)
        log_entry({"ts": now.isoformat(), "event": "no_slot", "next": nxt["exec_at_cst"] if nxt else None})
        return

    state = load(STATE, {})
    topic = next_topic(state)
    slot = slots[0]
    print("今天有 %d 个发布窗口。首选: 美东 %s %s ET" % (len(slots), slot["weekday"], slot["time_et"]))
    print("队列下一个选题: %s" % (topic["headline"] if topic else "（队列空，需先跑 topics）"))

    if not topic:
        log_entry({"ts": now.isoformat(), "event": "queue_empty"})
        return

    draft = os.path.join(DRAFTS, topic["slug"] + ".json")
    if not os.path.exists(draft):
        print("\nSTATUS=NEED_DRAFT  slug=%s" % topic["slug"])
        print("（稿子还没写。Agent 写好 data/blog_engine/drafts/%s.json 后，"
              "再跑 `python scripts/blog_release.py ship --slug %s`）"
              % (topic["slug"], topic["slug"]))
        log_entry({"ts": now.isoformat(), "event": "need_draft", "slug": topic["slug"],
                   "slot_et": slot["publish_at_et"]})
        return

    print("\n发现草稿，准备发布: %s" % topic["slug"])
    if a.run or a.check:
        r = subprocess.run([sys.executable, "-X", "utf8",
                            os.path.join(ROOT, "scripts", "blog_release.py"),
                            "ship", "--slug", topic["slug"]],
                           cwd=ROOT, capture_output=True, text=True,
                           encoding="utf-8", errors="replace")
        print((r.stdout or "")[-1500:])
        log_entry({"ts": now.isoformat(), "event": "ship", "slug": topic["slug"],
                   "ok": r.returncode == 0})


if __name__ == "__main__":
    main()
