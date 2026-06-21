/**
 * Independent certifier (ROADMAP M4: the "dispose" authority). Runs the full gate
 * suite end-to-end and is the NON-AGENT run that certifies a proposed/edited instance
 * — the proposer≠certifier separation the methodology (§10, ADR-0005) demands. The
 * generation loop's proposer may *claim* green; this is what actually verifies it.
 *
 * Gates, in order (fail-fast): tsc + content validator + completeness (--gate) +
 * order-score tests + build (all via `npm run check`), then the artifact e2e gate
 * against a fresh `vite preview` of the built dist.
 *
 *   node scripts/certify.mjs
 */
import { spawn } from "node:child_process";

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: "inherit", ...opts });
    p.on("exit", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return true;
    } catch {/* not up yet */}
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

console.log("── certify: deterministic gates (npm run check) ──");
const checkCode = await run("npm", ["run", "check"]);
if (checkCode !== 0) {
  console.error("\n✗ CERTIFY FAIL — deterministic gates (tsc/validate/completeness/tests/build) did not pass.");
  process.exit(1);
}

console.log("\n── certify: artifact e2e gate (vite preview + puppeteer) ──");
const PORT = 4173;
const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
let e2eCode = 1;
try {
  const up = await waitForServer(`http://localhost:${PORT}/`);
  if (!up) {
    console.error("✗ CERTIFY FAIL — preview server did not start.");
  } else {
    e2eCode = await run("node", ["scripts/e2e-gate.mjs"], { env: { ...process.env, BASE: `http://localhost:${PORT}` } });
  }
} finally {
  preview.kill("SIGTERM");
}

if (e2eCode !== 0) {
  console.error("\n✗ CERTIFY FAIL — artifact e2e gate did not pass.");
  process.exit(1);
}
console.log("\n✓ CERTIFIED — all gates pass (deterministic + artifact e2e). Safe to ship / accept a proposal.");
