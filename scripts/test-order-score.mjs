/**
 * Unit tests for the order-selection scorer (ROADMAP M2c). Bundles the TS module +
 * the concept graph via esbuild (like the other scripts) and asserts behavior.
 * Exit 1 on any failure.
 *
 *   node scripts/test-order-score.mjs
 */
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const out = join(tmpdir(), `godel-os-${process.pid}.mjs`);
const stub = join(tmpdir(), `godel-os-stub-${process.pid}.ts`);
writeFileSync(
  stub,
  `export { scoreConceptOrder } from ${JSON.stringify(process.cwd() + "/src/content/orderScore.ts")};
   export { CONCEPT_GRAPH, conceptTopoOrder } from ${JSON.stringify(process.cwd() + "/src/content/concepts.ts")};`,
);
await build({ entryPoints: [stub], bundle: true, format: "esm", outfile: out, logLevel: "error" });
const { scoreConceptOrder, CONCEPT_GRAPH, conceptTopoOrder } = await import(pathToFileURL(out).href);

let failed = 0;
const assert = (cond, msg) => { if (!cond) { console.error("  ✗ " + msg); failed++; } else console.log("  ✓ " + msg); };
const inUnit = (x) => x >= 0 && x <= 1;

// --- 1. real concept graph: the derived topo order is valid and scores well ---
const order = conceptTopoOrder();
const s = scoreConceptOrder(order, CONCEPT_GRAPH.concepts);
assert(s.valid, "derived topo order is a valid topological order");
assert(s.total > 0, `derived topo order total > 0 (got ${s.total.toFixed(3)})`);
assert(Object.values(s.components).every(inUnit), "all components in [0,1]");

// --- 2. reversing the order makes it INVALID (prereqs land after) → total -1 ---
const rev = [...order].reverse();
const sr = scoreConceptOrder(rev, CONCEPT_GRAPH.concepts);
assert(!sr.valid && sr.total === -1, "reversed order is disqualified (invalid, total -1)");
assert(s.total > sr.total, "valid order scores strictly above the invalid reversed order");

// --- 3. determinism ---
const s2 = scoreConceptOrder(order, CONCEPT_GRAPH.concepts);
assert(s.total === s2.total, "scoring is deterministic");

// --- 4. synthetic graph: high-fan-out concept earlier scores higher (fanoutEarly) ---
const syn = [
  { id: "a", term: "a", prerequisites: [], example: "x" },          // prereq of b,c (fanout 2)
  { id: "b", term: "b", prerequisites: ["a"], example: "x" },
  { id: "c", term: "c", prerequisites: ["a"], example: "x" },
  { id: "d", term: "d", prerequisites: [], example: "x" },            // independent
];
const early = scoreConceptOrder(["a", "b", "c", "d"], syn); // a (fanout 2) at front
const late = scoreConceptOrder(["d", "a", "b", "c"], syn);  // a one step later
assert(early.valid && late.valid, "both synthetic orders are valid");
assert(early.components.fanoutEarly >= late.components.fanoutEarly, "high-fan-out concept earlier ⇒ fanoutEarly not worse");
assert(early.total >= late.total, "putting the high-fan-out root first scores ≥ putting an independent node first");

// --- 5. example alternation: stacking example-less concepts lowers the component ---
const synNoEx = syn.map((c) => ({ ...c, example: undefined }));
const noEx = scoreConceptOrder(["a", "b", "c", "d"], synNoEx);
assert(noEx.components.exampleAlternation === 0, "all example-less ⇒ exampleAlternation 0");
assert(early.components.exampleAlternation === 1, "all-with-examples ⇒ exampleAlternation 1");

rmSync(out, { force: true });
rmSync(stub, { force: true });
if (failed) { console.error(`\n✗ order-score: ${failed} assertion(s) failed`); process.exit(1); }
console.log("\n✓ order-score: all assertions passed");
