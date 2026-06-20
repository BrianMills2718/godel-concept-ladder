/**
 * Personalized goals (ADR-0001 Phase D, MVP). Map a free-text goal to an existing
 * achievement node via a static keyword ruleset; selecting it highlights that
 * achievement's prerequisite sub-DAG. (AI-generated trees are deferred — the data
 * model supports them, but v1 ships this deterministic mapping.)
 */
import { nodeById } from "./graph";

interface Rule {
  match: RegExp;
  goal: string;
}

// Order matters: more specific intents first.
const RULES: Rule[] = [
  { match: /second incomplete|own consistency|con\(|cannot prove.*consist/i, goal: "a-second" },
  { match: /first incomplete|incompleteness theorem|true but unprov|why.*unprov|truth outruns/i, goal: "a-first" },
  { match: /g[öo]?del sentence|diagonal|self.?ref|liar/i, goal: "a-godel-sentence" },
  { match: /prov_t|proof_t|provability predicate|proof.?check.*arith/i, goal: "a-prov-predicate" },
  { match: /coding|encode|arithmetiz|prime.?power|number.*proof/i, goal: "a-encode" },
  { match: /comput|decidable|undecidable|recursively enumerable|r\.e\./i, goal: "a-computability" },
  { match: /metatheor|object.*meta|meta.*object|about the theory/i, goal: "a-object-meta" },
  { match: /sound|complete|consisten/i, goal: "a-sound-complete" },
  { match: /truth.*proof|proof.*truth|provab.*\btrue|true.*provab|difference between.*(prov|true)|⊢|⊨/i, goal: "a-distinguish" },
  { match: /model|semantic|satisf|true in|structure|interpret/i, goal: "a-evaluate-N" },
  { match: /proof graph|proof tree|reachab|derivation/i, goal: "a-proof-graph" },
  { match: /2\s*\+\s*2|peano|prove.*arith|successor|numeral/i, goal: "a-prove-224" },
  { match: /classif|well.?form|formula|sentence|syntax|grammar|term/i, goal: "a-classify" },
];

export interface ResolvedGoal {
  goal: string;
  title: string;
}

/** Map free-text to an achievement goal, or null if nothing matches. */
export function resolveGoal(text: string): ResolvedGoal | null {
  const t = text.trim();
  if (!t) return null;
  for (const r of RULES) {
    if (r.match.test(t)) {
      const node = nodeById(r.goal);
      if (node) return { goal: r.goal, title: node.title };
    }
  }
  return null;
}
