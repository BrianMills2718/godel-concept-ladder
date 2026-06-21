/**
 * Core content contract for the concept-ladder site.
 *
 * WHY this shape: the whole pedagogical point is that the site separates five
 * relations that learners conflate — well-formedness, provability, truth-in-a-
 * structure, coding, and metatheory. That separation has to be *typed*, not
 * decorative, so node/edge/viz/quiz are all discriminated unions whose tags
 * carry the distinction. Content is plain data so a lesson can be authored or
 * corrected without touching a component.
 */

/** The five conceptual layers. Every typed-graph node/edge declares its layer
 *  so the renderer can visually keep them apart (style + legend, not color
 *  alone). This is the central anti-"category-error" mechanism. */
export type Layer = "syntax" | "proof" | "semantics" | "coding" | "metatheory";

/** Node kinds in the typed graph. A superset across all stages; a given graph
 *  uses only the kinds it needs. */
export type NodeType =
  | "RawString"
  | "Symbol"
  | "Term"
  | "Formula"
  | "Sentence"
  | "Axiom"
  | "InferenceRule"
  | "ProofStep"
  | "Theorem"
  | "Structure"
  | "DomainObject"
  | "Function"
  | "Relation"
  | "TruthValue"
  | "CodeNumber"
  | "ArithmeticPredicate"
  | "ObjectTheory"
  | "MetaTheory"
  | "MetaClaim"
  | "LayerBox"; // used by the four/five-level map

/** Edge kinds. The legend explains each; the renderer gives each a distinct
 *  line style so `formed_from` is never mistaken for `proves` or `satisfies`. */
export type EdgeType =
  | "formed_from"
  | "parsed_as"
  | "has_subexpression"
  | "binds_variable"
  | "premise_of"
  | "concludes"
  | "derived_by"
  | "proves"
  | "interpreted_as"
  | "evaluates_to"
  | "satisfies"
  | "encodes_as"
  | "decodes_to"
  | "represents"
  | "proves_about"
  | "extends"
  | "relates"; // generic layer-map relation

export interface GraphNode {
  id: string;
  /** Display label. May contain KaTeX delimited by $...$. */
  label: string;
  type: NodeType;
  layer: Layer;
  /** Optional longer text shown on hover / in the textual summary. */
  note?: string;
  /** Optional fixed position for hand-laid diagrams (layer map, loops). */
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  /** Short edge label; the *type* carries the meaning, the label is a hint. */
  label?: string;
  type: EdgeType;
  layer: Layer;
}

/** A visualization is a discriminated union: not everything is a node-link
 *  graph. Parse trees, comparison tables, and the coding encoder are their own
 *  kinds so we never force a tree or a table into React Flow. */
export type VisualizationSpec =
  | TypedGraphViz
  | ParseTreeViz
  | ParseExplorerViz
  | ComparisonTableViz
  | CodingEncoderViz
  | GodelLoopViz
  | LadderViz;

export interface VizBase {
  id: string;
  title: string;
  /** Required: a plain-text description that doubles as the accessibility
   *  fallback for screen readers and for when a graph can't render. */
  textualSummary: string;
}

export interface TypedGraphViz extends VizBase {
  kind: "typed-graph";
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Layers actually present, controls which legend rows show. */
  layers: Layer[];
}

/** Recursive parse-tree node. Rendered as nested SVG/HTML, not React Flow. */
export interface ParseNode {
  id: string;
  /** KaTeX-able label (the expression at this node). */
  label: string;
  /** Grammatical category of this node. */
  category: "sentence" | "formula" | "term" | "symbol" | "quantifier";
  /** Id of the formation rule that builds this node (parse-explorer only). */
  ruleId?: string;
  children?: ParseNode[];
}

export interface ParseTreeViz extends VizBase {
  kind: "parse-tree";
  root: ParseNode;
  /** Optional malformed string to show *failing* to parse, side by side. */
  malformedExample?: { input: string; reason: string };
}

/** The interactive parse / parse-failure explorer (ADR-0002, Phase 3). Shows the
 *  formation rules explicitly and lets the learner pick a string and watch it
 *  parse (rule-by-rule) or *fail*, citing the exact rule that can't apply — the
 *  "show the rules by which something is parsable" capability. The parse of each
 *  example is authored data (no live parser), matching the content-as-data
 *  philosophy and keeping the grammar honest. */
export interface FormationRuleSpec {
  /** short id cited by parse nodes / failures, e.g. "F∀". */
  id: string;
  category: "term" | "formula";
  /** the rule, KaTeX-able, e.g. "if $t$ is a term then $S(t)$ is a term". */
  text: string;
}

