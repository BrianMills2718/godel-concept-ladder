/**
 * The skill DAG (ADR-0001 / MIGRATION_PLAN §2).
 *
 * Concept nodes carry existing reviewed stage content (via lessonId). Achievement
 * nodes are capstone assessments (assessmentIds → src/content/assessments.ts).
 * Edges are `prerequisite_for` (source must be passed before target unlocks).
 * The graph is a DAG; the linear ladder is one topological ordering of it.
 *
 * `assesses`/`remediates` relations are represented in the assessment data
 * (AssessmentTask), not as graph edges, in v1.
 */
import type { SkillGraph, SkillNode, SkillEdge } from "../types";

const concept = (
  id: string,
  branch: SkillNode["branch"],
  lessonId: string,
  title: string,
  shortDescription: string,
  position: { x: number; y: number },
): SkillNode => ({ id, kind: "concept", branch, lessonId, title, shortDescription, position });

const achievement = (
  id: string,
  branch: SkillNode["branch"],
  title: string,
  shortDescription: string,
  assessmentIds: string[],
  position: { x: number; y: number },
): SkillNode => ({ id, kind: "achievement", branch, title, shortDescription, assessmentIds, position });

const NODES: SkillNode[] = [
  // --- concept nodes (content = stages) ---
  concept("c-four-levels", "foundations", "stage-0", "Two Distinctions (orientation)", "Optional map: ⊢ vs ⊨, and object vs meta.", { x: 40, y: -120 }),
  concept("c-syntax", "syntax", "stage-1", "Terms, Formulas, Sentences", "The grammatical ladder.", { x: 250, y: 40 }),
  concept("c-grammar", "syntax", "stage-2", "Grammar & Well-formedness", "Legal ≠ true ≠ provable.", { x: 500, y: 20 }),
  concept("c-proof", "proof-theory", "stage-3", "Axioms, Rules, Proofs", "⊢ is derivability, not truth.", { x: 250, y: 460 }),
  concept("c-proof-graphs", "proof-theory", "stage-4", "Proof Graphs", "⊢ as reachability.", { x: 500, y: 460 }),
  concept("c-pa", "peano-arithmetic", "stage-5", "Peano Arithmetic & 2+2=4", "Successor, numerals, derivation.", { x: 500, y: 160 }),
  concept("c-structures", "semantics", "stage-6", "Structures & Interpretation", "Symbol ≠ its meaning.", { x: 250, y: 280 }),
  concept("c-satisfaction", "semantics", "stage-7", "Satisfaction (⊨)", "Truth by recursive evaluation.", { x: 500, y: 280 }),
  concept("c-prov-vs-truth", "provability-vs-truth", "stage-8", "Provability vs Truth", "⊢ and ⊨ are different arrows.", { x: 760, y: 280 }),
  concept("c-theory-props", "theory-properties", "stage-9", "Sound / Complete / Consistent", "Three distinct properties.", { x: 1020, y: 280 }),
  concept("c-metatheory", "metatheory", "stage-10", "Object vs Metatheory", "Inside T vs about T.", { x: 500, y: 600 }),
  concept("c-computability", "computability", "stage-11", "Computability", "Decidable / r.e. / undecidable.", { x: 250, y: 760 }),
  concept("c-coding", "godel-coding", "stage-12", "Gödel Coding", "Syntax as numbers.", { x: 500, y: 760 }),
  concept("c-prov-predicate", "provability-predicate", "stage-13", "Proof_T / Prov_T", "Proof-checking as arithmetic.", { x: 760, y: 640 }),
  concept("c-diagonalization", "diagonalization", "stage-14", "Diagonalization & Gₜ", "Self-reference via coding.", { x: 1020, y: 640 }),
  concept("c-incompleteness-1", "incompleteness", "stage-15", "First Incompleteness", "True but unprovable.", { x: 1300, y: 460 }),
  concept("c-incompleteness-2", "incompleteness", "stage-16", "Second Incompleteness", "T cannot prove Con(T).", { x: 1560, y: 460 }),

  // --- achievement nodes (capstone assessments) ---
  achievement("a-classify", "syntax", "Classify Formal Expressions", "Malformed / term / formula / sentence.", ["cap-classify"], { x: 500, y: -110 }),
  achievement("a-prove-224", "peano-arithmetic", "Prove 2+2=4", "Derive it from the axioms.", ["cap-prove-224"], { x: 760, y: 120 }),
  achievement("a-proof-graph", "proof-theory", "Read a Proof Graph", "Premises, conclusions, reachability.", ["cap-proof-graph"], { x: 760, y: 460 }),
  achievement("a-evaluate-N", "semantics", "Evaluate Truth in ℕ", "Why ℕ⊨2+2=4 but ℕ⊭2+2=5.", ["cap-evaluate-N"], { x: 760, y: 400 }),
  achievement("a-distinguish", "provability-vs-truth", "Distinguish Syntax, Proof & Truth", "The core capability.", ["cap-distinguish"], { x: 1020, y: 80 }),
  achievement("a-sound-complete", "theory-properties", "Soundness vs Completeness", "Tell them apart.", ["cap-sound-complete"], { x: 1280, y: 240 }),
  achievement("a-object-meta", "metatheory", "Object vs Meta", "Classify claims by level.", ["cap-object-meta"], { x: 760, y: 600 }),
  achievement("a-computability", "computability", "Why Computable Systems", "r.e. vs decidable theoremhood.", ["cap-computability"], { x: 250, y: 900 }),
  achievement("a-encode", "godel-coding", "Encode Syntax as Arithmetic", "Prime-power coding + recover.", ["cap-encode"], { x: 500, y: 900 }),
  achievement("a-prov-predicate", "provability-predicate", "Proof-checking as Arithmetic", "What Proof_T checks.", ["cap-prov-predicate"], { x: 1020, y: 800 }),
  achievement("a-godel-sentence", "diagonalization", "Construct the Gödel Sentence", "Gₜ ↔ ¬Provₜ(⌜Gₜ⌝), not the liar.", ["cap-godel-sentence"], { x: 1300, y: 680 }),
  achievement("a-first", "incompleteness", "Explain First Incompleteness", "Truth outruns proof.", ["cap-first"], { x: 1560, y: 220 }),
  achievement("a-second", "incompleteness", "Explain Second Incompleteness", "The tower never closes.", ["cap-second"], { x: 1560, y: 680 }),
];

