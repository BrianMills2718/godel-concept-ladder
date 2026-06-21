# Constructing Optimal Educational Output: A Concept-Graph-First Methodology
### (for topics with a representable prerequisite structure)

*A construction theory, not an efficacy study. It specifies how to build a
learnable treatment of a topic — ordered lessons, a navigable skill map,
assessments, visualizations, a glossary — by making the topic's **conceptual
dependency structure** an explicit, machine-checked artifact and **deriving** the
curriculum from it. It is grounded in a deployed reference architecture (the
"Concept Ladder" for Gödel's incompleteness theorems) but written to apply to any
topic that can be represented as concepts plus prerequisite relations. It argues
for **structural** optimality and is explicit (§13–§15) about the empirical claims
it deliberately does **not** make.*

---

## Reading contract

> **"Optimal" is stipulative and structural — a spiral gloss here, fully defined in
> §14.** Until §14, read *optimal educational output* as a one-line working
> definition: a treatment that is dependency-faithful, gap-free, acyclic,
> derived-order, inspectable, verifiable, and misconception-targeted. This names
> *satisfaction of structural constraints*, not maximization against a measured
> objective. A reader who prefers **well-structured** or **sound** may substitute it
> throughout without loss. (Introducing a term by a one-line gloss and deepening it
> at its own node is itself a method device — §11; this paper uses it on its own
> headline term.)
>
> **Form is not correctness — the single most important caveat (stated once,
> referenced after).** The gates verify the **form** of the structure (closure,
> acyclicity, coherence, traceability). They do **not** verify that any individual
> prerequisite judgment is **true**, nor that learners learn better. A graph can be
> perfectly well-formed and encode entirely wrong dependencies. Deciding whether an
> edge is *correct* is expert work the gates support but cannot replace (§13, Tier
> 1). Read "verified" as "verified well-formed," never "verified correct,"
> everywhere below.
>
> **Empirical efficacy testing is deferred by design — a deliberate sequence, not an
> omission.** This paper claims only structural well-formedness. Measuring whether
> the treatment actually teaches better (learning gain, transfer, retention — §13
> Tier 2) is **intentionally postponed until the construction system is complete**:
> you cannot run a clean ablation isolating "derived structure" until the
> structure-producing pipeline is stable, so the engineering order is *build the
> deterministic substrate → layer soft optimization → then measure*. The honest cost
> of that choice: **the internal metrics this paper optimizes (closure, acyclicity,
> coverage %, group coherence) are unvalidated proxies for learnability, with
> unknown — possibly zero, conceivably negative — correlation to actual learning.**
> "Necessary, not sufficient" understates it: a proxy can also *mislead* (maximal
> decomposition satisfies group-coherence yet may cause the atomization/fatigue
> failure of §16). Every design decision made before Tier 2 — granularity, the four
> cycle-resolution moves, the ordering heuristics — is therefore **provisional and
> may be reversed by efficacy data.**
>
> **Reference architecture (the numbers the paper cites).** A deployed static site
> teaches the prerequisites for Gödel's incompleteness theorems as a derived skill
> map over **60 concepts / 17 stages / 106 prerequisite edges** (each edge carries a
> mandatory justification and a semantic kind). Source of truth:
> `src/content/concepts.ts`; derivation: `derive.ts` + `graph.ts`; build gate:
> `scripts/validate-content.mjs`; design records: ADR-0002…ADR-0007. File references
> are illustrative, not requirements. **The reference topic is a near-best-case
> instance** (formal, definitional, compositional, single terminal theorem,
> uncontested), which §15 weighs honestly.

---

## §0. How this paper is built — by its own method

To dogfood the methodology, the paper's own ideas are treated as a concept graph:
each section is a concept with **local prerequisites**, and the **section order is a
topological order of that graph** — derived, not hand-sequenced. The full
node→prerequisite listing is Appendix A; the shape is:

```
 the-problem        ── (root)
 concept            ── (root)
   prerequisite           ← concept
   relation-typing        ← prerequisite
 concept-graph            ← concept, prerequisite
 acyclicity               ← concept-graph
 cycle-resolution         ← acyclicity, relation-typing
 definition-closure       ← concept-graph, relation-typing
 grouping                 ← concept-graph, acyclicity
 skill-map-derivation     ← grouping, acyclicity
 goal / goal-closure      ← concept-graph, goal
 ordering                 ← skill-map-derivation, goal-closure
 propose-then-dispose     ← ordering, definition-closure, cycle-resolution
 content-attachment       ← ordering, concept
   PEA, running-artifact, ladder, spiral-gloss   ← content-attachment (+goal)
 assessment               ← concept, ordering, goal-closure
 validation-tiers         ← assessment, skill-map-derivation
 optimal-output           ← definition-closure, acyclicity, ordering, goal-closure   [goal]
 transfer-limits          ← optimal-output, validation-tiers                          [goal]
```

Two self-applications are visible here. **Closure:** each section below uses only
concepts introduced in earlier sections — the same gate the method imposes on
content. **Spiral gloss:** `optimal-output` is a goal node (it depends on every
invariant), so its full definition can only land in §14; the reading contract gives
it the mandatory one-line gloss up front. This section is the *orientation node* and
is, by design, exempt from closure (it previews everything).

---

## §1. The problem: most educational material is structurally unsound

The dominant failure of explanatory material is not bad prose; it is **using ideas
before they are earned**. A definition leans on a term defined three chapters later;
an example presumes a distinction not yet drawn; an "intuitive" order follows the
author's associative memory, not the learner's dependency needs. This is the *curse
of knowledge*: an expert cannot easily see which prerequisites they silently assume.

Three structural defects follow, all from one root cause — the dependency structure
is never written down as a checkable object:

1. **Implicit, duplicated structure.** Prerequisite order lives in the prose *and*
   (separately) in any table of contents or course map. Nothing reconciles them;
   they drift.
2. **Hand-guessed ordering.** "What comes first" is decided by intuition, with no
   check that each introduction is preceded by everything it uses.
3. **Ungrounded claims.** A term's first use is not mechanically tied to its
   definition, so "is every word defined before use?" can only be answered by
   re-reading.

The fix must make the dependency structure **explicit, singular, and checkable**,
and make the curriculum a *consequence* of it rather than a parallel artifact.

## §2. Concept and prerequisite — and two relation axes

A **concept** is one teachable idea, recorded as: an `id` and display term; a
one-line **definition** (first-encounter readable) and optional expansion; a
concrete **example**; an optional **micro-check**; a **group** (its skill-map node);
and a **`primitive`** flag for ideas with no in-topic prerequisite. (Full record:
Appendix A of ADR-0002; the data-model details are deferred to keep this spine
compact.)

A **prerequisite** is a *directed* relation "you must understand X before you can
understand Y." It is the one relation that **gates and orders**. The central
discipline is to keep it distinct from two things it is easily confused with:

- **Gating axis — requirement vs association vs mention.** "Understand X first"
  (gating `prerequisite`), "X is illuminated by contrast with Y" (non-gating,
  symmetric `contrasts`), and "X is named now only to motivate, treated fully later"
  (forward `gloss`/`foreshadow`, never gating) are different relations. Conflating
  *lexical mention* with *conceptual requirement* both manufactures false cycles and
  over-constrains authors. Only `prerequisite` participates in closure, acyclicity,
  and derivation.
- **Semantic-kind axis — *what kind* of prerequisite.** A small controlled
  vocabulary `{ is-a, part-of, defined-via, operates-on, refines, assumes }`
  **annotates** an edge without changing its gating. The kind is the always-on edge
  label (the per-edge justification is the on-hover detail), so the *shape* of the
  structure is legible at a glance. `refines` is where maturity-versioning (§5) lives.

These axes are orthogonal: gating is a principled rule; kind is annotation. Keep the
kind vocabulary small and earned from real edges. *(Reference impl ships
`prerequisite` + `contrasts` + the kind vocabulary; other gating types —
`soft-prerequisite`, `corequisite` — are added per domain need, ADR-0005.)*

## §3. The concept graph as the single source of truth

The **concept graph** is all concepts and their `prerequisite` edges. It is the one
explicit artifact for *dependency*; everything else — order, navigable map,
glossary panels, assessment hooks — is **derived** from it or attached **to** it.
The other relation types annotate it without changing the derived order. To change
the curriculum's structure you edit concepts, never the derived outputs.

A consequence for tooling: inside definitions and prose, a concept is named by a
**typed reference** (e.g. a chip), so closure (§6) is checkable and the reference can
render as a drill-down into the named concept.

## §4. Acyclicity by construction

The prerequisite relation is **kept acyclic** — a deliberate methodological choice,
defended here, not a claim that every domain is natively acyclic (§15 marks the
limit). A prerequisite cycle would assert "A cannot be understood *at all* without
first *fully* understanding B, and vice versa." Yet learners do acquire
co-constitutive pairs (supply/demand; force/mass/acceleration) — by holding
**partial, revisable versions** of several ideas at once. The honest model of that
is not a cycle but **versioned concepts at increasing maturity** (§5, move 4), which
*are* acyclic.

So an apparent cycle is treated as a **decomposition signal** (§5), and acyclicity
is enforced as a hard build gate. **Caveat (§15):** this makes the method
all-or-nothing per topic — there is no degraded mode; a domain with a genuinely
irreducible cycle cannot ship. Whether "a cycle always means better decomposition is
possible" holds *universally* is unproven and, for genuinely co-defined concepts,
arguably circular — §15 states this plainly.

**Acyclic substrate, spiral experience.** Keeping the *substrate* acyclic is not a
claim that understanding is non-holistic. Mutuality is represented elsewhere — in
`refines`/maturity-versioned concepts and in the *traversal* (a deliberate
revisit-and-deepen order) — never as a cyclic prerequisite edge. Designing that
spiral is a pedagogy decision (§9), not a graph property.

## §5. Resolving apparent cycles — the four moves

When the acyclicity gate fires, the cycle resolves into **one of four forms**
(matching ADR-0004 as amended):

1. **Sloppy / mutual definition → name a primitive.** *Reference case:* "a *symbol*
   is a mark from the *alphabet*" while "an *alphabet* is a set of *symbols*." Fixed
   by making `symbol` primitive ("an atomic mark") and `alphabet` depend on it.
2. **An inductive definition mistaken for a dependency.** A recursive definition ("a
   *formula* can be `∀x P` where P is a formula") is *well-founded* — it bottoms out
   at a base case. The recursion is generative, not a prerequisite. *Reference case:*
   `formula` depends on `atomic-formula`; the construct `quantifier` then depends on
   `formula`. Acyclic and more accurate.
3. **A contrast mislabeled as a dependency.** Pairs understood *against* each other
   (provability `⊢` vs truth `⊨`; object theory vs metatheory) are *associations*,
   not prerequisites. Move them to `contrasts`.
4. **Co-constitutive concepts → split by maturity (versioning).** When concepts
   genuinely develop together, the cycle dissolves into an acyclic chain of
   *versions*: an informal form of each, a coordinating concept depending on the
   informal forms, then refined formal forms depending on the coordinator
   (`force-informal` → `newtons-second-law` → `force-formal`). This is the honest
   model of "successive approximations."

   > **Move 4 is the method's answer to its hardest objection, and it is the least
   > proven part.** Maturity-versioning is *unimplemented and untested*: the
   > reference instance ships **zero** versioned concepts (its domain decomposes
   > cleanly without it). Whether arbitrary co-defined pairs *cleanly stratify* into
   > acyclic versions — rather than resisting decomposition entirely — is a
   > **conjecture**, not a result (§15). Moves 1–3 are exercised and solid; move 4 is
   > a recommended extension carrying disproportionate load.

A strongly-connected-component (SCC) linter reports cycles. Once the gate is green
every component is a singleton; the linter earns its keep **at authoring time** as
the cycle detector that forces moves 1–4 — it is a guard on the shipped graph, a
diagnostic during construction.

## §6. Definition closure — no forward references

**Every concept a definition references *as a requirement* must be a transitive
prerequisite-or-equal** — never a downstream concept. This makes "defined before
use" a property the build enforces at term granularity, not a hope.

The gate governs **requirement** references only: a motivational mention is typed as
a `gloss`/`foreshadow` that points forward without gating. **The known hole, stated
once:** the gate sees only *typed* references — bare prose can still smuggle an
untyped requirement (§16). The mitigation is to require requirement-bearing terms to
be typed and to lint prose for known terms; the gate does **not** certify that every
*word* is earned, only that every *typed reference* is.

Unavoidable early mentions use a **spiral gloss** (§11); the orientation/overview
unit is exempt from closure by design (as §0 is here).

## §7. Grouping and the derived skill map

- **Skill-map nodes** = concept **groups** (the abstraction function from concepts
  to navigable units). **Group coherence** is gated: the grouping lifted to the
  group level must *also* be acyclic — a cross-group cycle means a concept is
  mis-grouped, and fails the build.
- **Skill-map edges** = `prerequisite` edges *lifted* to the group level (group A→B
  iff some concept in B depends on some concept in A, cross-group only), deduplicated
  and **transitively reduced**. *On the group-lifted graph — which is acyclic by the
  group-coherence gate above — transitive reduction is unique and reachability-
  preserving;* this is why the audit below can compare reachability rather than raw
  edges.
- **Audit against a prior hand-authored map** by comparing *reachability*:
  *authored-but-unexplained* edges are either a missing concept dependency (add it)
  or a genuinely pedagogical edge (keep it, explicitly, in the overlay);
  *derived-but-absent* edges are structure the hand map missed (adopt it).

*Reference outcome (an existence proof only — see §13):* of the curated map's **19**
group-level edges, the concept graph explains **79% (15)**; the **21% (4)**
unexplained surfaced a real missing prerequisite (proofs are needed before "derive
2+2=4") and a wrong root (the structures unit depends on syntactic atoms) — both
adopted. The derivation produced **33** group-level edges and added **no** edges
outside the curated map's closure.

## §8. Goals and goal-closure — core vs enrichment

Declare the topic's **goals** (terminal concepts / achievements). A concept is
**core** if it lies on some goal's backward closure (the learner genuinely needs it
to reach a goal), **enrichment** if reachable but off every critical path, and an
**orphan** (a warning) if in no goal's closure and not itself a goal.

*Reference outcome:* **45 of 60** concepts are core; **15** are deliberate
enrichment; no unexplained orphans. **Caveat:** this lens is only interpretable for
topics with a *definable terminal goal* to derive backward from — Gödel has a crisp
one (the incompleteness theorems); survey topics ("20th-century art"), open
empirical sciences, and skill domains often do not (§15).

## §9. Ordering — topological, then optimized

The recommended linear path is a **topological order** of the concept graph.
(Production builds *hard-fail* on a cycle per §4, so a published order is always over
an acyclic graph; the traversal is written cycle-tolerant only as a defensive belt
for debug views, never as license to ship a cyclic graph.)

A topological order is **necessary but not sufficient**: many valid orders exist and
some are pedagogically poor (overloaded, too abstract, unmotivated). **The two halves
must be kept distinct in any claim of "derived order":** the *navigable map and a
valid order* are fully derived and done; *selecting the pedagogically good order
among the valid ones* is a second optimization that is **specified but not
implemented** — the reference instance was authored middle-out, so it ships *a* valid
order, not yet an *optimized* one. Sensible secondary criteria (heuristics, not laws,
and themselves provisional per the proxy caveat):

1. minimize *new* symbols/terms per unit;
2. alternate abstraction with worked examples (don't stack definitions);
3. prefer high-fan-out prerequisites earlier (they unblock the most);
4. cap chain length without an interleaved check or payoff;
5. place motivational payoffs at bounded intervals.

There is no objective function tying these together yet; "optimize within the
envelope" is a direction, not an executable algorithm.

## §10. Propose, then dispose — where the LLM belongs

A mechanical derivation guarantees *correctness* (a valid order), not *optimality*.
Choosing among valid orders, grouping, pacing, the spiral revisits, decompositions,
and prose is judgment an algorithm does poorly and an LLM does well. The division of
labor (ADR-0005):

- The **deterministic layer defines the feasible set and enforces the hard
  invariants** — closure, acyclicity, group coherence, traceability. These are
  *guaranteed*, never LLM-judged ("looks acyclic" is not a guarantee).
- The **LLM optimizes within that envelope** — which valid ordering, grouping,
  motivation, spiral, the edge *kind*, the prose. Every LLM output round-trips
  through the gates.

You get LLM-quality pedagogy with mechanically-guaranteed correctness. *Status: the
agentic-coder propose→gate→revise loop is **specified, not built** (§15); today the
separation is authoring discipline, not CI.*

## §11. Attaching content to the structure

Structure is necessary but inert. Disciplines for the prose and artifacts hung on it:

- **First-encounter-readable definitions; show then tell.** Precise but legible on
  first contact; depth is added by expansion and drill-down, not front-loaded rigor.
  Concrete (picture/example) before abstract (definition). The sequence is a
  problem→solution story ("Therefore & But"), not an "and-then" topological listicle.
- **PEA, distinguished by domain (ADR-0006).** *Pictures* (a visual of the real
  thing) and *Examples* (an instance from the concept's own domain) are **in-domain**
  — faithful, and they can *grow*. *Analogies* (a mapping to a familiar foreign
  domain) are **out-of-domain** — lossy and *local*.
- **One in-domain through-line, derived backward — with a mandatory fallback.**
  Prefer a single running example/artifact that *accretes sophistication* across the
  arc, derived backward from the *terminal* artifact, aligned to the concept track by
  closure (the artifact at stage N uses only concepts available by N). **This assumes
  a nameable terminal artifact** — often unclear up front, so in practice iterative;
  where no single object honestly spans a stretch, fall back to a *small consistent
  cast* (reference cast: `PA`, `ℕ`, `2+2=4`, `2+2=5`, a malformed foil, `G_PA`) rather
  than faking a through-line.
- **Analogies are local, plural, bounded — fitted forward, not derived backward.**
  Choose the best analogy *per concept*, mark its **breakdown point**, retire it there
  (chess illuminates "formal system" and is structurally silent on truth and
  self-reference). The breakdown point is information — usually a "Therefore & But"
  handoff to the next concept.
- **Typed visualizations.** A diagram's node/edge *types* carry the conceptual
  distinction (one relation can never be mistaken for another), with a legend and text
  fallback — the anti-"category-error" mechanism.
- **Ladder-of-abstraction recipe for *dynamical* concepts (ADR-0006 §6, after B.
  Victor).** Where a concept *has a parameter*: **control** it → **abstract over** it
  (show all values at once) → **step down** (tie a point on the abstraction back to a
  concrete case). The insight lives in the *transitions*. Valuable even as a **static**
  figure; full interactivity is a *scoped enhancement* for the few concepts that are
  parameterized systems with emergent behaviour, deliberately **not** a v1 requirement
  (it is expensive bespoke craft). This "ladder of abstraction" — levels of *one*
  system — is orthogonal to the prerequisite DAG — relations *between* concepts.
- **Spiral gloss.** A concept that must be named before its full treatment gets a
  one-line working definition up front, deepened at its own node. (This paper glosses
  `optimal-output` that way.)
- **Confusions as predicted misconceptions.** The dependency structure predicts where
  learners conflate concepts (contrast pairs, category errors); each unit states those
  misconceptions and their corrections explicitly.

## §12. Assessment

- **Front-half readiness, back-half capability.** Two assessments bracket a unit. A
  **prerequisite pretest** on entry (ADR-0007) checks the learner understands the
  unit's prerequisites; it is **derived** — assembled from the per-concept micro-checks
  of the page's *direct out-of-page prerequisite* concepts (a deliberate scoping
  choice, *not* the full transitive closure, so it may miss a deep dependency — a
  judgment call). A page with no out-of-page prerequisites (the first page) gets none.
  It is **soft-diagnostic**: a miss links to "review [concept]" — the graph is the
  remediation map — and never blocks navigation. The end-of-unit check tests the
  unit's *own* content. *(A one-item check is a weak probe — a diagnostic nudge, not
  proof of mastery.)*
- **Demonstrated capability, not exposure.** A unit is earned by performing a task.
  Use **deterministic checks** wherever the answer is exact; reserve an **LLM judge**
  for genuinely open-ended explanation.
- **The judge is an instrument that must be validated before it gates anything.**
  Measure its false-pass/false-fail against a frozen, hand-graded set; keep a
  deterministic component it cannot override; treat learner input as untrusted.
- **Items map to concepts.** Each item declares the concept(s) it tests and the
  misconception(s) it detects — what makes a result *diagnostic* rather than a scalar,
  and what lets remediation route precisely. (Full psychometrics — difficulty
  calibration, formal error-rate estimation — is a deliberate non-goal unless
  assessments are used for stakes; §13.)
- **Fatal misconceptions override — above a confidence threshold.** Certain category
  errors fail a task regardless of other credit, but only when detected above a set
  confidence bar, so a lucky phrasing or noisy judge call does not hard-fail a
  competent learner.
- **Remediation routing.** A failed attempt maps detected misconceptions back to the
  responsible prerequisite concepts. The dependency graph *is* the remediation map.

## §13. Validation in two tiers — and the deliberate deferral

The gates verify a treatment is **well-formed** on every change. They do **not**
verify the edges are **correct**, nor that learners learn better. Both are owed, at
different tiers.

**Tier 1 — structural validity (validate the graph, not just its form).** The edge
set is author opinion in typed form until reviewed. Cheap, high-value checks:
*independent expert edge review* (each prerequisite rated correct/wrong/arguable);
*independent re-authoring* (a second author builds the graph blind — convergence is
evidence, divergence localizes contested structure); *granularity review*;
*learner-error comparison* (do predicted misconceptions match real errors?); *edge
ablation*. The reference "79% explained" figure is an **existence proof that the
graph recovers most of one expert's structure — nothing more** (same author wrote
both; consistent with shared bias or retrofitting). Tier 1 is what would make it
independent.

**Tier 2 — learning efficacy (empirical) — deliberately deferred until the system is
complete (see reading contract).** Only after Tier 1. *Endpoints:* pre/post learning
gain, misconception elimination, transfer, retention — not one scalar. *Baselines:*
the same content authored conventionally; a topic-matched resource; an ablation
removing the *derived ordering* (random/expert-guessed) to isolate the structure's
contribution. *Controls:* hold prose constant so the variable under test is the
*structure*, not the writing.

> The claim this paper supports is: *the construction is principled, well-formed, and
> auditable.* The claims it does **not** make are *that the edges are correct* (Tier
> 1) and *that it improves learning* (Tier 2). The architecture is built to make both
> measurable — and, per the reading contract, every pre-Tier-2 design choice is
> provisional against efficacy data the proxies may misrepresent.

## §14. "Structurally optimal," fully defined

Now that every invariant is in hand, the gloss from the reading contract can be
discharged. A treatment is **structurally optimal** — the only sense this paper
claims — when:

- **Dependency-faithful** — each concept's prerequisites are the concepts one
  genuinely must understand first, and nothing more. *(This is an authoring
  aspiration the gates **support but cannot certify** — "genuinely must" is the one
  term not operationalized; it is what Tier-1 review, §13, exists to check.)*
- **Gap-free** — every typed requirement a unit uses is introduced at that unit or a
  transitive prerequisite (§6). Enforced.
- **Derived** — the navigable map and a valid order are computed from the structure
  (§7, §9); *order selection* is the owed, soft-optimized half (§9, §10).
- **Decomposed** — the dependency relation is acyclic; apparent cycles resolved by
  the four moves (§4–§5).
- **Inspectable** — every term, claim, and ordering traces to a concept record (§3).
- **Verifiable** — the above are machine-checked on every change.
- **Misconception-targeted** — assessment is by demonstrated capability aimed at the
  confusions the structure predicts (§12).

These are **necessary, not sufficient**, conditions, and at the level of **form**
only (reading contract). They remove the structural defects of §1; they do not
guarantee learning, and — per the proxy caveat — may not even correlate with it. A
reader who substitutes *well-structured* for *optimal* throughout loses nothing.

## §15. What transfers — and where the method returns empty

**Transfers:** everything except the concept records — the `Concept` shape, the gates
(closure, acyclicity, coherence), the SCC linter, the derivation (group-lift +
transitive reduction), the audit, the renderers, and this process. *Standing up a new
subject = author its concepts and their prerequisites; the order, the map, and the
checks come for free.*

**Not literally "any topic."** The method requires a topic representable as a finite
set of **teachable knowledge components plus typed prerequisite relations**. Where
that representation does not exist, the method does **not degrade gracefully — it
returns empty at a specific step**:

| Topic class | Where it breaks | What is left of the method |
|---|---|---|
| Tacit / embodied skill (tennis serve, comedic timing) | **§2 Step 1** — no nameable component with a definition+example; nothing to record | Nothing; the substrate has no input |
| Aesthetic / taste domains | **§2 Step 1** — units of learning aren't propositional | Nothing (perhaps a vocabulary glossary) |
| Genuinely co-constitutive / holistic ideas (meaning↔use; niche↔ecosystem) | **§4 acyclicity** — irreducible cycle; move-4 versioning is an *unproven* escape | Build cannot ship unless real dependencies are demoted to non-gating `relates` — which discards the structure the method exists to capture |
| Empirical / revisable science (as evidence, not definition) | **§2 relation vocabulary** — no edge type for "is evidence for," "superseded by," "competes with"; flattened to a false `prerequisite` or lossy `contrasts` | The settled, axiomatizable *sub-areas* only (thermodynamics-as-taught, not "much of science") |
| Contested / normative (ethics, interpretive history) | **single-source-of-truth** — the *point* is plural incompatible structures; the architecture holds one graph | Inapplicable where competing decompositions *are* the subject |
| Survey / open-ended (no terminal goal) | **§8 goal-closure, §11 backward derivation** — no endpoint to derive back from | Concepts + closure still work; the goal lens and running-artifact do not |

Honesty about the evidence base: **the reference topic is the easiest possible
instance** — formal, definitional, compositional, single-terminal-theorem,
uncontested — so it provides essentially *zero* evidence about the hard rows above.
"Read 'any topic' as 'any topic with a representable prerequisite structure'" is not a
hedge; it is the actual scope.

**Open questions (the newest, least-tested parts):**
- **The generation loop is unbuilt** — the agentic propose→gate→revise loop and the
  LLM-designed ordering are specified, not implemented. *The honest test is authoring
  a second topic from scratch — not yet done.*
- **Maturity-versioning (move 4) is unimplemented and untested** — the sole answer to
  co-constitutive concepts, exercised by zero reference concepts; whether arbitrary
  co-defined pairs cleanly stratify is unproven.
- **No independent gate yet** — the propose/dispose split assumes a non-agent run
  certifies the agent's work; today that is discipline, not CI.
- **The artifact "structure-matches-claims" gate is aspirational** — ad-hoc sweeps,
  not general structural assertions.
- **Analogies are unmodeled**; their scope/breakpoints are empirical (Tier-2).
- **The kind vocabulary and the four resolution moves are earned from one topic** and
  may not transfer.

## §16. Threats to validity and failure modes

| Threat | Symptom | Mitigation |
|---|---|---|
| **Form mistaken for truth** | A well-formed graph encoding the *wrong* dependencies | Tier-1 validation (§13); the gates can't catch this |
| **Proxy mistaken for outcome** | Optimizing closure/coverage/acyclicity that don't track learning (or anti-track it) | Treat all pre-Tier-2 choices as provisional; run §13 Tier 2 before believing the structure helps |
| Wrong prerequisite edge | A unit unlocks before its real dependency | §7 audit; Tier-1 review; small high-confidence edits |
| Over-decomposition (atomization) | Dozens of trivial nodes; learner fatigue | Group coherence; "distinct idea or a sentence?" review |
| Co-constitutive concepts forced into order | An honest cycle papered over | Maturity versioning (§5 move 4) — itself unproven |
| Grouping that fights dependencies | Cross-group cycle | Group-coherence gate fails the build |
| Closure gives false security | "No forward refs" checks only *typed* refs, not bare prose | Require requirement-bearing terms typed; lint prose for known terms (§6) |
| Mention treated as requirement | Authors over-constrained; spurious cycles | Type motivational mentions as `gloss`/`foreshadow` (§2) |
| One-size order ignores the learner | Valid order inefficient for a given learner | Treat the graph as substrate for adaptive sequencing; §9 secondary criteria |
| Judge false pass/fail | Confident nonsense earns a badge / terse-but-correct rejected | Validate judge on a frozen set first; deterministic component; confidence-thresholded override |
| Recency over-indexing in authoring | The model fixates on whatever was salient when authored | Pressure-test framings against standard sources, not the last conversation |

## §17. Positioning

This is not a new claim about the structure of learning, and it overlaps deliberately
with concept maps, knowledge-component decompositions, and graph-based adaptive
sequencing. The differentiator is narrow and engineering: **the concept graph is a
typed, build-checked *source of truth* from which the ordering, navigation, glossary,
and assessment hooks are generated** — a curriculum *compiler* with enforced
invariants, rather than a hand-drawn map kept in sync by discipline. What it compiles
is *form*; whether the form teaches is the deferred empirical question (§13) this
paper is built to make answerable.

---

## Appendix A — the data model, and this paper's own concept map

**The `Concept` record (data model).** `id`, display term; one-line definition +
optional expansion; concrete example; optional micro-check; `prerequisites` (acyclic
concept ids); `contrasts`/`relates` (undirected, never gate); `group`; `primitive`
flag; optional **maturity `level`** (`informal`/`operational`/`formal`) with a version
chain for co-constitutive domains (§5 move 4; *unused in the reference instance*).
The **concept graph** is all concepts + `prerequisites`; the **skill map** is the
derived group graph plus a hand-authored overlay (assessments, layout, goals, and any
explicitly-labeled pedagogical sequencing edges). *(Full types: ADR-0002; relation
axes: ADR-0005.)*

**This paper's concept map (the dogfood data).** Node → local prerequisites:

```
the-problem            → (root)
concept                → (root)
prerequisite           → concept
relation-typing        → prerequisite
concept-graph          → concept, prerequisite
acyclicity             → concept-graph
cycle-resolution       → acyclicity, relation-typing
definition-closure     → concept-graph, relation-typing
grouping               → concept-graph, acyclicity
skill-map-derivation   → grouping, acyclicity
goal                   → concept
goal-closure           → concept-graph, goal
ordering               → skill-map-derivation, goal-closure
propose-then-dispose   → ordering, definition-closure, cycle-resolution
content-attachment     → ordering, concept
PEA                    → content-attachment
running-artifact       → PEA, goal
ladder-of-abstraction  → running-artifact
spiral-gloss           → definition-closure, content-attachment
assessment             → concept, ordering, goal-closure
validation-tiers       → assessment, skill-map-derivation
optimal-output  [goal] → definition-closure, acyclicity, ordering, goal-closure
transfer-limits [goal] → optimal-output, validation-tiers
```

Acyclic (verify: no node lists a later node). The §1–§17 order is one topological
order of this graph; `optimal-output`, a goal, depends on every invariant, so it can
only be defined at §14 — hence the reading-contract spiral gloss. The method, applied
to itself, produced this paper's spine.
