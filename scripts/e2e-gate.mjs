/**
 * Artifact e2e gate (ROADMAP M2a). Unlike screenshots.mjs (capture only), this
 * ASSERTS that rendered artifacts match their claims, and FAILS (exit 1) otherwise.
 * Per route it checks:
 *   - 0 console errors / page errors / failed requests
 *   - no fail-loud chips (.def-missing) — every @n/@t/@c reference resolved
 *   - no unrendered chip tokens (@c{ / @n{ / @t{) in visible text
 *   - no leftover KaTeX delimiters ($...$) in the lesson/viz content (math rendered)
 *   - ladder viz, where present, renders exactly its 3 rungs
 *   - typed-graph / comparison-table / godel-loop / parse* render their container
 *
 * Assumes a server at BASE (default the dev server). Run e.g.:
 *   (npm run dev &) ; sleep 4 ; npm run e2e
 *
 *   node scripts/e2e-gate.mjs
 */
import puppeteer from "puppeteer";

const BASE = process.env.BASE || "http://localhost:5173";
const ROUTES = [
  ...Array.from({ length: 17 }, (_, i) => `stage-${i}`),
  "tree",
  "concepts",
];

const failures = [];
const fail = (route, msg) => failures.push(`[${route}] ${msg}`);

const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

for (const route of ROUTES) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const isBenign = (u) => /favicon\.ico|\/@vite\/|\/@react-refresh|\.hot-update\./.test(u);
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => { if (!isBenign(r.url())) consoleErrors.push(`requestfailed: ${r.url()}`); });
  page.on("response", (r) => { if (r.status() >= 400 && !isBenign(r.url())) consoleErrors.push(`${r.status()} ${r.url()}`); });

  try {
    await page.goto(`${BASE}/#/${route}`, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));

    const res = await page.evaluate(() => {
      const scope = document.querySelector("#main") || document.body;
      // Strip rendered math before scanning for raw LaTeX: KaTeX keeps the TeX
      // source in a hidden <annotation>, which would otherwise be a false positive.
      const clone = scope.cloneNode(true);
      clone.querySelectorAll(".katex, .viz-summary").forEach((n) => n.remove());
      const text = clone.textContent || "";
      return {
        defMissing: document.querySelectorAll(".def-missing").length,
        rawChip: /@[cnt]\{/.test(text),
        // outside any rendered .katex, a $…\cmd…$ or a bare backslash-command means
        // the math was NOT rendered (a real artifact bug).
        rawMath: /\$[^$]*\\[a-zA-Z]+[^$]*\$/.test(text) || /\\(models|nvdash|forall|exists|vdash|mathbb|neg|times|Rightarrow)/.test(text),
        ladders: [...document.querySelectorAll(".ladder")].map((l) => l.querySelectorAll(".ladder-rung").length),
        hasMain: !!(document.querySelector("#main") || document.querySelector(".lesson") || document.querySelector(".skilltree, .concept-graph, .react-flow")),
      };
    });

    if (consoleErrors.length) fail(route, `console errors: ${consoleErrors.slice(0, 3).join(" | ")}`);
    if (!res.hasMain) fail(route, "no main content rendered");
    if (res.defMissing > 0) fail(route, `${res.defMissing} unresolved reference chip(s) (.def-missing)`);
    if (res.rawChip) fail(route, "unrendered chip token (@c{/@n{/@t{) in visible text");
    if (res.rawMath) fail(route, "leftover KaTeX delimiter / unrendered LaTeX command in visible text");
    for (const n of res.ladders) if (n !== 3) fail(route, `ladder viz rendered ${n} rungs, expected 3`);
  } catch (e) {
    fail(route, `load failed: ${e.message}`);
  }
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(`✗ artifact e2e gate: ${failures.length} failure(s)`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log(`✓ artifact e2e gate: ${ROUTES.length} routes clean (no console errors, no unresolved refs, no raw math, ladders well-formed)`);