/** prerequisite_for edges: source must be passed before target unlocks. */
const PREREQS: [string, string][] = [
  // Roots are the three atoms: c-syntax, c-proof, c-structures. The orientation
  // node c-four-levels is intentionally non-gating (an optional map).
  // syntax
  ["c-syntax", "c-grammar"],
  ["c-syntax", "c-pa"],
  ["c-syntax", "c-proof"],
  ["c-grammar", "c-prov-vs-truth"],
  // proof
  ["c-proof", "c-proof-graphs"],
  ["c-proof", "c-prov-vs-truth"],
  ["c-proof", "c-computability"],
  ["c-proof", "c-metatheory"],
  // semantics
  ["c-structures", "c-satisfaction"],
  ["c-pa", "c-satisfaction"],
  ["c-satisfaction", "c-prov-vs-truth"],
  // upper spine
  ["c-prov-vs-truth", "c-theory-props"],
  ["c-theory-props", "c-incompleteness-1"],
  // coding track
  ["c-computability", "c-coding"],
  ["c-computability", "c-prov-predicate"],
  ["c-coding", "c-prov-predicate"],
  ["c-metatheory", "c-prov-predicate"],
  ["c-metatheory", "c-incompleteness-1"],
  ["c-prov-predicate", "c-diagonalization"],
  ["c-diagonalization", "c-incompleteness-1"],
  ["c-incompleteness-1", "c-incompleteness-2"],

  // concept → achievement (achievement unlocks when its prereq concepts pass)
  ["c-syntax", "a-classify"],
  ["c-grammar", "a-classify"],
  ["c-pa", "a-prove-224"],
  ["c-proof", "a-prove-224"],
  ["c-proof", "a-proof-graph"],
  ["c-proof-graphs", "a-proof-graph"],
  ["c-structures", "a-evaluate-N"],
  ["c-satisfaction", "a-evaluate-N"],
  ["c-prov-vs-truth", "a-distinguish"],
  ["c-syntax", "a-distinguish"],
  ["c-satisfaction", "a-distinguish"],
  ["c-proof", "a-distinguish"],
  ["c-theory-props", "a-sound-complete"],
  ["c-metatheory", "a-object-meta"],
  ["c-computability", "a-computability"],
  ["c-coding", "a-encode"],
  ["c-computability", "a-encode"],
  ["c-prov-predicate", "a-prov-predicate"],
  ["c-coding", "a-prov-predicate"],
  ["c-diagonalization", "a-godel-sentence"],
  ["c-prov-predicate", "a-godel-sentence"],
  ["c-metatheory", "a-godel-sentence"],
  ["c-syntax", "a-godel-sentence"],
  ["c-incompleteness-1", "a-first"],
  ["a-godel-sentence", "a-first"],
  ["c-theory-props", "a-first"],
  ["c-incompleteness-2", "a-second"],
  ["a-first", "a-second"],
];

const EDGES: SkillEdge[] = PREREQS.map(([source, target], i) => ({
  id: `e${i}`,
  source,
  target,
  kind: "prerequisite_for",
}));

export const SKILL_GRAPH: SkillGraph = { nodes: NODES, edges: EDGES };

/** The final goal node — the default selected achievement. */
export const ROOT_GOAL_ID = "a-first";

export function nodeById(id: string): SkillNode | undefined {
  return SKILL_GRAPH.nodes.find((n) => n.id === id);
}

/** The concept node that renders a given stage (for legacy #/stage-* redirects
 *  and the sidebar's recommended-path links). */
export function nodeForLesson(lessonId: string): SkillNode | undefined {
  return SKILL_GRAPH.nodes.find((n) => n.lessonId === lessonId);
}

/** All achievement nodes (goal choices). */
export function achievements(): SkillNode[] {
  return SKILL_GRAPH.nodes.filter((n) => n.kind === "achievement");
}

/** Direct prerequisite node ids of `id`. */
export function prereqsOf(id: string): string[] {
  return SKILL_GRAPH.edges
    .filter((e) => e.kind === "prerequisite_for" && e.target === id)
    .map((e) => e.source);
}

/** All ancestors (transitive prerequisites) of `id` — the sub-DAG a goal needs. */
export function ancestorsOf(id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [...prereqsOf(id)];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    stack.push(...prereqsOf(n));
  }
  return seen;
}
