/**
 * The ordered lesson list. Stages are added here as they're authored; the rest
 * of the app is data-driven off this array, so a new stage needs no component
 * changes. The 16 remaining stages (2–16) are stubbed in `upcoming` so the
 * sidebar can show the full ladder with "coming soon" markers.
 */
import type { Lesson } from "../../types";
import { stage0 } from "./stage0";
import { stage1 } from "./stage1";
import { stage2 } from "./stage2";
import { stage3 } from "./stage3";
import { stage4 } from "./stage4";
import { stage5 } from "./stage5";

export const LESSONS: Lesson[] = [stage0, stage1, stage2, stage3, stage4, stage5];

/** Titles of the not-yet-authored stages, shown greyed in the sidebar so the
 *  learner sees the whole trajectory and where they are in it. */
export const UPCOMING: { stage: number; title: string }[] = [
  { stage: 6, title: "Structures & Interpretations" },
  { stage: 7, title: "Satisfaction and Truth (⊨)" },
  { stage: 8, title: "Provability vs Truth (⊢ vs ⊨)" },
  { stage: 9, title: "Soundness & Completeness" },
  { stage: 10, title: "Object Theory vs Metatheory" },
  { stage: 11, title: "Computability" },
  { stage: 12, title: "Gödel Coding" },
  { stage: 13, title: "Proof_T(p,q) and Prov_T(q)" },
  { stage: 14, title: "Diagonalization & the Gödel Sentence" },
  { stage: 15, title: "First Incompleteness Theorem" },
  { stage: 16, title: "Second Incompleteness Theorem" },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
