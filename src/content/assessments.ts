/**
 * Achievement capstones (ADR-0001 / MIGRATION_PLAN §3). Each achievement node is
 * earned by passing one of these — a deterministic component (graded locally by
 * the Quiz engine) plus, for most, an open-ended explanation graded by the LLM
 * judge in Phase C (stored locally until then). Fatal misconceptions fail the
 * task regardless of other credit and route to remediation nodes.
 */
import type { AssessmentTask, Misconception, Rubric } from "../types";

// --- shared misconceptions (reused across capstones) ---
const M: Record<string, Misconception> = {
  wfTrue: { id: "wf-true", description: "Treats 'well-formed' as 'true'.", remediationNodeIds: ["c-grammar", "c-prov-vs-truth"], fatal: true },
  trueProv: { id: "true-prov", description: "Treats 'true in ℕ' as 'provable in PA'.", remediationNodeIds: ["c-satisfaction", "c-prov-vs-truth"], fatal: true },
  malformedFalse: { id: "malformed-false", description: "Treats a malformed string as false (it has no truth value).", remediationNodeIds: ["c-syntax", "c-grammar"], fatal: true },
  objMeta: { id: "obj-meta", description: "Treats metatheoretic claims as statements inside T.", remediationNodeIds: ["c-metatheory"], fatal: true },
  liar: { id: "liar", description: "Says the Gödel sentence is merely the English liar paradox.", remediationNodeIds: ["c-diagonalization", "c-prov-predicate"], fatal: true },
  codeUnderstands: { id: "code-understands", description: "Says the code number intrinsically 'understands' the proof.", remediationNodeIds: ["c-coding", "c-prov-predicate"], fatal: true },
  absolute: { id: "absolute", description: "Says G_T is absolutely unprovable in every system.", remediationNodeIds: ["c-incompleteness-1"], fatal: true },
  undecidableSlow: { id: "undecidable-slow", description: "Says 'undecidable' means 'too computationally expensive'.", remediationNodeIds: ["c-computability"], fatal: true },
  needSound: { id: "need-sound-for-unprov", description: "Thinks unprovability of G_T needs soundness (it needs only consistency).", remediationNodeIds: ["c-incompleteness-1"] },
};

export const RUBRICS: Record<string, Rubric> = {
  "rub-distinguish": {
    id: "rub-distinguish",
    criteria: [
      { id: "wf", description: "Correctly identifies well-formedness as grammatical, independent of truth.", maxScore: 25 },
      { id: "prov-vs-true", description: "Explains ⊢ (derivability) and ⊨ (truth in ℕ) as different relations.", maxScore: 35 },
      { id: "examples", description: "Applies the distinction correctly to all four canonical examples.", maxScore: 30 },
      { id: "precision", description: "States hedges (e.g. 'assuming PA consistent/sound') where needed.", maxScore: 10 },
    ],
  },
  "rub-evaluate-N": {
    id: "rub-evaluate-N",
    criteria: [
      { id: "interp", description: "Uses interpretation of + and = in ℕ, not proof rules.", maxScore: 50 },
      { id: "eval", description: "Evaluates both terms and compares, for 2+2=4 and 2+2=5.", maxScore: 50 },
    ],
  },
  "rub-godel-sentence": {
    id: "rub-godel-sentence",
    criteria: [
      { id: "defs", description: "Defines G_T, Prov_T, and ⌜G_T⌝ correctly.", maxScore: 30 },
      { id: "arithmetic", description: "Explains why G_T is an arithmetic sentence about numbers.", maxScore: 25 },
      { id: "fixed-point", description: "Attributes the self-reference to the Fixed-Point Lemma / coding.", maxScore: 25 },
      { id: "not-liar", description: "Explains why it is not the liar paradox (provability is representable; truth is not).", maxScore: 20 },
    ],
  },
  "rub-first": {
    id: "rub-first",
    criteria: [
      { id: "conditions", description: "States the three conditions on T.", maxScore: 25 },
      { id: "unprov", description: "Explains T⊬G_T from consistency.", maxScore: 25 },
      { id: "truth", description: "Explains why G_T is true in ℕ (soundness/standard model).", maxScore: 25 },
      { id: "scope", description: "Notes unprovable-in-T is not absolutely unprovable.", maxScore: 25 },
    ],
  },
  "rub-generic": {
    id: "rub-generic",
    criteria: [
      { id: "correct", description: "Conceptually correct and applied to the concrete example, not memorized vocabulary.", maxScore: 70 },
      { id: "precise", description: "Precise about the relevant distinction; no fatal misconception.", maxScore: 30 },
    ],
  },
};

