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
npm run typecheck
```

## Architecture
- `src/types.ts` — the content contract (Lesson, typed graph nodes/edges, quiz union)
- `src/content/lessons/` — one file per stage; add to `lessons/index.ts`
- `src/components/viz/` — typed-graph / parse-tree / comparison-table renderers
- `src/components/Quiz.tsx` — MC / multi-select / true-false / classification
- `src/store/progress.ts` — localStorage, soft gating (never blocks navigation)

## Status
Vertical slice: **Stage 0** (Four-Level Map) and **Stage 1** (Symbols, Terms,
Formulas, Sentences) are fully built. Stages 2–16 are stubbed in the sidebar.
See `CONTENT_NOTES.md` for math-correctness decisions for the later stages.