export interface ParseExample {
  /** the input string, KaTeX-able. */
  input: string;
  legal: boolean;
  /** legal inputs: the parse as nested rule applications (root = whole input). */
  tree?: ParseNode;
  /** illegal inputs: where and why parsing fails. */
  failure?: {
    /** the offending token/fragment, shown verbatim (plain text, not KaTeX). */
    at: string;
    /** the rule that was expected to apply but couldn't. */
    ruleTried: string;
    /** plain-language reason. */
    reason: string;
  };
}

export interface ParseExplorerViz extends VizBase {
  kind: "parse-explorer";
  rules: FormationRuleSpec[];
  examples: ParseExample[];
}

export interface ComparisonRow {
  /** Row label, e.g. the sentence under test. KaTeX-able. */
  label: string;
  cells: Record<string, ComparisonCell>;
}
export interface ComparisonCell {
  value: "yes" | "no" | "n/a";
  /** Tooltip / sub-label explaining the verdict. */
  note?: string;
}
export interface ComparisonTableViz extends VizBase {
  kind: "comparison-table";
  /** Column keys in order, e.g. ["Well-formed?", "Provable in PA?", "True in ℕ?"]. */
  columns: string[];
  rows: ComparisonRow[];
}

/** Interactive prime-power Gödel encoder: the learner edits a short sequence of
 *  exponents and sees 2^a·3^b·5^c·… , its product, and the decode back. */
export interface CodingEncoderViz extends VizBase {
  kind: "coding-encoder";
  /** Default exponent sequence, e.g. [4, 7, 9]. */
  defaultSequence: number[];
}

/** The Gödel-sentence self-reference cycle. Fixed four-node loop; the labels are
 *  parameterized but the structure (G_T → code → ¬Prov → G_T) is constant. */
export interface GodelLoopViz extends VizBase {
  kind: "godel-loop";
  /** The four stations of the loop, in cycle order. KaTeX-able labels. */
  stations: { label: string; sub?: string }[];
  /** The relation label printed on each arrow, in order. */
  arrows: string[];
}

/** A **ladder-of-abstraction** figure (ADR-0006 §6, after B. Victor) for a
 *  *dynamical* concept: three fixed rungs — **control** a parameter (a concrete
 *  case), **abstract over** it (the case generalized over all values), and **step
 *  down** (point back from the abstraction to a concrete instance). Static by
 *  design; the insight lives in the transitions between rungs. */
