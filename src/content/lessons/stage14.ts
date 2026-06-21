/**
 * Stage 14 — Diagonalization & the Gödel sentence. Per CONTENT_NOTES §2: the
 * existence of G_T is the Fixed-Point (Diagonal) Lemma, NOT casual self-reference
 * and NOT the liar paradox. Embeds the godel-loop viz.
 */
import type { Lesson } from "../../types";

export const stage14: Lesson = {
  id: "stage-14",
  stage: 14,
  title: "Diagonalization & the Gödel Sentence",
  summary:
    "The Fixed-Point Lemma builds a sentence G_T that provably satisfies G_T ↔ ¬Prov_T(⌜G_T⌝). It is an arithmetic sentence about numbers whose self-reference is mediated by coding — not the liar paradox.",
  prerequisites: ["stage-13"],
  objectives: [
    "State the Diagonal/Fixed-Point Lemma and what it guarantees.",
    "Write the Gödel sentence as $\\neg\\exists p\\,\\mathrm{Proof}_T(p,\\ulcorner G_T\\urcorner)$.",
    "Explain why $G_T$ is arithmetic and why it is not the liar paradox.",
  ],
  definitions: [
    { term: "diagonalization", short: "A construction yielding a sentence that refers to its own code, via the Fixed-Point Lemma." },
    { term: "Gödel sentence", short: "A sentence @n{GT} with $T\\vdash G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$ — it 'says' it is unprovable in @n{T}." },
  ],
  sections: [
    {
      heading: "The Fixed-Point Lemma (no magic)",
      body: `Self-reference here is a **theorem**, not a trick. The **Diagonal / Fixed-Point Lemma** says: for any formula $\\psi(x)$ with one free variable — and any theory $T$ extending a weak base arithmetic that can represent substitution (e.g. Robinson's Q; our $T = \\mathrm{PA}$ qualifies) — there is a sentence $G$ such that

$$T \\vdash \\; G \\leftrightarrow \\psi(\\ulcorner G\\urcorner).$$

That is, $T$ *proves* $G$ equivalent to "$\\psi$ holds of my own code." The lemma is established mechanically using the coding of Stages 12–13 — there is nothing informal about it. (It needs that base strength: a theory too weak to represent substitution, or in a non-arithmetic language, has no such guarantee.)`,
    },
    {
      heading: "Build G_T by diagonalizing on 'not provable'",
      body: `Apply the lemma with $\\psi(x) := \\neg\\mathrm{Prov}_T(x)$ ("the formula coded by $x$ is not provable"). It hands us a sentence $G_T$ with

$$T \\vdash \\; G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner),$$

equivalently, with $\\mathrm{Prov}_T$ unfolded,

$$T \\vdash \\; G_T \\leftrightarrow \\neg\\exists p\\,\\mathrm{Proof}_T(p,\\ulcorner G_T\\urcorner).$$

In words: $T$ *proves* $G_T$ equivalent to "no number codes a $T$-proof of the sentence whose code is $\\ulcorner G_T\\urcorner$" — and that sentence is $G_T$ itself. ($G_T$ is **provably equivalent** to that statement, not literally the same string — the lemma gives the biconditional, not syntactic identity.)`,
    },
    {
      heading: "It is arithmetic, and it is not the liar",
      body: `$G_T$ contains only $0,S,+,\\times,=$, quantifiers, and connectives. It is an ordinary **arithmetic sentence about numbers** — it just happens that one of those numbers, $\\ulcorner G_T\\urcorner$, is its own code. The "this sentence" reading is carried entirely by the coding; there is no direct self-reference in the language.

Why it is **not** the liar paradox ("this sentence is false"):

- The liar uses *truth*, which — by **Tarski's undefinability theorem** (no arithmetic formula can define "true in ℕ") — is **not** definable inside arithmetic, so "I am false" can't even be written.
- $G_T$ uses *provability*, which **is** representable ($\\mathrm{Prov}_T$). "I am not provable" is expressible and consistent.

A false-saying liar yields contradiction; an unprovable-saying $G_T$ yields *incompleteness*. Different ingredient, different outcome.`,
    },
  ],
  visualizations: [
    {
      id: "stage14-ladder",
      kind: "ladder",
      title: "Diagonalization, up and down the ladder of abstraction",
      parameter: "the formula ψ(x)",
      textualSummary:
        "Control: take one ψ(x) = ¬Prov_T(x); the Fixed-Point Lemma builds a specific G_T with T ⊢ G_T ↔ ¬Prov_T(⌜G_T⌝). Abstract over ψ: for ANY one-variable arithmetic formula there is a fixed point G with T ⊢ G ↔ ψ(⌜G⌝). Step down: read it back at our ψ — G_T says of its own code that no number codes a proof of it; self-reference recovered mechanically.",
      rungs: [
        { rung: "control", caption: "One choice of ψ", body: "Take $\\psi(x) := \\neg\\mathrm{Prov}_T(x)$: the Fixed-Point Lemma yields a specific $G_T$ with $T\\vdash G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$." },
        { rung: "abstract-over", caption: "Over all ψ", body: "The lemma abstracts over the formula: for *any* one-variable arithmetic $\\psi$ there is a fixed point $G$ with $T\\vdash G \\leftrightarrow \\psi(\\ulcorner G\\urcorner)$." },
        { rung: "step-down", caption: "Read it back at our ψ", body: "$G_T$ 'says' of its own code that no number codes a proof of it — self-reference recovered by a *theorem*, via coding, not by a sentence containing itself." },
      ],
    },
    {
      id: "stage14-loop",
      kind: "godel-loop",
      title: "How $G_T$ refers to itself — through coding",
      textualSummary:
        "The Gödel sentence G_T encodes as the number ⌜G_T⌝. That number is inserted into the provability predicate to form ¬Prov_T(⌜G_T⌝). By the Fixed-Point Lemma that formula is provably equivalent to G_T itself, closing the loop. The self-reference runs entirely through the coding, not through any direct mention of 'this sentence'.",
      stations: [
        { label: "$G_T$", sub: "an arithmetic sentence" },
        { label: "$\\ulcorner G_T\\urcorner$", sub: "its Gödel number" },
        { label: "$\\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$", sub: "insert the code into the provability predicate" },
        { label: "$G_T$ again", sub: "Fixed-Point Lemma: provably equivalent" },
      ],
      arrows: ["encodes_as", "inserted into", "provably equivalent (fixed point)", "loop closes"],
    },
  ],
  confusions: [
    {
      misconception: "You just write 'this sentence is not provable' — self-reference for free.",
      correction:
        "Direct self-reference isn't available in the language. The Fixed-Point Lemma *constructs* a genuine sentence with the right equivalence, using Gödel coding. The reference is earned, mechanically.",
    },
    {
      misconception: "The Gödel sentence is the liar paradox in disguise.",
      correction:
        "The liar uses truth (undefinable in arithmetic — Tarski's undefinability theorem) and gives contradiction. $G_T$ uses provability (representable) and gives incompleteness — no contradiction.",
    },
    {
      misconception: "$G_T$ is some special non-arithmetic statement.",
      correction:
        "It is an ordinary sentence about natural numbers built from $0,S,+,\\times,=$. Its only twist is that one numeral in it is its own code.",
    },
  ],
  quiz: [
    {
      id: "s14q1",
      type: "multiple-choice",
      prompt: "What does $\\ulcorner G_T\\urcorner$ denote?",
      options: [
        "The truth value of $G_T$.",
        "The Gödel code number of the sentence $G_T$.",
        "A proof of $G_T$.",
        "The negation of $G_T$.",
      ],
      correct: 1,
      explanation:
        "$\\ulcorner\\cdot\\urcorner$ is the Gödel-numbering bracket: $\\ulcorner G_T\\urcorner$ is the number coding $G_T$.",
    },
    {
      id: "s14q2",
      type: "true-false",
      prompt:
        "True or false: the existence of a sentence $G_T$ with $G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$ is guaranteed by the Fixed-Point (Diagonal) Lemma.",
      correct: true,
      explanation:
        "True. The lemma gives, for any $\\psi(x)$, a sentence $G$ with $T\\vdash G\\leftrightarrow\\psi(\\ulcorner G\\urcorner)$; take $\\psi=\\neg\\mathrm{Prov}_T$.",
    },
    {
      id: "s14q3",
      type: "multiple-choice",
      prompt: "Why is $G_T$ not just the liar paradox?",
      options: [
        "Because $G_T$ is false.",
        "Because $G_T$ is built from *provability* (representable in arithmetic), whereas the liar needs *truth*, which is not definable in arithmetic — so $G_T$ is consistent and yields incompleteness, not contradiction.",
        "Because the liar is also an arithmetic sentence.",
        "Because $G_T$ has no Gödel number.",
      ],
      correct: 1,
      explanation:
        "Swapping undefinable 'truth' for representable 'provability' turns paradox into the incompleteness phenomenon.",
    },
  ],
  masteryCheckpoint:
    "You can state the Fixed-Point Lemma, write $G_T$ as $\\neg\\exists p\\,\\mathrm{Proof}_T(p,\\ulcorner G_T\\urcorner)$, and explain why it is arithmetic and not the liar paradox.",
};
