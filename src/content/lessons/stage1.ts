/**
 * Stage 1 — Symbols, Strings, Terms, Formulas, Sentences.
 *
 * Goal: make the grammatical ladder concrete. The parse-tree explorer expands
 * ∀x(x+0=x) into its parts and shows a malformed string failing to parse, so
 * "well-formed" and "term vs formula vs sentence" stop being vague.
 */
import type { Lesson } from "../../types";

export const stage1: Lesson = {
  id: "stage-1",
  stage: 1,
  title: "Symbols, Terms, Formulas, Sentences",
  summary:
    "The grammatical ladder: symbols → strings → terms → formulas → sentences. Terms name objects; formulas can be true or false; sentences have no free variables.",
  prerequisites: ["stage-0"],
  objectives: [
    "Distinguish a symbol, a string, a term, a formula, and a sentence.",
    "Explain why a term (a noun phrase) is never true or false on its own.",
    "Tell a free variable from a bound one, and a formula from a sentence.",
    "Classify any expression as malformed / term / open formula / sentence.",
  ],
  definitions: [
    { term: "symbol", short: "An atomic mark from the alphabet.", example: "$S$, $+$, $($, the variable $x$." },
    { term: "string", short: "Any finite sequence of symbols — legal or not." },
    { term: "term", short: "A well-formed expression denoting an object (a number). Never true or false by itself.", example: "$0$, $S(0)$, $x+S(0)$." },
    { term: "formula", short: "A well-formed expression that is true or false once interpreted and its free variables are assigned.", example: "$x+0=x$." },
    { term: "sentence", short: "A formula with no free variables.", example: "$\\forall x(x+0=x)$." },
    { term: "free variable", short: "A variable occurrence not bound by a quantifier." },
    { term: "bound variable", short: "A variable occurrence governed by @n{forall} or @n{exists}." },
  ],
  sections: [
    {
      heading: "The alphabet",
      body: `Arithmetic is written with a fixed alphabet:

$$0,\\; S,\\; +,\\; \\times,\\; =,\\; \\neg,\\; \\wedge,\\; \\vee,\\; \\rightarrow,\\; \\forall,\\; \\exists,\\; (,\\; ),\\; x, y, z, \\dots$$

A **string** is any finite sequence of these symbols. Most strings are gibberish — being a string is a very low bar.`,
    },
    {
      heading: "Terms name objects; formulas make claims",
      body: `A **term** is a legal expression that denotes an *object* — here, a number. Terms are the noun phrases of arithmetic. They are built up by rules:

- @n{zero} is a term.
- if $t$ is a term, then @n{succ}$(t)$ is a term.
- if $s$ and $t$ are terms, then $(s+t)$ and $(s\\times t)$ are terms.

A term is **never true or false** — "$S(S(0))$" is no more true-or-false than the English word "four."

A **formula** is a legal expression that can be *true or false* once interpreted. The simplest formulas equate two terms: if $s$ and $t$ are terms, then $(s=t)$ is a formula. Formulas combine with $\\neg, \\wedge, \\vee, \\rightarrow$ and quantifiers $\\forall, \\exists$.`,
    },
    {
      heading: "Free vs bound: formula vs sentence",
      body: `In $x+0=x$, the variable $x$ is **free** — nothing pins it down, so the expression is not yet a definite claim. It is an *open formula*.

Put a quantifier in front and $x$ becomes **bound**:

$$\\forall x\\,(x+0=x)$$

Now there are no free variables. A formula with no free variables is a **sentence**, and only sentences have a definite truth value in a structure. This is why the next stages care so much about sentences: $\\vdash$ and $\\models$ both want sentences.`,
    },
    {
      heading: "Use the explorer",
      body: `Expand the parse tree below. Watch a single sentence decompose into formula → terms → symbols, and watch the gibberish string fail to parse at all. Being well-formed means *there is such a tree*; being malformed means there isn't.`,
    },
  ],
  visualizations: [
    {
      id: "stage1-parse-explorer",
      kind: "parse-explorer",
      title: "Parse it yourself: the formation rules, and what breaks",
      textualSummary:
        "An interactive explorer showing the term and formula formation rules (0 and variables are terms; S(t), (s+t), (s×t) are terms; s=t is an atomic formula; ¬P and ∀x P are formulas). Pick a string and see it parse rule-by-rule or fail. ∀x(x+0=x) parses as a sentence: rule F∀ over the formula x+0=x (rule F=) whose left side x+0 is a term (rule T+). S(S(0)) parses as a term by rule TS twice over T0. ∀+=x))0 fails: rule F∀ needs a variable right after ∀, but '+' is not one. ∀x(x+0) fails: rule F∀ needs a formula after the variable, but x+0 is a term, not a formula.",
      rules: [
        { id: "T0", category: "term", text: "$0$ is a term" },
        { id: "Tv", category: "term", text: "every variable ($x, y, z, \\dots$) is a term" },
        { id: "TS", category: "term", text: "if $t$ is a term, then $S(t)$ is a term" },
        { id: "T+", category: "term", text: "if $s, t$ are terms, then $(s+t)$ and $(s\\times t)$ are terms" },
        { id: "F=", category: "formula", text: "if $s, t$ are terms, then $s=t$ is an (atomic) formula" },
        { id: "F¬", category: "formula", text: "if $P$ is a formula, then $\\neg P$ is a formula" },
        { id: "F∀", category: "formula", text: "if $P$ is a formula and $x$ a variable, then $\\forall x\\,P$ and $\\exists x\\,P$ are formulas" },
      ],
      examples: [
        {
          input: "$\\forall x\\,(x+0=x)$",
          legal: true,
          tree: {
            id: "n-sent",
            category: "sentence",
            label: "$\\forall x\\,(x+0=x)$",
            ruleId: "F∀",
            children: [
              { id: "n-quant", category: "quantifier", label: "$\\forall x$" },
              {
                id: "n-form",
                category: "formula",
                label: "$x+0=x$",
                ruleId: "F=",
                children: [
                  {
                    id: "n-tleft",
                    category: "term",
                    label: "$x+0$",
                    ruleId: "T+",
                    children: [
                      { id: "n-x1", category: "term", label: "$x$", ruleId: "Tv" },
                      { id: "n-plus", category: "symbol", label: "$+$" },
                      { id: "n-0", category: "term", label: "$0$", ruleId: "T0" },
                    ],
                  },
                  { id: "n-eq", category: "symbol", label: "$=$" },
                  { id: "n-tright", category: "term", label: "$x$", ruleId: "Tv" },
                ],
              },
            ],
          },
        },
        {
          input: "$S(S(0))$",
          legal: true,
          tree: {
            id: "t-ss0",
            category: "term",
            label: "$S(S(0))$",
            ruleId: "TS",
            children: [
              {
                id: "t-s0",
                category: "term",
                label: "$S(0)$",
                ruleId: "TS",
                children: [{ id: "t-0", category: "term", label: "$0$", ruleId: "T0" }],
              },
            ],
          },
        },
        {
          input: "$\\forall{+}{=}x))0$",
          legal: false,
          failure: {
            at: "+",
            ruleTried: "F∀",
            reason:
              "Rule F∀ needs a variable immediately after ∀, then a formula. Here ∀ is followed by '+', which is not a variable, so no formula can even begin — the parse dies at the first step.",
          },
        },
        {
          input: "$\\forall x\\,(x+0)$",
          legal: false,
          failure: {
            at: "x+0",
            ruleTried: "F∀",
            reason:
              "Rule F∀ needs a formula after the bound variable. Here ∀x is followed by the term x+0 (a noun phrase that names a number), not a formula — and no rule turns a bare term into a formula, so the quantifier has nothing to bind.",
          },
        },
      ],
    },
  ],
  confusions: [
    {
      misconception: "A term like $S(S(0))$ is true.",
      correction:
        "Terms denote objects; they are not the kind of thing that is true or false. Only formulas (and sentences) can be true or false. $S(S(0))$ just names the number 2.",
    },
    {
      misconception: "$x+0=x$ is a sentence, so it is simply true.",
      correction:
        "$x+0=x$ has a free variable, so it is an open formula, not a sentence. It becomes a sentence only when the variable is bound, e.g. $\\forall x(x+0=x)$.",
    },
    {
      misconception: "A malformed string like $\\forall{+}{=}x))0$ is a really weird false formula.",
      correction:
        "It is not a formula at all — it never parses. False requires a well-formed sentence first; gibberish is below the level where truth even applies.",
    },
  ],
  quiz: [
    {
      id: "s1q1",
      type: "classification",
      prompt: "Classify each expression.",
      buckets: ["Malformed string", "Term", "Open formula (free variable)", "Sentence"],
      items: [
        { id: "a", label: "$S(S(0))$", correctBucket: "Term" },
        { id: "b", label: "$x+0=x$", correctBucket: "Open formula (free variable)" },
        { id: "c", label: "$\\forall x(x+0=x)$", correctBucket: "Sentence" },
        { id: "d", label: "$\\forall{+}{=}x))0$", correctBucket: "Malformed string" },
        { id: "e", label: "$x+S(0)$", correctBucket: "Term" },
      ],
      explanation:
        "$S(S(0))$ and $x+S(0)$ denote objects → terms. $x+0=x$ is a legal equality but has a free $x$ → open formula. Binding it gives a sentence. The last string never parses → malformed.",
    },
    {
      id: "s1q2",
      type: "multiple-choice",
      prompt: "Why is $S(S(0))$ not the kind of thing that can be true or false?",
      options: [
        "Because it is false.",
        "Because it is a term — it denotes an object (a number), and objects aren't true or false.",
        "Because it has a free variable.",
        "Because it is malformed.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "It isn't false either — truth/falsity simply doesn't apply to a noun phrase like a numeral.",
        "2": "$S(S(0))$ has no variables at all.",
        "3": "It parses perfectly: it is the term naming the number 2.",
      },
      explanation:
        "$S(S(0))$ is a term. Terms are arithmetic's noun phrases; they name objects. Only formulas/sentences carry truth values.",
    },
    {
      id: "s1q3",
      type: "multi-select",
      prompt: "Select every expression that is a sentence (a formula with no free variables).",
      options: [
        "$x+0=x$",
        "$\\forall x(x+0=x)$",
        "$\\exists y\\,(y = S(0))$",
        "$S(0)$",
      ],
      correct: [1, 2],
      explanation:
        "$\\forall x(x+0=x)$ and $\\exists y(y=S(0))$ bind all their variables → sentences. $x+0=x$ has a free $x$ (open formula). $S(0)$ is a term, not a formula at all.",
    },
    {
      id: "s1q4",
      type: "true-false",
      prompt:
        "True or false: 'well-formed' means there exists a parse tree building the expression from the grammar's rules.",
      correct: true,
      explanation:
        "True. Well-formedness is exactly the existence of such a derivation/parse tree. A malformed string is one for which no such tree exists.",
    },
  ],
  masteryCheckpoint:
    "You can label any arithmetic expression as malformed, term, open formula, or sentence — and explain why terms have no truth value and why an open formula isn't yet a sentence.",
};