export interface LadderViz extends VizBase {
  kind: "ladder";
  /** The parameter being controlled / abstracted over, e.g. "the assignment to x". */
  parameter: string;
  /** Exactly three rungs, in order: control → abstract-over → step-down. */
  rungs: {
    rung: "control" | "abstract-over" | "step-down";
    /** Short caption naming the move. */
    caption: string;
    /** The concrete content at this rung. KaTeX-able. */
    body: string;
  }[];
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export type QuizQuestion =
  | MultipleChoiceQ
  | MultiSelectQ
  | TrueFalseQ
  | ClassificationQ
  | FillInQ
  | MatchingQ;

interface QuizBase {
  id: string;
  prompt: string; // KaTeX-able
  /** Why the correct answer is correct — always shown after answering. */
  explanation: string;
  /** Optional fine-grained item→concept mapping: the concept id(s) this item
   *  tests. Enables per-item diagnostic routing (METHODOLOGY §12). */
  concepts?: string[];
  /** Optional item→misconception mapping: misconception id(s) this item probes
   *  (the ids defined in assessments.ts). */
  misconceptions?: string[];
}

export interface MultipleChoiceQ extends QuizBase {
  type: "multiple-choice";
  options: string[];
  /** Index into options. */
  correct: number;
  /** Optional per-wrong-option explanations, keyed by option index as string. */
  wrongExplanations?: Record<string, string>;
}

export interface MultiSelectQ extends QuizBase {
  type: "multi-select";
  options: string[];
  /** Indices that should be selected. */
  correct: number[];
}

export interface TrueFalseQ extends QuizBase {
  type: "true-false";
  correct: boolean;
}

/** Sort each item into exactly one bucket. Used for the well-formedness
 *  classifier and the four-level-map classification. */
export interface ClassificationQ extends QuizBase {
  type: "classification";
  buckets: string[];
  items: { id: string; label: string; correctBucket: string }[];
}

/** Fill in a missing step (e.g. a derivation line). The learner's text is
 *  normalized (whitespace collapsed, a few notational variants folded) and
 *  matched against `accepted`. Used for the 2+2=4 derivation. */
export interface FillInQ extends QuizBase {
  type: "fill-in";
  /** Context shown above the blank, KaTeX-able (e.g. the derivation so far). */
  before?: string;
  /** Context shown below the blank. */
  after?: string;
  /** Accepted answers (post-normalization, case-insensitive). */
  accepted: string[];
  /** Shown as the input's placeholder/hint. */
  placeholder?: string;
}

/** Match each left item (notation) to its right meaning. Used for the symbol
 *  glossary checks (e.g. ⊢, ⊨, ⌜P⌝, Con(T)). */
export interface MatchingQ extends QuizBase {
  type: "matching";
  /** Left column, e.g. notation. */
  left: { id: string; label: string }[];
  /** Right column, e.g. meanings. Shown shuffled in the UI via select boxes. */
  right: { id: string; label: string }[];
  /** Correct pairing: left id → right id. */
  pairs: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

export interface Definition {
  term: string;
  short: string;
  expanded?: string;
  example?: string; // KaTeX-able
}

/** A prose block. `body` is markdown-lite: paragraphs split on blank lines,
 *  inline KaTeX via $...$, block KaTeX via $$...$$. */
export interface Section {
  heading?: string;
  body: string;
  /** Optional pedagogical role for "show then tell" / "Therefore & But" ordering
   *  (ADR-0006, METHODOLOGY §11). Makes the problem→solution / concrete→abstract
   *  structure explicit and checkable rather than implicit in prose order. */
  role?: SectionRole;
}

/** The role a section plays in the problem→solution / show-then-tell arc. */
export type SectionRole = "problem" | "solution" | "show" | "tell";

export interface Confusion {
  /** The wrong belief, stated plainly. */
  misconception: string;
  /** The correction. */
  correction: string;
}

export interface Lesson {
  id: string;
  stage: number;
  title: string;
  /** One-line "what this stage is about" for the sidebar/header. */
  summary: string;
  prerequisites: string[]; // lesson ids
  objectives: string[];
  definitions: Definition[];
  sections: Section[];
  visualizations: VisualizationSpec[];
  confusions: Confusion[];
  quiz: QuizQuestion[];
  /** The "you may proceed when you can…" statement. */
  masteryCheckpoint: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  related: string[];
}

// ---------------------------------------------------------------------------
// Concept dependency DAG (ADR-0002) — the fine-grained substrate beneath the
// stage-level skill DAG. A `Concept` is a first-class node: each *idea* a lesson
// uses carries its own `prerequisites` (the other concepts you must already
// grasp), so "defined before use" is enforceable at term granularity, not just
// chip-token granularity. A stage node (ADR-0001) encapsulates the sub-DAG of
// concepts whose `introducedIn` is that stage; the stage DAG is thus a quotient
// of this one. Notation (@n{}) stays a self-contained primitive; @c{} refs an
// idea and renders recursively (a definition may contain further @c{} chips).
// ---------------------------------------------------------------------------

export interface Concept {
  /** kebab-case id; also the `@c{id}` chip key. */
  id: string;
  /** display label, e.g. "free variable". */
  term: string;
  layer: Layer;
  /** One-line definition. May contain `$math$`, `@n{}` notation, and `@c{}`
   *  concept refs. Every `@c{}` ref MUST be a transitive prerequisite of this
   *  concept (enforced by the validator) — that is the "defined before use"
   *  closure. */
  short: string;
  /** Optional deeper explanation; same reference rules as `short`. */
  expanded?: string;
  /** Concrete example, KaTeX-able (drawn from the fixed running cast). */
  example?: string;
  /** Concept ids that must be understood first — the definition-dependency
   *  edges. **Acyclic** and gated as such (a cycle is a decomposition error
   *  resolved by the four moves — ADR-0003 as amended / ADR-0004 §Cycles). Empty
   *  for a genuine primitive (also set `primitive: true`). */
  prerequisites: string[];
  /** Undirected associations — concepts understood *against* each other (e.g.
   *  ⊢ contrasts ⊨). NOT a dependency: never gates, orders, or derives the skill
   *  map; used for "see also"/contrast cross-links. Expected to be symmetric. */
  contrasts?: string[];
  /** Stage/lesson id (ADR-0001) that formally introduces this concept. A
   *  prerequisite concept must be introduced at this stage or a prerequisite
   *  stage of it. */
  introducedIn: string;
  /** Optional self-contained check for just this concept. */
  microQuiz?: QuizQuestion[];
  /** A genuine primitive that needs no prior concept (e.g. symbol, object). */
  primitive?: boolean;
  /** Optional out-of-domain **analogy** (the third leg of PEA, ADR-0006): a
   *  mapping to a familiar foreign domain, with the point where it breaks down.
   *  Out-of-domain = lossy and *local*; attach lightly, retire at the breakdown. */
  analogy?: Analogy;
}

/** An out-of-domain analogy with an explicit domain of validity (ADR-0006 §3).
 *  Faithful only on the mapped features; the `breakdown` is information, usually a
 *  "Therefore & But" handoff to the next concept. */
export interface Analogy {
  /** The familiar source domain, e.g. "a database query". */
  domain: string;
  /** What maps to what — the faithful correspondence. KaTeX-able. */
  mapping: string;
  /** Where the analogy breaks (its domain of validity ends). KaTeX-able. */
  breakdown: string;
  /** Optional "Therefore & But" handoff motivated by the breakdown. KaTeX-able. */
  handoff?: string;
}

export interface ConceptGraph {
  concepts: Concept[];
}

// ---------------------------------------------------------------------------
// Skill DAG (ADR-0001) — the prerequisite graph that is the primary navigation.
// A "lesson" is content attached to a concept node; the linear ladder is one
// topological ordering of this graph.
// ---------------------------------------------------------------------------

export type NodeKind = "concept" | "skill" | "achievement";

/** v1 authors only these three. meta_level_of / encodes_as / contrasts_with are
 *  reserved in the type but deliberately not authored yet (ADR-0001). */
export type EdgeKind =
  | "prerequisite_for"
  | "orients" // soft, non-gating link (the orientation map → the starting atoms)
  | "assesses"
  | "remediates"
  | "meta_level_of"
  | "encodes_as"
  | "contrasts_with";

export type Branch =
  | "foundations"
  | "syntax"
  | "proof-theory"
  | "peano-arithmetic"
  | "semantics"
  | "provability-vs-truth"
  | "theory-properties"
  | "metatheory"
  | "computability"
  | "godel-coding"
  | "provability-predicate"
  | "diagonalization"
  | "incompleteness";

export interface SkillNode {
  id: string;
  kind: NodeKind;
  title: string;
  shortDescription: string;
  branch: Branch;
  /** concept/skill nodes: the stage id whose content this node renders. */
  lessonId?: string;
  /** achievement nodes: the capstone task id(s) that earn this node. */
  assessmentIds?: string[];
  /** hand-laid position for the homepage DAG layout. */
  position?: { x: number; y: number };
}

export interface SkillEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  label?: string;
}

export interface SkillGraph {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

/** Runtime state of a node for the learner, derived from progress + edges. */
export type NodeState = "locked" | "available" | "passed" | "current";

// ---------------------------------------------------------------------------
// Assessment (achievement = demonstrated capability)
// ---------------------------------------------------------------------------

export type AssessmentKind = "deterministic" | "llm-judged" | "hybrid";

export interface Misconception {
  id: string;
  description: string;
  /** nodes to revisit when this misconception is detected. */
  remediationNodeIds: string[];
  /** a fatal misconception fails the task regardless of other credit. */
  fatal?: boolean;
}

export interface RubricCriterion {
  id: string;
  description: string;
  maxScore: number;
}

export interface Rubric {
  id: string;
  criteria: RubricCriterion[];
}

export interface AssessmentTask {
  id: string;
  /** the achievement node this capstone earns. */
  nodeId: string;
  kind: AssessmentKind;
  title: string;
  /** capstone prompt (KaTeX/markdown + @n/@t chips). */
  prompt: string;
  /** deterministic component, graded by the existing Quiz engine. */
  deterministic?: QuizQuestion[];
  /** open-ended component: the learner writes an explanation graded by the LLM
   *  judge (Phase C). Stored locally until then. */
  openEnded?: {
    /** prompt for the written part. */
    prompt: string;
    rubricId: string;
  };
  requiredConcepts: string[];
  fatalMisconceptions: Misconception[];
  /** default 0.8. */
  passThreshold: number;
}

/** Structured result returned by the LLM judge backend (Phase C). */
export interface JudgeResult {
  score: number; // 0..100
  passed: boolean;
  confidence: "low" | "medium" | "high";
  criterionScores: {
    criterionId: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
  detectedMisconceptions: string[];
  missingConcepts: string[];
  feedbackForLearner: string;
  suggestedRemediationNodeIds: string[];
  followUpQuestion?: string | null;
}
