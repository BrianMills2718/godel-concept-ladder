/**
 * Stage 15 — First Incompleteness Theorem. The critical correctness stage
 * (CONTENT_NOTES §1). Keep the three conditions separate:
 *   T ⊬ G_T          needs only CONSISTENCY
 *   T ⊬ ¬G_T         needs ω-consistency (Gödel) or Rosser's trick (consistency)
 *   ℕ ⊨ G_T (true)   needs SOUNDNESS / that ℕ ⊨ T (metatheoretic)
 */
import type { Lesson } from "../../types";

export const stage15: Lesson = {
  id: "stage-15",
  stage: 15,
  title: "First Incompleteness Theorem",
  summary:
    "If T is consistent, computably axiomatized, and strong enough for arithmetic, then T ⊬ G_T — yet G_T is true in ℕ (assuming T is sound). Truth outruns provability.",
  prerequisites: ["stage-14"],
  objectives: [
    "State the three hypotheses: consistent, computably axiomatized, strong enough.",
    "Show $T\\nvdash G_T$ using only consistency.",
    "Know that $T\\nvdash\\neg G_T$ needs ω-consistency (Gödel) or Rosser's trick.",
    "Explain why $G_T$ is true in $\\mathbb{N}$ — and that this step needs soundness.",
    "Distinguish 'unprovable in $T$' from 'absolutely unprovable'.",
  ],
  definitions: [
    { term: "consistent", short: "@n{T} proves no contradiction; @n{T}@n{nturnstile}$0=1$." },
    { term: "computably axiomatized", short: "$T$'s axioms can be mechanically recognized/listed (effectively axiomatized)." },
    { term: "strong enough", short: "$T$ represents enough arithmetic to encode syntax and proof-checking (e.g. PA, or even Robinson's Q)." },
    { term: "incomplete", short: "Some sentence @n{P} has neither @n{T}@n{turnstile}@n{P} nor $T\\vdash\\neg P$." },
  ],
  sections: [
    {
      heading: "Statement",
      body: `**First Incompleteness Theorem.** If $T$ is **consistent**, **computably axiomatized**, and **strong enough** to represent basic arithmetic, then there is a sentence $G_T$ with

$$T \\nvdash G_T,$$

and — assuming $T$ is **sound** for $\\mathbb{N}$ — also

$$\\mathbb{N}\\models G_T.$$

So $G_T$ is **true but not provable in $T$**. Each clause leans on a *different* hypothesis; the rest of the stage keeps them apart.`,
    },
    {
      heading: "Step 1 — T ⊬ G_T (only consistency needed)",
      body: `Recall $T\\vdash G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$. Suppose $T\\vdash G_T$. Then:

- An actual proof of $G_T$ exists, so by representability $T\\vdash \\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$.
- But from $T\\vdash G_T$ and the equivalence, $T\\vdash \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$.

Now $T$ proves both $\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$ and its negation — $T$ is **inconsistent**. Contrapositive: if $T$ is **consistent**, then $T\\nvdash G_T$. Note: *only consistency* was used here.`,
    },
    {
      heading: "Step 2 — the other half needs more than consistency",
      body: `For genuine *incompleteness* we also need the negation unprovable. Here the two classical routes use **different sentences** — don't merge them:

- **Track A — Gödel's original $G_T$** (the $\\neg\\mathrm{Prov}_T$ sentence above). Consistency gives $T\\nvdash G_T$ (Step 1), but $T\\nvdash\\neg G_T$ requires the stronger hypothesis **ω-consistency** ($T$ never proves $\\exists x\\,\\varphi(x)$ while refuting each of $\\varphi(0),\\varphi(1),\\dots$).
- **Track B — Rosser's sentence $R_T$** (1936): a *different* sentence built from a cleverly modified "proof-before-refutation" predicate. For $R_T$, **plain consistency** already yields *both* $T\\nvdash R_T$ and $T\\nvdash\\neg R_T$.

So: with $G_T$ you get incompleteness assuming ω-consistency; with the separate sentence $R_T$ you get it from bare consistency. Either way a consistent, computable, strong enough $T$ is **incomplete**.`,
    },
    {
      heading: "Step 3 — why G_T is true in ℕ (two separate ingredients)",
      body: `This step is **metatheoretic** and rests on two *distinct* facts — keep them apart:

1. **Correct arithmetization (not soundness).** $\\mathrm{Proof}_T(p,q)$ is built to hold of exactly the genuine proof-codes; in the standard model $\\mathbb{N}$ its extension matches real provability. Since Step 1 (consistency) gives *no* real proof of $G_T$, we get $\\mathbb{N}\\models\\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$. This uses only the construction + consistency — *not* any assumption that $T$ is sound.
2. **Soundness / standard model.** To pass from there to $\\mathbb{N}\\models G_T$ we use the provable biconditional $G_T\\leftrightarrow\\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$. For $\\mathbb{N}$ to satisfy that biconditional we need $\\mathbb{N}\\models T$ — i.e. $T$ is **sound** (the standard model is a model of $T$).

Together: $\\mathbb{N}\\models G_T$. Drop soundness and you lose the *truth* claim (ingredient 2), though unprovability (Step 1) still stands. Keep the hedge: **"true under the usual assumption that the standard model satisfies $T$."**`,
    },
    {
      heading: "What it does and doesn't say",
      body: `$G_T$ is unprovable **in $T$** — not absolutely. A stronger system (e.g. $T+G_T$, or set theory for $T=\\mathrm{PA}$) proves it outright. Incompleteness is not "some truths are forever beyond all reasoning"; it is "**no single** consistent, computable, sufficiently strong theory captures all arithmetic truth." Every time you add the missing truth, the *new* theory has its own Gödel sentence (Stage 16).`,
    },
  ],
  visualizations: [
    {
      id: "stage15-regions",
      kind: "typed-graph",
      title: "$G_T$ lives in true-but-not-provable",
      textualSummary:
        "Within all well-formed sentences, the true-in-ℕ sentences form a region, and for a sound theory the provable-in-T sentences sit inside it. Because T is incomplete, provable-in-T does not exhaust true-in-ℕ: the Gödel sentence G_T is true in ℕ but not provable in T, sitting in the gap. Its negation ¬G_T is false in ℕ and also unprovable — for the original G_T this needs ω-consistency, while Rosser's separate sentence achieves both unprovabilities from plain consistency.",
      layers: ["syntax", "semantics", "proof"],
      nodes: [
        { id: "all", type: "Sentence", layer: "syntax", label: "all well-formed sentences", position: { x: 40, y: 30 } },
        { id: "true", type: "TruthValue", layer: "semantics", label: "true in $\\mathbb{N}$", position: { x: 360, y: 30 } },
        { id: "prov", type: "Theorem", layer: "proof", label: "provable in $T$", position: { x: 360, y: 160 } },
        { id: "g", type: "Sentence", layer: "semantics", label: "$G_T$: true, not provable", position: { x: 660, y: 95 } },
        { id: "ng", type: "Sentence", layer: "proof", label: "$\\neg G_T$: false, not provable", position: { x: 360, y: 300 } },
      ],
      edges: [
        { id: "e1", source: "true", target: "all", type: "relates", label: "⊆", layer: "semantics" },
        { id: "e2", source: "prov", target: "true", type: "relates", label: "⊆ (soundness)", layer: "proof" },
        { id: "e3", source: "g", target: "true", type: "relates", label: "∈", layer: "semantics" },
        { id: "e4", source: "g", target: "prov", type: "relates", label: "∉ (Step 1)", layer: "proof" },
        { id: "e5", source: "ng", target: "prov", type: "relates", label: "∉ (Step 2)", layer: "proof" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "Gödel needs the theory to be sound (true) to get unprovability.",
      correction:
        "Unprovability of $G_T$ (Step 1) needs only *consistency*. Soundness is needed only for the separate claim that $G_T$ is *true* in $\\mathbb{N}$ (Step 3).",
    },
    {
      misconception: "Plain consistency already gives that neither $G$ nor $\\neg G$ is provable.",
      correction:
        "$T\\nvdash G$ needs consistency; $T\\nvdash\\neg G$ needs ω-consistency (Gödel) or a Rosser sentence (then consistency suffices). The two halves have different hypotheses.",
    },
    {
      misconception: "Gödel proves there are truths nothing can ever establish.",
      correction:
        "$G_T$ is unprovable *in $T$*, not absolutely — a stronger theory proves it. The theorem limits any *single* effective theory, not knowledge as such.",
    },
    {
      misconception: "Gödel applies to every formal system.",
      correction:
        "Only to consistent, computably axiomatized, sufficiently strong ones. Weak or non-effective systems can be complete (e.g. Presburger arithmetic is complete and decidable).",
    },
  ],
  quiz: [
    {
      id: "s15q1",
      type: "multi-select",
      prompt: "Which hypotheses does the First Incompleteness Theorem require of $T$?",
      options: [
        "$T$ is consistent.",
        "$T$ is computably (effectively) axiomatized.",
        "$T$ is strong enough to represent basic arithmetic.",
        "$T$ is finite.",
      ],
      correct: [0, 1, 2],
      explanation:
        "Consistent + computably axiomatized + strong enough. Finiteness is not required (PA has infinitely many axioms via schemas).",
    },
    {
      id: "s15q2",
      type: "multiple-choice",
      prompt: "Which hypothesis is enough, by itself, to conclude $T\\nvdash G_T$?",
      options: [
        "Soundness.",
        "Consistency.",
        "Completeness.",
        "ω-consistency is required even for this.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "Soundness is needed for the *truth* of $G_T$, not for its unprovability.",
        "3": "ω-consistency is needed for $T\\nvdash\\neg G_T$, not for $T\\nvdash G_T$.",
      },
      explanation:
        "If $T\\vdash G_T$ then $T$ proves both $\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$ and its negation — inconsistent. So consistency alone gives $T\\nvdash G_T$.",
    },
    {
      id: "s15q3",
      type: "true-false",
      prompt:
        "True or false: 'unprovable in $T$' means 'unprovable in every possible system'.",
      correct: false,
      explanation:
        "False. $G_T$ is unprovable in $T$ but provable in suitable stronger systems. Incompleteness bounds each single effective theory, not all reasoning.",
    },
    {
      id: "s15q4",
      type: "multiple-choice",
      prompt: "Why does $T\\nvdash G_T$ make $G_T$ true in $\\mathbb{N}$ (given $T$ sound)?",
      options: [
        "Because unprovable sentences are true by definition.",
        "Because $G_T$ asserts exactly 'no number codes a $T$-proof of $G_T$', and Step 1 shows there really is no such proof.",
        "Because $T$ proves $G_T$ is true.",
        "It doesn't — $G_T$ is false.",
      ],
      correct: 1,
      explanation:
        "$G_T$ says it has no proof; Step 1 (consistency) establishes it has none, and correct arithmetization gives $\\mathbb{N}\\models\\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$. Soundness ($\\mathbb{N}\\models T$) is then what carries this to $\\mathbb{N}\\models G_T$ via the provable biconditional — two separate ingredients.",
    },
  ],
  masteryCheckpoint:
    "You can state the three hypotheses, derive $T\\nvdash G_T$ from consistency alone, attribute $T\\nvdash\\neg G_T$ to ω-consistency/Rosser, and explain why $G_T$'s *truth* needs soundness — and why unprovable-in-$T$ isn't absolute.",
};
