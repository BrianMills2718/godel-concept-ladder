# godel — project instructions

Educational site teaching the prerequisites for Gödel's incompleteness theorems.
Core mission: **prevent category errors** — make `well-formed ≠ provable ≠ true ≠
metatheoretically known` visible. Not a generic "Gödel explainer."

## Architecture (current → target)
- **Current:** linear 17-stage ladder (`src/content/lessons/stageN.ts`), static
  Vite/React/TS frontend, KaTeX, React Flow typed-graph viz, content-as-data.
- **Target (ADR-0001):** typed **prerequisite DAG** ("skill tree" in UI) with
  **achievement-as-assessment** (deterministic + LLM-judged hybrid grading) and a
  FastAPI/`llm_client` judge backend. See `docs/ADR-0001-skill-dag-pivot.md` and
  `docs/MIGRATION_PLAN.md`. The linear ladder = one topological ordering; content
  is preserved and attached to nodes.

## Content invariants (enforced)
- **No forward references (prerequisite closure).** Every concept a node uses must
  be introduced at that node or a transitive prerequisite — "has this already been
  explained?" is a build gate, not a hope. Enforced by the closure checker in
  `scripts/validate-content.mjs`: a `@t{term}` ref must resolve to a lesson that
  defines it at-or-before the node. `@n{}` notation chips are self-contained
  (carry their own definition). Unavoidable early refs (PA) use **spiral glosses**
  — a one-line working definition up front, deepened later — not a bare name-drop.
  Orientation nodes (stage-0) preview deliberately and are exempt.
- **Two distinctions, not four levels.** The faithful frame is one precondition
  (well-formed) + two orthogonal axes: `⊢ vs ⊨` (provable vs true) and object vs
  metatheory. Proof is on the syntactic side; metatheory is a vantage, not a
  level. The DAG roots are the atoms (syntax, structures); the "Two Distinctions"
  node is an optional, non-gating map.
- **Beware recency over-indexing.** This project was spurred by the end of a long
  ChatGPT thread; generated specs over-fixate on whatever was salient late
  (the old "four levels", the 9 edge types, the elaborate judge schema). Pressure-
  test foundational framings against standard sources, not the chat's last turn.

## Non-negotiables
- **Math correctness is the product.** Apply `CONTENT_NOTES.md` (consistency vs
  soundness vs ω-consistency/Rosser; Fixed-Point Lemma; two senses of "complete";
  representability). A subtle content error is a critical bug here.
- **Fixed running cast** (`RUNNING_EXAMPLE.md`): `T=PA`, `ℕ`, `2+2=4`,
  `∀x(x+0=x)`, `2+2=5`, the malformed string, `G_T`/`Con(T)`. Use `G_PA` when the
  theory is named PA (no `G_T`/`PA` drift).
- **Every symbol defined at use** via `@n{key}` (notation.ts) / `@t{slug}`
  (glossary). The validator fails on unresolved `@refs`.
- **Verify by running it.** `npm run check` (tsc + content validator + build).
  The headless visual pass (`npm run screenshots`, puppeteer, `--disable-dev-shm-usage`
  for WSL) is mandatory before declaring UI done — it has already caught two
  page-freezing bugs that tsc/validator/review all missed.

## LLM judge (when building Phase C)
Must use the ecosystem: `llm_client` (`task=`,`trace_id=`,`max_budget=`),
`json_schema` structured output (`JudgeResult`; fatal-misconception fields
required), prompts-as-data (YAML/Jinja, no f-strings), a typed `@boundary`,
FastAPI + API parity, and **validate with `prompt_eval` on a frozen case set
before it gates any achievement** (target false-pass ≤5%, false-fail ≤15%).
API key backend-only; treat learner input as untrusted (prompt injection).
