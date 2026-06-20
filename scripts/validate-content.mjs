/**
 * Content validator. Bundles the lesson + glossary modules with esbuild (already
 * present as a Vite dependency) and asserts structural invariants that the type
 * system can't fully enforce at the value level:
 *   - stages 0..16 all present, unique ids
 *   - quiz answer indices in range; classification correctBuckets exist
 *   - typed-graph edges reference existing node ids
 *   - every visualization has a non-empty textualSummary (a11y fallback)
 *
 * Run: node scripts/validate-content.mjs
 */
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const out = join(tmpdir(), `godel-content-${process.pid}.mjs`);

// Bundle a tiny stub that re-exports the two modules we want to inspect.
// (esbuild handles extensionless + .ts imports + `import type` for us.)
const stub = join(tmpdir(), `godel-stub-${process.pid}.ts`);
writeFileSync(
  stub,
  `export { LESSONS } from ${JSON.stringify(process.cwd() + "/src/content/lessons/index.ts")};
   export { GLOSSARY } from ${JSON.stringify(process.cwd() + "/src/content/glossary.ts")};
   export { NOTATION } from ${JSON.stringify(process.cwd() + "/src/content/notation.ts")};`,
);
await build({
  entryPoints: [stub],
  bundle: true,
  format: "esm",
  outfile: out,
  logLevel: "error",
});

const { LESSONS, GLOSSARY, NOTATION } = await import(pathToFileURL(out).href);

const errors = [];
const ok = (cond, msg) => { if (!cond) errors.push(msg); };

// Every @n{key}/@t{slug} reference must resolve — no undefined symbols (fail loud).
const notationKeys = new Set(Object.keys(NOTATION));
const glossarySlugs = new Set(GLOSSARY.map((g) => g.term.toLowerCase()));
const TOKEN_RE = /@n\{([^}]+)\}|@t\{([^}|]+)(?:\|[^}]+)?\}/g;
for (const l of LESSONS) {
  const strings = [
    l.summary, l.masteryCheckpoint, ...l.objectives,
    ...l.definitions.flatMap((d) => [d.short, d.expanded ?? "", d.example ?? ""]),
    ...l.sections.map((s) => s.body),
    ...l.confusions.flatMap((c) => [c.misconception, c.correction]),
    ...l.quiz.map((q) => q.prompt + " " + (q.explanation ?? "")),
  ];
  for (const s of strings) {
    for (const m of s.matchAll(TOKEN_RE)) {
      if (m[1]) ok(notationKeys.has(m[1]), `stage ${l.stage}: @n{${m[1]}} not in NOTATION`);
      if (m[2]) ok(glossarySlugs.has(m[2].toLowerCase()), `stage ${l.stage}: @t{${m[2]}} not in glossary`);
    }
  }
}

// Stage coverage + unique ids
const stages = LESSONS.map((l) => l.stage);
for (let s = 0; s <= 16; s++) ok(stages.includes(s), `missing stage ${s}`);
const ids = new Set();
for (const l of LESSONS) {
  ok(!ids.has(l.id), `duplicate lesson id ${l.id}`);
  ids.add(l.id);
  ok(l.quiz.length >= 3, `stage ${l.stage}: <3 quiz questions`);
  ok(l.visualizations.length >= 1, `stage ${l.stage}: no visualization`);
  ok(l.confusions.length >= 2, `stage ${l.stage}: <2 confusion boxes`);
  ok(!!l.masteryCheckpoint, `stage ${l.stage}: no mastery checkpoint`);

  // Visualizations
  for (const v of l.visualizations) {
    ok(!!v.textualSummary && v.textualSummary.length > 20, `stage ${l.stage} viz ${v.id}: weak/missing textualSummary`);
    if (v.kind === "typed-graph") {
      const nodeIds = new Set(v.nodes.map((n) => n.id));
      for (const e of v.edges) {
        ok(nodeIds.has(e.source), `stage ${l.stage} viz ${v.id}: edge ${e.id} bad source ${e.source}`);
        ok(nodeIds.has(e.target), `stage ${l.stage} viz ${v.id}: edge ${e.id} bad target ${e.target}`);
      }
    }
    if (v.kind === "comparison-table") {
      for (const row of v.rows)
        for (const c of Object.keys(row.cells))
          ok(v.columns.includes(c), `stage ${l.stage} viz ${v.id}: row cell column "${c}" not in columns`);
    }
  }

  // Quiz answer integrity
  for (const q of l.quiz) {
    if (q.type === "multiple-choice")
      ok(q.correct >= 0 && q.correct < q.options.length, `stage ${l.stage} ${q.id}: correct index OOR`);
    if (q.type === "multi-select")
      for (const i of q.correct) ok(i >= 0 && i < q.options.length, `stage ${l.stage} ${q.id}: multi index OOR`);
    if (q.type === "classification") {
      for (const it of q.items)
        ok(q.buckets.includes(it.correctBucket), `stage ${l.stage} ${q.id}: bucket "${it.correctBucket}" missing`);
    }
    if (q.type === "matching") {
      const rids = new Set(q.right.map((r) => r.id));
      for (const l2 of q.left)
        ok(rids.has(q.pairs[l2.id]), `stage ${l.stage} ${q.id}: pair for ${l2.id} -> unknown right`);
    }
    if (q.type === "fill-in")
      ok(Array.isArray(q.accepted) && q.accepted.length > 0, `stage ${l.stage} ${q.id}: no accepted answers`);
    ok(!!q.explanation, `stage ${l.stage} ${q.id}: no explanation`);
  }
}

// Glossary uniqueness
const gterms = new Set();
for (const g of GLOSSARY) {
  ok(!gterms.has(g.term.toLowerCase()), `duplicate glossary term ${g.term}`);
  gterms.add(g.term.toLowerCase());
}

rmSync(out, { force: true });
rmSync(stub, { force: true });

if (errors.length) {
  console.error(`✗ content validation: ${errors.length} problem(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ content valid: ${LESSONS.length} stages, ${GLOSSARY.length} glossary terms, ${Object.keys(NOTATION).length} symbols, all quizzes/graphs/@refs consistent`);
