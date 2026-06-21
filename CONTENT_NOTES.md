# Content correctness notes

The site's whole value is preventing category errors, so the *content itself*
must not commit subtler ones. The source spec (a ChatGPT outline) is loose in a
few places. These are the corrections to apply when authoring Stages 9–16, so we
don't propagate the spec's hand-waving.

## 1. First Incompleteness — separate the three conditions cleanly (Stage 15)
The spec's proof sketch ("if T proved G_T, T would prove a false claim") blurs
consistency, soundness, and ω-consistency. State precisely:

- **`T ⊬ G_T` needs only consistency.** If T proved G_T, then (since Prov_T
  correctly represents provability) T would prove `Prov_T(⌜G_T⌝)`, while G_T is
  `¬Prov_T(⌜G_T⌝)` — so T proves both a sentence and (a sentence implying) its
  negation. Contradiction. So consistency alone gives unprovability of G_T.
- **`T ⊬ ¬G_T` needs more.** Gödel's original used **ω-consistency**; **Rosser
  (1936)** strengthened the sentence so that plain **consistency** suffices for
  both directions. Mention Rosser; don't claim plain consistency gives the
  original G both ways.
- **`ℕ ⊨ G_T` (G_T is *true*) needs ONLY consistency — NOT soundness.** This is the
  subtle one, and the easy place to overclaim (an external review caught us doing
  exactly this, 2026-06-21). The reasoning, in two parts, *neither* being soundness
  of T:
  1. *Correct arithmetization* (needs only that T is effectively axiomatized):
     consistency gives no real proof of G_T, so `ℕ ⊨ ¬Prov_T(⌜G_T⌝)`.
  2. *The biconditional `G_T ↔ ¬Prov_T(⌜G_T⌝)` is a theorem of the **base**
     arithmetic* (Q/PA) via the Fixed-Point Lemma, not of T — so it holds in ℕ
     because `ℕ ⊨ PA`, regardless of whether `ℕ ⊨ T`.
  Combine: `ℕ ⊨ G_T`, from consistency alone. Soundness (`ℕ ⊨ T`) is **sufficient
  but not necessary**. Counterexample that must stay refutable: `T = PA + ¬Con(PA)`
  is consistent (Gödel 2) but unsound, and its Gödel sentence is still true in ℕ.
  **Do NOT write "G_T is true assuming T is sound" as if soundness were required.**
  It *is* still a metatheoretic claim (it lives in the metatheory, about the object
  theory) — flag *that*, not a soundness dependency.

It is fine and correct to say *soundness ⟹ everything T proves is true ⟹ Thm(T) ⊆
True(ℕ)* (the prov ⊆ true containment in the Stage 9/15 region diagram). That is a
different, legitimate use of soundness — keep it; just don't make the *truth of
G_T* depend on it. Keep the Stage 0 table honest: G_T's "true in ℕ" hedge is
"assuming T consistent" (the same hedge as unprovability), not "assuming soundness."

## 2. Diagonalization is the Fixed-Point Lemma, not casual self-reference (Stage 14)
The existence of a sentence with `G_T ↔ ¬Prov_T(⌜G_T⌝)` is **not** something you
just write down — it is guaranteed by the **Diagonal / Fixed-Point Lemma**: for
any formula `ψ(x)` with one free variable there is a sentence `G` with
`T ⊢ G ↔ ψ(⌜G⌝)`. Name the lemma. This is also the answer to "why isn't this the
liar paradox?" — the self-reference is a *theorem about coding*, fully rigorous,
not a semantic paradox. The site elsewhere warns against "magic self-reference";
Stage 14 must live up to that by citing the lemma rather than gesturing.

## 3. "Complete" is overloaded — disambiguate explicitly (Stage 9)
- **Gödel's Completeness Theorem (1929):** first-order logic is complete —
  `Γ ⊨ φ ⟹ Γ ⊢ φ` (semantic consequence = provability). About the *logic*.
- **Completeness of a theory:** for every sentence P, `T ⊢ P` or `T ⊢ ¬P`. About
  a *theory*. This is what the **Incompleteness** theorem denies for suitable T.
These are different notions; the site must say so where it introduces "complete."

## 4. Soundness vs consistency (Stage 9)
- **Consistency:** `T ⊬ (P ∧ ¬P)` — equivalently `T ⊬ 0=1`. Purely syntactic.
- **Soundness (w.r.t. ℕ):** `T ⊢ P ⟹ ℕ ⊨ P`. Semantic; strictly stronger
  (soundness ⟹ consistency, not conversely). Keep them distinct; the "no false
  theorems" gloss is soundness, not consistency.

## 5. Gödel numbering (Stage 12) — fine as illustration
The `2^a · 3^b · 5^c` prime-power coding is correct and standard for sequences;
flag it as illustrative (real systems differ in detail). Note explicitly: the
number does **not** "know" it codes a formula — the coding relation is fixed
externally by the scheme and then *represented* inside arithmetic by a formula.

## 6. Representability (Stages 13–15)
`Proof_T(p,q)` works because the proof-checking relation is **primitive
recursive**, hence **representable** in T. The chain is: proof-checking is
mechanical → primitive recursive → representable by an arithmetic formula. State
this rather than asserting "we can just write Proof_T."
