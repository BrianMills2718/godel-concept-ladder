/**
 * The ordered lesson list. Stages are added here as they're authored; the rest
 * of the app is data-driven off this array, so a new stage needs no component
 * changes. The 16 remaining stages (2–16) are stubbed in `upcoming` so the
 * sidebar can show the full ladder with "coming soon" markers.
 */
import type { Lesson } from "../../types";
import { SECTION_ROLES } from "../sectionRoles";
import { stage0 } from "./stage0";
import { stage1 } from "./stage1";
import { stage2 } from "./stage2";
import { stage3 } from "./stage3";
import { stage4 } from "./stage4";
import { stage5 } from "./stage5";
import { stage6 } from "./stage6";
import { stage7 } from "./stage7";
import { stage8 } from "./stage8";
import { stage9 } from "./stage9";
import { stage10 } from "./stage10";
import { stage11 } from "./stage11";
import { stage12 } from "./stage12";
import { stage13 } from "./stage13";
import { stage14 } from "./stage14";
import { stage15 } from "./stage15";
import { stage16 } from "./stage16";

export const LESSONS: Lesson[] = [
  stage0, stage1, stage2, stage3, stage4, stage5, stage6, stage7, stage8,
  stage9, stage10, stage11, stage12, stage13, stage14, stage15, stage16,
];

// Apply section roles (ROADMAP M3) where a section doesn't already carry one inline.
for (const l of LESSONS)
  l.sections.forEach((s, i) => {
    if (!s.role) s.role = SECTION_ROLES[`${l.id}:${i}`];
  });

/** All stages authored — the ladder is complete. */
export const UPCOMING: { stage: number; title: string }[] = [];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
