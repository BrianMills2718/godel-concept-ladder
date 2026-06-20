# The Concept Ladder — Gödel Prerequisites

An educational site that teaches the prerequisites for Gödel's incompleteness
theorems by keeping five layers **strictly apart**: syntax, proof, semantics
(truth-in-a-structure), Gödel coding, and metatheory. The pedagogical goal is
not "explain Gödel" — it is to prevent the category errors (well-formed =
provable = true) that ordinary explanations skip over.

## Stack
- Vite + React + TypeScript
- KaTeX for math, React Flow for typed node-link graphs (DAGs only)
- Content is plain data (`src/content/`); no backend; progress in localStorage

## Develop
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static bundle in dist/ (relative paths, deploys anywhere)
npm run validate   # structural check of all lesson/quiz/graph content
npm run check      # typecheck + validate + build (full gate)
```

## Architecture
- `src/types.ts` — the content contract (Lesson, typed graph nodes/edges, quiz union)
- `src/content/lessons/` — one file per stage; add to `lessons/index.ts`
- `src/content/glossary.ts` — 61 terms, every technical word used in a lesson
- `src/components/viz/` — five renderers: typed-graph (React Flow), parse-tree,
  comparison-table, coding-encoder (interactive prime-power BigInt), godel-loop
- `src/components/Quiz.tsx` — MC / multi-select / true-false / classification /
  fill-in / matching, with immediate feedback + why-wrong explanations
- `src/store/progress.ts` — localStorage, soft gating (never blocks navigation)
- `scripts/validate-content.mjs` — bundles content with esbuild and asserts
  invariants (stage coverage, quiz answer ranges, graph edge endpoints, a11y
  summaries)

## Status — complete
All **17 stages (0–16)** are authored, registered, and validated:

| | | |
|---|---|---|
| 0 Four-Level Map | 1 Symbols→Sentences | 2 Grammar |
| 3 Proofs | 4 Proof graphs | 5 PA & 2+2=4 |
| 6 Structures | 7 Satisfaction (⊨) | 8 ⊢ vs ⊨ |
| 9 Sound/Complete | 10 Object vs Meta | 11 Computability |
| 12 Gödel coding | 13 Proof_T/Prov_T | 14 Diagonalization |
| 15 First Incompleteness | 16 Second Incompleteness | |

`CONTENT_NOTES.md` records the math-correctness decisions (consistency vs
soundness vs ω-consistency/Rosser; Fixed-Point Lemma; the two senses of
"complete"; representability) applied across Stages 9–16.

### Acceptance criteria (from the spec)
- [x] Separates well-formedness / provability / truth / metatheory / coding via
      typed nodes + typed edges with per-graph legends.
- [x] Shows 2+2=5 well-formed-but-false; 2+2=4 provable & true; G_T arithmetic
      not paradox; Proof_T an arithmetic predicate; metatheory ≠ a node in T.
- [x] Every stage has a quiz with why-correct + why-wrong feedback.
- [x] Typed, consistent graph notation + textual fallback (a11y).
- [x] No unexplained term — all are in the glossary (validated).
- [x] Sequential navigation + review (sidebar); soft mastery gating.
- [x] Math renders (KaTeX); clean, content-driven (add a lesson without touching
      components).
