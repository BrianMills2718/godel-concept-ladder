/**
 * Stage 0 — Two Distinctions (optional orientation).
 *
 * NOTE: this node is an OPTIONAL, non-gating orientation (ADR-0001 reframe). It
 * deliberately previews ⊢/⊨/object-meta before they're taught, using
 * self-contained notation chips + spiral glosses, so it is exempt from the
 * forward-reference closure check (it is the "map," not a prerequisite).
 *
 * Replaces the earlier "four-level map": the four things were not co-equal
 * levels (proof lives on the syntactic side; metatheory is a vantage, not a
 * level). The faithful structure is one precondition + two orthogonal axes.
 */
import type { Lesson } from "../../types";

export const stage0: Lesson = {
  id: "stage-0",
  stage: 0,
  title: "Two Distinctions (orientation)",
  summary:
    "An optional map. One precondition — is the string even well-formed? — and two independent distinctions that run through everything: provable (⊢) vs true (⊨), and talking inside a theory vs about it.",
  prerequisites: [],
  objectives: [
    "Name the precondition (well-formedness) and the two distinctions.",
    "State that @n{turnstile} (provable) and @n{models} (true) are different relations.",
    "Recognize an object-level claim vs a metatheoretic one.",
  ],
  definitions: [
    { term: "well-formed formula", short: "A string the grammar accepts — the precondition before truth or proof even apply.", example: "$2+2=5$ is well-formed (and false)." },
    { term: "syntactic", short: "About symbol manipulation — proofs/derivations. @n{turnstile} lives here." },
    { term: "semantic", short: "About truth in a structure. @n{models} lives here." },
    { term: "metatheory", short: "Reasoning ABOUT a theory (its proofs, consistency) — a vantage point, not a level." },
  ],
  sections: [
    {
      heading: "First, a precondition",
      body: `Before anything else: **is the string a legal formula at all?** Gibberish like $\\forall{+}{=}x))0$ isn't true, isn't false, isn't provable — it's simply not in the game. Well-formedness (grammar) is the gate. A *well-formed* sentence like $2+2=5$ can then be false; being legal says nothing about being true.

Our running theory @n{T} is **PA** — @n{PA}, a standard formal theory of the natural numbers built from $0$ and successor (dissected fully at the *Peano Arithmetic* node). Our running structure is @n{N}, the ordinary natural numbers.`,
    },
    {
      heading: "Axis 1 — provable (⊢) vs true (⊨)",
      body: `For a well-formed sentence @n{P}, two **different** relations can hold:

- @n{T}@n{turnstile}@n{P} — *$P$ is provable in $T$*: there's a finite derivation. This is **syntactic** (symbol pushing).
- @n{N}@n{models}@n{P} — *$P$ is true in $\\mathbb{N}$*. This is **semantic** (evaluation in a structure).

They often agree on easy cases, which is exactly why people fuse them — but they are different arrows on the same sentence. **The gap between them is the whole subject:** Gödel builds a sentence that is true in @n{N} yet not provable in @n{T}.

$$\\text{provable} \\;\\neq\\; \\text{true}$$`,
    },
    {
      heading: "Axis 2 — object vs meta (orthogonal)",
      body: `A separate distinction, at right angles to the first: are you speaking **inside** the theory or **about** it?

- *Object level* — a claim of @n{T} about numbers: $2+2=4$.
- *Metatheory* — a claim about @n{T} itself: "@n{T} proves $2+2=4$", "@n{T} is consistent".

The symbol @n{turnstile} is not part of @n{T}'s language; it belongs to the metatheory describing @n{T}. (Later, **Gödel coding** is precisely the trick that smuggles metatheoretic claims back into object-level arithmetic — that's why coding matters.)`,
    },
    {
      heading: "What to keep in your head",
      body: `Not four stacked levels — **one gate and two crossing axes**: well-formed? then *provable vs true* and *object vs meta*. Almost every confusion about Gödel is a slip on one of these. The rest of the tree builds each one properly; come back to this map whenever you feel lost.`,
    },
  ],
  visualizations: [
    {
      id: "stage0-axes",
      kind: "typed-graph",
      title: "One sentence, two relations (Axis 1), seen from a vantage (Axis 2)",
      textualSummary:
        "A single well-formed sentence P is the target of two different arrows: the theory T 'proves' P (syntactic, ⊢) and the structure ℕ 'satisfies' P (semantic, ⊨). Separately, the metatheory sits outside and makes claims ABOUT T and about these relations — that is the object-vs-meta axis, orthogonal to provable-vs-true.",
      layers: ["syntax", "proof", "semantics", "metatheory"],
      nodes: [
        { id: "P", type: "Sentence", layer: "syntax", label: "well-formed sentence @n{P}", position: { x: 320, y: 170 } },
        { id: "T", type: "ObjectTheory", layer: "proof", label: "theory @n{T} (PA)", position: { x: 40, y: 40 } },
        { id: "N", type: "Structure", layer: "semantics", label: "structure @n{N}", position: { x: 40, y: 300 } },
        { id: "meta", type: "MetaTheory", layer: "metatheory", label: "metatheory (about $T$)", position: { x: 640, y: 170 } },
      ],
      edges: [
        { id: "e1", source: "T", target: "P", type: "proves", label: "⊢ provable (syntactic)", layer: "proof" },
        { id: "e2", source: "N", target: "P", type: "satisfies", label: "⊨ true (semantic)", layer: "semantics" },
        { id: "e3", source: "meta", target: "T", type: "proves_about", label: "Axis 2: about $T$", layer: "metatheory" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "If a sentence is well-formed it must be true (or at least provable).",
      correction:
        "Well-formedness is just the grammar gate. $2+2=5$ is well-formed and false. Legal ≠ true ≠ provable.",
    },
    {
      misconception: "'True in ℕ' and 'provable in PA' are the same thing.",
      correction:
        "They are different relations (Axis 1). They agree on simple cases, but Gödel's sentence is true in @n{N} yet unprovable in @n{T} — that gap is incompleteness.",
    },
    {
      misconception: "Metatheory is just more statements inside T.",
      correction:
        "'@n{T} is consistent' is a claim ABOUT @n{T} (Axis 2), one level up. Gödel later encodes such claims back into arithmetic — a separate, deliberate move.",
    },
  ],
  quiz: [
    {
      id: "s0q1",
      type: "classification",
      prompt: "Which distinction is each pair testing?",
      buckets: ["Axis 1: provable vs true", "Axis 2: object vs meta", "Precondition: well-formed?"],
      items: [
        { id: "i1", label: "“$\\forall{+}{=}x))0$ is not a legal formula.”", correctBucket: "Precondition: well-formed?" },
        { id: "i2", label: "“$2+2=4$ is true in $\\mathbb{N}$, but is it provable in PA?”", correctBucket: "Axis 1: provable vs true" },
        { id: "i3", label: "“$2+2=4$” vs “PA proves $2+2=4$.”", correctBucket: "Axis 2: object vs meta" },
      ],
      explanation:
        "Legality is the precondition; ⊢-vs-⊨ is Axis 1; a claim about PA's proofs (vs about numbers) is Axis 2.",
    },
    {
      id: "s0q2",
      type: "true-false",
      prompt: "True or false: a sentence must be provable in $T$ before we can ask whether it is true in $\\mathbb{N}$.",
      correct: false,
      explanation:
        "False. ⊢ and ⊨ are independent relations (Axis 1). Any well-formed sentence can be evaluated in $\\mathbb{N}$ whether or not $T$ proves it — and that independence is where the Gödel sentence lives.",
    },
    {
      id: "s0q3",
      type: "multiple-choice",
      prompt: "Why is the metatheory called a 'vantage', not a fourth level?",
      options: [
        "Because it is inside $T$.",
        "Because 'about $T$' is a different axis from 'syntax vs semantics' — you can make object- or meta-level claims that are themselves syntactic or semantic.",
        "Because it has no symbols.",
        "Because it is always false.",
      ],
      correct: 1,
      explanation:
        "Object-vs-meta is orthogonal to provable-vs-true. Treating it as a peer 'level' stacked on the others is itself a category slip.",
    },
  ],
  masteryCheckpoint:
    "You can name the precondition (well-formed) and the two axes (⊢ vs ⊨; object vs meta), and say why proof and truth are different relations.",
};
