/**
 * Content-completeness report (ROADMAP M1, rubric in docs/COMPLETENESS.md).
 *
 * Measures the instance against the EXPECTED-tier rubric and prints, per concept
 * and per stage, which owed fields are present/absent + coverage %. Non-failing by
 * design (a report, not a gate) until M3 promotes EXPECTED → hard-gated.
 *
 *   node scripts/completeness-report.mjs        # full table + summary
 *   node scripts/completeness-report.mjs --summary   # summary only
 */
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const out = join(tmpdir(), `godel-complete-${process.pid}.mjs`);
const stub = join(tmpdir(), `godel-complete-stub-${process.pid}.ts`);
writeFileSync(
  stub,
  `export { LESSONS } from ${JSON.stringify(process.cwd() + "/src/content/lessons/index.ts")};
   export { CONCEPT_GRAPH, DYNAMICAL_CONCEPTS, ANALOGY_APT_CONCEPTS, conceptsForStage, prerequisiteConceptsForStage } from ${JSON.stringify(process.cwd() + "/src/content/concepts.ts")};
   export { goalClosure, GOAL_CONCEPTS } from ${JSON.stringify(process.cwd() + "/src/content/derive.ts")};`,
);
await build({ entryPoints: [stub], bundle: true, format: "esm", outfile: out, logLevel: "error" });
const { LESSONS, CONCEPT_GRAPH, DYNAMICAL_CONCEPTS, ANALOGY_APT_CONCEPTS, conceptsForStage, prerequisiteConceptsForStage, goalClosure } =
  await import(pathToFileURL(out).href);

const summaryOnly = process.argv.includes("--summary");
const CONCEPTS = CONCEPT_GRAPH.concepts;
const core = goalClosure(); // set of core concept ids
const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

// stage -> does it have a ladder viz?
const stageHasLadder = (stageId) =>
  (lessonById[stageId]?.visualizations ?? []).some((v) => v.kind === "ladder");

// --- per-concept rows ---
const conceptRows = [];
for (const c of CONCEPTS) {
  const isCore = core.has(c.id);
  const isDyn = DYNAMICAL_CONCEPTS.has(c.id);
  const isAna = ANALOGY_APT_CONCEPTS.has(c.id);
  const checks = {
    example: !!c.example,
    microQuiz: !isCore ? null : !!(c.microQuiz && c.microQuiz.length), // null = n/a
    analogy: !isAna ? null : !!c.analogy,
    ladder: !isDyn ? null : stageHasLadder(c.introducedIn),
  };
  conceptRows.push({ id: c.id, stage: c.introducedIn, isCore, isDyn, isAna, checks });
}

// --- per-stage rows ---
const stageRows = [];
for (const l of LESSONS) {
  const ownPrereqs = prerequisiteConceptsForStage(l.id);
  const realPretest = ownPrereqs.length === 0 ? null : ownPrereqs.some((p) => p.microQuiz && p.microQuiz.length);
  const sectionRoles = (l.sections ?? []).length === 0 ? null : (l.sections ?? []).every((s) => !!s.role);
  stageRows.push({
    id: l.id,
    ladderIfDyn: conceptsForStage(l.id).some((c) => DYNAMICAL_CONCEPTS.has(c.id))
      ? stageHasLadder(l.id)
      : null,
    realPretest,
    sectionRoles,
  });
}

// --- printing helpers ---
const mark = (v) => (v === null ? "  –  " : v ? "  ✓  " : " MISS");
const pct = (rows, key) => {
  const applicable = rows.filter((r) => r.checks[key] !== null);
  const have = applicable.filter((r) => r.checks[key]).length;
  return applicable.length ? `${have}/${applicable.length} (${Math.round((100 * have) / applicable.length)}%)` : "n/a";
};

if (!summaryOnly) {
  console.log("=== per-concept completeness (EXPECTED tier) ===");
  console.log(["concept".padEnd(24), "stage".padEnd(9), "ex", "micro", "analogy", "ladder"].join(" "));
  for (const r of conceptRows) {
    console.log(
      [r.id.padEnd(24), r.stage.padEnd(9), mark(r.checks.example), mark(r.checks.microQuiz), mark(r.checks.analogy), mark(r.checks.ladder)].join(" "),
    );
  }
  console.log("\n=== per-stage completeness ===");
  console.log(["stage".padEnd(10), "ladder(if dyn)", "real-pretest", "section-roles"].join(" "));
  for (const r of stageRows) {
    console.log([r.id.padEnd(10), mark(r.ladderIfDyn).padEnd(14), mark(r.realPretest).padEnd(12), mark(r.sectionRoles)].join(" "));
  }
}

// --- summary ---
console.log("\n=== completeness summary ===");
console.log(`concepts: ${CONCEPTS.length}  |  core: ${core.size}  |  dynamical: ${DYNAMICAL_CONCEPTS.size}  |  analogy-apt: ${ANALOGY_APT_CONCEPTS.size}`);
console.log(`example coverage:   ${pct(conceptRows, "example")}`);
console.log(`microQuiz (core):   ${pct(conceptRows, "microQuiz")}`);
console.log(`analogy (apt):      ${pct(conceptRows, "analogy")}`);
console.log(`ladder (dynamical): ${pct(conceptRows, "ladder")}`);
const stagePct = (key) => {
  const app = stageRows.filter((r) => r[key] !== null);
  const have = app.filter((r) => r[key]).length;
  return app.length ? `${have}/${app.length} (${Math.round((100 * have) / app.length)}%)` : "n/a";
};
console.log(`stage ladder(dyn):  ${stagePct("ladderIfDyn")}`);
console.log(`real pretests:      ${stagePct("realPretest")}`);
console.log(`section roles:      ${stagePct("sectionRoles")}`);

// Missing list (no silent caps — name everything owed-but-absent)
const missing = [];
for (const r of conceptRows)
  for (const k of ["example", "microQuiz", "analogy", "ladder"])
    if (r.checks[k] === false) missing.push(`${r.id}: missing ${k}`);
for (const r of stageRows) {
  if (r.ladderIfDyn === false) missing.push(`${r.id}: missing ladder (introduces a dynamical concept)`);
  if (r.realPretest === false) missing.push(`${r.id}: pretest is banner-only (no prereq has a microQuiz)`);
  if (r.sectionRoles === false) missing.push(`${r.id}: sections missing roles`);
}
console.log(`\n=== owed (EXPECTED-tier gaps): ${missing.length} ===`);
for (const m of missing) console.log("  - " + m);
console.log(missing.length === 0 ? "\nALL GREEN — completeness rubric satisfied (ROADMAP M3)." : "");

// --gate: hard-fail (ROADMAP M3 promoted EXPECTED → gated once coverage hit 100%).
if (process.argv.includes("--gate") && missing.length) {
  console.error(`\n✗ completeness gate: ${missing.length} owed field(s) — see above`);
  process.exit(1);
}
