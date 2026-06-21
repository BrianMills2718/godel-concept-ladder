/**
 * Section pedagogical roles (ROADMAP M3, ADR-0006 show-then-tell), keyed by
 * "<lessonId>:<sectionIndex>". Applied to lessons at load (lessons/index.ts) so the
 * problem→solution / concrete→abstract structure is explicit and checkable. Most
 * sections are expository ("tell"); "show" marks worked-example sections, "problem"
 * marks motivating-question sections. (That the course is tell-heavy is itself a
 * signal an ordering optimizer could act on — METHODOLOGY §9.)
 */
import type { SectionRole } from "../types";

export const SECTION_ROLES: Record<string, SectionRole> = {
  "stage-0:0": "tell", "stage-0:1": "tell", "stage-0:2": "tell", "stage-0:3": "tell",
  "stage-1:0": "tell", "stage-1:1": "tell", "stage-1:2": "tell", "stage-1:3": "show",
  "stage-2:0": "tell", "stage-2:1": "tell",
  "stage-3:0": "tell", "stage-3:1": "tell", "stage-3:2": "tell",
  "stage-4:0": "tell", "stage-4:1": "tell", "stage-4:2": "tell",
  "stage-5:0": "tell", "stage-5:1": "tell", "stage-5:2": "show", "stage-5:3": "show", "stage-5:4": "tell",
  "stage-6:0": "tell", "stage-6:1": "tell",
  // stage-7 sections carry inline roles already
  "stage-8:0": "tell", "stage-8:1": "tell", "stage-8:2": "tell",
  "stage-9:0": "tell", "stage-9:1": "tell", "stage-9:2": "tell", "stage-9:3": "tell",
  "stage-10:0": "tell", "stage-10:1": "tell", "stage-10:2": "tell", "stage-10:3": "tell",
  "stage-11:0": "tell", "stage-11:1": "show", "stage-11:2": "problem", "stage-11:3": "tell",
  "stage-12:0": "problem", "stage-12:1": "show", "stage-12:2": "tell", "stage-12:3": "tell",
  "stage-13:0": "tell", "stage-13:1": "tell", "stage-13:2": "tell", "stage-13:3": "tell",
  "stage-14:0": "tell", "stage-14:1": "show", "stage-14:2": "tell",
  "stage-15:0": "tell", "stage-15:1": "tell", "stage-15:2": "show", "stage-15:3": "show", "stage-15:4": "show", "stage-15:5": "tell",
  "stage-16:0": "tell", "stage-16:1": "tell", "stage-16:2": "tell", "stage-16:3": "tell",
};
