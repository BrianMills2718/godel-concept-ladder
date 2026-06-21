/**
 * Stage 7 — Satisfaction and truth (⊨).
 *
 * Goal: define M⊨P as a *recursive evaluation*, not an intuition. Walk ℕ⊨2+2=4
 * and ℕ⊭2+2=5 as evaluation trees. Keep ⊨ (truth in a structure) firmly apart
 * from ⊢ (provability).
 */
import type { Lesson } from "../../types";

export const stage7: Lesson = {
  id: "stage-7",
  stage: 7,
  title: "Satisfaction and Truth (⊨)",
  summary:
    "M ⊨ P means the structure M makes P true, defined by recursion on P's shape. Truth is evaluation in a structure — a different relation from provability.",
  prerequisites: ["stage-6"],
  objectives: [
    "Read $M \\models P$ as 'structure $M$ satisfies $P$'.",
    "State the recursive satisfaction clauses for $=,\\neg,\\wedge,\\vee,\\to,\\forall,\\exists$.",
    "Evaluate $\\mathbb{N}\\models 2+2=4$ and $\\mathbb{N}\\not\\models 2+2=5$ by computation.",
    "Keep $\\models$ (truth) distinct from $\\vdash$ (provability).",
  ],
  definitions: [
    { term: "satisfaction", short: "The relation @n{M}@n{models}@n{P}: structure $M$ makes formula $P$ true, defined recursively." },
    { term: "truth in a structure", short: "Truth relative to a fixed interpretation. @n{N}@n{models}@n{P} means $P$ is true in the standard naturals." },
  ],
  sections: [
    {
      heading: "Satisfaction is recursive, not vibes",
      role: "tell",
      body: `"$M \\models P$" ("$M$ satisfies $P$", "$P$ is true in $M$") is defined by **recursion on the shape of $P$**. Terms first evaluate to objects in the domain; then:

- $M \\models (a=b)$ iff $a$ and $b$ evaluate to the **same** object.
- $M \\models \\neg P$ iff $M \\not\\models P$.
- $M \\models (P\\wedge Q)$ iff $M\\models P$ **and** $M\\models Q$.
- $M \\models (P\\vee Q)$ iff $M\\models P$ **or** $M\\models Q$.
- $M \\models (P\\to Q)$ iff $M\\not\\models P$ **or** $M\\models Q$.
- $M \\models \\forall x\\,P(x)$ iff **every** object $d$ in the domain has $M\\models P(d)$.
- $M \\models \\exists x\\,P(x)$ iff **some** object $d$ has $M\\models P(d)$.

No intuition required — satisfaction is **defined by recursion** on the formula's structure, so it is fully determined once the structure is fixed. That is not the same as being *computable*: a closed numeral fact like $2+2=4$ reduces to a finite calculation, but $\\forall x\\,P(x)$ quantifies over the whole infinite domain $\\mathbb{N}$, so there's no terminating "evaluate every case" procedure in general. (Indeed, Stage 11 notes arithmetic truth is not decidable at all.) Well-defined ≠ computable.`,
    },
    {
      heading: "Evaluating the running examples",
      role: "show",
      body: `In $\\mathbb{N}$, the term $2+2$ evaluates: $+$ is interpreted as addition, so $2+2 \\mapsto 4$. The numeral $4$ evaluates to $4$. The atomic formula $2+2=4$ holds iff these are the same object — they are. So

$$\\mathbb{N}\\models 2+2=4.$$

For $2+2=5$: the left term evaluates to $4$, the right to $5$, and $4 \\neq 5$, so the equality fails:

$$\\mathbb{N}\\not\\models 2+2=5.$$

And $\\mathbb{N}\\models\\forall x(x+0=x)$ because for *every* domain object $d$, evaluating $d+0$ uses the addition function and yields $d$, which equals $d$ — no proof rules mentioned, only evaluation.`,
    },
    {
      heading: "⊨ is not ⊢",
      role: "tell",
      body: `Satisfaction is **semantic** — about interpretation in a structure. Provability ($\\vdash$, Stages 3–4) is **syntactic** — about derivations. They are different relations on the same sentence. They happen to agree on $2+2=4$, but agreement on examples is not identity of meaning. The next stage puts them face to face.`,
    },
  ],
  visualizations: [
    {
      id: "stage7-eval",
      kind: "parse-tree",
      title: "Evaluating $\\mathbb{N}\\models 2+2=4$",
      textualSummary:
        "The equality 2+2=4 evaluates by first evaluating its terms in ℕ: the term 2+2 evaluates to 4 (addition sends (2,2) to 4) and the term 4 evaluates to 4. Since both sides denote the same object, the equality is satisfied, so ℕ ⊨ 2+2=4. By contrast 2+2=5 evaluates to 4 vs 5, which differ, so ℕ ⊭ 2+2=5.",
      root: {
        id: "eq",
        category: "formula",
        label: "$2+2=4$ — satisfied (4 = 4) ✓",
        children: [
          {
            id: "lhs",
            category: "term",
            label: "$2+2 \\;\\Rightarrow\\; 4$",
            children: [
              { id: "two1", category: "term", label: "$2 \\Rightarrow 2$" },
              { id: "plus", category: "symbol", label: "$+$ : addition" },
              { id: "two2", category: "term", label: "$2 \\Rightarrow 2$" },
            ],
          },
          { id: "eqs", category: "symbol", label: "$=$ : identity" },
          { id: "rhs", category: "term", label: "$4 \\Rightarrow 4$" },
        ],
      },
      malformedExample: {
        input: "2+2=5  ⟶  4 ≠ 5",
        reason: "well-formed and fully evaluable, but the two sides denote different objects, so ℕ ⊭ 2+2=5 (false, not malformed)",
      },
    },
    {
      id: "stage7-ladder",
      kind: "ladder",
      title: "Satisfaction, up and down the ladder of abstraction",
      parameter: "the assignment to $x$",
      textualSummary:
        "Control: fix x=3 and evaluate x+0 in ℕ to get 3+0=3, a satisfied instance. Abstract over the assignment: ℕ ⊨ ∀x(x+0=x) holds iff every domain object d has d+0=d — the truth condition quantifies over the whole infinite domain at once. Step down: read the general ⊨ relation at one concrete point — ℕ ⊭ 2+2=5, since the closed terms evaluate to 4 and 5, which differ.",
      rungs: [
        {
          rung: "control",
          caption: "Fix one value of the parameter",
          body: "Take $x=3$: evaluate $x+0$ in $\\mathbb{N}$ → $3+0 = 3$, and $3 = 3$, so the instance $3+0=3$ is **satisfied**.",
        },
        {
          rung: "abstract-over",
          caption: "Generalize over every value at once",
          body: "$\\mathbb{N}\\models\\forall x(x+0=x)$ iff **every** domain object $d$ has $d+0=d$ — the truth condition ranges over the whole infinite domain, not any single $x$.",
        },
        {
          rung: "step-down",
          caption: "Read the abstraction at one concrete point",
          body: "Point at a *false* case: $\\mathbb{N}\\not\\models 2+2=5$, because the closed terms evaluate to $4$ and $5$, which differ. The general $\\models$ relation, read at a point, returns a concrete verdict.",
        },
      ],
    },
  ],
  confusions: [
    {
      misconception: "Satisfaction is an informal 'feels true' judgment.",
      correction:
        "It is a precise recursion over the formula's structure, bottoming out in evaluating terms to domain objects. Given the structure, it is fully determined.",
    },
    {
      misconception: "$\\mathbb{N}\\models P$ means PA proves $P$.",
      correction:
        "No. $\\models$ is truth-by-evaluation in a structure; $\\vdash$ is derivability by rules. Different relations — the whole next stage is about their difference.",
    },
  ],
  quiz: [
    {
      id: "s7q1",
      type: "multiple-choice",
      prompt: "By the satisfaction clauses, $\\mathbb{N}\\models \\neg(2+2=5)$ holds because…",
      options: [
        "PA proves $\\neg(2+2=5)$.",
        "$\\mathbb{N}\\not\\models 2+2=5$, and $\\models\\neg P$ holds exactly when $\\not\\models P$.",
        "$2+2=5$ is malformed.",
        "$5$ has no interpretation.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "Provability is a different relation; here we are evaluating truth in $\\mathbb{N}$.",
        "2": "$2+2=5$ parses fine; it is simply false.",
      },
      explanation:
        "The negation clause: $\\mathbb{N}\\models\\neg P$ iff $\\mathbb{N}\\not\\models P$. Since $2+2=5$ is not satisfied, its negation is.",
      concepts: ["satisfaction"],
      misconceptions: ["true-prov", "malformed-false"],
    },
    {
      id: "s7q2",
      type: "true-false",
      prompt:
        "True or false: to check $\\mathbb{N}\\models\\forall x(x+0=x)$ you must consult PA's inference rules.",
      correct: false,
      explanation:
        "False. You evaluate: for every domain object $d$, $d+0$ computes to $d$. That is semantics — no proof rules involved.",
      concepts: ["satisfaction"],
      misconceptions: ["true-prov"],
    },
    {
      id: "s7q3",
      type: "fill-in",
      prompt: "Fill the blank in the conditional clause: $M\\models (P\\to Q)$ iff $M\\not\\models P$ ____ $M\\models Q$.",
      accepted: ["or"],
      placeholder: "and / or",
      explanation:
        "The material conditional is satisfied unless the antecedent holds and the consequent fails: $M\\not\\models P$ OR $M\\models Q$.",
      concepts: ["satisfaction"],
    },
  ],
  masteryCheckpoint:
    "You can evaluate $\\mathbb{N}\\models 2+2=4$ and $\\mathbb{N}\\not\\models 2+2=5$ purely by the satisfaction clauses, without mentioning proof.",
};
