# A Concept-Graph-First Methodology for Well-Structured Educational Content
### (for topics with a representable prerequisite structure)

> **A note on terms.** This paper uses **"structurally optimal"** as a *defined
> internal term* (§14): satisfaction of a fixed set of structural form-checks —
> **necessary, not sufficient** for good learning, and **not** an efficacy claim. It is
> deliberately kept *out of the title*: the method produces a **well-structured**
> curriculum artifact; whether that artifact teaches better is the deferred empirical
> question (§13). (Earlier drafts titled this "Optimal Educational Output"; three
> reviews flagged that as a predictable overclaim, so the title now states only what
> the method establishes.)

*A construction theory, not an efficacy study. It specifies how to build a
learnable treatment of a topic — ordered lessons, a navigable skill map,
assessments, visualizations, a glossary — by making the topic's **conceptual
dependency structure** an explicit, machine-checked artifact and **deriving** the
curriculum from it. Beyond the checkable structure it also specifies the **content
craft** hung on it (motivation, concrete-before-abstract, a problem→solution arc,
total symbol/notation explanation, skill-focus) and a discipline for resolving the
**tensions** those content demands create with each other (§11, §15). It is grounded in
a deployed reference architecture (the
"Concept Ladder" for Gödel's incompleteness theorems) but written to apply to any
topic that can be represented as concepts plus prerequisite relations — though
**whether a given topic admits that representation is itself the hard, often-negative
question (§16)**, not a mild precondition. It argues for **structural** optimality and
is explicit (§13–§16) about the empirical claims it deliberately does **not** make.*

> **For external reviewers.** This is a **construction / methods** paper, not an
> efficacy study. We claim **structural well-formedness only**; learning efficacy and
> the *correctness* of individual prerequisite edges are explicitly **deferred**
> (§13), by design (reading contract). The most useful review evaluates the
> **construction discipline and its honesty about scope** — where the method
> over-reaches, where a step is too vague to execute, where it ignores a relevant
> prior result (§18) — *not* "where is the user study?" (we agree there isn't one
> yet, and §13 says why). The self-application in §0 is meant to be checked: the
> claims there (acyclic map, derived section order, closure) are falsifiable against
> Appendix A.

---

## Reading contract

> **"Structurally optimal" is stipulative — a spiral gloss here, fully defined in
> §14.** Until §14, read *structurally optimal* as a one-line working
> definition: a treatment with **six gate-enforced** properties — *gap-free,
> decomposed* (acyclic), *derived, inspectable, verifiable, misconception-targeted* —
> **plus one aspirational, review-owed** property, *dependency-faithful* (the edges
> are the concepts one genuinely must understand first, not merely *some* acyclic set).
> That seventh is the substantive one and the gates **cannot** certify it — it is what
> Tier-1 expert review (§13) exists to check. So "optimal" names *satisfaction of
> structural constraints* (six enforced, one owed), not maximization against a measured
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
> failure of §17). Every design decision made before Tier 2 — granularity, the four
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
> uncontested), which §16 weighs honestly.

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
 goal                     ← concept
 goal-closure             ← concept-graph, goal
 ordering                 ← skill-map-derivation, goal-closure
 propose-then-dispose     ← ordering, definition-closure, cycle-resolution
 content-attachment       ← ordering, concept
   PEA                    ← content-attachment
   running-artifact       ← PEA, goal
   ladder-of-abstraction  ← running-artifact
   spiral-gloss           ← definition-closure, content-attachment
   skill-focus            ← goal, content-attachment
 assessment               ← concept, ordering, goal-closure
 validation-tiers         ← assessment, skill-map-derivation
 domain-faithfulness      ← concept-graph, goal, validation-tiers
 optimal-output           ← definition-closure, acyclicity, ordering, goal-closure   [goal]
 tension-resolution       ← content-attachment, validation-tiers, optimal-output
 transfer-limits          ← optimal-output, validation-tiers                          [goal]
