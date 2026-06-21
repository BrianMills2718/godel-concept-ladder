/**
 * Stage 3 — Axioms, inference rules, proofs, theorems.
 *
 * Goal: move from "legal" to "derivable". Introduce ⊢ as a *syntactic* relation
 * — derivability by rules — and hammer that T⊢P does NOT mean P is true.
 */
import type { Lesson } from "../../types";

export const stage3: Lesson = {
  id: "stage-3",
  stage: 3,
  title: "Axioms, Inference Rules, Proofs",
  summary:
    "A theory starts from axioms and grinds forward by inference rules. A proof is a finite object; a theorem is its endpoint. T⊢P is syntactic — it is not (yet) a claim about truth.",
  prerequisites: ["stage-2"],
  objectives: [
    "Define axiom, inference rule, proof, and theorem.",
    "Read $T \\vdash P$ as 'there is a finite derivation of $P$ from $T$'.",
    "Explain why $T \\vdash P$ does not by itself mean $P$ is true.",
    "Distinguish checking a proof from searching for one.",
  ],
  definitions: [
    { term: "axiom", short: "A formula a theory @n{T} accepts without derivation.", example: "$\\forall x(x+0=x)$." },
    { term: "inference rule", short: "A licensed step from premises to a conclusion.", example: "Modus ponens: from $A$ and $A\\to B$, infer $B$." },
    { term: "proof", short: "A finite sequence/tree of formulas, each an axiom or inferred from earlier ones." },
    { term: "theorem", short: "A formula @n{P} with a proof. We write @n{T}@n{turnstile}@n{P}.", example: "$\\mathrm{PA} \\vdash 2+2=4$." },
  ],
  sections: [
    {
      heading: "From axioms by rules",
      body: `A theory @n{T} hands you two things: a set of @t{axiom|axioms} (formulas you may use for free) and @t{inference rule|inference rules} (licensed moves). The workhorse rule is **modus ponens** — from $A$ and $A\\to B$, infer $B$:

$$\\dfrac{A \\qquad A\\to B}{B}$$

A @c{proof} is a finite list (or tree) of formulas in which every line is either an axiom or follows from earlier lines by a rule. The last line is the @c{theorem}. When such a proof exists we write

$$T \\vdash P$$

— i.e. @n{T} @n{turnstile} @n{P}, read "@n{T} proves @n{P}": *there exists a finite valid derivation of $P$ in $T$*. (Tap any symbol above to see what it means.)`,
    },
    {
      heading: "⊢ is syntax, not truth",
      body: `@n{T}@n{turnstile}@n{P} is a statement about **symbol manipulation**: rules were applied to strings until $P$ appeared. It says nothing, on its own, about $P$ being *true* (that is @n{models}, a different relation we reach in Stage 7). A theory with a false axiom would happily prove false things.

The bridge from "provable" to "true" is a *separate* property called **soundness** (introduced later, at the *Soundness/Completeness* node): a theory is sound when everything it proves is true. PA is sound, so its theorems are true — but that is an extra fact about PA, not part of the meaning of @n{turnstile}.`,
    },
    {
      heading: "Finite — and that matters",
      body: `In ordinary first-order logic a proof is a **finite** object. That finiteness is exactly what lets us, later (Stages 11–13), *encode a proof as a single number* and check it mechanically. Hold onto it: "proof = finite object" is load-bearing for Gödel.`,
    },
  ],
  visualizations: [
    {
      id: "stage3-ladder",
      kind: "ladder",
      title: "Provability, up and down the ladder of abstraction",
      parameter: "the proof object",
      textualSummary:
        "Control: exhibit one finite derivation of 2+2=4 from PA's axioms — a single concrete proof witnessing PA ⊢ 2+2=4. Abstract over all proofs: T ⊢ P asserts that SOME finite derivation exists, quantifying over every proof object — an existential claim, not a particular proof. Step down: read it at a sentence — for the Gödel sentence no proof object exists, so T ⊬ G_T.",
      rungs: [
        { rung: "control", caption: "Exhibit one proof", body: "Write a specific finite derivation from PA's axioms ending in $2+2=4$ — one concrete proof witnesses $\\mathrm{PA}\\vdash 2+2=4$." },
        { rung: "abstract-over", caption: "Over all proofs", body: "$T\\vdash P$ abstracts over *which* derivation: it asserts *some* finite proof exists — an existential claim over all proof objects, not any particular one." },
        { rung: "step-down", caption: "Read it at a sentence", body: "At a sentence with no proof object, the existential is false: $T\\nvdash P$. This is what 'unprovable' means — no witness exists." },
      ],
    },
    {
      id: "stage3-mp",
      kind: "typed-graph",
      title: "A proof step: modus ponens",
      textualSummary:
        "Two premises, the axiom A and the formula A→B, feed a modus ponens inference step, which concludes B. The conclusion B is a theorem: it is reachable from the axioms by a licensed rule. The edges are proof-layer relations (premise_of, concludes), distinct from grammar or truth.",
      layers: ["proof"],
      nodes: [
        { id: "A", type: "Axiom", layer: "proof", label: "$A$", position: { x: 60, y: 40 } },
        { id: "AB", type: "Axiom", layer: "proof", label: "$A \\to B$", position: { x: 280, y: 40 } },
        { id: "mp", type: "InferenceRule", layer: "proof", label: "modus ponens", position: { x: 170, y: 170 } },
        { id: "B", type: "Theorem", layer: "proof", label: "$B$ (theorem)", position: { x: 170, y: 300 } },
      ],
      edges: [
        { id: "e1", source: "A", target: "mp", type: "premise_of", layer: "proof" },
        { id: "e2", source: "AB", target: "mp", type: "premise_of", layer: "proof" },
        { id: "e3", source: "mp", target: "B", type: "concludes", layer: "proof" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "$T \\vdash P$ means $P$ is true.",
      correction:
        "$\\vdash$ is pure derivability — symbol pushing. Truth needs a structure ($\\models$, Stage 7). They coincide only when $T$ is *sound* (Stage 9), which is an extra property.",
    },
    {
      misconception: "Finding a proof and verifying a proof are the same task.",
      correction:
        "Verifying a given derivation is a mechanical check (decidable). Searching for a proof of a target may never halt if none exists. Same rules, very different difficulty (Stages 4, 11).",
    },
  ],
  quiz: [
    {
      id: "s3q1",
      type: "multiple-choice",
      prompt: "What does $T \\vdash P$ assert?",
      options: [
        "$P$ is true in $\\mathbb{N}$.",
        "There exists a finite derivation of $P$ from $T$'s axioms by its rules.",
        "$P$ is well-formed.",
        "Every structure satisfies $P$.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "That is $\\mathbb{N}\\models P$ (semantics), a different relation.",
        "2": "Well-formedness is grammar; $\\vdash$ presupposes it but asserts more.",
        "3": "That is semantic validity, again not what $\\vdash$ means.",
      },
      explanation:
        "$\\vdash$ is the existence of a finite proof — a syntactic, derivability claim.",
    },
    {
      id: "s3q2",
      type: "true-false",
      prompt:
        "True or false: because $\\vdash$ is about symbol manipulation, a theory could in principle prove a false sentence.",
      correct: true,
      explanation:
        "True. If a theory had a false axiom it would prove falsehoods. 'No false theorems' is the extra property of soundness (Stage 9), not part of $\\vdash$ itself.",
    },
    {
      id: "s3q3",
      type: "matching",
      prompt: "Match each notion to its description.",
      left: [
        { id: "ax", label: "axiom" },
        { id: "rule", label: "inference rule" },
        { id: "thm", label: "theorem" },
      ],
      right: [
        { id: "r1", label: "a formula accepted without proof" },
        { id: "r2", label: "a licensed step from premises to a conclusion" },
        { id: "r3", label: "a formula that has a proof" },
      ],
      pairs: { ax: "r1", rule: "r2", thm: "r3" },
      explanation:
        "Axioms are starting points; rules transform premises into conclusions; theorems are the formulas you can reach.",
    },
  ],
  masteryCheckpoint:
    "You can read $T \\vdash P$ as 'a finite derivation exists', and explain why that is not the same as $P$ being true.",
};
