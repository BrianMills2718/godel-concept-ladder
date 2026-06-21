# ADR-0006 — Examples and explanatory devices: in-domain spine + out-of-domain analogies (PEA), two-track backward derivation

- **Status:** Accepted (stance / target). **Not implemented** — the reference
  instance currently has a fixed *cast*, not a single evolving artifact, and
  models no analogies.
- **Date:** 2026-06-21
- **Builds on:** ADR-0004 (methodology), ADR-0005 (LLM-in-the-loop)
- **Owner:** Brian
- **Source:** design discussion + N. Case, *"How To Explain Things Real Good"*
  (PEA = Pictures, Examples, Analogies; "show then tell"; "Therefore & But").

## Context

Two questions sharpened the example/artifact side of the method: *what exactly are
Pictures vs Examples vs Analogies*, and *can a single example/artifact span a whole
topic*? The answer hinges on one distinction and predicts an asymmetry.

## Decisions

### 1. PEA, distinguished by **domain** (the line that matters)
- **Picture** — a visual of the *real thing itself* (the parse tree of the actual
  sentence; a square being rotated).
- **Example** — a concrete *instance from the concept's own domain* (`2+2=4` is an
  example of a provable sentence).
- **Analogy** — a mapping to a *different, familiar domain* (chess ↔ formal system).

Pictures and examples are **in-domain** (faithful — they *are* the thing or a real
case of it). Analogies are **out-of-domain** (lossy — a borrowed mapping). That
single difference governs how each can be reused and scoped.

### 2. One in-domain **through-line**, derived backward
The running *example* and its *picture/artifact* are the spine: a single object
that **accretes sophistication** across the arc (for Gödel, a sentence that goes
parse-tree → truth-in-ℕ → proof → code-number → self-reference). Derive it
**backward from the terminal artifact** (the one that embodies the end goal), the
same way the concept graph is derived backward from the goal concept. **Honest
fallback:** where one object cannot honestly span a stretch, use a *small,
consistent cast* — do not contrive a through-line. (`RUNNING_EXAMPLE.md` already
records that a single sentence cannot carry all 17 Gödel stages.)

### 3. Analogies are **local, plural, bounded — fitted forward, never derived backward**
Because an analogy maps to a foreign domain, it is faithful only on the features
that map and **silent or misleading elsewhere**; it has a *domain of validity*.
So: choose the best analogy *per concept*, mark its **breakdown point**, and
*retire* it there — never stretch one analogy across the arc (chess is brilliant
for "formal system = symbols + rules + start position" and structurally incapable
of reaching truth or the Gödel sentence; forcing it would be *wrong*, not merely
sub-optimal). **The breakdown point is information** — it is usually a "Therefore &
But" handoff to the next concept ("chess models a formal system, *but* chess has no
truth, *therefore* we need semantics"). Attach an analogy to its concept *lightly*
("maps X↔Y; breaks at Z") — no heavy taxonomy.

### 4. Two-track backward derivation, aligned by closure
- **Concept track:** goal concept → primitives (the concept graph).
- **Artifact/example track:** terminal artifact → its simplest seed.
- **Alignment:** the artifact-at-stage-N may use only concepts available by stage
  N (the *same closure gate* as prose), and should *exercise* that stage's new
  concept. This mechanically ties the two tracks.

### 5. Order is "show then tell" + "Therefore & But"
Concrete (picture/example) before abstract (definition); the sequence is a
problem→solution story, **not** a topological listicle (which is an "and-then"
list). This is the soft-optimization the LLM owns (ADR-0005), over the acyclic
substrate.

## Consequences
- A single evolving artifact is a stronger spine than a scattered cast; learners
  re-anchor on one growing picture.
- Analogies become *safe* (scoped + retired) instead of over-stretched.
- The artifact track gains a checkable invariant (closure against available
  concepts).

## Uncertainties & concerns (explicit)
- **Spanning artifact is an aspiration, not a guarantee.** Many topics have no
  single object that honestly spans the arc; the fallback-to-a-cast is mandatory,
  and deciding *when* one object stops working is a judgment call, not a rule.
- **Scope and breakpoints of analogies are empirical.** Which analogy lands and
  where it breaks is discovered by *testing for transfer* (ADR-0004 §9 Tier-2) —
  which we do **not** currently do. So this whole layer is **unvalidated**.
- **None of this is implemented.** The reference instance has a fixed *cast* and
  *per-stage* visualizations, not a single evolving artifact; analogies are not
  modeled at all; the artifact-track closure check does not exist. This ADR is a
  target, and may be wrong in ways only authoring a second topic will reveal.
- **Over-engineering risk.** A PEA/analogy taxonomy can sprawl; keep it minimal
  (attach an analogy + its breakpoint to a concept; resist a relation zoo).
- **"Backward from the terminal artifact" assumes you can name it up front.** For
  some topics the terminal artifact is itself unclear until you've explored — so
  in practice this is iterative (design a *candidate* terminal artifact, derive
  back, revise when the back-derivation exposes that it was wrong).
