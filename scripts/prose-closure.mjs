/**
 * Bare-prose closure linter (ROADMAP M2b). The typed-closure gate only sees
 * @t{}/@c{} references; this catches the hole (METHODOLOGY §6/§17): a concept term
 * named in *plain prose* before it is introduced (a forward reference the typed
 * gate can't see). Strips chips / math / code first, then flags whole-word mentions
 * of a NOT-YET-INTRODUCED concept term, minus an allowlist of terms too common to
 * flag (ordinary English) and deliberate previews.
 *
 *   node scripts/prose-closure.mjs            # report
 *   node scripts/prose-closure.mjs --gate     # exit 1 on any flag (for CI)
 */
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const out = join(tmpdir(), `godel-prose-${process.pid}.mjs`);
const stub = join(tmpdir(), `godel-prose-stub-${process.pid}.ts`);
writeFileSync(
  stub,
  `export { LESSONS } from ${JSON.stringify(process.cwd() + "/src/content/lessons/index.ts")};
   export { CONCEPT_GRAPH } from ${JSON.stringify(process.cwd() + "/src/content/concepts.ts")};`,
);
await build({ entryPoints: [stub], bundle: true, format: "esm", outfile: out, logLevel: "error" });
const { LESSONS, CONCEPT_GRAPH } = await import(pathToFileURL(out).href);

const gate = process.argv.includes("--gate");

// Terms too common (ordinary English) or structural to flag as forward-references.
// These appear in prose informally long before/independently of their concept node.
const ALLOW = new Set([
  "object", "string", "term", "model", "structure", "proof", "theorem", "grammar",
  "parser", "sentence", "formula", "variable", "symbol", "axiom", "alphabet",
  "complete", "completeness", "consistent", "consistency", "sound", "soundness",
  "true", "interpretation", "semantic", "syntactic", "decidable", "provability",
  "representable", "numeral", "contradiction", "well-formed",
]);

const EXEMPT_STAGES = new Set(["stage-0"]); // orientation previews deliberately

// stage order index for "introduced before"
const stageIdx = Object.fromEntries(LESSONS.map((l, i) => [l.id, l.stage]));
const concepts = CONCEPT_GRAPH.concepts;

// strip @-chips (and their payload), $…$ / $$…$$ math, and `code`
const strip = (s) =>
  (s || "")
    .replace(/@[ntc]\{[^}]*\}/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/`[^`]*`/g, " ");

const proseOf = (l) =>
  strip(
    [
      l.summary,
      ...(l.objectives ?? []),
      ...(l.sections ?? []).map((s) => `${s.heading ?? ""} ${s.body}`),
      ...(l.definitions ?? []).flatMap((d) => [d.short, d.expanded ?? "", d.example ?? ""]),
      ...(l.confusions ?? []).flatMap((c) => [c.misconception, c.correction]),
    ].join("\n"),
  );

const flags = [];
for (const l of LESSONS) {
  if (EXEMPT_STAGES.has(l.id)) continue;
  const prose = proseOf(l);
  const foreshadowed = new Set(l.foreshadows ?? []);
  for (const c of concepts) {
    if (ALLOW.has(c.id) || ALLOW.has(c.term.toLowerCase()) || foreshadowed.has(c.id)) continue;
    // future = introduced at a later stage than this lesson
    if (!(stageIdx[c.introducedIn] > l.stage)) continue;
    const term = c.term;
    const re = new RegExp(`(?<![\\w-])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`, "i");
    if (re.test(prose)) flags.push(`${l.id}: forward-references "${term}" (introduced at ${c.introducedIn}) in plain prose — type it @c{${c.id}} or reword`);
  }
}

console.log(`=== bare-prose closure: ${flags.length} forward-reference(s) ===`);
for (const f of flags) console.log("  - " + f);
if (flags.length === 0) console.log("clean — no plain-prose forward references to un-introduced concepts.");
if (gate && flags.length) process.exit(1);
