# Roadmap & success criteria — from a hand-authored instance to a reliable content generator

- **Date:** 2026-06-21
- **Companion docs:** `SYSTEM_AUDIT.md` (grounded gap analysis), `METHODOLOGY.md` (the theory), `OVERNIGHT_PLAN.md` (historical).
- **Purpose:** an unambiguous long-term plan with **checkable** success criteria, so "done" is never a judgment call. Each milestone states *what to build*, *the exact success bar*, and *how it is verified*. Milestones are ordered; each ends green + committed.

## End-state definition (what the whole project is "done" means)

> **The system can take a topic specification and, via an LLM-in-the-loop
> propose→gate→revise pipeline, produce an educational instance that (a) passes the
> deterministic gate, (b) meets the content-completeness rubric (M1), and (c) is
> certified by an independent (non-agent) run — demonstrated on ≥2 topics including
> one *hostile* (co-constitutive / plural / empirical) topic.**

Empirical learning-efficacy (Tier-2, M6) is a **separate, later** validation,
deliberately deferred (METHODOLOGY §13) and **not** part of "the generator works."
"High-quality" until M6 means *meets the completeness rubric and passes every gate* —
an explicitly structural proxy whose correlation with learning is unmeasured.

## Sequencing rationale

A trustworthy generator (M4) is only as good as (i) the **gate** that checks it and
(ii) the **golden corpus** it is validated against. So both must precede it:
**M1 (define the target) → M2 (complete the gate) → M3 (build the golden corpus) →
M4 (the generator) → M5 (hostile transfer test) → M6 (efficacy).** M0 is immediate
hygiene. Within a milestone, work concept-by-concept, gate-green after each.

---

## M0 — Hygiene (DONE)
- **[DONE]** Validator in CI (`deploy.yml` runs `npm run validate` before build).
- **Success:** CI fails on invalid content. *Verify:* a deliberately-invalid push is rejected by the `validate` step.

## M1 — Define the target: a content-completeness rubric + report  *(in progress: slice done for `satisfaction`)*
Make "complete, high-quality content for a concept / stage" an explicit, checkable spec — the thing a generator must hit and a human can audit.
- Write the **completeness rubric** (`docs/COMPLETENESS.md`): per concept — definition, ≥1 example, microQuiz (required for **core** concepts), analogy (required where an *analogy-apt* flag is set), ladder viz (required where a *dynamical* flag is set); per stage — ≥1 viz, ≥2 confusions, quiz ≥3, mastery checkpoint, a real (non-banner) pretest where out-of-page prereqs exist, section roles present.
- Add an **`apt` flag set** (which concepts are dynamical / analogy-apt) so requirements are per-concept, not blanket. Maintain the list explicitly (no silent omissions).
- Add a **completeness report** script (extends `derive-report.mjs`): prints, per concept/stage, present/absent required fields + a coverage % per field.
- **Success criteria (unambiguous):**
  1. `docs/COMPLETENESS.md` exists and defines every required field per concept/stage and the `apt`-flag semantics.
  2. `node scripts/completeness-report.mjs` runs and emits a per-concept/stage table + headline coverage numbers.
  3. The gate **hard-fails** on the *currently-required* subset and **warns** (non-failing) on the aspirational subset, so the bar can ratchet up as M3 fills it.
- **Verify:** report runs; flipping a required field off for one concept makes the gate fail; the rubric doc review.

