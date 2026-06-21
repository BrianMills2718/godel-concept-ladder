"""Validity gate for the judge (ROADMAP M2d): grade frozen good/borderline/bad case
sets and report false-pass / false-fail per task. The judge must clear the bar
(false-pass ≤ 5%, false-fail ≤ 15%) on EVERY judged task before it gates anything.

Case sets live one-per-task in eval/cases/<taskId>.json. This runner globs them all,
measures each, and certifies only if every task passes (and none errored).

    cd backend && python -m eval.run            # all task case sets
    cd backend && python -m eval.run cap-first  # one task
"""
from __future__ import annotations

import json
import pathlib
import sys

from godel_judge.judge import grade
from godel_judge.models import GradeRequest

FALSE_PASS_MAX = 0.05
FALSE_FAIL_MAX = 0.15

_HERE = pathlib.Path(__file__).resolve().parent


def run_task(path: pathlib.Path) -> dict:
    spec = json.loads(path.read_text())
    task_id = spec["taskId"]
    cases = spec["cases"]
    n_pos = sum(1 for c in cases if c["expect_pass"])
    n_neg = len(cases) - n_pos
    false_pass = false_fail = errors = 0

    print(f"\n── {task_id}: {len(cases)} frozen cases ──")
    for c in cases:
        try:
            r = grade(GradeRequest(taskId=task_id, answer=c["answer"]))
        except Exception as exc:  # quota/transient/no-key — record, don't crash
            errors += 1
            print(f"  [ERR ] {c['id']:24s} {type(exc).__name__}: {str(exc)[:60]}")
            continue
        ok = r.passed == c["expect_pass"]
        if not ok and c["expect_pass"]:
            false_fail += 1
        if not ok and not c["expect_pass"]:
            false_pass += 1
        print(
            f"  [{'ok ' if ok else 'MISS'}] {c['id']:24s} expect={'PASS' if c['expect_pass'] else 'fail'} "
            f"got={'PASS' if r.passed else 'fail'} score={r.score:5.1f} conf={r.confidence:6s}"
        )
    fp = false_pass / n_neg if n_neg else 0.0
    ff = false_fail / n_pos if n_pos else 0.0
    gated = errors == 0 and fp <= FALSE_PASS_MAX and ff <= FALSE_FAIL_MAX
    status = "INCONCLUSIVE" if errors else ("PASS" if gated else "FAIL")
    print(f"  → false-pass {false_pass}/{n_neg}={fp:.0%}  false-fail {false_fail}/{n_pos}={ff:.0%}  [{status}]")
    return {"task": task_id, "errors": errors, "gated": gated, "status": status}


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    files = sorted((_HERE / "cases").glob("*.json"))
    if only:
        files = [p for p in files if p.stem == only]
    if not files:
        print("no case sets found in eval/cases/")
        return 1

    results = [run_task(p) for p in files]
    print("\n=== judge eval summary ===")
    for r in results:
        print(f"  {r['task']:24s} {r['status']}")
    all_pass = all(r["gated"] for r in results)
    any_err = any(r["errors"] for r in results)
    print(f"\ncoverage: {len(results)} task case set(s) present")
    if any_err:
        print("GATE: INCONCLUSIVE — some cases errored (provider quota / no API key); rerun with a key")
        return 1
    print("GATE:", "PASS — judge validated on all present task sets" if all_pass else "FAIL — a task did not clear the bar")
    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(main())
