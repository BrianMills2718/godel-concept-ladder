# Overnight build — mission & acceptance criteria

> **STATUS: COMPLETE (2026-06-19).** All 20 tasks done. 17 stages (0–16) authored
> + 2 flagship interactives + 6 quiz types + 61-term glossary. `npm run check`
> (typecheck + content validator + build) passes. Working tree clean, all
> committed. See README status table.

**Mission:** Complete the Concept Ladder site — author all remaining stages
(2–16) plus the two flagship interactives, on top of the verified Stage 0–1
slice. Run continuously until done. Soft gating throughout.

**Re-read this after any compaction. Track work in the task list (#1–#20).**

## Order of execution
Infra just-in-time, then stages in sequence:
1. Quiz types: fill-in + matching (#1) — needed by Stage 5, 12.
2. Stages 2→4 (#4–#6).
3. Stage 5 (#7, uses fill-in).
4. Stages 6→11 (#8–#13).
5. Encoder viz (#2) → Stage 12 (#14).
6. Stage 13 (#15).
7. Loop viz (#3) → Stage 14 (#16).
8. Stages 15→16 (#17–#18) — apply CONTENT_NOTES §1 carefully.
9. Glossary expansion (#19).
10. Final polish/build/commit (#20).

## Per-stage definition of done
- `stageN.ts` authored: summary, objectives, definitions, sections, ≥1 typed
  visualization, ≥2 common-confusion boxes, ≥3 quiz questions, mastery checkpoint.
- Registered in `src/content/lessons/index.ts` (moved out of UPCOMING).
- `npx tsc -b --noEmit` clean.
- Math correctness follows `CONTENT_NOTES.md` (esp. Stages 9, 14, 15, 16).
- Committed (one commit per stage or tight pair).

## Global acceptance criteria (from the original spec)
1. Site separates well-formedness / provability / truth / metatheory / coding —
   visibly, via typed nodes + typed edges with legends.
2. Learner can see why 2+2=5 is well-formed but false; 2+2=4 provable & true;
   G_T arithmetic not paradox; Proof_T an arithmetic predicate; metatheory ≠ a
   node inside T.
3. Every stage has a quiz with meaningful feedback (why correct + why wrong).
4. Typed, consistent graph notation with legend + textual fallback.
5. No unexplained term: everything used is in the glossary.
6. Sequential navigation, review previous concepts (sidebar).
7. Math renders (KaTeX).
8. Clean, modular, content-driven (add a lesson without touching components).

## Verification at the end
- `npx tsc -b --noEmit` clean, `npm run build` succeeds.
- Dev server serves all 17 stages; spot-check each route renders.
- README status updated; final commit pushed-equivalent (local commit, no remote).
