/**
 * Propose → gate → revise generation loop (ROADMAP M4, ADR-0005). SCAFFOLD.
 *
 * The deterministic skeleton (the loop control + the DISPOSE step) is real and runs;
 * the PROPOSE and REVISE steps are agentic-coder calls (`llm_client`) and are stubbed
 * — they throw unless a real implementation is wired, because the LLM is the one part
 * that cannot be faked. This keeps the architecture honest: the gate is the authority,
 * the LLM only proposes within the envelope.
 *
 *   node scripts/generate.mjs --dry-run            # no proposal; just certify current state (proves wiring)
 *   node scripts/generate.mjs --target stage-7     # (requires a wired proposer) regenerate a target
 *
 * CONTRACT (what a wired implementation must satisfy):
 *   1. propose(target): an agentic coder reads the concept graph + rubric + gates and
 *      EDITS the source data files for `target` (lessons/concepts), then returns.
 *   2. dispose(): the independent certifier — `npm run certify` — run by THIS process,
 *      not the agent. Its verdict is authoritative; the agent's self-report is not.
 *   3. revise(failures): the agent is given the certifier's failures verbatim and
 *      edits again. Loop 2–3 until certified or maxRounds.
 *   4. efficacy check: regenerate a HELD-OUT stage and diff against the golden version
 *      (completeness + an independent judged-quality bar) — not just "it certifies".
 */
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const target = (args[args.indexOf("--target") + 1]) || null;
const MAX_ROUNDS = 4;

function certify() {
  return new Promise((resolve) => {
    const p = spawn("npm", ["run", "certify"], { stdio: "inherit" });
    p.on("exit", (code) => resolve(code ?? 1));
  });
}

// --- agentic steps: require llm_client (ADR-0005). Stubbed. ---
async function propose(_target) {
  throw new Error(
    "propose() not implemented: requires an llm_client agentic coder (ADR-0005). " +
    "It must edit the source data files for the target, then return so dispose() can certify.",
  );
}
async function revise(_failures) {
  throw new Error("revise() not implemented: requires an llm_client agentic coder (ADR-0005).");
}

async function main() {
  if (dryRun) {
    console.log("generate --dry-run: skipping propose/revise; running the DISPOSE step (certifier) on the current tree.\n");
    const code = await certify();
    console.log(code === 0 ? "\n✓ dry-run: current tree certifies (loop wiring OK)." : "\n✗ dry-run: current tree does not certify.");
    process.exit(code);
  }

  if (!target) { console.error("need --target <stageId> (or --dry-run)"); process.exit(2); }
  console.log(`generate: propose→gate→revise for ${target}\n`);
  await propose(target); // throws until wired
  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const code = await certify();
    if (code === 0) { console.log(`\n✓ ${target} certified in round ${round}.`); process.exit(0); }
    console.log(`\nround ${round}: not certified — revising…`);
    await revise("(certifier output above)"); // throws until wired
  }
  console.error(`\n✗ ${target} not certified after ${MAX_ROUNDS} rounds.`);
  process.exit(1);
}

await main();
