# ADR-0005 — Typed prerequisite edges, LLM-in-the-loop generation, and the acyclic-substrate / spiral stance

- **Status:** Accepted (stance + Phase 1 implemented: typed edges); LLM-in-the-loop is the stated direction
- **Date:** 2026-06-21
- **Builds on:** ADR-0002 (concept layer), ADR-0003 (derive the map), ADR-0004 (methodology)
- **Owner:** Brian

## Context

Three conclusions crystallized in design discussion and want recording.

1. **"Prerequisite" is overloaded.** The per-edge justifications (`PREREQ_WHY`)
   are not all the same *kind* of dependency — "a variable *is a* symbol", "a
   string *is built from* symbols", "well-formed *means buildable by* the rules",
   "a quantifier *binds* a formula", "soundness *is the stronger* notion atop
   consistency", "*a hypothesis of* the theorem". In the concept-graph view this
   showed up as a real defect: contrast edges carry a visible label while
   prerequisite edges were bare (their justification was hover/click-only),
   because there was no concise thing to print on a prerequisite edge.

2. **A mechanical derivation guarantees correctness, not optimality.** SCC-condense
   + lift + transitive-reduce + topological-sort produces a *valid* curriculum (no
   forward references, a legal order), but a topological order is necessary, not
   sufficient — many valid orders exist and which one teaches well (pacing,
   motivation, where the payoff lands, when to revisit) is judgment, not algorithm.

3. **Cycles, reconsidered.** The prerequisite *relation* can be kept acyclic (any
   learnable concept has a non-circular grounding via decomposition / primitive /
   contrast-reclassification / maturity-versioning), and acyclicity is what makes
   it mechanically checkable. What is genuinely unavoidable is the *holism* of
   understanding — concepts co-constitute; understanding develops in a spiral.

## Decisions

### 1. Two orthogonal relation axes

- **Gating axis** — does the relation mean "understand first"? `prerequisite`
  (gates closure/acyclicity/derivation) vs `contrasts` / (future) `gloss` /
  `foreshadow` (non-gating).
- **Semantic-kind axis** — *what kind* of prerequisite, an **annotation** that
  does **not** change gating: a small controlled vocabulary
  `{ is-a, part-of, defined-via, operates-on, refines, assumes }`.
  - `is-a` — X is a kind/specialization of Y (`variable→symbol`, `theorem→sentence`).
  - `part-of` — X is composed of / contains Y (`string→symbol`, `formula→atomic-formula`).
  - `defined-via` — X's definition is stated through Y (`well-formed→formation-rule`, `Prov_T→Proof_T`).
  - `operates-on` — X is a construct/operation acting on Y (`quantifier→formula`).
  - `refines` — X is a stronger/sharper/later-maturity version of Y (`soundness→consistency`, `ω-consistency→consistency`). *This is where maturity-versioning lives.*
  - `assumes` — X takes Y as a hypothesis/ingredient (`first-incompleteness→consistency`, `godel-coding→formula`).
- **Rendering:** the *kind* is the always-on edge label (one word, styled per
  kind); the per-edge `why` stays on hover. This annotates every edge at a glance
  and exposes the *shape* of the dependency structure.
- **Discipline:** keep the vocabulary small and earned from real edges; allow a
  "primary flavor" rather than rigid typing (the `why` carries nuance). The kind
  is annotation; only the gating axis is a principled rule.

### 2. LLM-in-the-loop generation — "propose, then dispose"

The deterministic layer **defines the feasible set and enforces the hard
invariants**; the LLM **optimizes within it**. Every LLM output round-trips
through the gates.

| Deterministic (guarantees correctness) | LLM (optimizes quality, inside that envelope) |
|---|---|
| Closure (no concept before its prerequisites) | Which *valid* ordering teaches best |
| Acyclicity / valid topological orders | Grouping into units; pacing; cognitive load |
| Edge / justification / traceability invariants | Motivation, payoffs, and **spiral revisits** |
| "Is this a legal curriculum?" | Proposing decompositions / versionings / the edge *kind* |
| | Writing prose, examples, predicted misconceptions |

The LLM must **not** adjudicate the hard invariants (an LLM "this looks acyclic"
is not a guarantee). It adjudicates the soft optimization and assigns the edge
*kind* + writes the *why* (judgment a fixed algorithm shouldn't make).

### 3. Acyclic substrate + spiral experience

The dependency **substrate stays acyclic** (checkable; the holism does not force
cyclic prerequisites). The **learning experience may spiral** — revisit and deepen
co-constitutive concepts — and that spiral is *designed by the LLM over the
acyclic substrate*, not derived by the algorithm. The mutuality is represented by
(a) `refines` / maturity-versioned concepts and (b) the traversal, never by cyclic
prerequisite edges.

## Consequences
- Every prerequisite edge gains a visible, meaningful annotation; the graph view
  shows relationship *kinds*, not just arrows.
- A principled seam for the LLM: it operates on the soft layer; gates guard the hard
  layer. Quality from the LLM, correctness from the mechanism.
- More authoring per edge (a `kind`), and a taxonomy that must be kept small and
  evidence-driven to avoid bikeshedding.

## Status / phasing
- **Phase 1 (this ADR):** add the `kind` to all prerequisite edges; validate it;
  render it as the edge label. *Implemented.*
- **Phase 2 (direction):** LLM-in-the-loop generation/ordering with the gates as
  guardrails (the propose/dispose loop), and LLM-designed spiral traversal.
  Specced here; not built.
