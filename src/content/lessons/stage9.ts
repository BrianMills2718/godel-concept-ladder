/**
 * Stage 9 — Soundness and completeness. Correctness-sensitive (CONTENT_NOTES
 * §3, §4): keep soundness vs consistency distinct, and disambiguate the two
 * senses of "complete" (Gödel's Completeness Theorem about FOL vs completeness
 * of a theory, which incompleteness denies).
 */
import type { Lesson } from "../../types";

export const stage9: Lesson = {
  id: "stage-9",
  stage: 9,
  title: "Soundness & Completeness",
  summary:
    "Sound = no false theorems (T⊢P ⇒ ℕ⊨P). Complete (of a theory) = every sentence is decided. Consistent = proves no contradiction. 'Complete' is overloaded — beware.",
  prerequisites: ["stage-8"],
  objectives: [
    "Define soundness, theory-completeness, and consistency precisely.",
    "Distinguish soundness from consistency (and know which is stronger).",
    "Separate Gödel's Completeness Theorem (about FOL) from completeness of a theory.",
  ],
  definitions: [
    { term: "soundness", short: "Everything provable is true in the intended structure: @n{T}@n{turnstile}@n{P} $\\Rightarrow$ @n{N}@n{models}@n{P}. 'No false theorems.'" },
    { term: "completeness", short: "Of a theory: for every sentence $P$, $T\\vdash P$ or $T\\vdash\\neg P$. ('Every sentence is decided.')" },
    { term: "consistency", short: "@n{T} proves no contradiction; equivalently @n{T}@n{nturnstile}$0=1$." },
    { term: "contradiction", short: "A sentence and its negation together, or a canonical falsehood like $0=1$." },
  ],
  sections: [
    {
      heading: "Soundness: no false theorems",
      body: `A theory is **sound** (for $\\mathbb{N}$) when proof never outruns truth:

$$T\\vdash P \\;\\Longrightarrow\\; \\mathbb{N}\\models P.$$

So a sound theory's theorems all sit inside the true sentences. PA is sound. Soundness is the bridge that lets us *trust* $\\vdash$ as a guide to $\\models$ — but it is an extra property, not part of $\\vdash$.`,
    },
    {
      heading: "Soundness vs consistency — not the same",
      body: `**Consistency** is weaker and purely syntactic:

$$T \\nvdash (P\\wedge\\neg P)\\quad\\text{equivalently}\\quad T\\nvdash 0=1.$$

Soundness implies consistency (a sound theory can't prove a falsehood, so can't prove $0=1$), but **not** conversely: a consistent theory might still prove things false in $\\mathbb{N}$ if its axioms are satisfied only by some *non-standard* structure. Keep them apart: consistency = "no contradiction"; soundness = "no falsehoods about $\\mathbb{N}$."`,
    },
    {
      heading: "Completeness of a theory",
      body: `A theory is **complete** when it leaves no sentence undecided:

$$\\text{for every sentence } P,\\quad T\\vdash P \\ \\text{ or }\\ T\\vdash \\neg P.$$

Gödel's **incompleteness** theorem (Stage 15) says: any consistent, computably axiomatized theory strong enough for arithmetic is **not** complete — some $P$ has neither $P$ nor $\\neg P$ provable.`,
    },
    {
      heading: "Warning: two senses of 'complete'",
      body: `This word is overloaded and the clash confuses everyone:

- **Gödel's Completeness Theorem (1929)** is about *first-order logic itself*: if $\\Gamma$ semantically entails $\\varphi$ ($\\Gamma\\models\\varphi$), then $\\Gamma\\vdash\\varphi$. The *logic* is complete — provability captures logical consequence.
- **Completeness of a theory** is the property above ("every sentence decided"). This is what the **Incompleteness** theorem denies for strong arithmetic theories.

No contradiction between them: one is about the logic's deductive power, the other about a particular theory settling every sentence. Always check which "complete" is meant.`,
    },
  ],
  visualizations: [
    {
      id: "stage9-circles",
      kind: "typed-graph",
      title: "Provable ⊆ true ⊆ all sentences (sound, incomplete theory)",
      textualSummary:
        "Among all well-formed sentences, the true-in-ℕ sentences form a subset, and for a sound theory the provable sentences form a subset of those. Because the theory is incomplete, the provable set does not fill up the true set: the Gödel sentence G_T sits inside true-in-ℕ but outside provable-in-T.",
      layers: ["syntax", "semantics", "proof"],
      nodes: [
        { id: "all", type: "Sentence", layer: "syntax", label: "all well-formed sentences", position: { x: 40, y: 30 } },
        { id: "true", type: "TruthValue", layer: "semantics", label: "true in $\\mathbb{N}$", position: { x: 360, y: 30 } },
        { id: "prov", type: "Theorem", layer: "proof", label: "provable in $T$", position: { x: 360, y: 170 } },
        { id: "g", type: "Sentence", layer: "semantics", label: "$G_T$: true but not provable", position: { x: 360, y: 320 } },
      ],
      edges: [
        { id: "e1", source: "true", target: "all", type: "relates", label: "⊆", layer: "semantics" },
        { id: "e2", source: "prov", target: "true", type: "relates", label: "⊆ (soundness)", layer: "proof" },
        { id: "e3", source: "g", target: "true", type: "relates", label: "∈", layer: "semantics" },
        { id: "e4", source: "g", target: "prov", type: "relates", label: "∉ (incompleteness)", layer: "proof" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "Sound and consistent mean the same thing.",
      correction:
        "Consistency = proves no contradiction (syntactic). Soundness = proves no $\\mathbb{N}$-falsehood (semantic). Soundness ⇒ consistency, not the reverse.",
    },
    {
      misconception: "Gödel's Completeness Theorem and Incompleteness Theorem contradict each other.",
      correction:
        "They use 'complete' in different senses. Completeness is about first-order logic capturing consequence; incompleteness is about a strong theory failing to decide every sentence. Both are true.",
    },
    {
      misconception: "A sound theory must be complete.",
      correction:
        "No. Soundness bounds proofs inside the truths; completeness asks proofs to reach *all* the truths (or their negations). PA is sound yet incomplete.",
    },
  ],
  quiz: [
    {
      id: "s9q1",
      type: "matching",
      prompt: "Match each property to its definition.",
      left: [
        { id: "snd", label: "sound" },
        { id: "cmp", label: "complete (theory)" },
        { id: "con", label: "consistent" },
      ],
      right: [
        { id: "r1", label: "$T\\vdash P \\Rightarrow \\mathbb{N}\\models P$" },
        { id: "r2", label: "for all $P$: $T\\vdash P$ or $T\\vdash\\neg P$" },
        { id: "r3", label: "$T\\nvdash 0=1$" },
      ],
      pairs: { snd: "r1", cmp: "r2", con: "r3" },
      explanation:
        "Sound = no false theorems; complete = decides every sentence; consistent = proves no contradiction.",
    },
    {
      id: "s9q2",
      type: "true-false",
      prompt: "True or false: a theory can be sound and incomplete at the same time.",
      correct: true,
      explanation:
        "True. PA is sound (no false theorems) yet incomplete (some sentence is neither proved nor refuted). The two properties are independent in this direction.",
    },
    {
      id: "s9q3",
      type: "multiple-choice",
      prompt: "Why is consistency weaker than soundness?",
      options: [
        "They are actually equivalent.",
        "Consistency only forbids contradictions; a consistent theory could still prove something false in $\\mathbb{N}$ (true only in non-standard structures).",
        "Soundness only forbids contradictions.",
        "Consistency implies completeness.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "Soundness ⇒ consistency but not conversely, so they are not equivalent.",
        "3": "Consistency says nothing about deciding every sentence.",
      },
      explanation:
        "Consistency is the syntactic 'no contradiction'; soundness additionally demands truth in $\\mathbb{N}$. A consistent theory can have only non-standard models and still prove $\\mathbb{N}$-falsehoods.",
    },
  ],
  masteryCheckpoint:
    "You can define sound, complete, and consistent without conflating them, and explain why the Completeness and Incompleteness theorems both hold.",
};
