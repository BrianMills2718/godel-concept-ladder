/**
 * Concept dependency DAG (ADR-0002).
 *
 * Each entry is a first-class *idea* with explicit `prerequisites` — the other
 * concepts you must already grasp to understand this one. This is the fine
 * substrate beneath the stage-level skill DAG (src/content/graph.ts): a stage
 * node encapsulates the concepts whose `introducedIn` is that stage.
 *
 * INVARIANTS (enforced in scripts/validate-content.mjs):
 *   - acyclic over `prerequisites` (no definitional cycles)
 *   - every `@c{id}` used in a `short`/`expanded` is a TRANSITIVE prerequisite
 *     (so a definition can't name an idea it hasn't declared a dependency on)
 *   - a prerequisite's `introducedIn` is the same stage or a prerequisite stage
 *
 * This slice covers the Stage 0–2 atoms (the grammatical ladder) plus the three
 * proof-orientation ideas (axiom / inference rule / formal theory) that Stage 0
 * name-drops. `@n{}` (notation.ts) symbols are always-available primitives.
 */
import type { Concept, ConceptGraph } from "../types";

const CONCEPTS: Concept[] = [
  // --- primitives (no prior concept) ---
  {
    id: "symbol",
    term: "symbol",
    layer: "syntax",
    primitive: true,
    short:
      "A single atomic character of the formal language — the smallest piece, written on the page but not yet meaning anything on its own.",
    example: "$0$, $S$, $+$, $=$, and the variable $x$ are each one symbol.",
    prerequisites: [],
    contrasts: ["object"],
    introducedIn: "stage-1",
  },
  {
    id: "object",
    term: "object",
    layer: "semantics",
    primitive: true,
    short:
      "A thing the theory talks *about* — not a mark on the page. For arithmetic the objects are the numbers $0, 1, 2, \\dots$ themselves.",
    expanded:
      "Keep the mark and the thing apart: the symbol string $S(S(0))$ is written with ink; the object it names is the number two. Stages 6–7 make 'the objects' precise as the domain of a structure; here it is enough that arithmetic talks about numbers.",
    example: "The numeral $S(S(0))$ is a string of symbols; the object it names is the number $2$.",
    prerequisites: [],
    contrasts: ["symbol"],
    introducedIn: "stage-1",
  },

  // --- the alphabet and strings ---
  {
    id: "variable",
    term: "variable",
    layer: "syntax",
    short:
      "A @c{symbol} such as $x, y, z$ that stands in for an unspecified @c{object}, the way a pronoun stands in for a noun.",
    example: "$x$ in $x + 0 = x$.",
    prerequisites: ["symbol", "object"],
    introducedIn: "stage-1",
  },
  {
    id: "alphabet",
    term: "alphabet",
    layer: "syntax",
    short: "The fixed, finite stock of @c{symbol}s a formal language is allowed to use — nothing else is legal.",
    example: "Arithmetic's alphabet: $0,\\ S,\\ +,\\ \\times,\\ =,\\ \\neg,\\ \\wedge,\\ \\vee,\\ \\rightarrow,\\ \\forall,\\ \\exists,\\ (,\\ )$ and variables.",
    prerequisites: ["symbol"],
    introducedIn: "stage-1",
  },
  {
    id: "string",
    term: "string",
    layer: "syntax",
    short:
      "Any finite sequence of @c{symbol}s, legal or gibberish. Being a string is a very low bar — it says nothing about being legal (well-formed).",
    example: "Both $\\forall x(x+0=x)$ and the gibberish $\\forall{+}{=}x))0$ are strings.",
    prerequisites: ["symbol"],
    introducedIn: "stage-1",
  },

  // --- the grammar: rules, well-formedness, parse trees ---
  {
    id: "formation-rule",
    term: "formation rule",
    layer: "syntax",
    short:
      "A grammar rule that either declares a legal expression directly (e.g. '$0$ is a term') or builds a larger one out of smaller legal pieces (e.g. 'if $t$ is a term, then $S(t)$ is a term').",
    expanded:
      "The whole grammar is just a short list of such rules. An expression is legal exactly when some sequence of rules produces it — that is what 'well-formed' will mean — and the record of which rules were used is its parse tree.",
    example: "Term rules: $0$ is a term; if $t$ is a term so is $S(t)$; if $s,t$ are terms so are $(s+t)$ and $(s\\times t)$.",
    prerequisites: ["symbol"],
    introducedIn: "stage-1",
  },
  {
    id: "well-formed",
    term: "well-formed",
    layer: "syntax",
    short:
      "A @c{string} is well-formed when the @c{formation-rule}s can build it step by step. Malformed means no sequence of rules produces it — so it is not a term or a formula at all, and the question of truth never even arises.",
    example: "$\\forall x(x+0=x)$ is well-formed; $\\forall{+}{=}x))0$ is malformed.",
    prerequisites: ["string", "formation-rule"],
    introducedIn: "stage-1",
  },
  {
    id: "parse-tree",
    term: "parse tree",
    layer: "syntax",
    short:
      "The tree that records how the @c{formation-rule}s build a @c{well-formed} expression: the whole expression at the root, single @c{symbol}s at the leaves. A malformed string has no such tree.",
    example: "$\\forall x(x+0=x)$: a quantifier over the formula $x+0=x$, whose left side is the term $x+0$.",
    prerequisites: ["formation-rule", "well-formed"],
    introducedIn: "stage-1",
  },

  // --- terms vs formulas vs sentences ---
  {
    id: "term",
    term: "term",
    layer: "syntax",
    short:
      "A @c{well-formed} string that *names* an @c{object} (a number). A term is a noun phrase, so it is never true or false on its own.",
    expanded:
      "Terms are built by the term @c{formation-rule}s: $0$ and each @c{variable} are terms; @n{succ} of a term is a term; a sum or product of terms is a term.",
    example: "$0$, $S(0)$, $x + S(0)$.",
    prerequisites: ["well-formed", "variable", "object"],
    introducedIn: "stage-1",
    microQuiz: [
      {
        id: "mq-term-1",
        type: "true-false",
        prompt: "True or false: the term $S(S(0))$ is true.",
        correct: false,
        explanation:
          "A term names an object (here the number 2); it is a noun phrase, not a claim, so 'true/false' does not apply to it. Only formulas and sentences carry truth values.",
      },
    ],
  },
  {
    id: "atomic-formula",
    term: "atomic formula",
    layer: "syntax",
    short:
      "The simplest @c{well-formed} claim: two @c{term}s joined by $=$, asserting the two terms name the same @c{object}.",
    example: "$x + 0 = x$ and $S(0) = S(0)$ are atomic formulas.",
    prerequisites: ["term"],
    introducedIn: "stage-1",
  },
  {
    id: "formula",
    term: "formula",
    layer: "syntax",
    short:
      "A @c{well-formed} expression that is true or false once an interpretation is fixed and its free variables are assigned. Built from @c{atomic-formula}s with @n{neg}, @n{and}, @n{or}, @n{implies} and the quantifiers @n{forall}/@n{exists}.",
    example: "$x + 0 = x$, and $\\neg(2+2=5)$.",
    // The recursion 'a formula can be ∀x P' is INDUCTIVE, not a prerequisite
    // cycle: it bottoms out at atomic formulas, so `formula` depends only on
    // `atomic-formula`. `quantifier` (the binding construct) then depends on
    // `formula`. Acyclic — see ADR-0004 on why cycles signal under-decomposition.
    prerequisites: ["atomic-formula", "well-formed"],
    introducedIn: "stage-1",
  },
  {
    id: "quantifier",
    term: "quantifier",
    layer: "syntax",
    short:
      "@n{forall} ('for every') or @n{exists} ('there exists') placed in front of a @c{formula}, binding a @c{variable} so the formula speaks about all (or some) @c{object}s.",
    example: "$\\forall x\\,(x+0=x)$ binds $x$.",
    prerequisites: ["formula", "variable"],
    introducedIn: "stage-1",
  },
  {
    id: "bound-variable",
    term: "bound variable",
    layer: "syntax",
    short: "A @c{variable} occurrence governed by a @c{quantifier} ($\\forall x$ or $\\exists x$).",
    example: "$x$ is bound in $\\forall x(x+0=x)$.",
    prerequisites: ["variable", "quantifier"],
    contrasts: ["free-variable"],
    introducedIn: "stage-1",
  },
  {
    id: "free-variable",
    term: "free variable",
    layer: "syntax",
    short:
      "A @c{variable} occurrence *not* bound by any @c{quantifier}. A free variable leaves the expression's truth value undetermined — it is not yet a definite claim.",
    example: "$x$ is free in $x+0=x$; binding it as $\\forall x(x+0=x)$ removes the freedom.",
    prerequisites: ["variable", "quantifier"],
    contrasts: ["bound-variable"],
    introducedIn: "stage-1",
    microQuiz: [
      {
        id: "mq-free-1",
        type: "true-false",
        prompt: "True or false: $x + 0 = x$ has a free variable, so it is not yet a sentence.",
        correct: true,
        explanation:
          "$x$ is free (no quantifier binds it), so the expression is an open formula, not a sentence. Binding it — $\\forall x(x+0=x)$ — makes it a sentence.",
      },
    ],
  },
  {
    id: "sentence",
    term: "sentence",
    layer: "syntax",
    short:
      "A @c{formula} with no @c{free-variable}s. Only sentences have a definite truth value, which is why both proof (@n{turnstile}) and truth (@n{models}) want sentences.",
    example: "$\\forall x(x+0=x)$ is a sentence; the open formula $x+0=x$ is not.",
    prerequisites: ["formula", "free-variable"],
    introducedIn: "stage-1",
  },

  // --- Stage 2: grammar as one rule set, read two ways ---
  {
    id: "grammar",
    term: "grammar",
    layer: "syntax",
    short:
      "The fixed set of @c{formation-rule}s that decides which @c{string}s are @c{well-formed} — and says nothing about whether they are true or provable.",
    example: "Arithmetic's grammar accepts both $2+2=4$ and $2+2=5$: each is $(s=t)$ with $s,t$ terms.",
    prerequisites: ["formation-rule", "well-formed"],
    introducedIn: "stage-2",
  },
  {
    id: "parser",
    term: "parser",
    layer: "syntax",
    short:
      "A procedure that reads a @c{string} and decides whether the @c{grammar} accepts it — outputting legal or illegal. It certifies @c{well-formed}ness only, never truth.",
    example: "$\\forall x(x=x)$ → parser → legal; $\\forall{+}{=}x))0$ → illegal.",
    prerequisites: ["grammar", "well-formed"],
    introducedIn: "stage-2",
    microQuiz: [
      {
        id: "mq-parser-1",
        type: "multiple-choice",
        prompt: "What does a parser decide about $2+2=5$?",
        options: [
          "That it is false.",
          "That it is legal (well-formed) — truth is a separate question.",
          "That it is unprovable.",
        ],
        correct: 1,
        explanation:
          "A parser certifies legality only. $2+2=5$ parses fine; that it is false is a semantic fact, decided elsewhere.",
      },
    ],
  },

  // --- proof-orientation ideas Stage 0 name-drops (taught at Stage 3) ---
  {
    id: "axiom",
    term: "axiom",
    layer: "proof",
    short:
      "A @c{sentence} a theory takes as a starting assumption — accepted without proof and used to derive everything else.",
    example: "$\\forall x(x+0=x)$ is one of PA's axioms.",
    prerequisites: ["sentence"],
    introducedIn: "stage-3",
  },
  {
    id: "inference-rule",
    term: "inference rule",
    layer: "proof",
    short:
      "A rule that lets you write down a new @c{formula} once you already have certain ones — e.g. modus ponens: from $P$ and $P \\rightarrow Q$, infer $Q$.",
    example: "From $2+2=4$ and $2+2=4 \\rightarrow 4=4$, infer $4=4$.",
    prerequisites: ["formula"],
    introducedIn: "stage-3",
  },
  {
    id: "formal-theory",
    term: "formal theory",
    layer: "proof",
    short:
      "A fixed set of @c{axiom}s together with @c{inference-rule}s for deriving new statements. Our running theory is PA (Peano Arithmetic).",
    example: "$T = \\mathrm{PA}$ — the theory dissected across the proof and arithmetic stages.",
    prerequisites: ["axiom", "inference-rule"],
    introducedIn: "stage-3",
  },

  // --- Stage 3: proofs (⊢ is derivability, not truth) ---
  {
    id: "proof",
    term: "proof",
    layer: "proof",
    short:
      "A finite sequence (or tree) of @c{formula}s in which every line is an @c{axiom} or follows from earlier lines by an @c{inference-rule}. Pure symbol manipulation — it says nothing about truth.",
    example: "A finite derivation ending in $2+2=4$, each step an axiom or a use of modus ponens.",
    prerequisites: ["axiom", "inference-rule"],
    introducedIn: "stage-3",
  },
  {
    id: "theorem",
    term: "theorem",
    layer: "proof",
    short:
      "A @c{sentence} that has a @c{proof} from a @c{formal-theory}. We write $T \\vdash P$ when $T$ proves $P$.",
    example: "$2+2=4$ is a theorem of PA: $\\mathrm{PA} \\vdash 2+2=4$.",
    prerequisites: ["proof", "sentence", "formal-theory"],
    introducedIn: "stage-3",
  },
  {
    id: "provability",
    term: "provability",
    layer: "proof",
    short:
      "The existence of *some* valid @c{proof}: $T \\vdash P$. An existential claim — independent of whether anyone has actually found the proof.",
    example: "$\\mathrm{PA} \\vdash 2+2=4$ holds because a proof exists, found or not.",
    prerequisites: ["proof"],
    introducedIn: "stage-3",
  },

  // --- Stage 4: proofs as graphs (⊢ as reachability) ---
  {
    id: "proof-graph",
    term: "proof graph",
    layer: "proof",
    short:
      "A graph whose edges are @c{inference-rule} steps leading from @c{axiom}s to conclusions. $T \\vdash P$ means $P$ is *reachable* from the axioms.",
    example: "Axioms at the roots; each edge an inference; $2+2=4$ reachable at a leaf.",
    prerequisites: ["proof"],
    introducedIn: "stage-4",
  },
  {
    id: "proof-tree",
    term: "proof tree",
    layer: "proof",
    short: "A tree-shaped @c{proof-graph}: each use of a lemma carries its own separate copy.",
    prerequisites: ["proof-graph"],
    contrasts: ["proof-dag"],
    introducedIn: "stage-4",
  },
  {
    id: "proof-dag",
    term: "proof DAG",
    layer: "proof",
    short: "A directed acyclic @c{proof-graph} in which a shared lemma is proved once and reused.",
    prerequisites: ["proof-graph"],
    contrasts: ["proof-tree"],
    introducedIn: "stage-4",
  },

  // --- Stage 5: Peano Arithmetic & numerals ---
  {
    id: "numeral",
    term: "numeral",
    layer: "syntax",
    short:
      "A @c{term} that names a natural number as iterated successor: @n{succ} applied repeatedly to @n{zero}.",
    example: "$3 = S(S(S(0)))$; the numeral and the number it names are different things.",
    prerequisites: ["term"],
    introducedIn: "stage-5",
  },
  {
    id: "peano-arithmetic",
    term: "Peano Arithmetic",
    layer: "proof",
    short:
      "Our running @c{formal-theory} (PA): standard @c{axiom}s for the natural numbers built from $0$ and successor $S$ (plus $+, \\times, =$), including induction.",
    example: "$\\mathrm{PA}$ proves $2+2=4$ and every other true equation between numerals.",
    prerequisites: ["formal-theory", "numeral"],
    introducedIn: "stage-5",
  },

  // --- Stage 6: structures & interpretation (symbol ≠ its meaning) ---
  {
    id: "interpretation",
    term: "interpretation",
    layer: "semantics",
    short:
      "An assignment giving each @c{symbol} a meaning: each constant names an @c{object}, each function symbol an actual function, each relation symbol a relation.",
    example: "$+$ is interpreted as ordinary addition on $\\mathbb{N}$; $0$ names the number zero.",
    prerequisites: ["symbol", "object"],
    introducedIn: "stage-6",
  },
  {
    id: "structure",
    term: "structure",
    layer: "semantics",
    short:
      "A domain of @c{object}s together with an @c{interpretation} of every symbol — which object is $0$, which function is $+$, and so on. (Called a model once it also satisfies a theory's axioms.)",
    example: "$\\mathbb{N} = \\langle\\{0,1,2,\\dots\\}, 0, S, +, \\times, =\\rangle$.",
    prerequisites: ["interpretation", "object"],
    introducedIn: "stage-6",
  },

  // --- Stage 7: satisfaction (⊨) — truth by recursive evaluation ---
  {
    id: "satisfaction",
    term: "satisfaction",
    layer: "semantics",
    short:
      "The relation $M \\models P$, defined by recursion on the shape of the @c{formula} $P$: the @c{structure} $M$ satisfies $P$ under an assignment of its free variables — and for a @c{sentence} (no free variables) the assignment is irrelevant, giving plain truth in $M$. A semantic claim, not a syntactic one.",
    example: "$\\mathbb{N} \\models \\forall x(x+0=x)$, and $\\mathbb{N} \\not\\models 2+2=5$.",
    prerequisites: ["structure", "formula", "sentence"],
    introducedIn: "stage-7",
  },
  {
    id: "truth-in-structure",
    term: "truth in a structure",
    layer: "semantics",
    short:
      "Truth relative to a specific @c{structure}: there is no bare 'true', only 'true in $M$'. For arithmetic the intended structure is $\\mathbb{N}$.",
    example: "$2+2=4$ is true in $\\mathbb{N}$; $2+2=5$ is false in $\\mathbb{N}$.",
    prerequisites: ["satisfaction"],
    introducedIn: "stage-7",
  },
  {
    id: "model",
    term: "model",
    layer: "semantics",
    short:
      "A @c{structure} that makes every @c{axiom} of a theory true — it @c{satisfaction|satisfies} the theory.",
    example: "$\\mathbb{N}$ is a model of PA: every PA axiom is true in it.",
    prerequisites: ["structure", "satisfaction", "axiom"],
    introducedIn: "stage-7",
  },

  // --- Stage 8: provability vs truth (⊢ and ⊨ are different arrows) ---
  {
    id: "syntactic",
    term: "syntactic",
    layer: "proof",
    short:
      "About symbol manipulation — @c{proof}s and derivations. The turnstile @n{turnstile} is syntactic: it asks only what can be *derived* from the axioms, never what is *true*.",
    example: "$\\mathrm{PA} \\vdash 2+2=4$ is a syntactic claim: a derivation exists.",
    prerequisites: ["proof"],
    contrasts: ["semantic"],
    introducedIn: "stage-8",
  },
  {
    id: "semantic",
    term: "semantic",
    layer: "semantics",
    short:
      "About interpretation in a @c{structure} — *truth*. The double turnstile @n{models} is semantic: it asks what is true in a structure, never what is derivable.",
    example: "$\\mathbb{N} \\models 2+2=4$ is a semantic claim: it is true in $\\mathbb{N}$.",
    prerequisites: ["satisfaction"],
    contrasts: ["syntactic"],
    introducedIn: "stage-8",
  },

  // --- Stage 9: sound / complete / consistent (three DISTINCT properties) ---
  {
    id: "contradiction",
    term: "contradiction",
    layer: "proof",
    short:
      "A @c{sentence} together with its negation (both provable), or a canonical falsehood like $0=1$.",
    example: "Deriving both $P$ and @n{neg}$P$, or deriving $0=1$.",
    prerequisites: ["sentence"],
    introducedIn: "stage-9",
  },
  {
    id: "consistency",
    term: "consistency",
    layer: "proof",
    short:
      "$T$ proves no @c{contradiction} — equivalently $T \\nvdash 0=1$. A purely @c{syntactic} property of the theory, and weaker than soundness (every sound theory is consistent, but not conversely).",
    example: "PA is consistent: it proves no contradiction. $\\mathrm{Con}(\\mathrm{PA})$ states this.",
    prerequisites: ["contradiction", "provability", "syntactic"],
    introducedIn: "stage-9",
  },
  {
    id: "soundness",
    term: "soundness",
    layer: "semantics",
    short:
      "Everything @c{provability|provable} is true in the intended @c{structure}: $T \\vdash P \\Rightarrow \\mathbb{N} \\models P$ ('no false theorems'). A bridge from @c{syntactic} to @c{semantic}; it *implies* @c{consistency} but is strictly stronger.",
    example: "PA is sound: it proves only sentences true in $\\mathbb{N}$, so it can't prove $2+2=5$.",
    prerequisites: ["provability", "truth-in-structure", "consistency", "syntactic", "semantic"],
    introducedIn: "stage-9",
  },
  {
    id: "completeness",
    term: "completeness",
    layer: "proof",
    short:
      "Of a *theory*: every @c{sentence} is decided — $T \\vdash P$ or $T \\vdash \\neg P$. (Distinct from Gödel's *Completeness Theorem* about first-order logic, a different claim.)",
    example: "Gödel's First Incompleteness Theorem shows PA is *not* complete in this sense.",
    prerequisites: ["provability", "sentence"],
    introducedIn: "stage-9",
  },

  // --- Stage 10: object theory vs metatheory (inside T vs about T) ---
  {
    id: "object-theory",
    term: "object theory",
    layer: "proof",
    short:
      "The @c{formal-theory} currently under study (e.g. PA). Its statements are about numbers — claims *about* the theory itself belong to the metatheory (though, via coding, later stages show arithmetic can encode such claims too).",
    example: "Inside the object theory PA, $2+2=4$ is a statement about numbers.",
    prerequisites: ["formal-theory"],
    contrasts: ["metatheory"],
    introducedIn: "stage-10",
  },
  {
    id: "metatheory",
    term: "metatheory",
    layer: "metatheory",
    short:
      "The external vantage from which we reason ABOUT an @c{object-theory} — about its @c{sentence}s and @c{proof}s. 'PA proves no contradiction' is a metatheoretic claim, not a theorem of PA itself.",
    example: "“There is no PA-proof of $G_{\\mathrm{PA}}$” is a claim in the metatheory about PA.",
    prerequisites: ["object-theory", "sentence", "proof"],
    contrasts: ["object-theory"],
    introducedIn: "stage-10",
  },

  // --- Stage 11: computability (decidable / r.e. / undecidable) ---
  {
    id: "decidable",
    term: "decidable",
    layer: "coding",
    short: "There is an algorithm that always halts with the correct yes/no answer.",
    example: "“Is this string a well-formed formula?” is decidable.",
    prerequisites: [],
    introducedIn: "stage-11",
  },
  {
    id: "recursively-enumerable",
    term: "recursively enumerable",
    layer: "coding",
    short:
      "A set whose members an algorithm can list (equivalently: a procedure that halts on members but may run forever on non-members) — abbreviated r.e. Strictly weaker than @c{decidable}.",
    example: "The theorems of PA are r.e. — listable — yet theoremhood is not decidable.",
    prerequisites: ["decidable"],
    introducedIn: "stage-11",
  },
  {
    id: "undecidable",
    term: "undecidable",
    layer: "coding",
    short:
      "No algorithm always gives the correct yes/no answer in finite time — the negation of @c{decidable}. (Not merely 'expensive'.)",
    example: "Theoremhood for PA is undecidable.",
    prerequisites: ["decidable"],
    introducedIn: "stage-11",
  },
  {
    id: "primitive-recursive",
    term: "primitive recursive",
    layer: "coding",
    short:
      "A class of always-halting computable functions and relations. Proof-checking is primitive recursive — which is exactly why it can be mirrored inside arithmetic.",
    example: "Checking that a finite list of formulas is a valid proof is primitive recursive.",
    prerequisites: ["decidable"],
    introducedIn: "stage-11",
  },
  {
    id: "effectively-axiomatized",
    term: "effectively axiomatized",
    layer: "coding",
    short:
      "A theory whose @c{axiom}s can be mechanically listed (the set is @c{recursively-enumerable}); for concrete systems like PA the axiom set is in fact @c{decidable}. A hypothesis of Gödel's theorems; 'computably axiomatized' means the same thing.",
    example: "PA is effectively axiomatized: a machine can check whether a formula is an axiom.",
    prerequisites: ["axiom", "recursively-enumerable", "decidable"],
    introducedIn: "stage-11",
  },

  // --- Stage 12: Gödel coding (syntax as numbers) ---
  {
    id: "godel-coding",
    term: "Gödel coding",
    layer: "coding",
    short:
      "Assigning natural numbers to @c{symbol}s, @c{formula}s, and @c{proof}s — giving every syntactic object a numerical name. (Turning syntactic *relations* into arithmetic ones is the next step, arithmetization.)",
    example: "Code a sequence by $2^{a_1+1}\\,3^{a_2+1}\\,5^{a_3+1}\\cdots$.",
    prerequisites: ["formula", "proof"],
    introducedIn: "stage-12",
  },
  {
    id: "code-number",
    term: "code number",
    layer: "coding",
    short:
      "The natural number assigned to a syntactic object under @c{godel-coding}; written @n{corner} (so $\\ulcorner P\\urcorner$ is the code of $P$).",
    example: "$\\ulcorner 0=1\\urcorner$ is the code number of the formula $0=1$.",
    prerequisites: ["godel-coding"],
    introducedIn: "stage-12",
  },
  {
    id: "arithmetization",
    term: "arithmetization of syntax",
    layer: "coding",
    short:
      "Re-expressing syntactic relations (well-formedness, @c{proof}-hood) as *arithmetic* relations among @c{code-number}s — the move that lets arithmetic talk about its own syntax.",
    example: "“$p$ is a proof of $q$” becomes an arithmetic relation between the numbers $p$ and $q$.",
    prerequisites: ["godel-coding", "code-number"],
    introducedIn: "stage-12",
  },

  // --- Stage 13: Proof_T / Prov_T (proof-checking as arithmetic) ---
  {
    id: "representable",
    term: "representable",
    layer: "coding",
    short:
      "A relation is representable in $T$ when some arithmetic @c{formula} lets $T$ *prove* it of exactly the right tuples and *disprove* it of the rest — a proof-theoretic property (⊢), not mere truth in ℕ. @c{decidable} (indeed @c{primitive-recursive}) syntactic relations like proof-checking are representable.",
    example: "Proof-checking is representable in PA by an arithmetic formula.",
    prerequisites: ["primitive-recursive", "arithmetization"],
    introducedIn: "stage-13",
  },
  {
    id: "proof-predicate",
    term: "Proof_T(p,q)",
    layer: "coding",
    short:
      "The arithmetic predicate @n{ProofT}: '$p$ codes a valid $T$-@c{proof} of the @c{formula} coded by $q$'. Proof-checking is @c{primitive-recursive}, hence @c{representable} in arithmetic.",
    example: "$\\mathrm{Proof}_T(p, \\ulcorner 2+2=4\\urcorner)$ holds when $p$ codes an actual proof of $2+2=4$.",
    prerequisites: ["representable"],
    introducedIn: "stage-13",
  },
  {
    id: "prov-predicate",
    term: "Prov_T(q)",
    layer: "coding",
    short:
      "The provability predicate @n{ProvT} $\\equiv \\exists p\\,\\mathrm{Proof}_T(p,q)$ — 'the @c{formula} coded by $q$ is provable in $T$', expressed inside arithmetic via @c{proof-predicate}.",
    example: "$\\mathrm{Prov}_T(\\ulcorner 2+2=4\\urcorner)$ is true.",
    prerequisites: ["proof-predicate"],
    introducedIn: "stage-13",
  },

  // --- Stage 14: diagonalization & the Gödel sentence ---
  {
    id: "diagonalization",
    term: "diagonalization",
    layer: "coding",
    short:
      "A self-reference construction: producing a @c{sentence} provably equivalent to a claim about its own @c{code-number}. Made rigorous by the Fixed-Point Lemma.",
    example: "It lets a sentence effectively refer to “my own code”.",
    prerequisites: ["sentence", "code-number"],
    introducedIn: "stage-14",
  },
  {
    id: "fixed-point-lemma",
    term: "Fixed-Point Lemma",
    layer: "coding",
    short:
      "For any arithmetic formula $\\psi(x)$ there is a @c{sentence} $G$ with $T \\vdash G \\leftrightarrow \\psi(\\ulcorner G\\urcorner)$ — the rigorous engine of @c{diagonalization} behind Gödel's self-reference.",
    example: "Take $\\psi(x) = \\neg\\mathrm{Prov}_T(x)$ to get the Gödel sentence.",
    prerequisites: ["diagonalization"],
    introducedIn: "stage-14",
  },
  {
    id: "godel-sentence",
    term: "Gödel sentence",
    layer: "coding",
    short:
      "A @c{sentence} $G_T$ with $T \\vdash G_T \\leftrightarrow \\neg\\mathrm{Prov}_T(\\ulcorner G_T\\urcorner)$ — built by the @c{fixed-point-lemma} from the @c{prov-predicate}, it 'says' it is unprovable in $T$. Arithmetic, *not* the liar paradox.",
    example: "$\\mathrm{PA} \\nvdash G_{\\mathrm{PA}}$, yet $\\mathbb{N} \\models G_{\\mathrm{PA}}$ (given $\\mathbb{N} \\models \\mathrm{PA}$, i.e. soundness).",
    prerequisites: ["fixed-point-lemma", "prov-predicate"],
    introducedIn: "stage-14",
  },

  // --- Stage 15: First Incompleteness (true but unprovable) ---
  {
    id: "omega-consistency",
    term: "ω-consistency",
    layer: "metatheory",
    short:
      "A strengthening of @c{consistency}: $T$ never proves @n{exists}$x\\,\\varphi(x)$ while refuting every instance $\\varphi(0), \\varphi(1), \\dots$. Gödel's original proof assumed it.",
    example: "ω-consistency rules out 'there is a counterexample' alongside 'no specific number is one'.",
    prerequisites: ["consistency"],
    introducedIn: "stage-15",
  },
  {
    id: "rosser-sentence",
    term: "Rosser sentence",
    layer: "metatheory",
    short:
      "A modified @c{godel-sentence} (Rosser 1936) for which plain @c{consistency} — not @c{omega-consistency} — already makes both it and its negation unprovable.",
    example: "Rosser's trick weakens the hypothesis of the First Incompleteness Theorem to mere consistency.",
    prerequisites: ["godel-sentence", "consistency", "omega-consistency"],
    introducedIn: "stage-15",
  },
  {
    id: "first-incompleteness",
    term: "first incompleteness theorem",
    layer: "metatheory",
    short:
      "A @c{consistency|consistent}, @c{effectively-axiomatized}, sufficiently strong theory is *incomplete*: a @c{godel-sentence} $G_T$ is unprovable in the theory, yet true in $\\mathbb{N}$ — a @c{metatheory} claim about the object theory (given @c{soundness}). So @c{completeness} fails.",
    example: "PA, being consistent and effectively axiomatized, cannot prove $G_{\\mathrm{PA}}$ — and, given soundness, cannot refute it either; so PA is incomplete. (Plain consistency alone gives only unprovability; the irrefutability half needs ω-consistency, or Rosser's sentence to drop back to mere consistency.)",
    prerequisites: ["godel-sentence", "effectively-axiomatized", "consistency", "soundness", "completeness", "metatheory"],
    introducedIn: "stage-15",
  },

  // --- Stage 16: Second Incompleteness (T cannot prove Con(T)) ---
  {
    id: "con-t",
    term: "Con(T)",
    layer: "metatheory",
    short:
      "The arithmetic sentence asserting $T$'s @c{consistency}: $\\neg\\mathrm{Prov}_T(\\ulcorner 0=1\\urcorner)$, written via the @c{prov-predicate}.",
    example: "$\\mathrm{Con}(\\mathrm{PA})$ says PA never proves $0=1$.",
    prerequisites: ["prov-predicate", "consistency"],
    introducedIn: "stage-16",
  },
  {
    id: "second-incompleteness",
    term: "second incompleteness theorem",
    layer: "metatheory",
    short:
      "A @c{consistency|consistent}, @c{effectively-axiomatized}, sufficiently strong $T$ cannot prove its own consistency @c{con-t|Con(T)}.",
    example: "$\\mathrm{PA} \\nvdash \\mathrm{Con}(\\mathrm{PA})$, even though $\\mathrm{Con}(\\mathrm{PA})$ is true.",
    prerequisites: ["first-incompleteness", "con-t", "effectively-axiomatized"],
    introducedIn: "stage-16",
  },
];