```

Two self-applications are visible here. **Closure:** each section below introduces
its concepts only after their prerequisites — the same gate the method imposes on
content. (The prose does carry forward `(§N)` pointers — e.g. §2 referencing §5;
those are `gloss`/`foreshadow`-typed pointers in the sense of §6, which point ahead
*to motivate* and never gate, exactly the mechanism the method permits — not closure
violations.) **Spiral gloss:** `optimal-output` is a goal node (it depends on every
invariant), so its full definition can only land in §14; the reading contract gives
it the mandatory one-line gloss up front. This section is the *orientation node* and
is, by design, exempt from closure (it previews everything); §17 (Threats) and §18
(Related work) are back-matter, outside the concept map. So the derived span is the
**§1–§16** spine.

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
kind vocabulary small and earned from real edges. The **full relation vocabulary**,
pinned in one place:

| Relation | Direction | Gates? | Meaning |
|---|---|---|---|
| `prerequisite` | directed | **yes** (acyclic) | must understand source before target; the one relation that orders + closes |
| `recommended-before` | directed | **no** (advisory) | helps but isn't strictly required; orders softly, never blocks (formerly "soft-prerequisite" — a non-required relation must not hard-gate) |
| `corequisite` | undirected | **cluster** | learned together; **contracted into one composite node before topological sort**, so it never breaks ordering — closure and assessment then apply to the cluster as a unit |
| `contrasts` / `relates` | undirected | **no** | understood *against* / "see also"; association, never orders |
| `gloss` / `foreshadow` | directed, **forward** | **no** | named early only to motivate; must resolve to a later concept |

Plus the **semantic-kind** annotation on a `prerequisite` edge: `{ is-a, part-of,
defined-via, operates-on, refines, assumes }`. *(Reference impl ships `prerequisite`
+ `contrasts` + the kind vocabulary; the others are added per domain need, ADR-0005.)*

**A note on the gating column (an external-review fix).** Only `prerequisite`
hard-gates. `recommended-before` is advisory — it influences ordering heuristics
(§9) but never blocks, because a *non-required* relation must not behave as a
requirement. `corequisite` does not gate *pairwise*; the corequisite-connected set is
**contracted to a single node** before the topological sort (and closure is checked at
the cluster boundary), which is how "learned together" is represented without
introducing a 2-cycle.

**Model expressiveness — a known limitation (extension flagged).** Prerequisites are
modeled as **pairwise directed edges**, which expresses **conjunction** natively
(several incoming edges = "all of these first") but **not** disjunctive or
route-dependent dependencies: *A **or** B suffices*, *any 3 of 5 worked examples*, *X
is prerequisite only on route R / for learner profile P*. The honest consequence is
that the current model **overstates linear dependency in domains with multiple
legitimate routes** — it can only force one path or drop the constraint. The planned
fix is **prerequisite predicates** (Boolean formulas over concepts: `A ∧ B`, `A ∨ B`,
threshold-k) or **hyperedges** (one dependency from a *set* of sources to a target);
both are specified-not-built, and until then disjunctive routes must be modeled
out-of-band (e.g. as separate goal closures). This is a real formalism gap, not a
cosmetic one (see also §16).

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
defended here, not a claim that every domain is natively acyclic (§16 marks the
limit). A prerequisite cycle would assert "A cannot be understood *at all* without
first *fully* understanding B, and vice versa." Yet learners do acquire
co-constitutive pairs (supply/demand; force/mass/acceleration) — by holding
**partial, revisable versions** of several ideas at once. The honest model of that
is not a cycle but **versioned concepts at increasing maturity** (§5, move 4), which
*are* acyclic.

So an apparent cycle is treated as a **decomposition signal** (§5), and acyclicity
is enforced as a hard build gate.

**Two honest concessions.** (1) *Acyclicity is achieved partly by how strongly we
define `prerequisite`* — "understand X *fully* before *at all* understanding Y." Under
the weaker, realistic reading ("partial X helps partial Y and vice versa") many
relations are genuinely mutual; we keep the substrate acyclic by routing that
mutuality into non-gating `refines`/versioning and the traversal. So this is closer
to *defining cycles out of the gating relation* than to *discovering* the world is
acyclic — a defensible modeling choice, not a empirical finding. (2) *The hard-fail is
a design stance, not a law.* As currently built the method is **all-or-nothing per
topic**: a genuinely irreducible cycle cannot ship. An alternative we have not
built — ship the acyclic core and mark the cycle as an explicitly-typed
"mutually-defined cluster" to be taught holistically — would give a degraded mode; we
chose hard-fail to keep the guarantee crisp. Whether "a cycle always admits better
decomposition" holds *universally* is unproven and, for genuinely co-defined concepts,
arguably circular — §16 states this plainly.

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
   > **conjecture**, not a result (§16). Moves 1–3 are exercised and solid; move 4 is
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
untyped requirement (§17). The mitigation is to require requirement-bearing terms to
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
outside the curated map's closure — though for a *same-author* audit even that
"clean" result is as consistent with retrofitting as with genuine convergence; it
cuts both ways (§13).

## §8. Goals and goal-closure — core vs enrichment

Declare the topic's **goals** (terminal concepts / achievements). A concept is
**core** if it lies on some goal's backward closure (the learner genuinely needs it
to reach a goal), **enrichment** if reachable but off every critical path, and an
**orphan** (a warning) if in no goal's closure and not itself a goal.

*Reference outcome:* **44 of 60** concepts are core; **16** are deliberate
enrichment; no unexplained orphans. (Notably, after a 2026-06-21 correctness fix,
`soundness` is *enrichment*: it is sufficient but **not necessary** for the
theorems, so it is correctly off the critical path — the truth clause is grounded
in `satisfaction` (ℕ ⊨ G_T) instead. §13.) **Caveat:** this lens is only interpretable for
topics with a *definable terminal goal* to derive backward from — Gödel has a crisp
one (the incompleteness theorems); survey topics ("20th-century art"), open
empirical sciences, and skill domains often do not (§16).

**Skill-focus: the goal is a *practitioner capability*, not a terminal fact.** In skill
and practitioner domains the terminal goal is not "understand topic X" but "**can act in
X**": for the learner's *own* goal, **understand the alternatives → weigh the tradeoffs →
decide and plan → implement → operate.** Understanding is only the first third; a tree
that stops at conceptual coverage has not produced the capability. So `core`/`enrichment`
are scoped by *what some real decision or build step requires* — a concept is core because
a choice turns on it or a build needs it, not because the domain's taxonomy lists it —
and coverage must extend past concepts to the *plan→implement→operate* layer (how to
choose a stack for a goal, build it, run and maintain it).

> **The author's job is to empower the learner's decision, not to win the debate.**
> Where alternatives genuinely compete (and the author has a preferred one), the content
> stays **neutral**: present the real menu of options, each with its honest costs, and
> teach the learner *how to choose for their situation* — never spine the curriculum on a
> favorite. An author's preference is shown as one option fairly costed, not as the
> answer. (This is a faithfulness obligation: a biased menu mis-scopes the field just as a
> stale one does, §13.)

Two structural consequences. (1) This sets up the Therefore/But content arc of §11 (each
option is a candidate solution carrying a cost). (2) It creates standing tensions —
covering the field *fairly and completely* (domain-faithfulness, §13) vs. covering only
what a decision needs (skill-focus), and conceptual breadth vs. implementation depth —
both resolved per §15.

**The arc's last segment — *operate* — is the one most curricula drop, and it is the
hardest.** Demos end at "it works once"; real capability is keeping the system correct,
current, and affordable in use (maintenance, drift, cost, updating). The honest target is
to teach the learner to run an **evaluation-gated living system** — a held-out check that
*gates each change* to their artifact. That is, recursively, the very propose→gate→revise
discipline this paper applies to *building* curricula (§10), handed to the learner as an
operating skill. A practitioner-capability tree that omits day-2 operation has taught the
first act and called it the play.

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

A mechanical derivation guarantees *structural validity* (a topologically valid order
— one that respects the declared edges), **not** that the edges are *correct* and not
*optimality*. Choosing among valid orders, grouping, pacing, the spiral revisits,
decompositions, and prose is judgment an algorithm does poorly and an LLM does well.
The division of labor (ADR-0005):

- The **deterministic layer defines the feasible set and enforces the hard
  invariants** — closure, acyclicity, group coherence, traceability. These are
  *guaranteed*, never LLM-judged ("looks acyclic" is not a guarantee).
- The **LLM optimizes within that envelope** — which valid ordering, grouping,
  motivation, spiral, the edge *kind*, the prose. Every LLM output round-trips
  through the gates.

You get LLM-quality pedagogy with **mechanically-guaranteed structural validity,
conditional on the authored graph** (not guaranteed *correctness* — a wrong edge
yields a perfectly valid but mis-taught curriculum; that is the edge-epistemology
problem §13 addresses). *Status: the agentic-coder propose→gate→revise loop is
**specified, not built** (§16); today the separation is authoring discipline, not CI.*

## §11. Attaching content to the structure

Structure is necessary but inert. Disciplines for the prose and artifacts hung on it
(a tested explanatory craft — closest articulation: N. Case, *How To Explain Things Real
Good* — adapted to the graph; these desiderata **conflict**, and resolving the conflicts
is §15):

- **Show what made you *care* — motivation before mechanism.** Open a unit with the
  concrete puzzle, surprise, or stake that made the idea matter — *show what made you
  care; don't assert why it's important* (the abstract "why" is gobbledygook to a
  novice). The first job is to make the learner *want* the next concept, which a
  Therefore/But arc then earns.
- **First-encounter-readable definitions; show then tell; concept before syntax.**
  Precise but legible on first contact; depth is added by expansion and drill-down, not
  front-loaded rigor. Concrete (picture/example/analogy) **before** abstract
  (definition) — and the *idea* before any specific-language **syntax**: a particular
  grammar or serialization or query language is a late, optional detail, never the entry
  point (introducing a concept *through* its notation is the inversion this rule
  forbids). The sequence is a problem→solution story ("Therefore & But"), not an
  "and-then" topological listicle.
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
- **Explain every symbol, notation, and acronym — completely.** No bare acronym (spell
  it out *and* define it on first use); every glyph in a formula or syntax block is
  accounted for — what each symbol, delimiter, prefix, and separator *does*. This is §6
  closure pushed below term granularity to the **sub-token** level, and it is
  non-negotiable: a learner must never have to *guess* what a mark means, because
  guessing manufactures exactly the silent wrong assumption the method exists to prevent.
- **Anchor to the learner's decision (skill-focus, §8).** In skill/decision domains,
  hang content on the *choice the learner must make*, not a theory taxonomy: present the
  options as candidate solutions, each with its cost (a natural Therefore/But), so theory
  earns its place by informing a decision rather than being surveyed for its own sake.
- **Confusion-anticipation pass.** Author each unit by predicting, line by line, the
  question or wrong assumption a first-time reader forms *right here*, and resolve it
  inline — the per-line complement to the structural misconception list above.
- **Test early, heckle often (§15).** A unit is not done when it reads well *to its
  author*; expose it to a real reader early and capture where it bored or confused them.
  Note these disciplines actively conflict (complete notation fights concision; a hook
  fights even coverage; concrete-first fights closure) — surfacing and resolving those
  tensions, holistically and iteratively, is §15.

## §12. Assessment

- **Front-half readiness, back-half capability.** Two assessments bracket a unit. A
  **prerequisite pretest** on entry (ADR-0007) checks the learner understands the
  unit's prerequisites; it is **derived** — assembled from the per-concept micro-checks
  of the page's *direct out-of-page prerequisite* concepts (a deliberate scoping
  choice, *not* the full transitive closure: deep prerequisites were already gated by
  the exit checks of the earlier pages that introduced them, so re-testing them here is
  redundant — the cost is that a deep dependency skipped by a learner who jumped pages
  could be missed; an acknowledged open design point). A page with no out-of-page
  prerequisites (the first page) gets none.
  It is **soft-diagnostic**: a miss links to "review [concept]" — the graph is the
  remediation map — and never blocks navigation. The end-of-unit check tests the
  unit's *own* content.
- **Three assessment strengths, kept distinct (a one-item check is not mastery).** A
  single item has low reliability and can reward recognition over mastery, so the
  protocol names three levels and never conflates them: **(1) diagnostic nudge** —
  low-stakes, one item, the pretest's role (a hint to review, never a gate); **(2)
  mastery evidence** — multiple items, varied format, explicit misconception probes,
  the end-of-unit bar; **(3) certification** — a calibrated assessment with known
  error rates (owed only if results carry stakes; §13). The reference instance ships
  (1) and (2); (3) is out of scope until Tier 2.
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

**Set-faithfulness is a distinct Tier-1 check from edge-correctness.** Edge review asks
"is *this dependency* true?"; it cannot ask "are these the *right concepts at all*?" A
graph can be acyclic, closed, and have every edge correct, yet **mis-scope the domain** —
omit ideas the field now treats as central, or center a dated taxonomy. (Reference
failure mode, from the sibling knowledge-graph instance: a "second brain" curriculum
built on the 2018 symbolic-query stack — RDF/SPARQL/OWL — while omitting retrieval/RAG and
agentic search, the dominant *current* paradigm.) So Tier 1 owes a **coverage/scope audit
against current authoritative sources**: are the declared concepts what a present-day
expert would teach, or a partial or stale slice? This is faithfulness of the *set*,
orthogonal to correctness of the *edges* — and, like skill-focus (§8), it trades off
against concision and is resolved per §15.

**Corollary for fast-moving practitioner domains: separate the durable from the
perishable.** In a field that churns (the second-brain/LLM tooling stack turns over
quarterly), faithfulness has a time dimension: the *durable* layer (the pipeline shape,
the decision axes, the tradeoff structure) is the concept graph and ages slowly; the
*perishable* layer (specific framework APIs, current prices, this month's leading system)
ages in months. Keep them in different registers — teach the durable as concepts, and
**date and quarantine** the perishable (mark it "as of <date>," confine it to examples,
never let a prerequisite edge depend on a tool's current API). This keeps a
practitioner-capable curriculum from rotting, and is the staleness-control complement to
the coverage audit above.

*The central unresolved issue is **edge epistemology** — how we know a prerequisite
edge is true. Edges are author opinion until reviewed, yet the whole compiler trusts
them: a wrong edge yields a perfectly valid, educationally distorted curriculum.* To
make Tier 1 **executable** (not just a good idea), every edge `X → Y` gets a standard
review form:

| Question | Response |
|---|---|
| Is X **necessary** to understand Y? | yes / no / arguable |
| Is X merely **helpful** rather than necessary? | yes / no |
| Is the edge **too coarse** (X bundles several ideas)? | yes / no |
| Is there an **alternate path** to Y avoiding X? | yes / no |
| Is this really a prerequisite, or a mislabeled relation? | prerequisite / contrast / gloss / other |
| What **learner error** would appear if X were missing? | free response |
| What **source / expert convention** supports this edge? | citation / rationale |

A "no" to *necessary* + "yes" to *helpful* should **downgrade** the edge to
`recommended-before` (§2); "yes" to *alternate path* signals a disjunctive
prerequisite the pairwise model can't yet hold (§2 model-expressiveness); a non-
`prerequisite` answer reclassifies the edge. The reviewer-facing artifact is this
form filled per edge — the Tier-1 deliverable.

**Tier 2 — learning efficacy (empirical) — deliberately deferred until the system is
complete (see reading contract).** Only after Tier 1. *Endpoints:* pre/post learning
gain, misconception elimination, transfer, retention — not one scalar. *Baselines:*
the same content authored conventionally; a topic-matched resource; an ablation
removing the *derived ordering* (random/expert-guessed) to isolate the structure's
contribution. *Controls:* hold prose constant so the variable under test is the
*structure*, not the writing. Before any of this is runnable, the only honest early
signal is **in-situ reader feedback** (§15) — a per-section "this confused/bored me"
channel; it is useful for *iteration*, not a substitute for the controlled comparison
above (it measures the *feeling* of difficulty, not learning gain).

> The claim this paper supports is: *the construction is principled, well-formed, and
> auditable.* The claims it does **not** make are *that the edges are correct* (Tier
> 1) and *that it improves learning* (Tier 2). The architecture is built to make both
> measurable — and, per the reading contract, every pre-Tier-2 design choice is
> provisional against efficacy data the proxies may misrepresent.

## §14. "Structurally optimal," fully defined

Now that every invariant is in hand, the gloss from the reading contract can be
discharged. A treatment is **structurally optimal** — the only sense this paper
claims — when it has the following seven properties. **Six are gate-enforced; the
first is aspirational** (review-owed, §13) — and it is the substantive one, so do not
read "optimal" as "all seven verified":

- **Dependency-faithful** *(aspirational — not gate-enforced)* — each concept's
  prerequisites are the concepts one genuinely must understand first, and nothing more.
  *(The gates **support but cannot certify** this — "genuinely must" is the one term
  not operationalized; it is what Tier-1 review, §13, exists to check. The six below
  are checkable form; this is whether the form is the **right** form.)*
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

These seven are the structural **floor**. Doing the job *well* above that floor —
balancing the content desiderata of §11 (which, unlike the gates, actively *conflict*
with one another) — is a separate discipline, and the gates are silent on it. That is
§15.

## §15. The desiderata conflict — a discipline for resolving tensions

The hard gates (§4, §6, §7) define a **feasible set**, and §14 calls clearing them
"structurally optimal" — a *floor*. But the work that actually determines whether a
treatment is good happens **above** that floor, in the content desiderata of §11 and
the soft ordering of §9. Those are **not** independent checkboxes you can each
maximize: they actively **trade off** against one another. A method that only ANDs
gates is silent exactly where most authoring judgment is spent. This section makes the
trade-offs explicit and gives an iterative, whole-graph discipline for resolving them.

**The forces (the recurring tension pairs).**

| This force… | pulls toward… | …conflicts with | …which pulls toward | Collision |
|---|---|---|---|---|
| Completeness (§11: explain *every* symbol/acronym) | account for every mark | Concision (§11: cut 10%, respect time) | say less | a fully-annotated notation block blows the length budget |
| Coverage / domain-faithfulness (§13) | the concepts the field *actually* uses now | Skill-focus (§8) | only what the learner's decision needs | a faithful survey buries the choice the learner came to make |
| Depth / comprehensiveness | author the full band | Legibility (§17) | a page a learner can hold at once | a complete page renders as an unreadable wall |
| Concrete-first (§11: PEA, show-then-tell) | open with a motivating example | Closure (§6) | introduce nothing un-earned | the best motivating example needs a term not yet defined |
| One running artifact (§11) | reuse the through-line | Per-concept aptness (§11) | the best picture for *this* idea | the running artifact isn't the clearest illustration here |
| Motivation hook (§11: "show what made you care") | a personal, vivid entry | Neutral surveying | even, comprehensive tone | the hook over-weights one sub-topic |

**Why a checklist cannot resolve these.** A gate is *pass/fail and independent*; these
forces are *dependent and continuous*. Maximize concision and you starve the
symbol-by-symbol explanation a newcomer needs; maximize coverage and you bury the
decision a skill-domain learner came for; satisfy closure too strictly and you forbid
the motivating example that makes the unit land. The resolution is therefore never
"satisfy all of them" — it is "**balance, per unit, on purpose, and check the whole.**"

**A three-part discipline.**

1. **Resolve per unit, by role — and record the choice.** The right balance depends on
   a unit's *role* in the arc. An orientation node (closure-exempt, §6) resolves
   Concrete-first ↔ Closure toward the hook; a deep reference node resolves the same
   tension toward closure. Each unit carries a short **resolution rationale** — which
   forces it favored and why — an ADR-at-the-unit, so the trade-off is inspectable (§3)
   and not silently re-litigated on the next edit.
2. **Detect tensions; don't pretend they're gates.** Some checks are **tension
   detectors**, not pass/fail gates: they flag a collision and *demand a recorded
   resolution* rather than picking a winner. "This unit introduces N undefined symbols
   **and** exceeds the concision budget" is not a failure — it is a surfaced tension
   whose resolution (gloss the symbols? split the unit? accept the length and say why?)
   is recorded. The detector's job is to make the trade-off visible to the author/LLM.
3. **Resolve holistically, then iterate.** A tension is rarely local. Easing
   Concrete-first by adding a motivating example can introduce a forward reference three
   nodes downstream (a §6 break *elsewhere*); deepening coverage to satisfy
   faithfulness can break legibility on the page. So every resolution triggers a
   **whole-graph re-check** — evaluated against the entire curriculum, not the single
   unit — and you iterate until the graph *as a whole* settles. This is the soft
   counterpart to the hard fixed-point the gates compute.

**This is the missing half of propose→gate→revise (§10).** §10 split labor into a
deterministic floor (the gates) and an LLM that "optimizes within the envelope." That
envelope *is* this tension space, and "optimize" was named a direction, not an
algorithm (§9). The discipline here is what the optimize step actually *does*: surface
the forces, balance per unit by role, re-check globally, iterate. The hard gates keep
it honest — no resolution may break closure or acyclicity — but the pedagogy lives in
the resolutions, not the gates.

**Closing the loop needs real signal, early.** *Which* resolution is right is
ultimately the Tier-2 empirical question (§13) — unanswerable until the system is
built. Until then the cheapest honest signal is to **test early and heckle often**:
put the draft in front of a reader and capture, *in situ*, where it bored, confused, or
lost them. The reference architecture operationalizes this as a **per-section feedback
channel** in the product — the reader flags a specific unit *while reading* — so
tension resolutions accrue real reactions instead of the author's guess. This is
signal, **not proof**: it measures the *feeling* of difficulty, not learning gain — the
§13 distinction holds.

**The shape is not a coincidence.** A good *explanation* is a Therefore/But loop (§11):
a solution creates a new problem, forcing a new solution. So is this *methodology*: each
requirement solves one defect of §1 (BUT) creates a tension with another, (THEREFORE)
forcing a resolution, which surfaces the next tension. The method's own desiderata form
a Therefore/But graph, resolved iteratively and holistically — applied to itself, the
method has the very structure it prescribes for its output.

## §16. What transfers — and where the method returns empty

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
  a second topic — and it must be a **hostile** one, not another formal/definitional
  subject* (which would only re-confirm the best case). The strongest stress tests, by
  what they break: **introductory mechanics** (force/mass/acceleration co-constitution
  → move 4), **statistics** (procedural + conceptual dependencies intertwined),
  **constitutional law / ethics** (plural, contested structures → single-source-of-
  truth fails), **biology/ecology** (evidence, mechanism, and taxonomy interact →
  relation-vocabulary gap). This is the next milestone, not yet done.
- **Maturity-versioning (move 4) is EXPERIMENTAL, not part of the guaranteed core** —
  unimplemented, untested, exercised by zero reference concepts; whether arbitrary
  co-defined pairs cleanly stratify is unproven. **Combined consequence, stated
  plainly:** move 4 is the *only* in-spec escape for genuine mutuality, so **if it
  fails to generalize, the method is restricted to natively-near-acyclic domains** — a
  substantially smaller claim than "any topic with a prerequisite structure." Appendix
  B sketches a worked example to show it is more than a placeholder, but a sketch is not
  a result. **Recommended near-term handling is therefore the degraded mode (§4):**
  ship the acyclic core, mark the mutually-defined cluster as a typed exception taught
  holistically, and make *no* structural-optimality claim for that region — rather than
  hard-failing the whole build or relying on unvalidated versioning.
- **No independent gate yet** — the propose/dispose split assumes a non-agent run
  certifies the agent's work; today that is discipline, not CI.
- **The artifact "structure-matches-claims" gate is aspirational** — ad-hoc sweeps,
  not general structural assertions.
- **Analogies are unmodeled**; their scope/breakpoints are empirical (Tier-2).
- **The kind vocabulary and the four resolution moves are earned from one topic** and
  may not transfer.

## §17. Threats to validity and failure modes

| Threat | Symptom | Mitigation |
|---|---|---|
| **Form mistaken for truth** | A well-formed graph encoding the *wrong* dependencies | Tier-1 validation (§13); the gates can't catch this |
| **Proxy mistaken for outcome** | Optimizing closure/coverage/acyclicity that don't track learning (or anti-track it) | Treat all pre-Tier-2 choices as provisional; run §13 Tier 2 before believing the structure helps |
| **Desiderata silently in conflict** | Author maximizes one force (concision) and starves another (symbol completeness, coverage) without noticing | Tension detectors + per-unit recorded resolution + whole-graph re-check (§15) |
| **Dated / mis-scoped concept set** | A well-formed graph reflecting an old or partial taxonomy; omits how the field now works | Set-faithfulness audit against current sources (§13); skill-focus scoping (§8) |
| **Notation opacity** | Symbols, delimiters, or acronyms used unexplained; the learner guesses and mis-assumes | Sub-token explanation discipline + concept-before-syntax (§11); lint for undefined glyphs/acronyms |
| Wrong prerequisite edge | A unit unlocks before its real dependency | §7 audit; Tier-1 review; small high-confidence edits |
| Over-decomposition (atomization) | Dozens of trivial nodes; learner fatigue | Group coherence; "distinct idea or a sentence?" review |
| Co-constitutive concepts forced into order | An honest cycle papered over | Maturity versioning (§5 move 4) — itself unproven |
| Grouping that fights dependencies | Cross-group cycle | Group-coherence gate fails the build |
| Closure gives false security | "No forward refs" checks only *typed* refs, not bare prose | Require requirement-bearing terms typed; lint prose for known terms (§6) |
| Mention treated as requirement | Authors over-constrained; spurious cycles | Type motivational mentions as `gloss`/`foreshadow` (§2) |
| One-size order ignores the learner | Valid order inefficient for a given learner | Treat the graph as substrate for adaptive sequencing; §9 secondary criteria |
| Judge false pass/fail | Confident nonsense earns a badge / terse-but-correct rejected | Validate judge on a frozen set first; deterministic component; confidence-thresholded override |
| Recency over-indexing in authoring | The model fixates on whatever was salient when authored | Pressure-test framings against standard sources, not the last conversation |

## §18. Related work and positioning

Prerequisite structure is old; almost nothing here is a new claim about *learning*.
The honest position is that the method **reinvents none of the theory and adds an
engineering discipline on top of it.** The relevant neighbors:

- **Gagné's learning hierarchies** (1968) — the original "teach prerequisites first"
  pedagogy: a skill is decomposed into subordinate skills that must be mastered first.
  We are a direct descendant; the delta is mechanization (a checked artifact, not a
  hand-drawn hierarchy).
- **Knowledge Space Theory** (Doignon & Falmagne, 1985; *Knowledge Spaces* 1999;
  *Learning Spaces* 2011) — **the closest formal neighbor.** KST already formalizes
  prerequisite ("surmise") relations, knowledge states, and well-graded *learning
  paths*, with acyclicity built in. A reviewer who knows KST must not feel we are
  unaware of it. The delta is *not* mathematical: KST structures are typically
  **inferred from assessment-response data** and used to *adaptively assess*; ours is
  **authored as a source of truth** and used to **compile exposition** (ordering,
  glossary, closure, assessment hooks) under CI-enforced invariants. KST answers
  "what state is the learner in?"; we answer "is this *content* well-formed against its
  dependency structure, by construction?"
- **Knowledge-component / Q-matrix models** (Tatsuoka's rule space, 1983; Koedinger,
  Corbett & Perfetti's KLI framework, 2012; cognitive tutors) — decompose a domain into
  KCs mapped to items for tutoring and assessment. We share the item→concept mapping
  (§12) but do not model learning/transfer of KCs; we use the decomposition to gate
  *forward-reference closure in exposition*, which KC work does not.
- **Concept maps** (Novak & Gowin, 1984) — visual concept-relation graphs for learning
  and elicitation. We differ by *typing and build-checking* the graph; and we inherit
  the well-known critique (edge **validity** and scoring **subjectivity** are hard) —
  which is exactly why §13 Tier-1 (independent edge review) is owed and the gates are
  honest that they check *form, not correctness*.
- **Prerequisite/competency ontologies** (OWL/RDF curriculum graphs) — share the
  explicit-graph idea; we add the *derivation* (the curriculum is output, not a
  parallel artifact) and the build gate.

In one table — what each tradition already solves, and the delta this proposal adds:

| Tradition | What it already solves | What this proposal adds |
|---|---|---|
| Gagné, learning hierarchies | prerequisite hierarchies for skills | a machine-checked *source of truth* |
| Knowledge Space Theory | formal prerequisite/state modeling, learning paths | *authored*, *compiled* exposition + closure gates (vs response-inferred) |
| Q-matrix / KC models | item↔skill mapping for assessment/tutoring | prose/order/glossary *derivation* from the same graph |
| Concept maps | visual relation graphs | typed, build-checked, *derivational* graph |
| Curriculum/competency ontologies | machine-readable competencies | CI gates + content compilation |

**Positioning.** The differentiator is narrow and engineering: **the typed concept
graph is a build-checked *source of truth* from which ordering, navigation, glossary,
and assessment hooks are *derived*** — a curriculum *compiler* with enforced
invariants (closure, acyclicity, coherence, traceability), rather than a hand-drawn map
kept in sync by discipline or a structure inferred from response data. What it compiles
is *form*; whether the form teaches is the deferred empirical question (§13) this paper
is built to make answerable.

### References

- Doignon, J.-P., & Falmagne, J.-C. (1985). Spaces for the assessment of knowledge.
  *International Journal of Man-Machine Studies*, 23(2), 175–196.
- Doignon, J.-P., & Falmagne, J.-C. (1999). *Knowledge Spaces.* Springer.
- Falmagne, J.-C., & Doignon, J.-P. (2011). *Learning Spaces.* Springer.
- Gagné, R. M. (1968). Learning hierarchies. *Educational Psychologist*, 6(1), 1–9.
- Koedinger, K. R., Corbett, A. T., & Perfetti, C. (2012). The Knowledge-Learning-
  Instruction framework: Bridging the science-practice chasm to enhance robust
  learning. *Cognitive Science*, 36(5), 757–798.
- Novak, J. D., & Gowin, D. B. (1984). *Learning How to Learn.* Cambridge Univ. Press.
- Tatsuoka, K. K. (1983). Rule space: An approach for dealing with misconceptions based
  on item response theory. *Journal of Educational Measurement*, 20(4), 345–354.

*(Citations are to the canonical sources; a camera-ready version owes a fuller
comparison, especially a side-by-side with KST's surmise relations.)*

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
skill-focus            → goal, content-attachment
assessment             → concept, ordering, goal-closure
validation-tiers       → assessment, skill-map-derivation
domain-faithfulness    → concept-graph, goal, validation-tiers
optimal-output  [goal] → definition-closure, acyclicity, ordering, goal-closure
tension-resolution     → content-attachment, validation-tiers, optimal-output
transfer-limits [goal] → optimal-output, validation-tiers
```