const T = (t: AssessmentTask): AssessmentTask => t;

export const ASSESSMENTS: AssessmentTask[] = [
  T({
    id: "cap-classify",
    nodeId: "a-classify",
    kind: "deterministic",
    title: "Classify formal expressions",
    prompt: "Sort each expression into the correct grammatical category.",
    deterministic: [
      {
        id: "c-q1", type: "classification",
        prompt: "Classify each expression.",
        buckets: ["Malformed string", "Term", "Open formula", "Sentence"],
        items: [
          { id: "a", label: "$\\forall{+}{=}x))0$", correctBucket: "Malformed string" },
          { id: "b", label: "$S(S(0))$", correctBucket: "Term" },
          { id: "c", label: "$x+0=x$", correctBucket: "Open formula" },
          { id: "d", label: "$\\forall x(x+0=x)$", correctBucket: "Sentence" },
        ],
        explanation: "Gibberish that won't parse → malformed; a denotation → term; an equality with a free $x$ → open formula; quantified, no free vars → sentence.",
      },
    ],
    requiredConcepts: ["term", "formula", "sentence", "well-formed formula"],
    fatalMisconceptions: [M.malformedFalse],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-prove-224",
    nodeId: "a-prove-224",
    kind: "hybrid",
    title: "Prove 2+2=4",
    prompt: "Complete the derivation and justify the rule used at each step.",
    deterministic: [
      {
        id: "p-q1", type: "fill-in",
        prompt: "Fill the missing line (successor rule, $y=0$).",
        before: "$S(S(0))+S(S(0)) = S\\big(S(S(0))+S(0)\\big) = \\;?$",
        after: "$\\;= S(S(S(S(0)))) = 4$",
        accepted: ["S(S(S(S(0))+0))", "S(S(S(S(0)) + 0))"],
        placeholder: "S(S(S( ... )))",
        explanation: "Successor rule with $y=0$ on the inner sum.",
      },
    ],
    openEnded: { prompt: "Explain which recursive addition equations justify each rewrite, and why this is a genuine PA derivation rather than 'obvious'.", rubricId: "rub-generic" },
    requiredConcepts: ["numeral", "recursive definition"],
    fatalMisconceptions: [{ id: "obvious", description: "Treats 2+2=4 as obvious without using the recursive addition rules.", remediationNodeIds: ["c-pa"], fatal: true }],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-proof-graph",
    nodeId: "a-proof-graph",
    kind: "hybrid",
    title: "Read a proof graph",
    prompt: "Given axioms $A$, $A\\to B$, $B\\to C$ and two modus-ponens steps deriving $C$:",
    deterministic: [
      {
        id: "pg-q1", type: "multiple-choice",
        prompt: "What does $T\\vdash C$ correspond to in this graph?",
        options: ["$C$ is an axiom.", "$C$ is reachable from the axioms by finite valid steps.", "$C$ is true in $\\mathbb{N}$.", "$C$ is well-formed."],
        correct: 1,
        explanation: "$\\vdash$ is reachability of $C$ from the axiom nodes.",
      },
    ],
    openEnded: { prompt: "Identify the premises and conclusions, and explain why $C$ is reachable — and why reachability is about derivation, not truth.", rubricId: "rub-generic" },
    requiredConcepts: ["provability", "proof graph"],
    fatalMisconceptions: [M.trueProv],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-evaluate-N",
    nodeId: "a-evaluate-N",
    kind: "llm-judged",
    title: "Evaluate truth in ℕ",
    prompt: "Explain why $\\mathbb{N}\\models 2+2=4$ but $\\mathbb{N}\\not\\models 2+2=5$.",
    openEnded: { prompt: "Your answer must use: interpretation, the standard model ℕ, evaluation of +, and the equality check. Do not mention proof rules.", rubricId: "rub-evaluate-N" },
    requiredConcepts: ["interpretation", "satisfaction", "truth in a structure"],
    fatalMisconceptions: [M.trueProv],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-distinguish",
    nodeId: "a-distinguish",
    kind: "hybrid",
    title: "Distinguish syntax, proof & truth",
    prompt: "For each item say whether it is well-formed, provable in PA (assuming PA consistent), and true in ℕ — then explain the difference between $T\\vdash P$ and $\\mathbb{N}\\models P$.",
    deterministic: [
      {
        id: "d-q1", type: "classification",
        prompt: "Is each provable in PA (assuming consistent)?",
        buckets: ["Provable", "Not provable"],
        items: [
          { id: "a", label: "$2+2=4$", correctBucket: "Provable" },
          { id: "b", label: "$2+2=5$", correctBucket: "Not provable" },
          { id: "c", label: "$G_{\\mathrm{PA}}$", correctBucket: "Not provable" },
        ],
        explanation: "PA proves $2+2=4$; refutes $2+2=5$; and does not prove its own Gödel sentence — though it is true in ℕ.",
      },
    ],
    openEnded: { prompt: "Explain why 'well-formed', 'provable in PA', and 'true in ℕ' are three different predicates, using the four canonical examples.", rubricId: "rub-distinguish" },
    requiredConcepts: ["syntactic", "semantic", "provability", "truth in a structure"],
    fatalMisconceptions: [M.wfTrue, M.trueProv, M.malformedFalse],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-sound-complete",
    nodeId: "a-sound-complete",
    kind: "llm-judged",
    title: "Soundness vs completeness",
    prompt: "Explain the difference between a theory being sound and being complete, and why a theory can be sound yet incomplete.",
    openEnded: { prompt: "Define each precisely ($T\\vdash P\\Rightarrow\\mathbb{N}\\models P$ vs 'for every $P$, $T\\vdash P$ or $T\\vdash\\neg P$') and give the PA example.", rubricId: "rub-generic" },
    requiredConcepts: ["soundness", "completeness", "consistency"],
    fatalMisconceptions: [{ id: "sound-complete-same", description: "Conflates soundness with completeness.", remediationNodeIds: ["c-theory-props"], fatal: true }],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-object-meta",
    nodeId: "a-object-meta",
    kind: "hybrid",
    title: "Object vs metatheory",
    prompt: "Classify each claim by level, then explain why the metatheory can talk about PA's proofs.",
    deterministic: [
      {
        id: "om-q1", type: "classification",
        prompt: "Object-level or metatheoretic?",
        buckets: ["Object level", "Metatheory"],
        items: [
          { id: "a", label: "$2+2=4$", correctBucket: "Object level" },
          { id: "b", label: "“PA proves $2+2=4$.”", correctBucket: "Metatheory" },
          { id: "c", label: "“PA is consistent.”", correctBucket: "Metatheory" },
          { id: "d", label: "$\\forall x(x+0=x)$", correctBucket: "Object level" },
        ],
        explanation: "Statements about numbers are object-level; statements about PA's proofs/consistency are metatheoretic.",
      },
    ],
    openEnded: { prompt: "Explain why 'PA is consistent' is a claim about PA, and why adding Con(T) yields a stronger theory.", rubricId: "rub-generic" },
    requiredConcepts: ["object theory", "metatheory"],
    fatalMisconceptions: [M.objMeta],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-computability",
    nodeId: "a-computability",
    kind: "llm-judged",
    title: "Why computable systems",
    prompt: "Explain why all PA theorems can be listed (r.e.) but PA theoremhood is not decidable.",
    openEnded: { prompt: "Distinguish proof-checking (decidable) from theoremhood (r.e., undecidable), and note why 'undecidable' is not about being slow.", rubricId: "rub-generic" },
    requiredConcepts: ["decidable", "recursively enumerable", "undecidable"],
    fatalMisconceptions: [M.undecidableSlow],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-encode",
    nodeId: "a-encode",
    kind: "hybrid",
    title: "Encode syntax as arithmetic",
    prompt: "Encode the sequence $[4,7,9]$ with prime powers and explain how it is recovered.",
    deterministic: [
      {
        id: "en-q1", type: "multiple-choice",
        prompt: "Why is the prime-power code invertible?",
        options: ["Primes are smallest.", "Unique prime factorization recovers the exponents.", "Because proofs are prime.", "It isn't invertible."],
        correct: 1,
        explanation: "Unique factorization lets the exponents be read straight off.",
      },
    ],
    openEnded: { prompt: "Explain how a proof becomes a number, and why the number itself does not intrinsically 'know' what it encodes.", rubricId: "rub-generic" },
    requiredConcepts: ["Gödel coding", "arithmetization of syntax"],
    fatalMisconceptions: [M.codeUnderstands],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-prov-predicate",
    nodeId: "a-prov-predicate",
    kind: "llm-judged",
    title: "Proof-checking as arithmetic",
    prompt: "Explain what $\\mathrm{Proof}_T(p,q)$ checks and why it is an arithmetic formula, not an English concept.",
    openEnded: { prompt: "Cover: the four checks $\\mathrm{Proof}_T$ performs, why proof-checking is primitive recursive hence representable, and $\\mathrm{Prov}_T(q):=\\exists p\\,\\mathrm{Proof}_T(p,q)$.", rubricId: "rub-generic" },
    requiredConcepts: ["Proof_T(p,q)", "Prov_T(q)", "representable"],
    fatalMisconceptions: [M.codeUnderstands],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-godel-sentence",
    nodeId: "a-godel-sentence",
    kind: "llm-judged",
    title: "Construct the Gödel sentence",
    prompt: "Explain $G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$.",
    openEnded: { prompt: "Define $G_T$, $\\mathrm{Prov}_T(q)$, and $\\ulcorner G_T\\urcorner$; explain why $G_T$ is still arithmetic and why this is self-reference through coding (Fixed-Point Lemma), not the liar paradox.", rubricId: "rub-godel-sentence" },
    requiredConcepts: ["Gödel sentence", "diagonalization", "Fixed-Point Lemma"],
    fatalMisconceptions: [M.liar],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-first",
    nodeId: "a-first",
    kind: "llm-judged",
    title: "Explain First Incompleteness",
    prompt: "Explain Gödel's First Incompleteness Theorem.",
    openEnded: { prompt: "Cover: (1) the conditions on T; (2) what $G_T$ says; (3) why $T\\nvdash G_T$ if T is consistent; (4) why $G_T$ is true in ℕ (soundness); (5) why this is not absolute unprovability.", rubricId: "rub-first" },
    requiredConcepts: ["consistent", "computably axiomatized", "first incompleteness theorem"],
    fatalMisconceptions: [M.absolute, M.trueProv],
    passThreshold: 0.8,
  }),
  T({
    id: "cap-second",
    nodeId: "a-second",
    kind: "llm-judged",
    title: "Explain Second Incompleteness",
    prompt: "Explain why a suitable consistent T cannot prove $\\mathrm{Con}(T)$, and why adding it never ends the hierarchy (for a sound base, where each extension stays consistent).",
    openEnded: { prompt: "Cover: $\\mathrm{Con}(T):=\\neg\\mathrm{Prov}_T(\\ulcorner 0=1\\urcorner)$; the formalized first theorem; that a stronger theory can prove it; and why $T+\\mathrm{Con}(T)$ has its own Gödel sentence.", rubricId: "rub-first" },
    requiredConcepts: ["Con(T)", "second incompleteness theorem"],
    fatalMisconceptions: [{ id: "con-false", description: "Says T can't prove Con(T) because Con(T) is false.", remediationNodeIds: ["c-incompleteness-2"], fatal: true }],
    passThreshold: 0.8,
  }),
];

export const ASSESSMENT_BY_ID: Record<string, AssessmentTask> = Object.fromEntries(
  ASSESSMENTS.map((a) => [a.id, a]),
);
