/**
 * Stage 0 — Start Here: The Big Picture (optional orientation).
 *
 * This is the first thing a beginner might read, so it must NOT assume the frame.
 * It opens in plain language, motivates with the running example, and defines
 * each term as it appears. It is a non-gating orientation (exempt from the
 * forward-reference closure check) and previews ⊢/⊨/object-meta gently.
 */
import type { Lesson } from "../../types";

export const stage0: Lesson = {
  id: "stage-0",
  stage: 0,
  title: "Start Here: The Big Picture",
  summary:
    "A short, skippable overview. Most of what makes Gödel feel mind-bending is really just a few different questions about a math statement getting mixed together — above all, “can we prove it?” versus “is it actually true?”. Those are not the same thing, and the gap between them is the whole story.",
  prerequisites: [],
  objectives: [
    "Hold onto one idea: “provable” and “true” are different things.",
    "See the three different questions you can ask about a statement.",
    "Know you can skip this and come back — it blocks nothing.",
  ],
  definitions: [
    { term: "well-formed formula", short: "A statement that's at least written by the rules — legal, whether or not it's true.", example: "$2+2=5$ is written correctly; it's just false." },
  ],
  sections: [
    {
      heading: "The one idea to take away",
      body: `Take a simple statement like $2+2=5$. It's natural to lump together three things — *is it written correctly?*, *can we prove it?*, and *is it actually true?* — as if they were one judgment. **They're not.** Almost everything that makes Gödel's theorem feel paradoxical comes from quietly mixing them up. Keeping them apart is the entire skill this site teaches.

You don't need any of the symbols or jargon yet. Just the idea: **"provable" and "true" are not automatically the same.**`,
    },
    {
      heading: "Three different questions about a statement",
      body: `Pick any statement $P$ about numbers. You can ask three *separate* questions:

1. **Is it even a legal statement?** Pure grammar. The gibberish $\\forall{+}{=}x))0$ isn't true or false — it's not a statement at all. But $2+2=5$ *is* a perfectly legal statement; it just happens to be wrong.
2. **Can you prove it** from a fixed set of rules and starting assumptions (a "theory")? Our running theory is **PA** (a standard set of rules for the whole numbers). When PA can prove $P$, we'll later write @n{T}@n{turnstile}@n{P}.
3. **Is it actually true** about the ordinary whole numbers? We'll later write @n{N}@n{models}@n{P}.

On easy statements these answers march together — $2+2=4$ is legal, provable, *and* true — which is exactly why people fuse them. The shock of Gödel is a statement where question 2 and question 3 **come apart**: true, but not provable.`,
    },
    {
      heading: "One more split — save it for later",
      body: `There's a second, smaller distinction you'll meet near the end: the difference between talking *inside* a theory ("$2+2=4$") and talking *about* it ("PA can prove $2+2=4$" or "PA never contradicts itself"). It becomes the key trick of the proof (Gödel coding). **Don't worry about it now** — just know it's coming.`,
    },
    {
      heading: "What to actually do",
      body: `You don't have to master this page — it's a map, not a lesson. **Skip ahead and start with the first real topic** (the highlighted node on the tree). If you ever feel lost about whether something is *provable* versus *true* versus *legal*, come back here.`,
    },
  ],
  visualizations: [
    {
      id: "stage0-axes",
      kind: "typed-graph",
      title: "The same statement, asked three ways",
      textualSummary:
        "A single legal statement P can be asked about in different ways: a theory T can try to prove it (written T ⊢ P), and the ordinary numbers ℕ either make it true or not (written ℕ ⊨ P). Separately, you can step outside and talk about the theory T itself. Provable and true are different relations on the same statement; the gap between them is incompleteness.",
      layers: ["syntax", "proof", "semantics", "metatheory"],
      nodes: [
        { id: "P", type: "Sentence", layer: "syntax", label: "a legal statement @n{P}", position: { x: 320, y: 170 } },
        { id: "T", type: "ObjectTheory", layer: "proof", label: "rules/theory @n{T} (PA)", position: { x: 30, y: 40 } },
        { id: "N", type: "Structure", layer: "semantics", label: "the numbers @n{N}", position: { x: 30, y: 300 } },
        { id: "meta", type: "MetaTheory", layer: "metatheory", label: "stepping outside: talking *about* $T$", position: { x: 650, y: 170 } },
      ],
      edges: [
        { id: "e1", source: "T", target: "P", type: "proves", label: "can it prove it? (⊢)", layer: "proof" },
        { id: "e2", source: "N", target: "P", type: "satisfies", label: "is it true? (⊨)", layer: "semantics" },
        { id: "e3", source: "meta", target: "T", type: "proves_about", label: "for later", layer: "metatheory" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "If a statement is written correctly, it must be true (or at least provable).",
      correction:
        "Being legal is just grammar. $2+2=5$ is written perfectly and is simply false. “Legal” tells you nothing about “true” or “provable.”",
    },
    {
      misconception: "“True” and “provable” are the same — if it's true, some theory proves it.",
      correction:
        "They agree on easy statements, but that's a coincidence of easy cases. Gödel builds a statement that's true about the numbers yet unprovable in the theory. That gap is the point.",
    },
    {
      misconception: "Gibberish like $\\forall{+}{=}x))0$ is a really weird false statement.",
      correction:
        "It isn't false — it isn't a statement at all. Truth only applies once something is at least written by the rules.",
    },
  ],
  quiz: [
    {
      id: "s0q1",
      type: "multiple-choice",
      prompt: "Which best describes $2+2=5$?",
      options: [
        "It's gibberish, so it has no truth value.",
        "It's a legal, correctly-written statement that is simply false.",
        "It's true but unprovable.",
        "It's both false and not legal.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "It parses fine — it's a normal equation, just a wrong one.",
        "2": "It's plainly false in the ordinary numbers, not a subtle true-but-unprovable case.",
      },
      explanation:
        "“Written correctly” and “true” are different questions. $2+2=5$ passes the first and fails the second.",
    },
    {
      id: "s0q2",
      type: "true-false",
      prompt: "True or false: if a statement is true about the numbers, then some fixed theory like PA must be able to prove it.",
      correct: false,
      explanation:
        "False — this is exactly what Gödel disproves. There are true statements about the numbers that PA cannot prove. “True” and “provable” come apart.",
    },
    {
      id: "s0q3",
      type: "multiple-choice",
      prompt: "What are the three separate questions this overview says people blur together?",
      options: [
        "Is it short? Is it famous? Is it useful?",
        "Is it legal (written by the rules)? Is it provable from a theory? Is it true about the numbers?",
        "Is it addition? Is it multiplication? Is it equality?",
        "Is it Gödel's? Is it Peano's? Is it ours?",
      ],
      correct: 1,
      explanation:
        "Legal vs provable vs true. They usually agree on easy cases, which is why they get mixed up — and Gödel pries provable and true apart.",
    },
  ],
  masteryCheckpoint:
    "You can say, in plain words, that “written correctly”, “provable”, and “true” are three different questions — and that Gödel finds a statement that is true but not provable.",
};
