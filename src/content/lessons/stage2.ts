/**
 * Stage 2 — Grammar: generation and recognition.
 *
 * Goal: nail down that grammar answers exactly one question — "is this a legal
 * expression?" — and never "is it true?" or "is it provable?". The two views
 * (build legal strings vs check a given string) are two sides of the same rules.
 */
import type { Lesson } from "../../types";

export const stage2: Lesson = {
  id: "stage-2",
  stage: 2,
  title: "Grammar: Generation & Recognition",
  summary:
    "A grammar decides which strings are well-formed — nothing more. Generation builds legal expressions; recognition checks a given one. Neither touches truth or provability.",
  prerequisites: ["stage-1"],
  objectives: [
    "State the one question a grammar answers: is this string legal?",
    "Distinguish a generative grammar (builds) from a recognizer/parser (checks).",
    "Explain why a false sentence like 2+2=5 is still perfectly well-formed.",
  ],
  definitions: [
    { term: "grammar", short: "The formal rules fixing which strings are well-formed." },
    { term: "generative grammar", short: "Rules that build legal expressions from smaller ones." },
    { term: "recognition grammar", short: "A parser: a procedure that decides whether a given string is legal.", example: "Input $\\forall x(x{=}x)$ → parser → legal." },
    { term: "well-formed formula", short: "A string the grammar accepts as a formula. Purely syntactic — says nothing about truth.", example: "$2+2=5$ is well-formed but false." },
  ],
  sections: [
    {
      heading: "Two views of one rule set",
      body: `A **grammar** is a finite set of formation rules. You can read those rules in two directions.

**Generation** — start from atoms and build outward:

- $0$ is a term; if $t$ is a term so is $S(t)$.
- if $s,t$ are terms then $(s+t)$ and $(s\\times t)$ are terms.
- if $s,t$ are terms then $(s=t)$ is a formula.
- if $P$ is a formula so is $\\neg P$; if $P,Q$ are formulas so is $(P\\to Q)$; if $P$ is a formula so is $\\forall x\\,P$.

**Recognition** — take a string and try to *parse* it by those same rules. If a parse exists, the string is legal; if not, it's gibberish. Recognition is the algorithm behind "well-formed?" and (we'll see in Stage 11) it is **decidable**.`,
    },
    {
      heading: "Grammar is silent about truth",
      body: `This is the whole point of the stage. The grammar accepts $2+2=5$ exactly as readily as $2+2=4$: both are $(s=t)$ with $s,t$ terms. The grammar has **no opinion** about which equation holds — that is a question for *semantics* (Stage 7), and whether either is *provable* is a question for *proof theory* (Stage 3).

$$\\text{well-formed} \\;\\neq\\; \\text{true} \\;\\neq\\; \\text{provable}$$

So: legal does not mean true, legal does not mean provable, and — going the other way — being false (like $2+2=5$) does not make a string malformed.`,
    },
  ],
  visualizations: [
    {
      id: "stage2-grammar",
      kind: "typed-graph",
      title: "Generation builds legal strings; recognition checks them",
      textualSummary:
        "On the generation side, the rule 'term, term → formula (s=t)' builds the well-formed formula 2+2=5 from the terms 2+2 and 5. On the recognition side, a parser takes a string and outputs legal or illegal: 2+2=5 is legal (well-formed), while ∀+=x))0 is illegal. Both 2+2=4 and 2+2=5 are legal — legality is independent of truth.",
      layers: ["syntax"],
      nodes: [
        { id: "rule", type: "InferenceRule", layer: "syntax", label: "rule: terms $s,t \\Rightarrow$ formula $(s=t)$", position: { x: 40, y: 40 } },
        { id: "t1", type: "Term", layer: "syntax", label: "term $2+2$", position: { x: 40, y: 160 } },
        { id: "t2", type: "Term", layer: "syntax", label: "term $5$", position: { x: 40, y: 260 } },
        { id: "wff", type: "Formula", layer: "syntax", label: "well-formed $2+2=5$", position: { x: 320, y: 200 } },
        { id: "parser", type: "InferenceRule", layer: "syntax", label: "parser", position: { x: 320, y: 40 } },
        { id: "legal", type: "Formula", layer: "syntax", label: "legal ✓", position: { x: 600, y: 0 } },
        { id: "bad", type: "RawString", layer: "syntax", label: "$\\forall{+}{=}x))0$ illegal ✗", position: { x: 600, y: 110 } },
      ],
      edges: [
        { id: "e1", source: "t1", target: "rule", type: "formed_from", label: "input", layer: "syntax" },
        { id: "e2", source: "t2", target: "rule", type: "formed_from", label: "input", layer: "syntax" },
        { id: "e3", source: "rule", target: "wff", type: "formed_from", label: "builds", layer: "syntax" },
        { id: "e4", source: "wff", target: "parser", type: "parsed_as", label: "check", layer: "syntax" },
        { id: "e5", source: "parser", target: "legal", type: "parsed_as", layer: "syntax" },
        { id: "e6", source: "parser", target: "bad", type: "parsed_as", label: "rejects", layer: "syntax" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "If a string parses, it must be true (or at least provable).",
      correction:
        "Parsing only certifies legality. $2+2=5$ parses and is false; many well-formed sentences are neither provable nor true. Grammar and truth are different layers.",
    },
    {
      misconception: "$2+2=5$ is a 'broken' or malformed expression because it's wrong.",
      correction:
        "It is grammatically flawless — a legal equality between two terms. Its falsehood is a semantic fact, not a grammatical one.",
    },
  ],
  quiz: [
    {
      id: "s2q1",
      type: "multi-select",
      prompt: "Which of these strings are well-formed formulas?",
      options: ["$2+2=4$", "$2+2=5$", "$\\forall{+}{=}x))0$", "$\\forall x(x=x)$"],
      correct: [0, 1, 3],
      explanation:
        "$2+2=4$, $2+2=5$, and $\\forall x(x=x)$ all parse. Only $\\forall{+}{=}x))0$ is illegal. Note $2+2=5$ is well-formed despite being false.",
    },
    {
      id: "s2q2",
      type: "true-false",
      prompt: "True or false: 'well-formed' is the same as 'true'.",
      correct: false,
      explanation:
        "False. Well-formed is purely grammatical (Stage 2). Truth is semantic (Stage 7) and requires a structure. $2+2=5$ is well-formed and false.",
    },
    {
      id: "s2q3",
      type: "multiple-choice",
      prompt: "What question does a recognition grammar (parser) answer?",
      options: [
        "Is this string true in $\\mathbb{N}$?",
        "Is this string provable in PA?",
        "Is this string a legal expression of the language?",
        "Is this string useful?",
      ],
      correct: 2,
      wrongExplanations: {
        "0": "Truth is decided by a structure (semantics), not a parser.",
        "1": "Provability is decided by proof rules (proof theory), not a parser.",
      },
      explanation:
        "A parser decides legality only. Truth and provability are separate questions answered at other layers.",
    },
  ],
  masteryCheckpoint:
    "You can explain that grammar decides legality and nothing else — and give an example (2+2=5) of a well-formed sentence that is false.",
};
