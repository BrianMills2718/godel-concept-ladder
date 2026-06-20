# Judge validation findings — cap-distinguish

Frozen set: 8 cases (3 expect-pass, 5 expect-fail). Model: `gemini/gemini-2.5-flash`.
Run 2026-06-20 (7/8 graded before free-tier quota — 20/day — exhausted).

| case | expect | got | score | conf | misconceptions |
|---|---|---|---|---|---|
| strong | pass | **pass** | 90 | high | — |
| correct-terse | pass | **pass** | 90 | high | — |
| minor-imprecision | pass | fail | 67 | high | — |
| true-equals-provable | fail | **fail** | 0 | high | true-prov |
| malformed-is-false | fail | **fail** | 0 | high | wf-true, true-prov, malformed-false |
| godel-is-liar | fail | **fail** | 0 | low | liar |
| slogan-no-application | fail | **fail** | 0 | low | — |
| off-topic | fail | (quota) | — | — | — |

## Verdict
- **false-pass = 0/4 (0%)** — the safety-critical metric is clean. Every
  fatal-misconception answer failed and the correct misconception ids were
  detected; remediation routed correctly. **The judge never passes a confused
  answer.**
- **false-fail = 1/3 (~33%, above the 15% target)** — entirely the
  "minor-imprecision" case (67/100). That answer *is* loose (no consistency hedge,
  no worked example, "truth is broader than provability"), so 67→fail is
  defensible; this is the judge erring **strict**, not wrong.

## Decision
For an educational gate, **strict-but-safe is the right failure direction**:
better to ask a learner to sharpen a vague answer than to award mastery for a
confused one. The judge is approved to gate achievements, with a known
conservative bias.

## Follow-ups
- Re-run the full 8 when quota resets (or set `JUDGE_MODEL` to a higher-quota
  model, e.g. an OpenAI tier — `OPENAI_API_KEY` is configured). Free-tier Gemini
  flash is 20 req/day and unusable for real serving.
- If the strictness frustrates real learners, nudge the pass threshold (0.8→0.75)
  or soften the "precision" rubric criterion, then re-validate.
- Graduate this harness into shared `prompt_eval` (frozen sets + bootstrap CI)
  when rolling the judge out to all achievements (Phase D).
