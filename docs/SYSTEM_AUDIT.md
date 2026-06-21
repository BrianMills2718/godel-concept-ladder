# System audit — where the Gödel instance stands vs the methodology, and what a reliable auto-generation system needs

- **Date:** 2026-06-21
- **Method:** three grounded auditors read the actual codebase (content-attachment, assessment, generation/robustness) and reported BUILT / PARTIAL / MISSING with file evidence + counts. This doc synthesizes them.
- **Purpose:** answer three questions honestly — (1) are we done optimizing the Gödel instance? (2) have we determined what's needed for a system that *reliably and automatically generates high-quality content robustly*? (3) have we incorporated PEA / ladder-of-abstraction / visuals / quizzes?

## Headline determination

1. **Done optimizing Gödel? No.** Content *correctness* is in good shape (recent fixes) and the *typed-visualization* + *quiz-engine* + *judge* pieces are solid. But the **content-attachment layer is largely unbuilt**: analogies = 0, ladder-of-abstraction = 0, running through-line = none (fixed cast only), and **microQuiz coverage is 13/60**, which leaves most prerequisite pretests banner-only or 1-of-N.
2. **Reliable + automatic + robust generation? It does not exist — there is zero generation code.** All content is hand-authored TypeScript. The "propose → gate → revise" loop is honestly labeled specified-not-built by its own ADRs. So "automatically generate" is 0% built; this audit *is* the determination of what's needed (roadmap below).
3. **PEA / ladder / visuals / quizzes incorporated? Partially.** Pictures (typed visualizations), in-domain Examples (58/60), and quizzes (6 types) are built. **Analogies (the third PEA leg), the ladder recipe, the running artifact, and most micro-checks are not.**

## Capability matrix (evidence-based)

### Built and solid
| Capability | Evidence |
|---|---|
| Deterministic validation **gate** (form) | `scripts/validate-content.mjs` — closure, prerequisite acyclicity, group-coherence, PREREQ_WHY/KIND completeness, quiz integrity, typed-graph edge validity, stage minima |
| **Typed visualizations** (anti-category-error) | 6 viz kinds; 14/18 instances are `typed-graph`; mandatory `textualSummary` a11y fallback, gated |
| In-domain **examples** | 58/60 concepts have `example` |
| **Quiz engine** | `Quiz.tsx` — 6 types (MC, multi-select, T/F, classification, fill-in, matching); 13 capstones |
| **LLM judge** | `backend/godel_judge/judge.py` — server-side pass recompute, fatal-misconception + low-confidence override, remediation routing; **validated** (false-pass 0/5, false-fail 0/3, `backend/eval/FINDINGS.md`) |
| **Derivation** | `derive.ts` — group-lift, Tarjan SCC lint, transitive reduction, goal-closure |

### Partial
| Capability | State | Evidence |
|---|---|---|
| **microQuiz coverage** | **13/60** concepts have one; 47 missing (incl. high-fan-out: satisfaction, formation-rule, formal-theory, provability, godel-sentence, first/second-incompleteness) | `concepts.ts` |
| **Prerequisite pretests** | mechanism correct; only **4 stages** get a multi-check pretest; many 1-of-N (stage-9: 1/5, stage-15: 1/6); stage-13 banner-only | `Definitions.tsx:273-317`, `concepts.ts:prerequisiteConceptsForStage` |
| **Judge validation** | real, but measured on **1 of 12** tasks (`cap-distinguish`); other 11 gate on an unmeasured judge | `backend/eval/{cases.json,run.py,FINDINGS.md}` |
| **Item→concept/misconception matrix** | only at *task* level (`requiredConcepts`,`fatalMisconceptions`); individual quiz/microQuiz items carry no concept/misconception tag | `types.ts:QuizBase`, `assessments.ts` |
| **Order selection** | topological order only; no optimizer over valid orders; authored middle-out | `derive.ts`, METHODOLOGY §9 |
| **Three assessment strengths** | de-facto separated by which component renders; not encoded as typed data | — |
| **Spiral gloss** | authoring convention backed by the closure checker; no marker/field | CLAUDE.md |

