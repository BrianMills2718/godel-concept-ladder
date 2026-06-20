/**
 * Stage 4 — Proof graphs: tree, DAG, search; checking vs searching vs existence.
 *
 * Goal: connect ⊢ to the graph intuition — T⊢P means P is *reachable* from the
 * axioms — and separate the three operations the learner keeps fusing.
 */
import type { Lesson } from "../../types";

export const stage4: Lesson = {
  id: "stage-4",
  stage: 4,
  title: "Proof Graphs",
  summary:
    "A proof is a graph from axioms to a conclusion. Checking a proof, searching for one, and a proof merely existing are three different things. T⊢P means: P is reachable.",
  prerequisites: ["stage-3"],
  objectives: [
    "See $T \\vdash P$ as reachability of $P$ in $T$'s proof graph.",
    "Distinguish proof tree, proof DAG (shared lemmas), and proof-search graph.",
    "Separate proof checking, proof search, and provability.",
  ],
  definitions: [
    { term: "proof graph", short: "A graph whose edges are inference steps from premises to conclusions." },
    { term: "proof tree", short: "A tree-shaped proof; each conclusion has its own copy of its premises." },
    { term: "proof DAG", short: "A directed acyclic proof graph where a shared lemma is proved once and reused." },
    { term: "proof checking", short: "Verifying a given finite proof is valid. Usually decidable." },
    { term: "proof search", short: "Trying to find a proof of a target. May run forever if none exists." },
    { term: "provability", short: "The existence of some valid proof: $T \\vdash P$." },
  ],
  sections: [
    {
      heading: "Reachability",
      body: `Lay the axioms down as source nodes and draw an edge for every inference step. Then

$$T \\vdash P \\quad\\Longleftrightarrow\\quad P \\text{ is reachable from } T\\text{'s axioms by finite valid steps.}$$

That is the entire content of "provable": there is a finite path (really a finite DAG) of licensed steps ending at $P$.`,
    },
    {
      heading: "Tree vs DAG",
      body: `If a lemma is used twice, a **proof tree** carries two separate copies of it; a **proof DAG** proves it once and points two arrows out of it. Same proof, more honest bookkeeping. DAGs matter in practice (shared lemmas) and conceptually (a proof is finite and reusable), but they prove exactly the same theorems.`,
    },
    {
      heading: "Three operations, not one",
      body: `Learners collapse these — keep them apart:

- **Checking**: "Is *this* finite derivation valid?" A mechanical, terminating check (Stage 11: decidable).
- **Search**: "Can I *find* a derivation of $P$?" If no proof exists, a naive search may run forever.
- **Provability**: "Does *some* proof of $P$ exist?" An existential fact — independent of whether you ever find it.

"$P$ is provable" is **not** "I found a proof of $P$." The first is about existence; the second is about your search succeeding.`,
    },
  ],
  visualizations: [
    {
      id: "stage4-dag",
      kind: "typed-graph",
      title: "Deriving $C$ from $A,\\ A\\to B,\\ B\\to C$",
      textualSummary:
        "From axiom A and axiom A→B, modus ponens concludes B. Then B together with axiom B→C feeds a second modus ponens step concluding C. C is reachable from the axioms, so T⊢C. The lemma B is proved once and reused — a DAG, not a tree.",
      layers: ["proof"],
      nodes: [
        { id: "A", type: "Axiom", layer: "proof", label: "$A$", position: { x: 40, y: 40 } },
        { id: "AB", type: "Axiom", layer: "proof", label: "$A\\to B$", position: { x: 240, y: 40 } },
        { id: "mp1", type: "InferenceRule", layer: "proof", label: "modus ponens", position: { x: 140, y: 150 } },
        { id: "B", type: "Theorem", layer: "proof", label: "$B$ (lemma)", position: { x: 140, y: 250 } },
        { id: "BC", type: "Axiom", layer: "proof", label: "$B\\to C$", position: { x: 380, y: 250 } },
        { id: "mp2", type: "InferenceRule", layer: "proof", label: "modus ponens", position: { x: 260, y: 360 } },
        { id: "C", type: "Theorem", layer: "proof", label: "$C$ (goal)", position: { x: 260, y: 460 } },
      ],
      edges: [
        { id: "e1", source: "A", target: "mp1", type: "premise_of", layer: "proof" },
        { id: "e2", source: "AB", target: "mp1", type: "premise_of", layer: "proof" },
        { id: "e3", source: "mp1", target: "B", type: "concludes", layer: "proof" },
        { id: "e4", source: "B", target: "mp2", type: "premise_of", layer: "proof" },
        { id: "e5", source: "BC", target: "mp2", type: "premise_of", layer: "proof" },
        { id: "e6", source: "mp2", target: "C", type: "concludes", layer: "proof" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "'P is provable' means someone has found a proof of P.",
      correction:
        "Provability is the *existence* of a proof, found or not. A sentence can be provable while no one has yet exhibited the derivation.",
    },
    {
      misconception: "If proof search hasn't found a proof yet, P must be unprovable.",
      correction:
        "Search may simply not have finished — with no proof it can run forever. Failure-so-far is not a proof of unprovability. (Establishing unprovability is a metatheoretic argument, Stage 15.)",
    },
  ],
  quiz: [
    {
      id: "s4q1",
      type: "multiple-choice",
      prompt: "In the graph picture, $T \\vdash P$ corresponds to:",
      options: [
        "$P$ being a source node (an axiom).",
        "$P$ being reachable from the axioms by finite valid inference steps.",
        "$P$ being true in $\\mathbb{N}$.",
        "$P$ being well-formed.",
      ],
      correct: 1,
      explanation:
        "Provability is reachability of $P$ from the axiom nodes along licensed edges.",
    },
    {
      id: "s4q2",
      type: "true-false",
      prompt: "True or false: checking a given proof and searching for a proof are the same operation.",
      correct: false,
      explanation:
        "False. Checking a supplied derivation terminates; search for an arbitrary target may not. Provability is a third thing again — mere existence.",
    },
    {
      id: "s4q3",
      type: "classification",
      prompt: "Sort each question by which operation it is.",
      buckets: ["Proof checking", "Proof search", "Provability"],
      items: [
        { id: "a", label: "“Is this 12-line derivation of $P$ valid?”", correctBucket: "Proof checking" },
        { id: "b", label: "“Find me a derivation of $P$.”", correctBucket: "Proof search" },
        { id: "c", label: "“Does any proof of $P$ exist at all?”", correctBucket: "Provability" },
      ],
      explanation:
        "Verify a given proof = checking; try to find one = search; does one exist = provability.",
    },
  ],
  masteryCheckpoint:
    "You can say $T \\vdash P$ means 'P is reachable in the proof graph', and keep checking, searching, and existence apart.",
};
