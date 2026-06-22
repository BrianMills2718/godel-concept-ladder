# ADR-0008 — Content craft, conflicting desiderata, and skill-focus: the soft layer above the gates

- **Status:** Accepted (stance / target). **Not implemented** — the new desiderata are a
  *soft* layer; none are gate-enforced, the tension-detector tooling and the in-product
  feedback channel are specified-not-built, and the second-brain rescope they motivate is
  a separate, unstarted track.
- **Date:** 2026-06-22
- **Builds on:** ADR-0004 (methodology), ADR-0006 (PEA / explanatory devices), and
  METHODOLOGY §8/§11/§13/§15 (where these decisions are written in full).
- **Owner:** Brian
- **Source:** independent review of the sibling `second-brain-ladder` instance + a design
  discussion; N. Case, *"How To Explain Things Real Good"*; a knowledge-graph / GraphRAG /
  second-brain landscape research sweep (17 notes, `second-brain-ladder/docs/research/`).

## Context

Reviewing the sibling second-brain instance surfaced that the methodology's gates enforce
**structure** (closure, acyclicity, coherence, coverage) but say nothing about whether the
content is **good to learn from**. A graph can pass every gate and still be flat, dated,
or unteachable — "if the cheap path passes the gates, the gates are incomplete," now
turned on our own gates. Four things followed: (1) the explanatory **craft** is unspecified;
(2) the content desiderata **conflict** with each other, so a checklist can't express them;
(3) skill/practitioner domains need a **decision-and-capability** framing, not a taxonomy;
(4) field-scoping must be **neutral and current**, not an author's favored slice.

## Decisions

1. **Content craft is first-class (METHODOLOGY §11).** Adopt the tested craft: *show what
   made you care* (motivation before mechanism); *show-then-tell* via PEA, concrete before
   abstract, and **concept before syntax** (never introduce an idea through a specific
   language's notation); *Therefore & But* (a problem→solution arc, not a listicle);
   **explain every symbol, notation, and acronym completely** (closure pushed to sub-token
   granularity — a standing requirement); a **per-line confusion-anticipation pass**; and
   *test early / heckle often*.
2. **The desiderata conflict — adopt a tension-resolution discipline (§15).** Name the
   competing **forces** (rigor↔concision, coverage↔skill-focus, depth↔legibility,
   concrete-first↔closure, running-artifact↔per-concept-aptness); resolve **per unit, by
   role, and record the rationale**; use **tension *detectors*** (flag a collision, demand
   a recorded resolution) rather than pass/fail gates; resolve **holistically** with a
   whole-graph re-check and iterate. This is the "optimize within the envelope" half of §10.
3. **Skill-focus = practitioner capability, neutral on the answer (§8).** The terminal
   goal is "can act in X": *understand alternatives → weigh tradeoffs → decide & plan →
   implement → operate* for the learner's **own** goal. Coverage extends past concepts to
   the plan→implement→operate layer. The author's job is to **empower the learner's
   decision, not win the debate**: present a fair menu, each option honestly costed; an
   author's preference is one option, never the spine. *Operate* is the hardest, most-
   dropped segment, and the antidote is teaching an **eval-gated living system** —
   recursively the same propose→gate→revise loop this method uses.
4. **Implement often = adopt + extend, not build (§8).** In modern practitioner domains
   the capable move is to adopt and extend an existing platform/tool/agent harness
   (select, configure, connect, extend via its integration surface), not reimplement it —
   so the implementation skill is selection + configuration + information architecture.
   (Concretely for knowledge work: adopt an agent *harness* over your files + MCP/connectors,
   rather than build a RAG/ReAct loop; build-your-own is the embedded/product contrast.)
5. **Faithfulness has a set and a time dimension (§13).** Beyond per-edge correctness,
   Tier-1 owes a **set-coverage / current-scope audit** (are these the concepts a
   present-day expert would teach?); and in fast-moving domains, separate the **durable**
   (pipeline shape, decision axes) from the **perishable** (framework APIs, prices) —
   teach the durable, date/quarantine the perishable.

## Consequences

- The deterministic gates remain **structure-only**; everything in this ADR is a **soft
  layer** that is *not* gate-enforced today. The M1 completeness rubric is therefore now
  **known-incomplete** — it does not yet check craft, quiz-distractor quality, judged
  activities, neutrality, tension-resolution, or plan→implement→operate coverage. A rubric
  expansion (and, where possible, tension *detectors*) is owed.
- The generalized principles are captured in `METHODOLOGY.md`; the landscape evidence is in
  the second-brain research notes; this ADR is the decision record tying them together.
- The second-brain instance is **mis-scoped** (2018 symbolic stack) and motivates a
  rescope — a **separate track**, not yet planned (see Open questions).

## Open questions / uncertainties

- **Tension-resolution is specified, not built** — no forces-registry tooling or tension
  detectors; resolution is discipline, not CI. Same status as the R5 generator (§15).
- **The in-product feedback channel** (heckle-test signal) is specified, not built.
- **Neutrality vs. the owner's preference** (the LLM-wiki / agentic-harness paradigm): a
  real risk the content tilts; needs active discipline + the feedback loop to catch it.
- **Coverage ↔ skill-focus is unresolved for any concrete topic** — exactly a §15 tension
  we've named but not resolved.
- **Everything here is pre-empirical** (METHODOLOGY §13 deferral); the new desiderata are
  unvalidated proxies for learnability like the structural ones.
- **Where the rescoped second brain lives** (sibling repo / fork / fresh) is undecided,
  which blocks writing its plan; and whether second brain is the right **M5 hostile-transfer
  topic** (it is externally-owned and a moving target) is open.
- The landscape research is **point-in-time (June 2026)** and partly vendor-influenced;
  cost/tradeoff figures are directional, not benchmarks.
