/**
 * Client for the LLM judge backend (Phase C). The frontend sends only
 * {taskId, answer}; the backend is rubric-authoritative and recomputes pass/fail.
 * If the backend is unreachable, callers degrade to a deterministic + explicit
 * self-attest flow: open-ended achievements can then be *self-attested* by the
 * learner (never silently auto-passed), and such claims are recorded as
 * `selfAttested` in the progress store and shown as "Self-attested (not AI-graded)"
 * — kept distinct from a real judged verdict.
 */
import type { JudgeResult } from "../types";

const BASE = (import.meta.env.VITE_JUDGE_URL as string | undefined) ?? "http://localhost:8000";

export async function gradeAnswer(taskId: string, answer: string): Promise<JudgeResult> {
  const res = await fetch(`${BASE}/api/grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId, answer }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`grade failed (${res.status}): ${detail.slice(0, 120)}`);
  }
  return (await res.json()) as JudgeResult;
}

export async function judgeAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
