/**
 * Order-selection scorer (ROADMAP M2c, METHODOLOGY §9). A **pure** function that
 * scores a topological order of the concept graph against the secondary ordering
 * heuristics. It *scores*; it does not yet *choose* (choosing among valid orders is
 * the soft-optimization a future generator/LLM owns — §10). A topological order is
 * necessary but not sufficient; this quantifies "how good" a valid order is.
 *
 * Components (each normalized to [0,1], higher = better):
 *  - fanoutEarly       — high-fan-out prerequisites introduced early (they unblock most)
 *  - prereqLocality     — concepts appear soon after their prerequisites (ideas stay close)
 *  - checkCadence       — no long run of concepts without a self-check (microQuiz)
 *  - exampleAlternation — avoid stacking definition-only concepts (alternate with examples)
 *
 * An order that is NOT a valid topological order scores total = -1 (disqualified):
 * prerequisite satisfaction is the hard constraint, the heuristics are the soft one.
 */
import type { Concept } from "../types";

export interface OrderScore {
  valid: boolean;
  total: number; // valid: weighted sum of components in [0,1]; invalid: -1
  components: {
    fanoutEarly: number;
    prereqLocality: number;
    checkCadence: number;
    exampleAlternation: number;
  };
}

const WEIGHTS = { fanoutEarly: 0.35, prereqLocality: 0.3, checkCadence: 0.2, exampleAlternation: 0.15 };
const CHECK_RUN_CAP = 6; // a run longer than this without a check is fully penalized

export function scoreConceptOrder(order: string[], concepts: Concept[]): OrderScore {
  const byId = new Map<string, Concept>(concepts.map((c) => [c.id, c]));
  const pos = new Map<string, number>(order.map((id, i) => [id, i]));
  const N = order.length;
  const empty = { fanoutEarly: 0, prereqLocality: 0, checkCadence: 0, exampleAlternation: 0 };
  if (N <= 1) return { valid: true, total: 1, components: { ...empty, fanoutEarly: 1, prereqLocality: 1, checkCadence: 1, exampleAlternation: 1 } };

  // --- hard constraint: valid topological order (every prereq precedes its concept) ---
  let valid = true;
  for (const c of concepts) {
    if (!pos.has(c.id)) continue;
    for (const p of c.prerequisites)
      if (pos.has(p) && pos.get(p)! > pos.get(c.id)!) { valid = false; break; }
    if (!valid) break;
  }

  // --- fanoutEarly: high out-degree concepts placed early ---
  const fanout = new Map<string, number>(order.map((id) => [id, 0]));
  for (const c of concepts) for (const p of c.prerequisites) if (fanout.has(p)) fanout.set(p, fanout.get(p)! + 1);
  const earliness = (i: number) => (N - 1 - i) / (N - 1); // 1 at front, 0 at back
  let fSum = 0;
  for (const id of order) fSum += fanout.get(id)! * earliness(pos.get(id)!);
  // best possible: highest fan-outs at the front
  const fanSortedDesc = [...fanout.values()].sort((a, b) => b - a);
  let fBest = 0;
  fanSortedDesc.forEach((f, i) => (fBest += f * earliness(i)));
  const fanoutEarly = fBest > 0 ? fSum / fBest : 1;

  // --- prereqLocality: small gap between a concept and its latest prerequisite ---
  let gapSum = 0, gapCount = 0;
  for (const c of concepts) {
    if (!pos.has(c.id)) continue;
    const prereqPositions = c.prerequisites.filter((p) => pos.has(p)).map((p) => pos.get(p)!);
    if (!prereqPositions.length) continue;
    gapSum += pos.get(c.id)! - Math.max(...prereqPositions);
    gapCount++;
  }
  const avgGap = gapCount ? gapSum / gapCount : 1;
  const prereqLocality = Math.max(0, 1 - (avgGap - 1) / (N - 1)); // gap of 1 (adjacent) ≈ best

  // --- checkCadence: longest run without a microQuiz, capped ---
  let run = 0, maxRun = 0;
  for (const id of order) {
    const c = byId.get(id);
    if (c?.microQuiz?.length) run = 0;
    else { run++; maxRun = Math.max(maxRun, run); }
  }
  const checkCadence = 1 - Math.min(1, maxRun / CHECK_RUN_CAP);

  // --- exampleAlternation: fraction of adjacent pairs not both example-less ---
  let goodPairs = 0;
  for (let i = 1; i < N; i++) {
    const a = byId.get(order[i - 1]), b = byId.get(order[i]);
    if (a?.example || b?.example) goodPairs++;
  }
  const exampleAlternation = goodPairs / (N - 1);

  const components = { fanoutEarly, prereqLocality, checkCadence, exampleAlternation };
  if (!valid) return { valid: false, total: -1, components };
  const total =
    WEIGHTS.fanoutEarly * fanoutEarly +
    WEIGHTS.prereqLocality * prereqLocality +
    WEIGHTS.checkCadence * checkCadence +
    WEIGHTS.exampleAlternation * exampleAlternation;
  return { valid: true, total, components };
}
