/**
 * A ladder-of-abstraction figure (ADR-0006 §6, after B. Victor): three fixed
 * rungs for a dynamical concept — control a parameter, abstract over it, step
 * back down to a concrete instance. Static by design; the insight is in the
 * transitions between rungs, so the arrows between them are labeled.
 */
import type { LadderViz } from "../../types";
import { RichLine } from "../Math";

const RUNG_LABEL: Record<string, string> = {
  control: "Control",
  "abstract-over": "Abstract over",
  "step-down": "Step down",
};
const RUNG_HINT: Record<string, string> = {
  control: "one concrete case you can vary",
  "abstract-over": "the case generalized over every value of the parameter",
  "step-down": "point back from the abstraction to a concrete instance",
};

export function Ladder({ viz }: { viz: LadderViz }) {
  return (
    <div className="ladder" role="img" aria-label={viz.textualSummary}>
      <div className="ladder-param">
        parameter: <RichLine text={viz.parameter} />
      </div>
      <ol className="ladder-rungs">
        {viz.rungs.map((r, i) => (
          <li className="ladder-rung" key={r.rung}>
            <div className="ladder-card">
              <div className="ladder-rung-head">
                <span className={`ladder-rung-tag tag-${r.rung}`}>{RUNG_LABEL[r.rung]}</span>
                <span className="ladder-rung-hint">{RUNG_HINT[r.rung]}</span>
              </div>
              <div className="ladder-rung-caption">
                <RichLine text={r.caption} />
              </div>
              <div className="ladder-rung-body">
                <RichLine text={r.body} />
              </div>
            </div>
            {i < viz.rungs.length - 1 && (
              <div className="ladder-arrow" aria-hidden>
                ↓
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