export const CONCEPT_GRAPH: ConceptGraph = { concepts: CONCEPTS };

export const CONCEPT_BY_ID: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c]),
);

/**
 * Per-edge justification for every prerequisite, keyed `"concept>prerequisite"`.
 * Each value answers "why does the concept need this prerequisite?" — the
 * annotation that lets a reader audit each edge (ADR-0004 §9 Tier-1). The
 * validator REQUIRES an entry for every prerequisite edge (you cannot add a
 * dependency without justifying it) and forbids orphans.
 */
export const PREREQ_WHY: Record<string, string> = {
  "variable>symbol": "a variable is a kind of symbol",
  "variable>object": "a variable stands for an (unspecified) object",
  "alphabet>symbol": "an alphabet is the fixed set of available symbols",
  "string>symbol": "a string is a finite sequence of symbols",
  "formation-rule>symbol": "formation rules build legal expressions out of symbols",
  "well-formed>string": "well-formedness is a property a string may or may not have",
  "well-formed>formation-rule": "well-formed means buildable by the formation rules",
  "parse-tree>formation-rule": "a parse tree records which formation rules built the expression",
  "parse-tree>well-formed": "only a well-formed expression has a parse tree",
  "term>well-formed": "a term is a well-formed expression of a particular kind",
  "term>variable": "variables are among the basic terms",
  "term>object": "a term denotes an object",
  "atomic-formula>term": "an atomic formula equates two terms",
  "formula>atomic-formula": "atomic formulas are the base case of the formula definition",
  "formula>well-formed": "a formula is a well-formed expression that can be true or false",
  "quantifier>formula": "a quantifier binds a variable in a formula to make a formula",
  "quantifier>variable": "a quantifier binds a variable",
  "bound-variable>variable": "'bound' is a status a variable occurrence can have",
  "bound-variable>quantifier": "a variable is bound when a quantifier governs it",
  "free-variable>variable": "'free' is a status a variable occurrence can have",
  "free-variable>quantifier": "free = not bound by any quantifier — defined against quantification",
  "sentence>formula": "a sentence is a formula of a special kind",
  "sentence>free-variable": "a sentence is a formula with no free variables",
  "grammar>formation-rule": "a grammar is the set of formation rules",
  "grammar>well-formed": "a grammar decides exactly which strings are well-formed",
  "parser>grammar": "a parser applies the grammar to decide legality",
  "parser>well-formed": "a parser's job is to certify well-formedness",
  "axiom>sentence": "an axiom is a sentence taken as a starting assumption",
  "inference-rule>formula": "an inference rule derives a new formula from given ones",
  "formal-theory>axiom": "a theory is a set of axioms (plus rules)",
  "formal-theory>inference-rule": "a theory's rules are its inference rules",
  "proof>axiom": "a proof's lines are axioms or follow from earlier lines",
  "proof>inference-rule": "each proof step applies an inference rule",
  "theorem>proof": "a theorem is a sentence that has a proof",
  "theorem>sentence": "a theorem is a sentence (a provable one)",
  "theorem>formal-theory": "a theorem is a sentence provable from a fixed formal theory T",
  "provability>proof": "provability is the existence of a proof",
  "proof-graph>proof": "a proof graph draws a proof as a reachability graph",
  "proof-tree>proof-graph": "a proof tree is a tree-shaped proof graph",
  "proof-dag>proof-graph": "a proof DAG is an acyclic proof graph with shared lemmas",
  "numeral>term": "a numeral is a term that names a number",
  "peano-arithmetic>formal-theory": "PA is a particular formal theory",
  "peano-arithmetic>numeral": "PA's arithmetic is stated over numerals",
  "interpretation>symbol": "an interpretation assigns a meaning to each symbol",
  "interpretation>object": "an interpretation maps constants to objects",
  "structure>interpretation": "a structure carries an interpretation of the symbols",
  "structure>object": "a structure has a domain of objects",
  "satisfaction>structure": "satisfaction is truth in a structure",
  "satisfaction>formula": "satisfaction evaluates a formula's truth",
  "satisfaction>sentence": "for a sentence the assignment is irrelevant — satisfaction reduces to plain truth in M",
  "truth-in-structure>satisfaction": "truth-in-a-structure is the satisfaction relation",
  "model>structure": "a model is a structure (one that satisfies the axioms)",
  "model>satisfaction": "'model of T' means it satisfies T's axioms",
  "model>axiom": "a model is judged against a theory's axioms",
  "syntactic>proof": "the syntactic side is about proofs/derivations (⊢)",
  "semantic>satisfaction": "the semantic side is about satisfaction/truth (⊨)",
  "contradiction>sentence": "a contradiction is a sentence together with its negation",
  "consistency>contradiction": "consistent = proves no contradiction",
  "consistency>provability": "consistency is stated in terms of what is provable",
  "consistency>syntactic": "consistency is a purely syntactic property",
  "soundness>provability": "soundness relates what is provable…",
  "soundness>truth-in-structure": "…to what is true in the intended structure",
  "soundness>consistency": "soundness is the stronger notion built atop consistency",
  "soundness>syntactic": "soundness bridges the syntactic side…",
  "soundness>semantic": "…to the semantic side",
  "completeness>provability": "completeness is about what the theory can prove",
  "completeness>sentence": "completeness = every sentence is decided",
  "object-theory>formal-theory": "the object theory is the formal theory under study",
  "metatheory>object-theory": "metatheory is reasoning about the object theory",
  "metatheory>sentence": "metatheoretic claims are about the object theory's sentences…",
  "metatheory>proof": "…and about its proofs",
  "recursively-enumerable>decidable": "r.e. is the weaker sibling of decidable",
  "undecidable>decidable": "undecidable = not decidable",
  "primitive-recursive>decidable": "primitive-recursive relations are decidable",
  "effectively-axiomatized>axiom": "effectively axiomatized = its axioms are mechanically recognizable…",
  "effectively-axiomatized>recursively-enumerable": "effectively axiomatized = the axiom set is mechanically listable (r.e.)",
  "effectively-axiomatized>decidable": "…and for concrete systems like PA, axiomhood is in fact decidable",
  "godel-coding>formula": "coding assigns numbers to formulas…",
  "godel-coding>proof": "…and to proofs",
  "code-number>godel-coding": "a code number is the number the coding assigns",
  "arithmetization>godel-coding": "arithmetization re-expresses syntax via the coding",
  "arithmetization>code-number": "arithmetization works over code numbers",
  "representable>primitive-recursive": "primitive-recursive relations are representable",
  "representable>arithmetization": "representability is the point of arithmetizing syntax",
  "proof-predicate>representable": "Proof_T works because proof-checking is representable",
  "prov-predicate>proof-predicate": "Prov_T is ∃p Proof_T(p,·)",
  "diagonalization>sentence": "diagonalization produces a self-referential sentence…",
  "diagonalization>code-number": "…that refers to its own code number",
  "fixed-point-lemma>diagonalization": "the Fixed-Point Lemma is the rigorous form of diagonalization",
  "godel-sentence>fixed-point-lemma": "G_T is built by the Fixed-Point Lemma",
  "godel-sentence>prov-predicate": "G_T is the fixed point of ¬Prov_T",
  "omega-consistency>consistency": "ω-consistency strengthens consistency",
  "rosser-sentence>godel-sentence": "the Rosser sentence is a modified Gödel sentence",
  "rosser-sentence>consistency": "it needs only plain consistency…",
  "rosser-sentence>omega-consistency": "…instead of ω-consistency",
  "first-incompleteness>godel-sentence": "the theorem is about the unprovability of G_T",
  "first-incompleteness>effectively-axiomatized": "a hypothesis of the theorem",
  "first-incompleteness>consistency": "a hypothesis of the theorem",
  "first-incompleteness>soundness": "soundness gives 'true but unprovable'",
  "first-incompleteness>completeness": "the conclusion is that completeness fails",
  "first-incompleteness>metatheory": "'unprovable yet true' is a metatheoretic claim",
  "con-t>prov-predicate": "Con(T) is written with Prov_T",
  "con-t>consistency": "Con(T) is the arithmetic statement of consistency",
  "second-incompleteness>first-incompleteness": "the second theorem builds on the first",
  "second-incompleteness>con-t": "it is about T's inability to prove Con(T)",
  "second-incompleteness>effectively-axiomatized": "a hypothesis of the theorem",
};