## M2 — Complete the gate (the independent authority)
Build the Tier-2 gates the audit flagged missing, so the gate is strong enough to certify generated content.
- **Artifact gate:** replace assertion-less screenshots with a puppeteer **e2e + structural-assertion** pass wired into `check`: every route loads with **0 console errors**; per viz kind ≥1 structural assertion (e.g. ladder renders exactly its 3 rungs; typed-graph renders all declared edges; comparison-table renders all cells); no raw `$…$`/unresolved `@ref` in rendered DOM.
- **Bare-prose closure linter:** scan lesson/section prose for known requirement-bearing terms (glossary/concept terms) used untyped; fail (with an allowlist) so the closure hole (METHODOLOGY §6/§16) is closed.
- **Order-selection scorer:** a pure function scoring a topological order against the §9 heuristics (new-symbol density, abstraction/example alternation, chain-length caps), with unit tests. (Scores; does not yet choose.)
- **Per-task judge eval:** every judged/hybrid task gets a frozen ≥8-case hand-graded set; `eval/run.py` measures false-pass ≤5% / false-fail ≤15% per task; results recorded in `backend/eval/FINDINGS.md`.
- **Success criteria:**
  1. `npm run check` includes the artifact e2e gate; it fails on a seeded broken render.
  2. Bare-prose linter is in the gate; it flags a seeded untyped requirement term.
  3. Order-scorer has tests and returns a total-ordering score for any valid order.
  4. **All 12 judged tasks** have a measured frozen set meeting the thresholds (currently 1/12).
- **Verify:** each gate negative-tested (seeded failure caught); `FINDINGS.md` shows 12/12.

## M3 — Build the golden corpus (complete the Gödel instance)
Fill the completeness rubric across the instance — this *is* Tier-1 content work and produces the examples M4 is validated against.
- Author the **~47 missing microQuizzes** (each tagged to its concept + the misconception it probes); analogies for every **analogy-apt** concept (with breakdown + handoff); ladders for every **dynamical** concept (the documented ~4–6); section roles across lessons; upgrade every page's pretest to ≥1 real check.
- **Success criteria:**
  1. Completeness report: **100% of required fields present** (M1 hard-subset = full set now); 0 warnings.
  2. microQuiz coverage = 100% of core concepts; ladder coverage = 100% of dynamical-flagged; analogy coverage = 100% of analogy-apt-flagged.
  3. Every page with out-of-page prereqs has a real (non-banner) pretest.
  4. Tier-1 edge-review (METHODOLOGY §13 rubric) completed for all 106 edges, logged in `EDGE_REVIEW.md` with a verdict per edge.
- **Verify:** completeness report all-green; `EDGE_REVIEW.md` has a verdict column with no blanks.

## M4 — The generation loop (the actual "automatic")
- Build the **agentic propose→gate→revise** harness (via `llm_client` agentic coders, ADR-0005): it edits source data files, runs `npm run check` + the artifact gate, and iterates to green. An **independent, non-agent** run re-certifies (proposer ≠ certifier).
- **Built-in efficacy check:** hold out one fully-authored stage from M3, regenerate it from the concept graph + gates, and compare to the golden version.
- **Success criteria:**
  1. The loop regenerates a **held-out stage** to a state that passes `npm run check` + artifact gate **and** meets the M1 completeness rubric, with **no human edit**.
  2. An independent CI run (not the proposer) certifies the result.
  3. The regenerated stage matches the golden stage on a documented quality bar: all required fields present; an independent judge rubric scores it ≥ an agreed threshold vs the golden.
- **Verify:** the held-out regeneration is reproducible from a clean checkout; certifier run is green.

## M5 — Hostile second topic (the transfer test)
- Author a **hostile** topic (mechanics / statistics / ecology — co-constitutive, plural, or empirical) to the M1 completeness bar, via M4 where possible.
- **Success criteria:**
  1. A second instance passes all gates + the completeness rubric.
  2. It **exercises** move-4 maturity-versioning or the degraded mode (a real co-constitutive cluster handled), and/or a disjunctive prerequisite — i.e. uses the machinery Gödel didn't.
  3. A written post-mortem records exactly where the method strained and which §15 row(s) it hit.
- **Verify:** second instance green; post-mortem doc exists.

## M6 — Empirical efficacy (Tier-2, deferred; the terminal criterion)
- Only after M1–M5. Pre/post learning gain, misconception elimination, transfer, retention, vs baselines, prose held constant (METHODOLOGY §13).
- **Success criteria:** a pre-registered study with the above endpoints; this is the first point at which any *learning* claim may be made.

---

## Addendum (2026-06-22): methodology evolution + a Second Brain track

