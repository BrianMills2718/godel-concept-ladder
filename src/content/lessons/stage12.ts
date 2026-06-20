/**
 * Stage 12 — Gödel coding (arithmetization of syntax). Embeds the interactive
 * coding-encoder. Per CONTENT_NOTES §5: prime-power coding is illustrative; the
 * number doesn't "know" it codes a formula — the relation is external, then
 * represented inside arithmetic (Stage 13).
 */
import type { Lesson } from "../../types";

export const stage12: Lesson = {
  id: "stage-12",
  stage: 12,
  title: "Gödel Coding",
  summary:
    "Assign numbers to symbols, formulas, and proofs. A sequence becomes one number via prime powers; unique factorization recovers it. This turns claims about syntax into claims about numbers.",
  prerequisites: ["stage-11"],
  objectives: [
    "Explain Gödel coding / arithmetization of syntax.",
    "Encode a sequence as $2^{a_1+1}3^{a_2+1}5^{a_3+1}\\cdots$ and decode by factorization.",
    "State why unique factorization makes the coding invertible.",
    "Explain that the number does not intrinsically 'mean' a formula.",
  ],
  definitions: [
    { term: "Gödel coding", short: "Assigning natural numbers to symbols, strings, formulas, and proofs." },
    { term: "code number", short: "The natural number assigned to a syntactic object, written with @n{corner}.", example: "$\\ulcorner P\\urcorner$ is the code of @n{P}." },
    { term: "arithmetization of syntax", short: "Representing syntactic facts (well-formedness, proofhood) as arithmetic facts about code numbers." },
  ],
  sections: [
    {
      heading: "The bridge Gödel needs",
      body: `Gödel wants the object theory PA — which only talks about numbers — to talk about *its own syntax*. The trick: assign every syntactic object a number, its **code**. Symbols get numbers, formulas (sequences of symbols) get numbers, and **proofs** (sequences of formulas) get numbers. Then a statement like "$p$ is a proof of $q$" becomes a statement about the numbers $p$ and $q$.`,
    },
    {
      heading: "Sequences as prime powers",
      body: `To code a *sequence* $[a_1,a_2,a_3,\\dots]$ as a single number, use prime powers — with a small twist, exponent $a_i+1$:

$$\\text{code}([a_1,a_2,a_3,\\dots]) = 2^{a_1+1}\\cdot 3^{a_2+1}\\cdot 5^{a_3+1}\\cdots$$

Why the $+1$? It makes *every* position contribute at least one factor of its prime, so a $0$ entry is still visible and the **length** is recoverable. By the **Fundamental Theorem of Arithmetic** (unique prime factorization) the exponents read straight back off the number: divide out 2s for $a_1+1$, 3s for $a_2+1$, and so on; the first prime that does *not* divide the number marks the end of the sequence. So the coding is **invertible from the number alone** — length and all. (With bare $a_i$, a trailing $0$ would vanish and $[1]$ and $[1,0]$ would collide.) Try it below.`,
    },
    {
      heading: "Illustrative, not literal",
      body: `This particular scheme is a *teaching* numbering — real Gödel numberings differ in detail and efficiency. What matters is only that some mechanical, invertible coding exists. The numbers blow up astronomically; that's fine, since we never compute them, we only reason about them.`,
    },
    {
      heading: "The number doesn't 'know' anything",
      body: `Crucial subtlety: the number $720$ does not *intrinsically* mean a formula. The coding relation is fixed **externally** by our scheme. Inside arithmetic, "decoding" is captured by a *formula about numbers* that we deliberately write down (Stage 13). So syntax-as-arithmetic is a thing we *represent*, not a meaning the integers carry on their own.`,
    },
  ],
  visualizations: [
    {
      id: "stage12-encoder",
      kind: "coding-encoder",
      title: "Encode a sequence, then decode it back",
      textualSummary:
        "An interactive encoder: enter a short sequence such as [4,7,9]; the tool computes 2^(4+1) · 3^(7+1) · 5^(9+1) as a single number, then decodes it by dividing out each prime (subtracting the +1 shift) to recover [4,7,9]. The first prime that does not divide the number marks the sequence's end, so length and contents are recovered from the number alone.",
      defaultSequence: [4, 7, 9],
    },
    {
      id: "stage12-map",
      kind: "typed-graph",
      title: "Syntax becomes arithmetic",
      textualSummary:
        "A formula encodes_as a code number, and a proof encodes_as a code number. The metatheoretic relation 'p codes a valid proof of q' is then represented inside arithmetic by a formula Proof_T(p,q). The coding edges (encodes_as) and the representation edge (represents) belong to the coding layer.",
      layers: ["syntax", "coding"],
      nodes: [
        { id: "form", type: "Formula", layer: "syntax", label: "formula $P$", position: { x: 40, y: 40 } },
        { id: "proof", type: "ProofStep", layer: "syntax", label: "proof $\\pi$", position: { x: 40, y: 180 } },
        { id: "q", type: "CodeNumber", layer: "coding", label: "code $\\ulcorner P\\urcorner = q$", position: { x: 340, y: 40 } },
        { id: "p", type: "CodeNumber", layer: "coding", label: "code $p$ of $\\pi$", position: { x: 340, y: 180 } },
        { id: "pred", type: "ArithmeticPredicate", layer: "coding", label: "$\\mathrm{Proof}_T(p,q)$", position: { x: 640, y: 110 } },
      ],
      edges: [
        { id: "e1", source: "form", target: "q", type: "encodes_as", layer: "coding" },
        { id: "e2", source: "proof", target: "p", type: "encodes_as", layer: "coding" },
        { id: "e3", source: "p", target: "pred", type: "represents", label: "p,q feed", layer: "coding" },
        { id: "e4", source: "q", target: "pred", type: "represents", layer: "coding" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "The code number itself contains or 'understands' the formula.",
      correction:
        "No. The number is just a number. The correspondence is fixed by an external coding scheme; arithmetic only *represents* the decoding via a formula we construct.",
    },
    {
      misconception: "Prime-power coding is the one true Gödel numbering.",
      correction:
        "It is one illustrative scheme. Any mechanical, invertible coding works. Real numberings differ; the existence of some such coding is all Gödel needs.",
    },
    {
      misconception: "We have to actually compute these huge numbers.",
      correction:
        "We never do. We reason *about* the codes via arithmetic relations; the astronomical sizes are irrelevant to the argument.",
    },
  ],
  quiz: [
    {
      id: "s12q1",
      type: "multiple-choice",
      prompt: "Why are prime powers used to encode a sequence into one number?",
      options: [
        "Because primes are the smallest numbers.",
        "Because unique prime factorization lets the exponents — hence the sequence — be recovered exactly.",
        "Because primes are true in $\\mathbb{N}$.",
        "Because every proof is prime.",
      ],
      correct: 1,
      explanation:
        "Unique factorization makes $2^{a_1+1}3^{a_2+1}5^{a_3+1}\\cdots$ invertible: the exponents (minus the $+1$ shift) read straight back off, and the first absent prime marks the length.",
    },
    {
      id: "s12q2",
      type: "true-false",
      prompt: "True or false: a Gödel code number intrinsically 'means' the formula it codes.",
      correct: false,
      explanation:
        "False. The meaning comes from the external coding scheme. Arithmetic only *represents* the coding relation through a formula we write; the integer carries no meaning by itself.",
    },
    {
      id: "s12q3",
      type: "matching",
      prompt: "Match each syntactic object to what it gets coded as.",
      left: [
        { id: "sym", label: "a symbol" },
        { id: "frm", label: "a formula (sequence of symbols)" },
        { id: "prf", label: "a proof (sequence of formulas)" },
      ],
      right: [
        { id: "r1", label: "a base code number" },
        { id: "r2", label: "a number coding its symbol-codes" },
        { id: "r3", label: "a number coding its formula-codes" },
      ],
      pairs: { sym: "r1", frm: "r2", prf: "r3" },
      explanation:
        "Coding is layered: symbols → numbers; formulas code their symbol sequence; proofs code their formula sequence — each via the same prime-power trick.",
    },
  ],
  masteryCheckpoint:
    "You can encode a sequence with prime powers, decode it by factorization, and explain that the code's meaning is external, not intrinsic.",
};