/** The justification for a prerequisite edge, or undefined if unannotated. */
export function prereqWhy(concept: string, prereq: string): string | undefined {
  return PREREQ_WHY[`${concept}>${prereq}`];
}

/** Direct prerequisite ids of a concept. */
export function conceptPrereqs(id: string): string[] {
  return CONCEPT_BY_ID[id]?.prerequisites ?? [];
}

/** All transitive prerequisites of a concept (its definition's dependency
 *  closure). */
export function conceptAncestors(id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [...conceptPrereqs(id)];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    stack.push(...conceptPrereqs(n));
  }
  return seen;
}

/** Concepts a given stage formally introduces (the sub-DAG it encapsulates). */
export function conceptsForStage(lessonId: string): Concept[] {
  return CONCEPTS.filter((c) => c.introducedIn === lessonId);
}

/** Concept ids in a dependency-respecting (simplest-first) order. DFS post-order
 *  over `prerequisites` (emit a concept after its prerequisites), with a visited
 *  guard so it is **cycle-tolerant** — mutually-defining concepts (an SCC) are
 *  emitted adjacently in a deterministic order rather than dropped (Kahn's
 *  algorithm would silently omit any node in a cycle). The UI derives definition
 *  order from this instead of hand-ordering. */
export function conceptTopoOrder(): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    for (const p of CONCEPT_BY_ID[id]?.prerequisites ?? []) visit(p);
    order.push(id);
  };
  for (const c of CONCEPTS) visit(c.id);
  return order;
}
