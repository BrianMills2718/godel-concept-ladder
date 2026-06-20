/**
 * Stage 0 — The Four-Level Map.
 *
 * Goal: install the single most important habit before any definitions —
 * keeping syntax / proof / truth / metatheory apart. The comparison table is
 * the payload; the layer map shows that semantics is not merely "after" proof.
 */
import type { Lesson } from "../../types";

export const stage0: Lesson = {
  id: "stage-0",
  stage: 0,
  title: "The Four-Level Map",
  summary:
    "Before any definitions: keep syntax, proof, truth, and metatheory separate. Well-formed ≠ provable ≠ true.",
  prerequisites: [],
  objectives: [
    "Name the four levels: syntax, proof theory, semantics, metatheory.",
    "State the core slogan: well-formed ≠ provable ≠ true.",
    "Classify an expression by which level a claim about it lives on.",
  ],
  definitions: [
    {
      term: "syntax",
      short: "Which strings are legal formulas.",
      example: "$\\forall x(x+0=x)$ is legal; $\\forall{+}{=}x))0$ is not.",
    },
    {
      term: "proof theory",
      short: "Which formulas are derivable from axioms by inference rules. Written @n{T}@n{turnstile}@n{P}.",
    },
    {
      term: "semantics",
      short: "Which formulas are true in a structure / model. Written @n{M}@n{models}@n{P} (for the standard model, @n{N}@n{models}@n{P}).",
    },
    {
      term: "metatheory",
      short: "What we can prove ABOUT the theory — its syntax, proofs, and models — from outside it.",
    },
  ],
  sections: [
    {
      heading: "Four levels, not one",
      body: `Most confusion about Gödel comes from collapsing four different questions into one. Keep them apart from the start.

1. **Syntax** — *Is this string a legal formula?* This is grammar. It has nothing to do with truth.
2. **Proof theory** — *Can this formula be derived from the axioms?* Written @n{T}@n{turnstile}@n{P}. This is symbol manipulation.
3. **Semantics** — *Is this formula true in a structure?* Written @n{M}@n{models}@n{P}. This is about interpretation, e.g. truth in the standard natural numbers @n{N}.
4. **Metatheory** — *What can we prove about the theory itself?* For example: "PA is consistent", or "PA does not prove @n{GT}".`,
    },
    {
      heading: "The slogan",
      body: `The whole site is built to keep this true in your head:

$$\\text{well-formed} \\;\\neq\\; \\text{provable} \\;\\neq\\; \\text{true}$$

These are three different properties of a sentence. They often agree on simple examples — which is exactly why they get confused — but they are not the same property.`,
    },
    {
      heading: "Not a one-way pipeline",
      body: `It is tempting to draw a straight line: strings → formulas → theorems → truths. That is misleading. A sentence can be *evaluated for truth in a structure even if no proof of it exists*. Proof and truth are two different relations on the same well-formed sentence, not two stops on one conveyor belt. Gödel's theorem lives precisely in the gap between them.`,
    },
  ],
  visualizations: [
    {
      id: "stage0-layer-map",
      kind: "typed-graph",
      title: "The four levels and how claims attach to a sentence",
      textualSummary:
        "A raw string is filtered by grammar into a well-formed sentence. That same sentence has two independent relations: the proof relation from a theory T (proves) and the satisfaction relation from the structure ℕ (satisfies). Above all of this sits the metatheory, which proves claims about the theory, its proofs, and its models. Syntax, proof, semantics, and metatheory are distinct layers.",
      layers: ["syntax", "proof", "semantics", "metatheory"],
      nodes: [
        { id: "raw", type: "RawString", layer: "syntax", label: "raw string", position: { x: 40, y: 40 }, note: "any finite sequence of symbols" },
        { id: "sent", type: "Sentence", layer: "syntax", label: "well-formed sentence $P$", position: { x: 40, y: 170 } },
        { id: "T", type: "ObjectTheory", layer: "proof", label: "theory $T$ (PA)", position: { x: 330, y: 60 } },
        { id: "thm", type: "Theorem", layer: "proof", label: "$T \\vdash P$", position: { x: 330, y: 180 }, note: "P is provable in T" },
        { id: "N", type: "Structure", layer: "semantics", label: "structure $\\mathbb{N}$", position: { x: 330, y: 300 } },
        { id: "true", type: "TruthValue", layer: "semantics", label: "$\\mathbb{N} \\models P$", position: { x: 330, y: 420 }, note: "P is true in the standard naturals" },
        { id: "meta", type: "MetaTheory", layer: "metatheory", label: "metatheory", position: { x: 640, y: 230 }, note: "reasons about T, its proofs, and its models" },
      ],
      edges: [
        { id: "e1", source: "raw", target: "sent", type: "parsed_as", label: "grammar", layer: "syntax" },
        { id: "e2", source: "T", target: "thm", type: "proves", layer: "proof" },
        { id: "e3", source: "thm", target: "sent", type: "proves", label: "of", layer: "proof" },
        { id: "e4", source: "N", target: "sent", type: "satisfies", layer: "semantics" },
        { id: "e5", source: "meta", target: "T", type: "proves_about", layer: "metatheory" },
        { id: "e6", source: "meta", target: "thm", type: "proves_about", layer: "metatheory" },
        { id: "e7", source: "meta", target: "true", type: "proves_about", layer: "metatheory" },
      ],
    },
    {
      id: "stage0-table",
      kind: "comparison-table",
      title: "The same four examples, three different questions",
      textualSummary:
        "The malformed string ∀+=x))0 is not well-formed, not provable, and has no truth value. 2+2=4 is well-formed, provable in PA, and true in ℕ. 2+2=5 is well-formed, not provable in consistent PA, and false in ℕ. The Gödel sentence G_PA is well-formed, not provable in PA (assuming PA is consistent), yet true in ℕ (assuming PA is sound). The columns disagree — that is the point.",
      columns: ["Well-formed?", "Provable in PA?", "True in $\\mathbb{N}$?"],
      rows: [
        {
          label: "$\\forall{+}{=}x))0$",
          cells: {
            "Well-formed?": { value: "no" },
            "Provable in PA?": { value: "no", note: "only formulas can be proved" },
            "True in $\\mathbb{N}$?": { value: "n/a", note: "no truth value — it is not a sentence" },
          },
        },
        {
          label: "$2+2=4$",
          cells: {
            "Well-formed?": { value: "yes" },
            "Provable in PA?": { value: "yes" },
            "True in $\\mathbb{N}$?": { value: "yes" },
          },
        },
        {
          label: "$2+2=5$",
          cells: {
            "Well-formed?": { value: "yes" },
            "Provable in PA?": { value: "no", note: "assuming PA is consistent" },
            "True in $\\mathbb{N}$?": { value: "no" },
          },
        },
        {
          label: "Gödel sentence $G_{\\mathrm{PA}}$",
          cells: {
            "Well-formed?": { value: "yes" },
            "Provable in PA?": { value: "no", note: "assuming PA is consistent" },
            "True in $\\mathbb{N}$?": { value: "yes", note: "assuming PA is sound" },
          },
        },
      ],
    },
  ],
  confusions: [
    {
      misconception: "If a sentence is well-formed, it must be either provable or at least meaningful-as-true.",
      correction:
        "Well-formedness is purely grammatical. $2+2=5$ is perfectly well-formed and simply false. Being legal says nothing about being provable or true.",
    },
    {
      misconception: "‘True’ and ‘provable in PA’ are the same thing for arithmetic.",
      correction:
        "They agree on simple examples but are different properties. Gödel's theorem produces a sentence that is true in $\\mathbb{N}$ yet not provable in PA.",
    },
    {
      misconception: "Metatheory is just more statements inside PA.",
      correction:
        "Metatheoretic claims like ‘PA is consistent’ are about PA. They live one level up. (Later, Gödel cleverly encodes some of them back into arithmetic — but they start as external claims.)",
    },
  ],
  quiz: [
    {
      id: "s0q1",
      type: "classification",
      prompt: "Sort each claim by which level it belongs to.",
      buckets: ["Syntax", "Proof theory", "Semantics", "Metatheory"],
      items: [
        { id: "i1", label: "“$\\forall{+}{=}x))0$ is not a legal formula.”", correctBucket: "Syntax" },
        { id: "i2", label: "“$\\mathrm{PA} \\vdash 2+2=4$.”", correctBucket: "Proof theory" },
        { id: "i3", label: "“$\\mathbb{N} \\models 2+2=4$.”", correctBucket: "Semantics" },
        { id: "i4", label: "“PA is consistent.”", correctBucket: "Metatheory" },
      ],
      explanation:
        "Legality is syntax; $\\vdash$ is proof theory; $\\models$ (truth in a structure) is semantics; a claim about PA itself is metatheory.",
    },
    {
      id: "s0q2",
      type: "multiple-choice",
      prompt: "Which statement about $2+2=5$ is correct?",
      options: [
        "It is malformed, so it has no truth value.",
        "It is well-formed but false in $\\mathbb{N}$, and not provable in consistent PA.",
        "It is well-formed and true, but PA cannot prove it.",
        "It is provable in PA but not true.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "$2+2=5$ parses fine — it is a perfectly legal equation between numerals. It is simply false.",
        "2": "It is not true in $\\mathbb{N}$: $2+2$ evaluates to $4$, and $4 \\neq 5$.",
        "3": "A consistent, sound theory never proves a false arithmetic equation.",
      },
      explanation:
        "$2+2=5$ is well-formed (grammatical), false in $\\mathbb{N}$, and not provable in consistent PA. Three different levels, all answered separately.",
    },
    {
      id: "s0q3",
      type: "true-false",
      prompt:
        "True or false: a sentence must be provable in $T$ before we can ask whether it is true in $\\mathbb{N}$.",
      correct: false,
      explanation:
        "False. Truth in a structure is an independent relation. We can evaluate any well-formed sentence in $\\mathbb{N}$ whether or not $T$ proves it — that independence is exactly where the Gödel sentence lives.",
    },
  ],
  masteryCheckpoint:
    "You can take any claim and say which of the four levels it lives on — and explain why ‘well-formed’, ‘provable’, and ‘true’ are three separate questions.",
};
