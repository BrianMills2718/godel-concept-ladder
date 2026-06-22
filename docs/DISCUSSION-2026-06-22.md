# Discussion log — 2026-06-22 (second-brain review → methodology evolution → landscape research)

A round that started as a review of the sibling `second-brain-ladder` instance and became
a methodology evolution + a knowledge-graph/GraphRAG/second-brain landscape map. Canonical
decision record: **ADR-0008**. Generalized theory: **METHODOLOGY.md** §8/§11/§13/§15.
Landscape evidence: **`second-brain-ladder/docs/research/`** (17 notes + synthesis README,
open in second-brain PR #2). Review fixes: second-brain PR #1.

## A. The arc
1. Adversarial review of `second-brain-ladder` → PR #1 (2 OWL content fixes + rewrote the
   wrong-project `CLAUDE.md`).
2. Inventory of the two built topics (Gödel, 17 stages; Second Brain, 17 modules).
3. Owner critique of the Second Brain site → a cluster of gaps that were *missing
   methodology requirements*, not one-off bugs.
4. Clarified the explanatory craft (Nicky Case = PEA / show-then-tell / Therefore-&-But /
   show-what-made-you-care / test-early — **not** interactivity).
5. Updated METHODOLOGY (§15 tensions, §11 craft, §8 skill-focus, §13 faithfulness).
6. Landscape research sweep → 17 notes.
7. Two owner course-corrections: (a) learner-empowerment + neutrality; (b) agentic =
   *adopt a harness*, not build one. Both folded back into notes + methodology.

## B. What we learned
- **Three paradigms, not one:** symbolic KG (legacy/niche) / GraphRAG (retrieve over an
  LLM-built graph) / **LLM-wiki–agentic** (front-load synthesis into navigable files an
  agent reads/maintains). Karpathy gist → karpathywiki plugin → Google OKF are paradigm 3.
- **PKM and KG/AI are the same artifact from two cultures** (backlink = edge; "AI over my
  notes" = RAG; an MOC = Karpathy's `index.md`).
- **"Reasoning over a KG" today is neural**, not OWL/DL — confirms the RDF-vs-property-graph
  correction; symbolic deductive reasoning is a niche.
- **Retrieval is a decision ladder:** keyword → vector → hybrid+rerank → GraphRAG →
  **agentic harness over files**.
- **Agentic SOTA = adopt + extend a harness** (Claude Code/Codex/Cursor/Cline + MCP/
  connectors/plugins), not build a ReAct/Self-RAG loop; build-your-own is the embedded/
  product case. MCP is the load-bearing extension surface. Agent shell+file access is a
  real, teachable security caveat.
- **DIGIMON's "method = graph type × retrieval operators"** is the best teachable decomposition.
- **Operate/maintenance is the hard, neglected layer**; antidote is an eval-gated living
  system (the method's own propose→gate→revise, handed to the learner).
- **Durable vs perishable:** teach durable concepts; date/quarantine perishable tool specifics.
- The existing SB content is high-quality but **mis-scoped to ~2018** and weak on pedagogy.

## C. Decisions (full record: ADR-0008)
- Methodology is the durable artifact; content-quality demands are first-class
  requirements that **conflict** → tension-resolution discipline (§15).
- Skill-focus = **practitioner capability** (understand→decide→plan→implement→operate),
  **neutral** on the answer.
- Implement often = **adopt + extend a harness**, not build from scratch.
- Karpathy reference = explanatory **craft**, not interactivity.
- Standing rules reaffirmed: explain every symbol/acronym; concept-before-syntax;
  non-trivial quizzes; judged activities; per-line confusion-anticipation; feedback sidebar.

## D. Artifacts
- **godel `master`:** METHODOLOGY §8/§11/§13/§15 updated; ADR-0008; this log; ROADMAP
  addendum. Gates green.
- **second-brain PR #1:** review content fixes + CLAUDE.md.
- **second-brain PR #2:** 17 research notes + synthesis README.
- **Memory:** educational-content-quality-bar, skill-based-focus, tension-resolution-
  methodology, second-brain-modern-scope, second-brain-ladder-sibling,
  agentic-harness-over-rolling-own.

## E. Uncertainties / concerns / ambiguities
1. **The rescope hasn't started** — research + methodology done; the Second Brain
   *curriculum* is unchanged. Biggest open work, unscoped.
2. **Ownership ambiguity** — `second-brain-ladder` is the other agent's repo; PRs #1/#2
   unmerged; unresolved whether we work in it, fork it, or build fresh, and who coordinates.
3. **Intent ambiguity** — fix the existing site / build new / evolve methodology only?
   We've leaned methodology-first; the build target is undecided.
4. **Coverage ↔ skill-focus unresolved in practice** — a §15 tension named, not resolved.
5. **Neutrality risk** — the owner's LLM-wiki preference is strong; even-handedness needs
   active discipline + the feedback loop.
6. **Pre-empirical** — none validated to teach better; §15, the feedback channel, and the
   R5 generator are all specified-not-built (both projects stall here).
7. **Research is point-in-time** (June 2026), directional, partly vendor-influenced.
8. **godel roadmap parked** — M2d has a live `cap-first` judge false-fail; M4/M5 stalled;
   whether Second Brain is the right M5 transfer test is open.
9. **Two open PRs accumulating** — will drift from `master` the longer they sit.

## Next decision needed
**Where the rescoped Second Brain gets built** (sibling repo / fork / fresh / methodology-
only). This unblocks the rescope plan; until then the plan is deliberately not written.
