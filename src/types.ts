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
  | ComparisonTableViz
  | CodingEncoderViz
  | GodelLoopViz;

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
  children?: ParseNode[];
}

export interface ParseTreeViz extends VizBase {
  kind: "parse-tree";
  root: ParseNode;
  /** Optional malformed string to show *failing* to parse, side by side. */
  malformedExample?: { input: string; reason: string };
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
}

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
