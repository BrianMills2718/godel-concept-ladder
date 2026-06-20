/**
 * Stage 6 — Structures, interpretations, models.
 *
 * Goal: open the semantics layer. A structure assigns *meanings* to symbols.
 * The load-bearing distinction: the formal symbol + is NOT the addition
 * function — it is *interpreted as* that function in a structure.
 */
import type { Lesson } from "../../types";

export const stage6: Lesson = {
  id: "stage-6",
  stage: 6,
  title: "Structures & Interpretations",
  summary:
    "A structure is a domain plus an interpretation of every symbol. The standard structure ℕ interprets 0 as zero, S as successor, + as addition. A symbol is not its meaning.",
  prerequisites: ["stage-5"],
  objectives: [
    "Define structure, domain, interpretation, and model.",
    "Describe the standard structure $\\mathbb{N}$.",
    "Distinguish a formal symbol from the object/function it is interpreted as.",
  ],
  definitions: [
    { term: "structure", short: "A domain together with interpretations of all the language's symbols.", example: "$\\mathbb{N}=\\langle\\{0,1,2,\\dots\\},0,S,+,\\times,=\\rangle$." },
    { term: "domain", short: "The set of objects variables range over.", example: "$\\{0,1,2,\\dots\\}$ for $\\mathbb{N}$." },
    { term: "interpretation", short: "The assignment of actual objects, functions, and relations to formal symbols." },
    { term: "model", short: "A structure that satisfies a chosen set of sentences (a theory's axioms)." },
  ],
  sections: [
    {
      heading: "Giving symbols meaning",
      body: `Syntax and proof never mention what symbols *mean*. Semantics begins here. A **structure** supplies two things:

1. a **domain** — the objects we talk about, and
2. an **interpretation** — for each symbol, the actual object/function/relation it denotes.

The intended structure for arithmetic is the **standard model**:

$$\\mathbb{N}=\\big\\langle\\,\\{0,1,2,3,\\dots\\},\\ 0,\\ S,\\ +,\\ \\times,\\ =\\,\\big\\rangle.$$`,
    },
    {
      heading: "The symbol is not the meaning",
      body: `This is the distinction the stage exists for. In the *language*, "$+$" is a mark — three line segments. In the *structure $\\mathbb{N}$*, that mark is **interpreted as** the ordinary addition function $\\mathbb{N}\\times\\mathbb{N}\\to\\mathbb{N}$. They are different kinds of thing:

| Formal symbol | Interpreted in $\\mathbb{N}$ as |
|---|---|
| $0$ | the number zero |
| $S$ | the successor function $n\\mapsto n+1$ |
| $+$ | the addition function |
| $\\times$ | the multiplication function |
| $=$ | the identity relation |

A *different* structure could interpret "$+$" as something else entirely. The symbol is fixed by syntax; its meaning is supplied by the structure. Truth (next stage) is always *truth in a structure* — there is no structure-free "true."`,
    },
  ],
  visualizations: [
    {
      id: "stage6-interp",
      kind: "typed-graph",
      title: "Symbols interpreted in the structure $\\mathbb{N}$",
      textualSummary:
        "Each formal symbol on the left is interpreted as a semantic object on the right: 0 as the number zero, S as the successor function, + as the addition function, = as the identity relation. The interpretation edges belong to the semantics layer and are distinct from grammar or proof relations.",
      layers: ["syntax", "semantics"],
      nodes: [
        { id: "sym0", type: "Symbol", layer: "syntax", label: "symbol $0$", position: { x: 40, y: 30 } },
        { id: "symS", type: "Symbol", layer: "syntax", label: "symbol $S$", position: { x: 40, y: 130 } },
        { id: "symP", type: "Symbol", layer: "syntax", label: "symbol $+$", position: { x: 40, y: 230 } },
        { id: "symE", type: "Symbol", layer: "syntax", label: "symbol $=$", position: { x: 40, y: 330 } },
        { id: "objz", type: "DomainObject", layer: "semantics", label: "the number $0$", position: { x: 360, y: 30 } },
        { id: "funS", type: "Function", layer: "semantics", label: "successor $n\\mapsto n{+}1$", position: { x: 360, y: 130 } },
        { id: "funP", type: "Function", layer: "semantics", label: "addition function", position: { x: 360, y: 230 } },
        { id: "relE", type: "Relation", layer: "semantics", label: "identity relation", position: { x: 360, y: 330 } },
      ],
      edges: [
        { id: "e1", source: "sym0", target: "objz", type: "interpreted_as", layer: "semantics" },
        { id: "e2", source: "symS", target: "funS", type: "interpreted_as", layer: "semantics" },
        { id: "e3", source: "symP", target: "funP", type: "interpreted_as", layer: "semantics" },
        { id: "e4", source: "symE", target: "relE", type: "interpreted_as", layer: "semantics" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "The symbol $+$ just *is* the addition function.",
      correction:
        "The symbol is a syntactic mark; the addition function is a mathematical object. The structure links them via interpretation. Another structure could interpret $+$ differently.",
    },
    {
      misconception: "There is one absolute notion of 'true' for a sentence.",
      correction:
        "Truth is always relative to a structure. 'True in $\\mathbb{N}$' is the intended reading for arithmetic, but the same sentence can be false in a non-standard structure.",
    },
  ],
  quiz: [
    {
      id: "s6q1",
      type: "matching",
      prompt: "Match each formal symbol to its interpretation in $\\mathbb{N}$.",
      left: [
        { id: "z", label: "$0$" },
        { id: "s", label: "$S$" },
        { id: "p", label: "$+$" },
        { id: "e", label: "$=$" },
      ],
      right: [
        { id: "r1", label: "the number zero" },
        { id: "r2", label: "the successor function" },
        { id: "r3", label: "the addition function" },
        { id: "r4", label: "the identity relation" },
      ],
      pairs: { z: "r1", s: "r2", p: "r3", e: "r4" },
      explanation:
        "The standard structure interprets each constant/function/relation symbol as the obvious arithmetic object.",
    },
    {
      id: "s6q2",
      type: "multiple-choice",
      prompt: "What does a structure provide that syntax and proof do not?",
      options: [
        "A list of axioms.",
        "A domain of objects and meanings for the symbols.",
        "A parser for well-formedness.",
        "A set of inference rules.",
      ],
      correct: 1,
      explanation:
        "A structure supplies a domain plus an interpretation — the semantic content syntax and proof deliberately omit.",
    },
    {
      id: "s6q3",
      type: "true-false",
      prompt:
        "True or false: 'is $+$ a symbol or a function?' has the answer 'it depends on the level — a symbol in the language, a function in the structure.'",
      correct: true,
      explanation:
        "True. At the syntactic level $+$ is a symbol; the structure interprets that symbol as the addition function. Keeping the levels apart is the point of this stage.",
    },
  ],
  masteryCheckpoint:
    "You can describe $\\mathbb{N}$ as domain + interpretation, and explain why the symbol $+$ is not the same thing as the addition function.",
};
