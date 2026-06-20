/**
 * Stage 5 — Peano Arithmetic and the proof of 2+2=4.
 *
 * Goal: make ⊢ concrete on the running example. Derive 2+2=4 purely from the
 * recursive addition equations and numeral abbreviations, citing each rule, and
 * show why 2+2=5 is refutable. Fill-in quiz on the derivation steps.
 */
import type { Lesson } from "../../types";

export const stage5: Lesson = {
  id: "stage-5",
  stage: 5,
  title: "Peano Arithmetic and 2+2=4",
  summary:
    "PA's symbols, numerals, and the two recursive equations for addition. We derive 2+2=4 step by step, and see why 2+2=5 is refutable — both inside the proof system.",
  prerequisites: ["stage-4"],
  objectives: [
    "Read numerals as iterated successors: $2 = S(S(0))$.",
    "Use the recursive addition axioms $x+0=x$ and $x+S(y)=S(x+y)$.",
    "Derive $2+2=4$ and justify each step.",
    "Explain why proving $2+2=4$ does not make every truth provable.",
  ],
  definitions: [
    { term: "Peano Arithmetic", short: "A first-order theory of $\\mathbb{N}$ over $0, S, +, \\times, =$, with induction. Abbreviated PA." },
    { term: "numeral", short: "The formal name of a number as iterated successor.", example: "$3 = S(S(S(0)))$." },
    { term: "recursive definition", short: "A definition with a base case and a step case.", example: "$x+0=x$ (base); $x+S(y)=S(x+y)$ (step)." },
  ],
  sections: [
    {
      heading: "Symbols and numerals",
      body: `PA is written with $0$, successor $S$, $+$, $\\times$, $=$. Every natural number has a **numeral** — its name as a stack of successors:

$$1 := S(0),\\quad 2 := S(S(0)),\\quad 3 := S(S(S(0))),\\quad 4 := S(S(S(S(0)))).$$

These are *abbreviations*; the only number-building symbols are $0$ and $S$.`,
    },
    {
      heading: "Addition, recursively",
      body: `Addition is fixed by two equations — a base case and a step case:

$$x+0=x \\qquad\\text{(zero)}$$
$$x+S(y)=S(x+y) \\qquad\\text{(successor)}$$

Read the successor rule as "adding one more on the right pulls an $S$ outside." Repeatedly applying it peels the second argument down to $0$, where the zero rule finishes the job.`,
    },
    {
      heading: "Deriving 2+2=4",
      body: `Write $2 = S(S(0))$ and apply the successor rule twice, then the zero rule:

$$\\begin{aligned}
2+2 &= S(S(0))+S(S(0)) \\\\
&= S\\big(S(S(0))+S(0)\\big) &&\\text{successor rule } (y = S(0))\\\\
&= S\\big(S(S(S(0))+0)\\big) &&\\text{successor rule } (y = 0)\\\\
&= S\\big(S(S(S(0)))\\big) &&\\text{zero rule}\\\\
&= 4. &&\\text{numeral abbreviation}
\\end{aligned}$$

Every line is licensed by an axiom — this is a genuine PA derivation, so $\\mathrm{PA} \\vdash 2+2=4$.`,
    },
    {
      heading: "Why 2+2=5 fails",
      body: `PA also has the successor laws $S(x)\\neq 0$ and $S(x)=S(y)\\to x=y$ (successor is injective and never $0$). Suppose for contradiction $4 = 5$, i.e. $S(S(S(S(0)))) = S(S(S(S(S(0)))))$. Cancel the outer $S$ four times by injectivity to get $0 = S(0)$ — contradicting $S(x)\\neq 0$. So PA refutes $2+2=5$: $\\mathrm{PA}\\vdash \\neg(2+2=5)$, and (being consistent) $\\mathrm{PA}\\nvdash 2+2=5$.`,
    },
    {
      heading: "One truth proved ≠ all truths provable",
      body: `Deriving $2+2=4$ shows the machinery works on a *decidable, closed* numeral equation. It does **not** follow that every true arithmetic sentence is provable. Sentences with unbounded quantifiers ($\\forall x \\exists y \\dots$) range over infinitely many cases and need not reduce to a finite calculation. That gap is precisely where Gödel's sentence will live (Stages 14–15).`,
    },
  ],
  visualizations: [
    {
      id: "stage5-derivation",
      kind: "typed-graph",
      title: "The $2+2=4$ derivation, one rule per edge",
      textualSummary:
        "Starting from 2+2 = S(S(0))+S(S(0)), the successor rule rewrites it to S(S(S(0))+S(0)), then again to S(S(S(S(0))+0)), then the zero rule gives S(S(S(S(0)))), which abbreviates to 4. Each arrow is a single licensed rewrite citing its axiom.",
      layers: ["proof"],
      nodes: [
        { id: "s0", type: "Formula", layer: "proof", label: "$S(S(0))+S(S(0))$", position: { x: 40, y: 20 } },
        { id: "s1", type: "Formula", layer: "proof", label: "$S\\big(S(S(0))+S(0)\\big)$", position: { x: 40, y: 130 } },
        { id: "s2", type: "Formula", layer: "proof", label: "$S\\big(S(S(S(0))+0)\\big)$", position: { x: 40, y: 240 } },
        { id: "s3", type: "Formula", layer: "proof", label: "$S(S(S(S(0))))$", position: { x: 40, y: 350 } },
        { id: "s4", type: "Theorem", layer: "proof", label: "$4$", position: { x: 40, y: 450 } },
      ],
      edges: [
        { id: "e1", source: "s0", target: "s1", type: "derived_by", label: "successor rule", layer: "proof" },
        { id: "e2", source: "s1", target: "s2", type: "derived_by", label: "successor rule", layer: "proof" },
        { id: "e3", source: "s2", target: "s3", type: "derived_by", label: "zero rule", layer: "proof" },
        { id: "e4", source: "s3", target: "s4", type: "derived_by", label: "numeral", layer: "proof" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "$2$ is a primitive symbol of PA.",
      correction:
        "The only primitives are $0$ and $S$. $2$ is shorthand for $S(S(0))$. The derivation uses no symbol '2' internally.",
    },
    {
      misconception: "Since PA proves $2+2=4$, PA can prove every true arithmetic statement.",
      correction:
        "Closed numeral equations reduce to finite calculation. Statements quantifying over all numbers need not — and Gödel shows some true ones are unprovable.",
    },
  ],
  quiz: [
    {
      id: "s5q1",
      type: "fill-in",
      prompt: "Fill in the missing line of the derivation (apply the successor rule with $y=0$).",
      before: "$S(S(0))+S(S(0)) = S\\big(S(S(0))+S(0)\\big) = \\;?$",
      after: "$\\;= S(S(S(S(0)))) = 4$",
      accepted: [
        "S(S(S(S(0))+0))",
        "S(S(S(S(0)) + 0))",
        "S(S(S(S(0))+0))",
      ],
      placeholder: "S(S(S( ... )))",
      explanation:
        "Applying $x+S(y)=S(x+y)$ with $y=0$ to the inner sum $S(S(0))+S(0)$ pulls out another $S$, giving $S\\big(S(S(S(0))+0)\\big)$. The next step uses the zero rule.",
    },
    {
      id: "s5q2",
      type: "multiple-choice",
      prompt: "Which axiom licenses the rewrite $x+S(y) \\rightsquigarrow S(x+y)$?",
      options: [
        "the zero rule $x+0=x$",
        "the successor rule $x+S(y)=S(x+y)$",
        "successor injectivity $S(x)=S(y)\\to x=y$",
        "the induction schema",
      ],
      correct: 1,
      explanation:
        "That is exactly the successor (step) equation for addition.",
    },
    {
      id: "s5q3",
      type: "true-false",
      prompt:
        "True or false: PA not only fails to prove $2+2=5$, it proves its negation $\\neg(2+2=5)$.",
      correct: true,
      explanation:
        "True. Using successor injectivity and $S(x)\\neq 0$, assuming $4=5$ yields $0=S(0)$, a contradiction — so PA proves $\\neg(2+2=5)$. Being consistent, it does not also prove $2+2=5$.",
    },
  ],
  masteryCheckpoint:
    "You can derive $2+2=4$ from the successor/zero rules citing each step, and explain why that single success doesn't make all truths provable.",
};
