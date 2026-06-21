# Content-completeness rubric (ROADMAP M1)

What "complete, high-quality content" means as a **checkable spec** — the target a
generator must hit and a human can audit. `scripts/completeness-report.mjs` measures
the instance against this; `npm run completeness` prints the per-concept/stage table
and coverage numbers.

Two requirement tiers (the bar **ratchets up** — see ROADMAP M1/M3):
- **REQUIRED (hard-gated now)** — enforced by `scripts/validate-content.mjs`; the
  build fails without it.
- **EXPECTED (report-warns now)** — surfaced by the completeness report as gaps;
  becomes hard-gated at **M3** once coverage reaches 100%.

## Per concept

| Field | Tier | Applies to | Rule |
|---|---|---|---|
| `short` definition | REQUIRED | all | first-encounter readable; `@c{}` refs closed (transitive prereqs) |
| `example` | EXPECTED | all | a concrete instance from the running cast |
| `microQuiz` (≥1 item) | EXPECTED | **core** concepts (on a goal's backward closure) | a self-check; each item tagged with `concepts` + the `misconceptions` it probes |
| `analogy` | EXPECTED | **analogy-apt** concepts (`ANALOGY_APT_CONCEPTS`) | `{domain, mapping, breakdown}` (+ optional `handoff`); out-of-domain, bounded, retired at breakdown |
| `prerequisites` justified + kinded | REQUIRED | all | every edge has `PREREQ_WHY` + valid `PREREQ_KIND` |
| Tier-1 edge verdict | EXPECTED (M3) | every prerequisite edge | reviewed correct/arguable/wrong in `EDGE_REVIEW.md` |

## Per stage (lesson)

| Field | Tier | Rule |
|---|---|---|
| ≥3 quiz, ≥1 viz, ≥2 confusions, mastery checkpoint | REQUIRED | gated in `validate-content.mjs` |
| `ladder` visualization | EXPECTED | required **iff** the stage introduces a **dynamical** concept (`DYNAMICAL_CONCEPTS`) |
| section `role`s | EXPECTED | sections tagged `problem`/`solution`/`show`/`tell` (show-then-tell made explicit) |
| real prerequisite pretest | EXPECTED | every page with out-of-page prereqs has ≥1 prereq concept carrying a `microQuiz` (so the pretest is a real check, not a banner) |
| no bare-prose forward requirement | EXPECTED (M2b) | requirement-bearing terms are typed `@t{}`/`@c{}` |

## The apt-flag sets (centrally maintained in `concepts.ts`, no silent omissions)

- **`DYNAMICAL_CONCEPTS`** — parameterized concepts with emergent behavior that
  warrant the ladder recipe (ADR-0006 §6). A concept here ⇒ its introducing stage
  must carry a `ladder` viz.
- **`ANALOGY_APT_CONCEPTS`** — concepts with a natural bounded out-of-domain analogy
  (ADR-0006 §3). A concept here ⇒ it must carry a `Concept.analogy`.

These lists are the spec for *where* the optional devices are owed. Extending a list
(e.g. flagging a new dynamical concept) raises the bar for that concept — deliberately.

## Definition of "instance complete" (M3 exit)

The completeness report is **all-green** — for every concept: example present;
microQuiz present if core; analogy present if analogy-apt — and for every stage:
ladder present if it introduces a dynamical concept; section roles present; a real
pretest where out-of-page prereqs exist — **and** `EDGE_REVIEW.md` has a Tier-1
verdict for all 106 edges. At that point the EXPECTED tier is promoted to hard-gated.
