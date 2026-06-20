/**
 * Stage 16 — Second Incompleteness Theorem (final stage).
 * Con(T) := ¬Prov_T(⌜0=1⌝). A suitable consistent T cannot prove Con(T); the
 * argument is the *formalized* First Theorem (via the Hilbert–Bernays–Löb
 * derivability conditions). Adding Con(T) climbs the hierarchy; Gödel reapplies.
 */
import type { Lesson } from "../../types";

export const stage16: Lesson = {
  id: "stage-16",
  stage: 16,
  title: "Second Incompleteness Theorem",
  summary:
    "A consistent, computably axiomatized, strong enough T cannot prove its own consistency Con(T). A stronger theory can; and T+Con(T) — when it stays consistent (guaranteed for a sound base like PA) — is again subject to Gödel. No effective tower of sound theories ever captures all arithmetic truth.",
  prerequisites: ["stage-15"],
  objectives: [
    "Write $\\mathrm{Con}(T) := \\neg\\mathrm{Prov}_T(\\ulcorner 0=1\\urcorner)$.",
    "State that suitable consistent $T$ has $T\\nvdash\\mathrm{Con}(T)$.",
    "See the proof as the First Theorem formalized inside $T$.",
    "Explain why adding $\\mathrm{Con}(T)$ never permanently escapes incompleteness.",
  ],
  definitions: [
    { term: "Con(T)", short: "The arithmetic sentence saying @n{T} is consistent: @n{ConT} $=\\neg\\mathrm{Prov}_T(\\ulcorner 0=1\\urcorner)$ (no proof of a contradiction)." },
  ],
  sections: [
    {
      heading: "Consistency, as an arithmetic sentence",
      body: `Using the provability predicate, "$T$ is consistent" becomes a sentence *about numbers*:

$$\\mathrm{Con}(T) \\;:=\\; \\neg\\mathrm{Prov}_T(\\ulcorner 0=1\\urcorner)$$

— "there is no number coding a $T$-proof of $0=1$." It is an ordinary $\\Pi_1$ arithmetic statement, expressible inside $T$ itself.`,
    },
    {
      heading: "Statement",
      body: `**Second Incompleteness Theorem.** If $T$ is consistent, computably axiomatized, and strong enough (and proves the standard *derivability conditions*), then

$$T \\nvdash \\mathrm{Con}(T).$$

A consistent theory of this kind **cannot prove its own consistency**.`,
    },
    {
      heading: "Why — the First Theorem, formalized",
      body: `Step 1 of Stage 15 was a finitary argument: "if $T$ is consistent then $T\\nvdash G_T$", and since $G_T$ says $\\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$, this is really "$\\mathrm{Con}(T)$ implies $G_T$". That whole argument can be **carried out inside $T$** (this is what the Hilbert–Bernays–Löb derivability conditions guarantee), giving

$$T \\vdash \\mathrm{Con}(T) \\rightarrow G_T.$$

Now suppose $T\\vdash\\mathrm{Con}(T)$. Then $T\\vdash G_T$ — contradicting the First Theorem ($T\\nvdash G_T$ for consistent $T$). Hence $T\\nvdash\\mathrm{Con}(T)$. The second theorem is the first theorem, reflected inward.`,
    },
    {
      heading: "Stronger theories, and the endless climb",
      body: `A *stronger* theory $M$ may well prove $\\mathrm{Con}(T)$ — e.g. ZFC proves $\\mathrm{Con}(\\mathrm{PA})$. And we can always just adjoin it:

$$T' = T + \\mathrm{Con}(T).$$

$T'$ is strictly stronger (it proves something $T$ couldn't). **As long as $T'$ is still consistent** — which is guaranteed when $T$ is **sound** ($\\mathbb{N}\\models T$), as PA is — it is again computably axiomatized and strong enough, so **Gödel applies again**: $T'\\nvdash\\mathrm{Con}(T')$, and $T'$ has its own Gödel sentence. (The caveat matters: a consistent-but-unsound $T$ can prove $\\neg\\mathrm{Con}(T)$, in which case $T+\\mathrm{Con}(T)$ is *inconsistent* rather than stronger.) For sound base theories, iterate and you get an endless tower

$$T \\;\\subsetneq\\; T+\\mathrm{Con}(T) \\;\\subsetneq\\; T+\\mathrm{Con}(T)+\\mathrm{Con}(T+\\mathrm{Con}(T)) \\;\\subsetneq\\;\\cdots$$

each rung larger, **none** of them a consistent, computable, sufficiently strong theory that captures all arithmetic truth. That is the final shape of incompleteness.`,
    },
  ],
  visualizations: [
    {
      id: "stage16-hierarchy",
      kind: "typed-graph",
      title: "Adding Con(T) climbs forever",
      textualSummary:
        "Theory T cannot prove Con(T). Extending T to T+Con(T) — which stays consistent for a sound base like PA — gives a strictly stronger theory, but it too cannot prove its own consistency Con(T+Con(T)); extending again continues the tower. Each extension is larger, yet no rung is a consistent, computable, sufficiently strong theory that proves its own consistency or captures all arithmetic truth.",
      layers: ["proof", "metatheory"],
      nodes: [
        { id: "t0", type: "ObjectTheory", layer: "proof", label: "$T$", position: { x: 60, y: 30 }, note: "T ⊬ Con(T)" },
        { id: "t1", type: "ObjectTheory", layer: "proof", label: "$T+\\mathrm{Con}(T)$", position: { x: 60, y: 150 }, note: "⊬ Con(T+Con(T))" },
        { id: "t2", type: "ObjectTheory", layer: "proof", label: "$T+\\mathrm{Con}(T)+\\mathrm{Con}(\\cdots)$", position: { x: 60, y: 270 } },
        { id: "dots", type: "ObjectTheory", layer: "proof", label: "$\\cdots$ (forever)", position: { x: 60, y: 390 } },
        { id: "m", type: "MetaTheory", layer: "metatheory", label: "stronger $M$ (e.g. ZFC) proves $\\mathrm{Con}(\\mathrm{PA})$", position: { x: 420, y: 90 } },
      ],
      edges: [
        { id: "e1", source: "t0", target: "t1", type: "extends", label: "+Con(T)", layer: "proof" },
        { id: "e2", source: "t1", target: "t2", type: "extends", label: "+Con(·)", layer: "proof" },
        { id: "e3", source: "t2", target: "dots", type: "extends", layer: "proof" },
        { id: "e4", source: "m", target: "t0", type: "proves_about", label: "proves Con", layer: "metatheory" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "T can't prove Con(T) because Con(T) is false.",
      correction:
        "If $T$ is consistent, $\\mathrm{Con}(T)$ is *true* — it just isn't provable *in $T$*. Unprovability here is not falsehood.",
    },
    {
      misconception: "No theory can ever prove Con(PA).",
      correction:
        "A stronger theory can — ZFC proves $\\mathrm{Con}(\\mathrm{PA})$. The theorem only forbids a suitable theory from proving its *own* consistency.",
    },
    {
      misconception: "Adding Con(T) finally defeats incompleteness.",
      correction:
        "$T+\\mathrm{Con}(T)$ is a new consistent, computable, strong theory — so it has its own Gödel sentence and cannot prove its own consistency. The phenomenon recurs at every rung.",
    },
  ],
  quiz: [
    {
      id: "s16q1",
      type: "fill-in",
      prompt: "Complete the definition: $\\mathrm{Con}(T) := \\neg\\mathrm{Prov}_T(\\ulcorner\\,?\\,\\urcorner)$.",
      accepted: ["0=1", "0 = 1", "1=0"],
      placeholder: "a canonical contradiction",
      explanation:
        "$\\mathrm{Con}(T)=\\neg\\mathrm{Prov}_T(\\ulcorner 0=1\\urcorner)$: there is no $T$-proof of the contradiction $0=1$.",
    },
    {
      id: "s16q2",
      type: "multiple-choice",
      prompt: "Why can't a suitable consistent $T$ prove $\\mathrm{Con}(T)$?",
      options: [
        "Because $\\mathrm{Con}(T)$ is not expressible in arithmetic.",
        "Because $T\\vdash \\mathrm{Con}(T)\\to G_T$ (the formalized First Theorem); so $T\\vdash\\mathrm{Con}(T)$ would give $T\\vdash G_T$, contradicting $T\\nvdash G_T$.",
        "Because $T$ is inconsistent.",
        "Because $\\mathrm{Con}(T)$ is false.",
      ],
      correct: 1,
      explanation:
        "Formalizing 'consistency implies $G_T$' inside $T$ means proving $\\mathrm{Con}(T)$ would prove $G_T$ — impossible for consistent $T$.",
    },
    {
      id: "s16q3",
      type: "true-false",
      prompt: "True or false: a stronger theory than $T$ can prove $\\mathrm{Con}(T)$.",
      correct: true,
      explanation:
        "True. E.g. ZFC proves $\\mathrm{Con}(\\mathrm{PA})$. The barrier is only against a theory proving its *own* consistency.",
    },
    {
      id: "s16q4",
      type: "multiple-choice",
      prompt: "Does adding $\\mathrm{Con}(T)$ to $T$ permanently solve incompleteness?",
      options: [
        "Yes — $T+\\mathrm{Con}(T)$ is complete.",
        "No — $T+\\mathrm{Con}(T)$ is again consistent, computable, and strong, so it has its own Gödel sentence and cannot prove its own consistency.",
        "Yes — it becomes decidable.",
        "No — because it becomes inconsistent.",
      ],
      correct: 1,
      explanation:
        "Each (still-consistent) extension is a fresh target for Gödel: a new unprovable Gödel sentence and a new unprovable consistency statement. For a sound base like PA the tower stays consistent and never closes.",
    },
  ],
  masteryCheckpoint:
    "You can write $\\mathrm{Con}(T)$, explain why suitable consistent $T$ cannot prove it (the formalized First Theorem), and why climbing the $T+\\mathrm{Con}(T)$ tower never escapes incompleteness.",
};