### Missing
| Capability | Evidence / note |
|---|---|
| **Automatic generation loop** | 0% — no propose→gate→revise code anywhere; all content hand-authored (ADR-0005 Phase 2 unbuilt) |
| **Gate in CI** | `.github/workflows/deploy.yml` runs only `npm run build` — `npm run check` (tsc + validator) is **not** in CI and can be bypassed on push. **Cheap, high-value fix.** |
| **Artifact gate (structure-matches-claims)** | `scripts/screenshots.mjs` captures PNGs with **no assertions**; no e2e |
| **Truth check beyond form** | gate certifies well-formedness, not edge *correctness*; Tier-1 independent edge review (rubric now in METHODOLOGY §13) not wired in |
| **Analogies + breakdown points** | 0 instances, no data field — the missing third PEA leg |
| **Ladder-of-abstraction recipe** | implemented nowhere even statically; only 2 "control-a-parameter" widgets (CodingEncoder stage-12, ParseExplorer stage-1), no abstract-over/step-down, no coverage log |
| **Running through-line artifact** | fixed cast only (the intended *fallback*); no backward-derived evolving artifact, no artifact-track closure check |
| **"Therefore & But" / show-then-tell ordering** | prose convention; `Section` is untyped `{heading,body}`; no section-role mechanism |
| **Bare-prose closure** | gate sees only typed `@t{}`/`@c{}`; untyped prose can smuggle a forward requirement |

## Two different goals (do not conflate)

The question entangles two distinct objectives:

- **(A) Optimize *this* instance** — hand-author the missing content so the Gödel app fully embodies the methodology (analogies, ladder figures, the 47 microQuizzes, richer pretests). Improves Gödel quality; **does not** build the generator.
- **(B) Build a system that reliably + automatically generates** — the meta-capability that works for *any* topic (the loop + gates-in-CI + artifact gate + truth check + per-task judge validation + order selection).

**Key sequencing insight:** most (A)-gaps are *missing data-model slots and missing gates* (an `analogy` field, section-role tags, per-item concept/misconception tags, a ladder-coverage log, an artifact-assertion gate). Those same slots and gates are exactly what a generator in (B) must target. **You cannot reliably auto-generate "high-quality content" until "high-quality, complete content for a concept/stage" is itself encoded as checkable invariants + data slots.** So harden the substrate first, then build the loop, then test on a hostile second topic.

## Roadmap

### Tier 0 — quick wins (hours)
- **Put `npm run check` in CI** (`deploy.yml`) — close the bypass hole; make the gate the independent certifier.
- **Generalize `eval/run.py` to per-task frozen sets** and run it for the other 11 judged tasks (the harness already exists).

### Tier 1 — complete this instance (the "optimize Gödel" ask), each gated
- Author the **47 missing microQuizzes** (tagged to concept + the misconception they probe) → upgrades pretests from banner/1-of-N to real.
- Add **analogies + breakdown points** (data field + populate the obvious ones, e.g. chess ↔ formal system, with the "Therefore & But" handoff).
- Implement the **ladder-of-abstraction recipe** for the ~4–6 dynamical concepts (at minimum static control→abstract-over→step-down figures) + a coverage log.
- Decide running-artifact vs cast explicitly; if cast, add an artifact-track closure check.

### Tier 2 — harden the substrate into a generation *target* (data model + gates)
- Data-model fields: `analogy{mapping,breakdown,handoff}`, **section roles** (`problem`/`solution`/`show`/`tell`) for show-then-tell, **per-item** `concepts`/`misconceptions` tags on `QuizBase`, spiral-gloss markers, ladder-coverage.
- Gates: **artifact structural assertions + puppeteer e2e** in `check`; **bare-prose requirement-term linter**; (optional) **order-selection scorer** over valid topological orders.
- Wire **Tier-1 edge-review** (the §13 rubric) as the truth check auto-generated content will need most.

### Tier 3 — the generator, then the real test
- Build the **agentic-coder propose→gate→revise loop** (edits source files, runs `check`, iterates), with an **independent (non-agent) certifier** run.
- Only then: **author a hostile second topic** (mechanics / statistics / ecology) — the genuine transfer test, now exercising move-4/degraded-mode/disjunctive-prereqs.

## One honesty note to reconcile
The judge is **validated on 1 of 12 tasks** — docs that call it flatly "live and validated" (e.g. CLAUDE.md) should say "validated on `cap-distinguish`; other tasks gated by an unmeasured judge until per-task eval sets exist."
