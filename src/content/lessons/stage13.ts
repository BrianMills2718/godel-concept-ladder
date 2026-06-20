/**
 * Stage 13 — Proof_T(p,q) and Prov_T(q). Per CONTENT_NOTES §6: proof-checking is
 * primitive recursive, hence representable, which is *why* Proof_T can be an
 * arithmetic formula. Keep the inside/outside reading explicit.
 */
import type { Lesson } from "../../types";

export const stage13: Lesson = {
  id: "stage-13",
  stage: 13,
  title: "Proof_T(p,q) and Prov_T(q)",
  summary:
    "Proof_T(p,q) is an arithmetic formula meaning 'p codes a valid T-proof of formula q'. Prov_T(q) := ∃p Proof_T(p,q). PA holds no English notion of proof — only a number predicate representing it.",
  prerequisites: ["stage-12"],
  objectives: [
    "Read $\\mathrm{Proof}_T(p,q)$ and $\\mathrm{Prov}_T(q)$.",
    "List what $\\mathrm{Proof}_T(p,q)$ checks about the numbers $p,q$.",
    "Explain why proof-checking being mechanical makes it representable in PA.",
    "Separate the inside-arithmetic reading from the outside interpretation.",
  ],
  definitions: [
    { term: "predicate", short: "A formula expressing a property or relation of its arguments." },
    { term: "provability predicate", short: "An arithmetic formula $\\mathrm{Prov}_T(q)$ representing 'the formula coded by $q$ is provable in $T$'." },
  ],
  sections: [
    {
      heading: "From coded proofs to an arithmetic predicate",
      body: `With coding in hand (Stage 12), define an arithmetic relation between numbers:

$$\\mathrm{Proof}_T(p,q) \\;:=\\; \\text{“}p\\text{ codes a valid }T\\text{-proof of the formula coded by }q\\text{.”}$$

Unwound, $\\mathrm{Proof}_T(p,q)$ checks, *arithmetically*, that:

1. $p$ codes a finite sequence of formulas;
2. each entry codes a well-formed formula;
3. each entry is an axiom of $T$ or follows from earlier entries by an inference rule;
4. the last entry's code is $q$.`,
    },
    {
      heading: "Why this can be an arithmetic formula",
      body: `Each of those four checks is *mechanical and terminating* — proof-checking is **decidable** (Stage 11). A decidable syntactic relation of this kind is **primitive recursive**, and every primitive recursive relation is **representable** in PA: there is an actual arithmetic formula that holds of exactly the right numbers. That representability — not magic — is why $\\mathrm{Proof}_T(p,q)$ exists *inside* arithmetic.`,
    },
    {
      heading: "The provability predicate",
      body: `Now existentially quantify over the proof:

$$\\mathrm{Prov}_T(q) \\;:=\\; \\exists p\\,\\mathrm{Proof}_T(p,q).$$

$\\mathrm{Prov}_T(q)$ says "some number codes a $T$-proof of the formula coded by $q$" — i.e. *the formula coded by $q$ is provable in $T$*. Note the asymmetry: $\\mathrm{Proof}_T$ (with the witness $p$) is decidable, but $\\mathrm{Prov}_T$ has an unbounded $\\exists p$ — matching Stage 11's "theoremhood is r.e., not decidable."`,
    },
    {
      heading: "Inside vs outside",
      body: `Two readings, both legitimate, must be kept apart:

- **Inside arithmetic**, $\\mathrm{Proof}_T(p,q)$ is *just a formula about numbers* — divisibilities, bounded quantifiers, equations.
- **Outside (metatheory)**, we *interpret* it as "$p$ proves $q$".

PA does not literally contain the English concept "proof." It contains a number predicate that, under the coding, **represents** proofhood. That gap is what keeps the upcoming self-reference rigorous rather than circular.`,
    },
  ],
  visualizations: [
    {
      id: "stage13-prov",
      kind: "typed-graph",
      title: "Proof-checking, represented as arithmetic",
      textualSummary:
        "A proof π encodes as a number p and a formula P encodes as a number q. The valid-proof relation between π and P is represented inside arithmetic by the formula Proof_T(p,q). Existentially quantifying the proof code p yields Prov_T(q) = ∃p Proof_T(p,q), the provability predicate.",
      layers: ["coding", "metatheory"],
      nodes: [
        { id: "pi", type: "ProofStep", layer: "metatheory", label: "proof $\\pi$", position: { x: 40, y: 40 } },
        { id: "P", type: "Formula", layer: "metatheory", label: "formula $P$", position: { x: 40, y: 170 } },
        { id: "p", type: "CodeNumber", layer: "coding", label: "code $p$", position: { x: 300, y: 40 } },
        { id: "q", type: "CodeNumber", layer: "coding", label: "code $q$", position: { x: 300, y: 170 } },
        { id: "pf", type: "ArithmeticPredicate", layer: "coding", label: "$\\mathrm{Proof}_T(p,q)$", position: { x: 560, y: 105 } },
        { id: "prov", type: "ArithmeticPredicate", layer: "coding", label: "$\\mathrm{Prov}_T(q)=\\exists p\\,\\mathrm{Proof}_T(p,q)$", position: { x: 560, y: 240 } },
      ],
      edges: [
        { id: "e1", source: "pi", target: "p", type: "encodes_as", layer: "coding" },
        { id: "e2", source: "P", target: "q", type: "encodes_as", layer: "coding" },
        { id: "e3", source: "p", target: "pf", type: "represents", layer: "coding" },
        { id: "e4", source: "q", target: "pf", type: "represents", layer: "coding" },
        { id: "e5", source: "pf", target: "prov", type: "represents", label: "∃p", layer: "coding" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "PA literally understands the concept of 'proof'.",
      correction:
        "PA contains a formula about numbers that *represents* proofhood under the coding. The English concept lives in the metatheory; PA only mirrors it numerically.",
    },
    {
      misconception: "$\\mathrm{Prov}_T(q)$ is decidable because $\\mathrm{Proof}_T$ is.",
      correction:
        "$\\mathrm{Proof}_T(p,q)$ (with $p$ given) is decidable, but $\\mathrm{Prov}_T(q)=\\exists p\\,\\mathrm{Proof}_T(p,q)$ has an unbounded search — provability is r.e., not decidable.",
    },
  ],
  quiz: [
    {
      id: "s13q1",
      type: "multiple-choice",
      prompt: "What does $\\mathrm{Proof}_T(p,q)$ assert (read inside arithmetic, then interpreted)?",
      options: [
        "$q$ is true in $\\mathbb{N}$.",
        "$p$ codes a valid $T$-proof whose last line is the formula coded by $q$.",
        "$p$ and $q$ are prime.",
        "$T$ is consistent.",
      ],
      correct: 1,
      explanation:
        "It is the (representable) checking relation: $p$ codes a sequence that is a valid $T$-proof ending in the formula coded by $q$.",
    },
    {
      id: "s13q2",
      type: "fill-in",
      prompt: "Complete the definition: $\\mathrm{Prov}_T(q) := \\;?\\; \\mathrm{Proof}_T(p,q)$.",
      accepted: ["∃p", "exists p", "\\exists p", "there exists p", "∃ p"],
      placeholder: "the quantifier over p",
      explanation:
        "$\\mathrm{Prov}_T(q):=\\exists p\\,\\mathrm{Proof}_T(p,q)$ — there exists a proof code $p$ for the formula coded by $q$.",
    },
    {
      id: "s13q3",
      type: "true-false",
      prompt:
        "True or false: $\\mathrm{Proof}_T(p,q)$ can be written as an arithmetic formula because proof-checking is mechanical (decidable ⇒ primitive recursive ⇒ representable).",
      correct: true,
      explanation:
        "True. The representability of decidable syntactic relations is exactly what lets proofhood live inside arithmetic — no magic involved.",
    },
  ],
  masteryCheckpoint:
    "You can state $\\mathrm{Prov}_T(q)=\\exists p\\,\\mathrm{Proof}_T(p,q)$, list what $\\mathrm{Proof}_T$ checks, and explain why it is representable yet not an English notion inside PA.",
};