This roadmap targets the **generator** (M4) over a *structural* gate. A design round on
2026-06-22 (ADR-0008; METHODOLOGY §8/§11/§13/§15) added a **soft content layer above the
structural gate** — explanatory craft, a tension-resolution discipline, skill-focus =
practitioner-capability + neutrality, and set/time faithfulness. Roadmap consequences:

- **M1's completeness rubric is now known-incomplete.** It checks structural presence, not
  craft, quiz-distractor quality, judged *activities*, neutrality, tension-resolution, or
  plan→implement→operate coverage. **Owed:** a rubric expansion, and where feasible
  **tension *detectors*** (flag a collision, demand a recorded resolution — not pass/fail).
  These are *soft*; they do not block M2–M4 but raise the bar M4 must eventually hit.
- **Second Brain rescope = a partial M5 transfer test (now planned).** A landscape sweep
  (17 notes in `second-brain-ladder/docs/research/`) maps the modern KG/GraphRAG/LLM-wiki/
  agentic-harness field. The sibling instance is mis-scoped (2018 symbolic stack); the
  **rescope is now planned** — *in place, in the sibling repo, branch-based, evolving
  `concepts.ts`* — see `second-brain-ladder/docs/RESCOPE_PLAN.md` (PR #3), milestones R0–R5.
  It is a **partial** M5: it stresses **plurality/neutrality** (competing paradigms, no
  single right answer), **set/time faithfulness** (fast-moving field), and the
  **decide→plan→implement→operate** arc — but **not move-4 maturity-versioning** (no
  genuine co-constitutive cycle), so a co-constitutive topic (mechanics) is still owed for
  a complete M5.
- **Companion docs:** `ADR-0008`, `DISCUSSION-2026-06-22.md`, and the research notes above.

## Standing rules (do not re-litigate)
- Every milestone ends with `npm run check` green + a commit (+ push).
- A failed gate is a content discovery, not an obstacle.
- "High-quality" = completeness-rubric + gates until M6; never assert efficacy before M6.
- No silent coverage caps: the completeness report names everything still missing.
- Math correctness per `CONTENT_NOTES.md` is paramount; a subtle content error is a critical bug.

## Current status (2026-06-22)
- **M0 done.** Validator in CI.
- **M1 done.** `docs/COMPLETENESS.md` + apt-flag sets + `npm run completeness`.
- **M2a done.** `npm run e2e` artifact gate (caught 3 real render bugs).
- **M2b done.** Bare-prose closure linter + `foreshadows` (in `npm run validate`).
- **M2c done.** `src/content/orderScore.ts` + tests (in `npm run check`).
- **M2d partial.** Harness generalized to all tasks; **12/12 case sets authored + committed**.
  2 measured with a refreshed key: `cap-distinguish` **PASS** (false-pass 0 / false-fail 0),
  `cap-first` **FAIL** — a false-fail on the `minor-imprecision` case (scored 77). Owed:
  revise `cap-first`'s pass-cases to cover the rubric, then run the full 12-task eval and
  record in `backend/eval/FINDINGS.md`.
- **M3 done.** Completeness ALL-GREEN and hard-gated (31 microQuizzes, 6 analogies,
  5 ladders, examples 60/60, section roles 17/17, real pretests 15/15); Tier-1 verdicts
  for all 108 edges (102 correct / 6 arguable / 0 wrong) in `EDGE_REVIEW.md`.
- **M4 partial / BLOCKED.** Independent certifier `npm run certify` built and passing
  (deterministic gates + e2e against a fresh preview — the proposer≠certifier authority).
  Loop scaffold `scripts/generate.mjs` (`--dry-run` certifies; `propose`/`revise` are
  `llm_client` agentic-coder steps, **stubbed — blocked on API access**).
- **M5 BLOCKED** (needs M4's agentic loop + is a full second instance). **M6 deferred.**

**Net:** everything executable without API access is done (M0–M3 + M4 certifier). The
remaining work (M2d measurement, M4 agentic propose/revise, M5) is gated on
`llm_client` + an API key; M6 is the deferred empirical milestone.
