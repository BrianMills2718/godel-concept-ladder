/**
 * Stage 8 — Provability vs Truth (⊢ vs ⊨). The conceptual core of the site.
 *
 * Goal: put the two relations side by side on the same sentences and show they
 * are different arrows — agreeing on easy cases, diverging at the Gödel sentence.
 */
import type { Lesson } from "../../types";

export const stage8: Lesson = {
  id: "stage-8",
  stage: 8,
  title: "Provability vs Truth (⊢ vs ⊨)",
  summary:
    "⊢ is syntactic derivability; ⊨ is semantic truth-in-a-structure. They are different relations on the same sentence — often agreeing, but not the same, and the Gödel sentence is where they part.",
  prerequisites: ["stage-7"],
  objectives: [
    "State the difference between $T\\vdash P$ and $\\mathbb{N}\\models P$.",
    "Read the four canonical sentences across well-formed / provable / true.",
    "Accept that a sentence can be true in $\\mathbb{N}$ yet unprovable in $T$.",
  ],
  definitions: [
    { term: "syntactic", short: "About symbol manipulation — proofs, derivations. @n{turnstile} lives here." },
    { term: "semantic", short: "About interpretation in a structure — truth. @n{models} lives here." },
  ],
  sections: [
    {
      heading: "Two arrows, one sentence",
      body: `For a single well-formed sentence $P$ there are two independent relations:

$$T \\vdash P \\quad\\text{(some finite proof of }P\\text{ exists in }T\\text{)}$$
$$\\mathbb{N} \\models P \\quad\\text{(}P\\text{ evaluates to true in the standard model)}$$

One is about **derivation**, the other about **evaluation**. Drawing them as the *same* arrow is the central category error this whole site is built to prevent.`,
    },
    {
      heading: "When they agree — and why that's misleading",
      body: `For $2+2=4$ both hold; for $2+2=5$ both fail (PA even refutes it). This agreement is real but *local*: it happens because PA is **sound** (Stage 9) and these sentences are simple closed computations. Seeing them always travel together on easy examples is exactly what tempts people to identify $\\vdash$ with $\\models$.`,
    },
    {
      heading: "Where they split",
      body: `Gödel's theorem (Stage 15) produces a well-formed sentence $G_T$ with

$$T \\nvdash G_T \\qquad\\text{yet}\\qquad \\mathbb{N}\\models G_T$$

(under the usual assumptions that $T$ is consistent, strong enough, and sound). Here the two arrows visibly come apart: $G_T$ is **true but unprovable in $T$**. The gap between "provable in this theory" and "true in the standard model" is the entire subject of incompleteness.`,
    },
  ],
  visualizations: [
    {
      id: "stage8-tworel",
      kind: "typed-graph",
      title: "The same sentence $P$, two different relations",
      textualSummary:
        "A single well-formed sentence P is the target of two different arrows: the theory T 'proves' P (a proof-layer relation), and the structure ℕ 'satisfies' P (a semantics-layer relation). They are distinct relations; for the Gödel sentence the proof arrow is absent while the satisfaction arrow remains.",
      layers: ["syntax", "proof", "semantics"],
      nodes: [
        { id: "P", type: "Sentence", layer: "syntax", label: "well-formed sentence $P$", position: { x: 300, y: 180 } },
        { id: "T", type: "ObjectTheory", layer: "proof", label: "theory $T$", position: { x: 40, y: 60 } },
        { id: "N", type: "Structure", layer: "semantics", label: "structure $\\mathbb{N}$", position: { x: 40, y: 300 } },
      ],
      edges: [
        { id: "e1", source: "T", target: "P", type: "proves", label: "⊢ (syntactic)", layer: "proof" },
        { id: "e2", source: "N", target: "P", type: "satisfies", label: "⊨ (semantic)", layer: "semantics" },
      ],
    },
    {
      id: "stage8-table",
      kind: "comparison-table",
      title: "Well-formed / provable / true across the four examples",
      textualSummary:
        "Malformed string: not well-formed, not provable, no truth value. 2+2=4: yes, yes, yes. 2+2=5: well-formed, not provable in consistent PA, false. Gödel sentence G_T: well-formed, not provable in T (assuming consistency and strength), true in ℕ under the usual assumptions. The provable and true columns disagree precisely at G_T.",
      columns: ["Well-formed?", "Provable in $T$?", "True in $\\mathbb{N}$?"],
      rows: [
        { label: "$\\forall{+}{=}x))0$", cells: { "Well-formed?": { value: "no" }, "Provable in $T$?": { value: "no" }, "True in $\\mathbb{N}$?": { value: "n/a", note: "no truth value" } } },
        { label: "$2+2=4$", cells: { "Well-formed?": { value: "yes" }, "Provable in $T$?": { value: "yes" }, "True in $\\mathbb{N}$?": { value: "yes" } } },
        { label: "$2+2=5$", cells: { "Well-formed?": { value: "yes" }, "Provable in $T$?": { value: "no", note: "$T$ refutes it" }, "True in $\\mathbb{N}$?": { value: "no" } } },
        { label: "$G_T$", cells: { "Well-formed?": { value: "yes" }, "Provable in $T$?": { value: "no", note: "T consistent & strong" }, "True in $\\mathbb{N}$?": { value: "yes", note: "metatheoretic assumptions" } } },
      ],
    },
  ],
  confusions: [
    {
      misconception: "If something is true in $\\mathbb{N}$, the theory must be able to prove it.",
      correction:
        "Truth and provability are different relations. Gödel exhibits a true-in-$\\mathbb{N}$ sentence that the theory cannot prove. Truth does not entail provability.",
    },
    {
      misconception: "$\\vdash$ and $\\models$ always agree, so they mean the same thing.",
      correction:
        "They agree on simple sentences because PA is sound, but agreement isn't identity. At $G_T$ they diverge — that divergence is incompleteness.",
    },
  ],
  quiz: [
    {
      id: "s8q1",
      type: "true-false",
      prompt: "True or false: a sentence can be true in $\\mathbb{N}$ yet unprovable in a given consistent theory $T$.",
      correct: true,
      explanation:
        "True — this is exactly Gödel's first incompleteness theorem. $G_T$ is such a sentence.",
    },
    {
      id: "s8q2",
      type: "multiple-choice",
      prompt: "Why do $T\\vdash P$ and $\\mathbb{N}\\models P$ agree on $2+2=4$?",
      options: [
        "Because $\\vdash$ and $\\models$ are by definition the same relation.",
        "Because $T$ (PA) is sound, and $2+2=4$ is a simple closed computation both relations settle.",
        "Because every well-formed sentence is provable.",
        "By coincidence, with no underlying reason.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "They are different relations (syntactic vs semantic); they merely coincide here.",
        "2": "Most sentences are not provable; well-formedness is much weaker.",
      },
      explanation:
        "Soundness ($T\\vdash P\\Rightarrow\\mathbb{N}\\models P$) plus the simplicity of the sentence makes them coincide — not definitional sameness.",
    },
    {
      id: "s8q3",
      type: "classification",
      prompt: "For each sentence, mark whether $T$ proves it (assuming $T$ is consistent and sound).",
      buckets: ["Provable in T", "Not provable in T"],
      items: [
        { id: "a", label: "$2+2=4$", correctBucket: "Provable in T" },
        { id: "b", label: "$2+2=5$", correctBucket: "Not provable in T" },
        { id: "c", label: "$G_T$ (the Gödel sentence)", correctBucket: "Not provable in T" },
      ],
      explanation:
        "$T$ proves $2+2=4$; it does not prove $2+2=5$ (it refutes it); and it does not prove $G_T$ — even though $G_T$ is true in $\\mathbb{N}$.",
    },
  ],
  masteryCheckpoint:
    "You can explain why 'provable in $T$' and 'true in $\\mathbb{N}$' are different predicates, and that the Gödel sentence is true-but-unprovable.",
};