Acyclic (verify: no node lists a later node). The **§1–§16** order is one topological
order of this graph; `optimal-output`, a goal, depends on every invariant, so it can
only be defined at §14 — hence the reading-contract spiral gloss. (§17 Threats and §18
Related work are back-matter, outside the concept map — like §0, which is the
closure-exempt orientation node.) The method, applied to itself, produced this paper's
spine.

## Appendix B — a hand-worked maturity-versioning example (move 4)

Move 4 (§5) is the method's answer to genuinely co-constitutive concepts and is its
least-tested part (no reference instance uses it). This sketch shows it is a concrete
construction, not a placeholder — though a hand sketch is not validation (§16).

*Target mutuality:* in introductory mechanics, **force**, **mass**, and
**acceleration** are co-defined — `F = ma` relates all three, and each is usually
"defined" via the others, which naively forms a 3-cycle. Move 4 dissolves it into an
acyclic version chain:

```
force-informal          ← (primitive)        "a push or pull"
mass-informal           ← (primitive)        "how much stuff / how hard to push"
acceleration-informal   ← velocity            "how fast velocity changes"
newtons-second-law      ← force-informal, mass-informal, acceleration-informal
                          [the coordinator: relates the three informal versions]
force-formal            ← newtons-second-law  "F ≡ m·a, as defined by the law"   (refines force-informal)
mass-formal             ← newtons-second-law  "inertial mass, the ratio F/a"     (refines mass-informal)
```

The chain is acyclic (each node's prerequisites precede it), yet it honestly models
"you hold rough versions of all three, then the law sharpens each into its formal
version." The `refines` edges (§2 semantic-kind) carry the version relation. **What
this does *not* show:** that *every* co-constitutive cluster stratifies this cleanly —
some may resist (the open question, §16). It shows only that the construction is
well-defined where it applies.
