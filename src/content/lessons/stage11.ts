/**
 * Stage 11 — Computability.
 *
 * Goal: the computability facts Gödel needs. Well-formedness & proof-checking
 * decidable; theorems recursively enumerable; theoremhood undecidable; truth not
 * computable. Why "all true sentences" is not an effective axiom set.
 */
import type { Lesson } from "../../types";

export const stage11: Lesson = {
  id: "stage-11",
  stage: 11,
  title: "Computability",
  summary:
    "Decidable, recursively enumerable, undecidable. Proof-checking is decidable; PA's theorems are r.e.; theoremhood is undecidable; arithmetic truth isn't computable at all. Gödel needs effectively axiomatized theories.",
  prerequisites: ["stage-10"],
  objectives: [
    "Define decidable, recursively enumerable (r.e.), and undecidable.",
    "Explain why proof-checking is decidable but theoremhood is undecidable.",
    "Say why 'all true arithmetic sentences' is not an effective axiom set.",
  ],
  definitions: [
    { term: "decidable", short: "An algorithm always halts with the correct yes/no answer.", example: "‘Is this string a formula?’" },
    { term: "recursively enumerable", short: "An algorithm lists all yes-instances, possibly never halting on no-instances. Abbreviated r.e.", example: "The theorems of PA." },
    { term: "undecidable", short: "No algorithm always gives the correct yes/no answer in finite time." },
    { term: "effectively axiomatized", short: "The axioms can be mechanically recognized or listed." },
  ],
  sections: [
    {
      heading: "Three levels of mechanical access",
      body: `Gödel's theorems are about *formal systems with mechanically specifiable proof procedures*. Three notions pin down "mechanical":

- **Decidable**: an algorithm always halts with the right yes/no answer.
- **Recursively enumerable (r.e.)**: an algorithm can *list* every yes-instance, but may run forever on a no-instance — you never get a definitive "no".
- **Undecidable**: no algorithm decides the question for all inputs.`,
    },
    {
      heading: "Checking decidable, theoremhood undecidable",
      body: `Two superficially similar questions, very different status:

- **"Is this finite string a valid proof of $P$?"** — *decidable*. Check each line is an axiom or a licensed inference; the proof is finite, so the check halts.
- **"Is $P$ a theorem (does *some* proof exist)?"** — *undecidable* for theories as strong as PA. We can search all candidate proofs in order, so theoremhood is **r.e.**; but if no proof exists the search never stops, and no algorithm decides theoremhood in general.

So checking a given proof is easy; deciding provability is not. (This is the computability echo of Stage 4's checking-vs-search.)`,
    },
    {
      heading: "Why not just axiomatize all truths?",
      body: `Tempting fix: take the axioms to be **all** true arithmetic sentences. Then everything true is provable in one step. The catch is *effectiveness*: the set of true arithmetic sentences is **not even r.e.** (truth is far less computable than provability). There is no algorithm to recognize or list it, so it is **not an effective axiomatization** — exactly the hypothesis Gödel requires. A theory you can't mechanically present isn't a usable formal system, and Gödel's theorem simply doesn't apply to it.`,
    },
    {
      heading: "The computability hooks for Gödel",
      body: `Pin these for later: proof-checking is decidable ⇒ it is **primitive recursive** ⇒ it is **representable** inside PA (Stage 13). That chain is what lets the metatheoretic relation "$p$ is a proof of $q$" become an *arithmetic formula* $\\mathrm{Proof}_T(p,q)$.`,
    },
  ],
  visualizations: [
    {
      id: "stage11-flow",
      kind: "typed-graph",
      title: "Proof checker halts; proof search may not",
      textualSummary:
        "A candidate proof fed to the proof checker always halts, answering valid or invalid — proof-checking is decidable. A candidate sentence P fed to proof search either finds a proof and answers yes, or, if no proof exists, runs forever — so theoremhood is recursively enumerable but not decidable.",
      layers: ["proof", "metatheory"],
      nodes: [
        { id: "cand", type: "CodeNumber", layer: "proof", label: "candidate proof", position: { x: 40, y: 40 } },
        { id: "check", type: "InferenceRule", layer: "metatheory", label: "proof checker (always halts)", position: { x: 320, y: 40 } },
        { id: "vi", type: "MetaClaim", layer: "metatheory", label: "valid / invalid", position: { x: 620, y: 40 } },
        { id: "P", type: "Sentence", layer: "proof", label: "candidate sentence $P$", position: { x: 40, y: 240 } },
        { id: "search", type: "InferenceRule", layer: "metatheory", label: "proof search", position: { x: 320, y: 240 } },
        { id: "yes", type: "MetaClaim", layer: "metatheory", label: "proof found → yes", position: { x: 620, y: 200 } },
        { id: "forever", type: "MetaClaim", layer: "metatheory", label: "no proof → runs forever", position: { x: 620, y: 300 } },
      ],
      edges: [
        { id: "e1", source: "cand", target: "check", type: "represents", layer: "metatheory" },
        { id: "e2", source: "check", target: "vi", type: "proves_about", layer: "metatheory" },
        { id: "e3", source: "P", target: "search", type: "represents", layer: "metatheory" },
        { id: "e4", source: "search", target: "yes", type: "proves_about", layer: "metatheory" },
        { id: "e5", source: "search", target: "forever", type: "proves_about", layer: "metatheory" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "Undecidable means 'too computationally expensive'.",
      correction:
        "Undecidable means *no* algorithm decides it in finite time for all inputs — not slow, but impossible in principle. It is unrelated to running time.",
    },
    {
      misconception: "Since proofs can be checked mechanically, provability must be decidable.",
      correction:
        "Checking a given proof halts; deciding whether *some* proof exists need not. Theoremhood for PA is r.e. but undecidable.",
    },
    {
      misconception: "We could dodge Gödel by taking all true sentences as axioms.",
      correction:
        "That 'theory' is not effectively axiomatized — true arithmetic isn't even r.e. — so it isn't a formal system Gödel's theorem is about.",
    },
  ],
  quiz: [
    {
      id: "s11q1",
      type: "multiple-choice",
      prompt: "Why can proof-checking be decidable while theoremhood is undecidable?",
      options: [
        "Because checking is slower than searching.",
        "Checking a *given* finite proof halts; deciding whether *some* proof exists may require an unbounded search that never terminates when none exists.",
        "Because theorems are infinite objects.",
        "They cannot both be true.",
      ],
      correct: 1,
      explanation:
        "A supplied proof is finite and verifiable in bounded steps; existence-of-a-proof is an unbounded search, r.e. but not decidable.",
    },
    {
      id: "s11q2",
      type: "true-false",
      prompt: "True or false: the set of PA-theorems is recursively enumerable.",
      correct: true,
      explanation:
        "True. Enumerate all finite strings, check which are valid proofs, and output their conclusions — this lists every theorem (though it never certifies a non-theorem).",
    },
    {
      id: "s11q3",
      type: "multiple-choice",
      prompt: "Why can't we define a useful formal theory whose axioms are 'all true arithmetic sentences'?",
      options: [
        "Because there are infinitely many of them.",
        "Because the set of true arithmetic sentences is not effectively axiomatizable (not even r.e.), so it isn't a mechanically presentable theory.",
        "Because true sentences are never provable.",
        "Because PA already proves all of them.",
      ],
      correct: 1,
      wrongExplanations: {
        "0": "PA also has infinitely many axioms (via schemas) and is fine — infinitude isn't the problem.",
        "3": "PA does not prove all true sentences — that's incompleteness.",
      },
      explanation:
        "Effective axiomatization requires the axioms be mechanically recognizable/listable; arithmetic truth is not even r.e., so this fails.",
    },
  ],
  masteryCheckpoint:
    "You can distinguish decidable / r.e. / undecidable, explain checking-vs-theoremhood, and say why 'all truths as axioms' isn't an effective theory.",
};
