# Judge validation findings

> **ROADMAP M2d status (2026-06-21).** The runner `eval/run.py` is generalized to
> measure **every** judged task from one-file-per-task case sets in `eval/cases/`,
> and certifies only if all present tasks clear the bar. **Authored so far: 2 of 12**
> — `cap-distinguish` (measured PASS, below) and `cap-first` (authored, probing the
> soundness-vs-consistency precision; **not yet measured here** — no API key in this
> environment). The remaining **10** judged tasks (`cap-classify`, `cap-prove-224`,
> `cap-proof-graph`, `cap-evaluate-N`, `cap-sound-complete`, `cap-object-meta`,
> `cap-computability`, `cap-encode`, `cap-prov-predicate`, `cap-second`) still need
> frozen sets. **The measurement is blocked on `OPENROUTER_API_KEY`**: run
> `cd backend && python -m eval.run` with a key to certify all present sets. Until
> 12/12 are measured PASS, only `cap-distinguish` is a validated gate.

## cap-distinguish — measured

Frozen set: 8 cases (3 expect-pass, 5 expect-fail).

## Current result — `openrouter/openai/gpt-5-mini` (2026-06-20)
Full 8/8 graded (OpenRouter has credits; no free-tier daily cap).

| case | expect | got | score | conf | misconceptions |
|---|---|---|---|---|---|
| strong | pass | **pass** | 100 | high | — |
| correct-terse | pass | **pass** | 100 | high | — |
| minor-imprecision | pass | **pass** | 88 | medium | — |
| true-equals-provable | fail | **fail** | 0 | high | true-prov |
| malformed-is-false | fail | **fail** | 0 | low | wf-true, malformed-false |
| godel-is-liar | fail | **fail** | 0 | high | liar |
| slogan-no-application | fail | **fail** | 10 | low | — |
| off-topic | fail | **fail** | 0 | low | — |

**false-pass = 0/5 (0%); false-fail = 0/3 (0%). GATE: PASS.**
Every fatal-misconception answer failed with the correct misconception ids and
remediation routed; both clear-pass and the borderline-but-decent answer passed.
The judge is approved to gate achievements.

## Note on model choice
An earlier run on `gemini/gemini-2.5-flash` had a daily free-tier cap (20 req) and
was *over*-strict (false-failed the "minor-imprecision" case at 67). Switching the
default to OpenRouter (`OPENROUTER_API_KEY`, any model, real credits) both removed
the quota wall and improved calibration — that case now correctly passes at 88.
Cost ≈ $0.003/grade. Override with `JUDGE_MODEL`.

## Follow-ups
- Expand the frozen set per achievement as the judge rolls out (Phase D), and
  graduate this harness into shared `prompt_eval` (bootstrap CI) at scale.
