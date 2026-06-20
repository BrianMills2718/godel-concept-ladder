/**
 * Single source of truth for what each layer and edge type *means* and how it
 * is styled. Every typed graph renders a legend from this so the learner can
 * always decode "this dashed orange arrow = encodes_as (coding layer)".
 *
 * Accessibility: each layer carries BOTH a color and a distinct line style /
 * shape hint, so the distinctions never rely on color alone.
 */
import type { EdgeType, Layer } from "../../types";

export const LAYER_META: Record<
  Layer,
  { label: string; color: string; blurb: string }
> = {
  syntax: {
    label: "Syntax",
    color: "#2563eb",
    blurb: "Which strings are legal expressions.",
  },
  proof: {
    label: "Proof",
    color: "#7c3aed",
    blurb: "What is derivable from axioms by inference rules.",
  },
  semantics: {
    label: "Semantics",
    color: "#059669",
    blurb: "What is true in a structure / model.",
  },
  coding: {
    label: "Coding",
    color: "#d97706",
    blurb: "How syntax and proofs become numbers.",
  },
  metatheory: {
    label: "Metatheory",
    color: "#dc2626",
    blurb: "What we can prove about the theory from outside it.",
  },
};

/** Edge dash patterns give a non-color cue per relation family. */
export const EDGE_META: Record<EdgeType, { label: string; dash?: string }> = {
  formed_from: { label: "formed from" },
  parsed_as: { label: "parsed as" },
  has_subexpression: { label: "has subexpression" },
  binds_variable: { label: "binds variable", dash: "2 3" },
  premise_of: { label: "premise of" },
  concludes: { label: "concludes" },
  derived_by: { label: "derived by", dash: "2 3" },
  proves: { label: "proves" },
  interpreted_as: { label: "interpreted as", dash: "6 4" },
  evaluates_to: { label: "evaluates to", dash: "6 4" },
  satisfies: { label: "satisfies", dash: "6 4" },
  encodes_as: { label: "encodes as", dash: "1 4" },
  decodes_to: { label: "decodes to", dash: "1 4" },
  represents: { label: "represents", dash: "1 4" },
  proves_about: { label: "proves about", dash: "8 3 2 3" },
  extends: { label: "extends", dash: "8 3 2 3" },
  relates: { label: "relates" },
};
