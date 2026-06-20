/**
 * Stage 10 — Object theory vs metatheory.
 *
 * Goal: the level distinction Gödel needs. Inside-PA claims (about numbers) vs
 * about-PA claims (about its syntax, proofs, consistency). Adding Con(T) makes a
 * new, stronger theory — and Gödel reapplies.
 */
import type { Lesson } from "../../types";

export const stage10: Lesson = {
  id: "stage-10",
  stage: 10,
  title: "Object Theory vs Metatheory",
  summary:
    "The object theory (PA) talks about numbers. The metatheory talks about PA — its formulas, proofs, consistency. 'PA proves 2+2=4' is a metatheoretic claim, not an arithmetic one.",
  prerequisites: ["stage-9"],
  objectives: [
    "Tell an object-level claim from a metatheoretic one.",
    "See the metatheory as reasoning about $T$'s syntax, proofs, and models.",
    "Explain why adding $\\mathrm{Con}(T)$ yields a stronger theory $T+\\mathrm{Con}(T)$.",
  ],
  definitions: [
    { term: "object theory", short: "The theory under study (e.g. PA). Its statements are about numbers." },
    { term: "metatheory", short: "The external theory used to reason about the object theory — its symbols, proofs, consistency, models." },
    { term: "meta-claim", short: "A claim about a theory/proof/model, e.g. 'PA is consistent' or 'this string is a formula'." },
  ],
  sections: [
    {
      heading: "Inside vs about",
      body: `Two levels, and Gödel depends on never confusing them:

- **Object level** — statements *inside* $T$, about numbers. Example: $2+2=4$.
- **Meta level** — statements *about* $T$. Examples: "PA proves $2+2=4$", "this string is a well-formed formula of PA", "PA is consistent", "there is no PA-proof of $G$".

The object theory talks about numbers; the **metatheory** talks about the object theory.`,
    },
    {
      heading: "Same words, different level",
      body: `"$2+2=4$" is object-level. "$\\mathrm{PA}\\vdash 2+2=4$" looks similar but is **metatheoretic** — it asserts something about PA's proof system. The symbol $\\vdash$ is *not* part of PA's language; it belongs to the metatheory describing PA. Likewise "$\\mathbb{N}\\models P$" is a metatheoretic semantic claim. Watch the level, not the surface.`,
    },
    {
      heading: "Adding Con(T) climbs one rung",
      body: `Suppose we form the statement $\\mathrm{Con}(T)$ = "$T$ is consistent". By the Second Incompleteness Theorem (Stage 16), a suitable consistent $T$ cannot prove its own $\\mathrm{Con}(T)$. We *can* simply **add it as a new axiom**, getting a strictly stronger theory

$$T' = T + \\mathrm{Con}(T).$$

Provided $T'$ is still **consistent**, it is computably axiomatized and strong enough — so Gödel applies again: $T'$ has its *own* Gödel sentence and cannot prove $\\mathrm{Con}(T')$. Climbing one rung never escapes the phenomenon.

*(A caveat the next stages lean on: $T'$'s consistency isn't automatic from $T$'s. A consistent-but-unsound theory can actually prove $\\neg\\mathrm{Con}(T)$ — e.g. $\\mathrm{PA}+\\neg\\mathrm{Con}(\\mathrm{PA})$ is consistent — and then adding $\\mathrm{Con}(T)$ would make it inconsistent. The clean tower needs $T$ **sound**, i.e. $\\mathbb{N}\\models T$, which holds for our running $T=\\mathrm{PA}$.)*`,
    },
    {
      heading: "Foreshadowing the twist",
      body: `Here is the move that makes Gödel possible: although meta-claims like "$p$ codes a proof of $q$" start life in the metatheory, Gödel **encodes** them back into arithmetic (Stages 12–13), so the object theory can talk — in numerical disguise — about its own proofs. The level distinction is what makes that encoding surprising rather than circular.`,
    },
  ],
  visualizations: [
    {
      id: "stage10-levels",
      kind: "typed-graph",
      title: "The metatheory reasons about the object theory",
      textualSummary:
        "The object theory T contains formulas about numbers, such as 2+2=4. The metatheory M sits above it and proves claims ABOUT T: that T proves 2+2=4, that a given string is a formula of T, and that T is consistent. The proves_about edges run from the metatheory down to facts about T, not inside T.",
      layers: ["proof", "metatheory"],
      nodes: [
        { id: "obj", type: "ObjectTheory", layer: "proof", label: "object theory $T$ (PA): about numbers", position: { x: 60, y: 260 } },
        { id: "num", type: "Theorem", layer: "proof", label: "$2+2=4$", position: { x: 60, y: 380 } },
        { id: "meta", type: "MetaTheory", layer: "metatheory", label: "metatheory $M$", position: { x: 420, y: 40 } },
        { id: "c1", type: "MetaClaim", layer: "metatheory", label: "“$T\\vdash 2+2=4$”", position: { x: 420, y: 160 } },
        { id: "c2", type: "MetaClaim", layer: "metatheory", label: "“this string is a formula of $T$”", position: { x: 420, y: 270 } },
        { id: "c3", type: "MetaClaim", layer: "metatheory", label: "“$T$ is consistent”", position: { x: 420, y: 380 } },
      ],
      edges: [
        { id: "e0", source: "obj", target: "num", type: "proves", layer: "proof" },
        { id: "e1", source: "meta", target: "c1", type: "proves_about", layer: "metatheory" },
        { id: "e2", source: "meta", target: "c2", type: "proves_about", layer: "metatheory" },
        { id: "e3", source: "meta", target: "c3", type: "proves_about", layer: "metatheory" },
        { id: "e4", source: "c1", target: "obj", type: "proves_about", label: "about", layer: "metatheory" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "'PA proves $P$' is just another statement inside PA.",
      correction:
        "It is a claim about PA's proof system — metatheoretic. $\\vdash$ is not a symbol of PA's language. (Gödel later encodes a numerical proxy for it into PA, which is a separate, deliberate construction.)",
    },
    {
      misconception: "Adding Con(T) to T permanently fixes incompleteness.",
      correction:
        "It yields a stronger theory $T+\\mathrm{Con}(T)$ that is again consistent, computable, and strong — so Gödel reapplies, with a new Gödel sentence and a new unprovable consistency statement.",
    },
  ],
  quiz: [
    {
      id: "s10q1",
      type: "classification",
      prompt: "Classify each claim as object-level (inside PA) or metatheoretic (about PA).",
      buckets: ["Object level", "Metatheory"],
      items: [
        { id: "a", label: "$2+2=4$", correctBucket: "Object level" },
        { id: "b", label: "“PA proves $2+2=4$.”", correctBucket: "Metatheory" },
        { id: "c", label: "“This string is well-formed.”", correctBucket: "Metatheory" },
        { id: "d", label: "“There is no PA-proof of $G$.”", correctBucket: "Metatheory" },
        { id: "e", label: "$\\forall x(x+0=x)$", correctBucket: "Object level" },
      ],
      explanation:
        "Statements about numbers are object-level; statements about PA's formulas, proofs, or consistency are metatheoretic.",
    },
    {
      id: "s10q2",
      type: "multiple-choice",
      prompt: "What is $T + \\mathrm{Con}(T)$?",
      options: [
        "An inconsistent theory.",
        "A strictly stronger theory that proves $T$'s consistency but has its own Gödel sentence.",
        "The same theory as $T$.",
        "A theory that escapes incompleteness forever.",
      ],
      correct: 1,
      wrongExplanations: {
        "2": "$T$ could not prove $\\mathrm{Con}(T)$, so adding it genuinely strengthens the theory.",
        "3": "Gödel reapplies to the stronger theory.",
      },
      explanation:
        "Adding the unprovable $\\mathrm{Con}(T)$ gives a stronger theory — still subject to Gödel (assuming the extension is still consistent, which holds when $T$ is sound, e.g. $T=\\mathrm{PA}$).",
    },
    {
      id: "s10q3",
      type: "true-false",
      prompt: "True or false: the symbol $\\vdash$ is part of PA's own formal language.",
      correct: false,
      explanation:
        "False. $\\vdash$ belongs to the metatheory describing PA. PA's language has only $0,S,+,\\times,=$ and logical symbols. Gödel separately builds a numerical *proxy* for provability inside PA.",
    },
  ],
  masteryCheckpoint:
    "You can label a claim as object-level or metatheoretic, and explain why adding $\\mathrm{Con}(T)$ climbs to a stronger theory that Gödel still bites.",
};
