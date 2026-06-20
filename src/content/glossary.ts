/**
 * Glossary. Grows as stages are added; this slice covers the terms used in
 * Stages 0–1 plus the five core distinction-words so the drawer is useful from
 * the start. Definitions are written to be *precise but first-encounter
 * readable* — every term a learner meets in the slice is defined here.
 *
 * `related` entries are other glossary terms (matched case-insensitively).
 */
import type { GlossaryEntry } from "../types";

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "syntax",
    definition:
      "The rule-governed formation of symbols into strings, terms, formulas, and sentences. Syntax decides whether an expression is legal — not whether it is true or provable.",
    example: "$\\forall x(x+0=x)$ is syntactically legal; $\\forall{+}{=}x))0$ is not.",
    related: ["grammar", "well-formed formula", "formula"],
  },
  {
    term: "proof theory",
    definition:
      "The study of which formulas are derivable from a theory's axioms using its inference rules. A proof-theoretic fact is about symbol manipulation, written with $\\vdash$.",
    example: "$\\mathrm{PA} \\vdash 2+2=4$ means PA can derive $2+2=4$.",
    related: ["axiom", "inference rule", "proof", "theorem"],
  },
  {
    term: "semantics",
    definition:
      "The study of which formulas are true in a structure (model). A semantic fact is about interpretation, written with $\\models$.",
    example: "$\\mathbb{N} \\models 2+2=4$ means $2+2=4$ is true in the standard natural numbers.",
    related: ["structure", "interpretation", "satisfaction", "truth in a structure"],
  },
  {
    term: "metatheory",
    definition:
      "The external theory we use to reason ABOUT a formal theory — its syntax, proofs, and models. 'PA is consistent' and 'PA does not prove G' are metatheoretic claims.",
    example: "“There is no PA-proof of $G$” is a claim in the metatheory about PA.",
    related: ["object theory", "syntax", "proof theory"],
  },
  {
    term: "alphabet",
    definition:
      "The fixed stock of symbols a formal language is allowed to use.",
    example: "For arithmetic: $0, S, +, \\times, =, \\neg, \\wedge, \\vee, \\rightarrow, \\forall, \\exists, (, )$ and variables.",
    related: ["symbol", "string"],
  },
  {
    term: "symbol",
    definition:
      "An atomic mark of the language — the smallest unit, drawn from the alphabet.",
    example: "$S$, $+$, $($, and the variable $x$ are symbols.",
    related: ["alphabet", "string"],
  },
  {
    term: "string",
    definition:
      "Any finite sequence of symbols — legal or not. Being a string says nothing about being well-formed.",
    example: "Both $\\forall x(x+0=x)$ and the gibberish $\\forall{+}{=}x))0$ are strings.",
    related: ["symbol", "well-formed formula"],
  },
  {
    term: "term",
    definition:
      "A well-formed expression that denotes an object (here, a number). Terms are the 'noun phrases' of arithmetic; they are never true or false on their own.",
    example: "$0$, $S(0)$, and $x+S(0)$ are terms.",
    related: ["formula", "symbol"],
  },
  {
    term: "formula",
    definition:
      "A well-formed expression that becomes true or false once its symbols are interpreted and its free variables are assigned values.",
    example: "$x+0=x$ is a formula (with a free variable $x$).",
    related: ["term", "sentence", "free variable"],
  },
  {
    term: "sentence",
    definition:
      "A formula with no free variables — every variable is bound by a quantifier. A sentence has a definite truth value in a given structure.",
    example: "$\\forall x(x+0=x)$ is a sentence; $x+0=x$ is not.",
    related: ["formula", "free variable", "bound variable"],
  },
  {
    term: "free variable",
    definition:
      "A variable occurrence not governed by any quantifier. A formula with a free variable is not yet a sentence.",
    example: "In $x+0=x$, the variable $x$ is free.",
    related: ["bound variable", "sentence", "formula"],
  },
  {
    term: "bound variable",
    definition:
      "A variable occurrence governed by a quantifier $\\forall$ or $\\exists$.",
    example: "In $\\forall x(x+0=x)$, every $x$ is bound by $\\forall x$.",
    related: ["free variable", "sentence"],
  },
  {
    term: "grammar",
    definition:
      "The formal rule system that determines which strings are well-formed. It answers only 'is this legal?' — never 'is this true?' or 'is this provable?'.",
    example: "A rule: if $s$ and $t$ are terms, then $(s=t)$ is a formula.",
    related: ["syntax", "well-formed formula"],
  },
  {
    term: "well-formed formula",
    definition:
      "A string accepted by the grammar as a formula. 'Well-formed' is purely syntactic — a well-formed formula can be false (e.g. $2+2=5$).",
    example: "$2+2=5$ is well-formed but false.",
    related: ["grammar", "formula", "syntax"],
  },
  {
    term: "axiom",
    definition:
      "A starting formula a theory accepts without derivation.",
    example: "$\\forall x(x+0=x)$ is an axiom of PA's theory of addition.",
    related: ["inference rule", "proof", "theorem"],
  },
  {
    term: "inference rule",
    definition:
      "A permitted pattern for deriving a conclusion from premises.",
    example: "Modus ponens: from $A$ and $A\\to B$, infer $B$.",
    related: ["axiom", "proof"],
  },
  {
    term: "proof",
    definition:
      "A finite sequence or tree of formulas in which every line is an axiom or follows from earlier lines by an inference rule.",
    example: "A finite derivation ending in $2+2=4$.",
    related: ["theorem", "axiom", "inference rule"],
  },
  {
    term: "theorem",
    definition:
      "A sentence that has a proof from a theory. We write $T \\vdash P$ when $T$ proves $P$.",
    example: "$2+2=4$ is a theorem of PA.",
    related: ["proof", "proof theory"],
  },
  {
    term: "Peano Arithmetic",
    definition:
      "A formal first-order theory of the natural numbers, built from $0$, successor $S$, $+$, $\\times$, and $=$, with axioms including induction. Abbreviated PA.",
    example: "PA proves $2+2=4$ and every other true equation between numerals.",
    related: ["axiom", "object theory"],
  },
  {
    term: "structure",
    definition:
      "A domain of objects together with interpretations of the language's symbols (which object is $0$, which function is $+$, etc.). Also called a model when it satisfies a theory's axioms.",
    example: "$\\mathbb{N} = \\langle\\{0,1,2,\\dots\\}, 0, S, +, \\times, =\\rangle$.",
    related: ["interpretation", "satisfaction", "semantics"],
  },
  {
    term: "interpretation",
    definition:
      "The assignment of actual mathematical objects, functions, and relations to the formal symbols of the language.",
    example: "The symbol $+$ is interpreted as the ordinary addition function on $\\mathbb{N}$.",
    related: ["structure", "semantics"],
  },
  {
    term: "satisfaction",
    definition:
      "The formal relation '$M \\models P$': structure $M$ makes formula $P$ true, defined recursively over the shape of $P$.",
    example: "$\\mathbb{N} \\models \\forall x(x+0=x)$.",
    related: ["truth in a structure", "structure", "semantics"],
  },
  {
    term: "truth in a structure",
    definition:
      "Truth relative to a specific interpretation. There is no 'true' without a structure to be true in; 'true in $\\mathbb{N}$' is the usual intended meaning for arithmetic.",
    example: "$2+2=4$ is true in $\\mathbb{N}$; $2+2=5$ is false in $\\mathbb{N}$.",
    related: ["satisfaction", "semantics"],
  },
  {
    term: "object theory",
    definition:
      "The formal theory currently under study (e.g. PA). Its statements are about numbers, not about itself.",
    example: "Inside the object theory PA, $2+2=4$ is a statement about numbers.",
    related: ["metatheory", "Peano Arithmetic"],
  },
];

/** Lower-cased term → entry, for the drawer's lookup and cross-links. */
export const GLOSSARY_INDEX: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((e) => [e.term.toLowerCase(), e]),
);
