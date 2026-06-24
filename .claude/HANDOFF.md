# Godel — Session Handoff

Educational site teaching prerequisites for Gödel's incompleteness theorems. Core
mission: prevent category errors (`well-formed ≠ provable ≠ true ≠ metatheoretically
known`). The concept graph in `src/content/concepts.ts` is the source of truth;
everything else is derived from it.

## What was done

The main sprint (CF1–CF4, C1–C4, D1–D2) is **complete**:
- Four-level framing replaced with two-axes (⊢ vs ⊨, object vs meta) — c-syntax/c-proof/c-structures are the DAG roots
- Reference-closure checker enforces no-forward-ref at build time
- LLM judge backend live and validated (0 false-pass on frozen set)
- Typed/dropdown goal selection highlights prerequisite sub-DAG
- `npm run check` green; backend grading verified end-to-end

Post-sprint:
- **ADR-0007 Ph.1** (db722cf): prerequisite pretest mechanism — per-page readiness banner + microQuiz assembly from concept graph. Soft-diagnostic only; never blocks navigation.
- **ADR-0006** (0f8aced): Accepted framework for explanatory devices (PEA: Pictures/Examples/Analogies; ladder-of-abstraction; two-track backward derivation from terminal artifact). **Not yet implemented in content.**

## Active uncertainties

**U1 [HIGH] — ADR-0006 not implemented.** The explanatory-device framework is accepted doctrine but the content still has a fixed cast and no analogies. Any content improvement work should check ADR-0006 first.

**U2 [MEDIUM] — ADR-0007 coverage is thin.** Most concepts lack a `microQuiz`, so most pretests render as readiness-banner only. Real diagnostic value requires authoring checks for high-fan-out concepts (proof, formula, etc.) first.

## Pending work

**P1 (high / large):** Author `microQuiz` for high-fan-out prerequisite concepts. Find top-N by counting prerequisite-array references to each concept in `concepts.ts`. A check on `proof` or `formula` pays off across many pages automatically.

**P2 (medium / large):** Implement ADR-0006 in content — audit concepts for analogy candidates, mark breakdown points, derive terminal artifact and work backward per two-track method. `RUNNING_EXAMPLE.md` already notes a single sentence can't span all 17 stages; use the small-consistent-cast fallback.

**P3 (low / small):** ADR-0007 UX hardening — cap pretest at ~3 questions, make it collapsible, suppress once prerequisite pages are passed (localStorage).

## Build commands

```bash
npm run check       # tsc + content validator + build (the gate)
npm run screenshots # visual pass (puppeteer, WSL needs --disable-dev-shm-usage)
cd backend && python -m pytest -q
```

## Files that must NOT be edited directly

- `src/content/graph.ts` — derived from concept graph; edit `concepts.ts` instead
- `src/content/derive.ts` — the derivation engine; changes require re-running derive-report

## Quick sanity checks

```bash
npm run check       # should exit 0
cd backend && python -m pytest -q   # all pass
node scripts/derive-report.mjs      # no SCC cycles, no unjustified edges
```
