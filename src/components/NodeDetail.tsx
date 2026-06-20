/**
 * Node detail (ADR-0001). Concept nodes render the existing reviewed lesson
 * content (LessonPage) with a node header + completion bridge. Achievement nodes
 * render their capstone: prompt, deterministic check (reused Quiz engine), and —
 * for open-ended parts — a written answer (graded by the LLM judge in Phase C;
 * self-attested for now). Passing an achievement marks the node passed.
 */
import { useEffect, useState } from "react";
import { nodeById } from "../content/graph";
import { lessonById } from "../content/lessons";
import { ASSESSMENT_BY_ID, RUBRICS } from "../content/assessments";
import type { SkillNode, AssessmentTask } from "../types";
import { LessonPage } from "./LessonPage";
import { Quiz } from "./Quiz";
import { RichLine, RichText } from "./Math";
import { useProgress } from "../store/progress";
import { markNodePassed, useSkillView } from "../store/skillProgress";

export function NodeDetail({ nodeId }: { nodeId: string }) {
  const node = nodeById(nodeId);
  if (!node) {
    return (
      <div className="node-detail">
        <p>Unknown node. <a href="#/tree">← Back to the skill tree</a></p>
      </div>
    );
  }
  return node.kind === "achievement" ? (
    <AchievementView node={node} />
  ) : (
    <ConceptView node={node} />
  );
}

function NodeHeader({ node, kind }: { node: SkillNode; kind: string }) {
  return (
    <div className="nd-bar">
      <a className="nd-back" href="#/tree">← Skill tree</a>
      <span className="nd-branch">{node.branch}</span>
      <span className="nd-kind">{kind}</span>
    </div>
  );
}

function ConceptView({ node }: { node: SkillNode }) {
  const lesson = node.lessonId ? lessonById(node.lessonId) : undefined;
  const lp = useProgress(node.lessonId ?? "");
  const { passed } = useSkillView();
  const isPassed = passed.has(node.id);

  // Bridge: when the lesson's quiz is mastered, the concept node is passed.
  useEffect(() => {
    if (lp.mastered) markNodePassed(node.id);
  }, [lp.mastered, node.id]);

  if (!lesson) return <div className="node-detail"><NodeHeader node={node} kind="concept" /><p>Missing content.</p></div>;

  return (
    <div className="node-detail">
      <NodeHeader node={node} kind="concept" />
      <LessonPage lesson={lesson} />
      <div className="nd-complete">
        {isPassed ? (
          <span className="nd-passed">✓ Concept passed — it now unlocks its dependents on the tree.</span>
        ) : (
          <button className="nd-complete-btn" onClick={() => { markNodePassed(node.id); window.location.hash = "#/tree"; }}>
            Mark this concept complete →
          </button>
        )}
      </div>
    </div>
  );
}

function AchievementView({ node }: { node: SkillNode }) {
  const taskId = node.assessmentIds?.[0];
  const task = taskId ? ASSESSMENT_BY_ID[taskId] : undefined;
  const { passed } = useSkillView();
  const isPassed = passed.has(node.id);

  if (!task) return <div className="node-detail"><NodeHeader node={node} kind="achievement" /><p>No assessment.</p></div>;

  return (
    <div className="node-detail">
      <NodeHeader node={node} kind="achievement" />
      <article className="achievement">
        <div className="lesson-stage-badge ach-badge">◆ Achievement</div>
        <h2 className="lesson-title">{node.title}</h2>
        <p className="lesson-summary">{node.shortDescription}</p>
        <div className="ach-meta">
          <span className="ach-fmt">{task.kind === "deterministic" ? "Auto-graded" : task.kind === "llm-judged" ? "Written explanation (AI-graded in a later phase)" : "Auto-graded + written explanation"}</span>
          <span className="ach-thresh">Pass: {Math.round(task.passThreshold * 100)}%, no fatal misconception</span>
        </div>

        <section className="lesson-block">
          <h3>Task</h3>
          <RichText text={task.prompt} />
        </section>

        <Capstone task={task} nodeId={node.id} alreadyPassed={isPassed} />

        {task.fatalMisconceptions.length > 0 && (
          <section className="lesson-block">
            <h3>What fails this — no matter how fluent</h3>
            <ul className="ach-fatal">
              {task.fatalMisconceptions.map((m) => <li key={m.id}><RichLine text={m.description} /></li>)}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}

function Capstone({ task, nodeId, alreadyPassed }: { task: AssessmentTask; nodeId: string; alreadyPassed: boolean }) {
  // Deterministic component mastery is recorded under the task id in the lesson
  // progress store (reusing the Quiz engine).
  const detProgress = useProgress(task.id);
  const detPassed = !task.deterministic || detProgress.mastered;
  const [answer, setAnswer] = useState("");
  const [attested, setAttested] = useState(false);

  const rubric = task.openEnded ? RUBRICS[task.openEnded.rubricId] : undefined;
  const openOk = !task.openEnded || (answer.trim().length > 40 && attested);
  const canClaim = !alreadyPassed && detPassed && openOk;

  return (
    <>
      {task.deterministic && (
        <section className="lesson-block">
          <h3>Check</h3>
          <Quiz lessonId={task.id} questions={task.deterministic} />
        </section>
      )}

      {task.openEnded && (
        <section className="lesson-block">
          <h3>Explain</h3>
          <RichText text={task.openEnded.prompt} />
          <textarea
            className="ach-answer"
            placeholder="Write your explanation…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
          />
          {rubric && (
            <details className="rollup ach-rubric">
              <summary className="rollup-summary">What a strong answer covers</summary>
              <ul className="rollup-body">
                {rubric.criteria.map((c) => <li key={c.id}>{c.description} <em>({c.maxScore})</em></li>)}
              </ul>
            </details>
          )}
          <label className="ach-attest">
            <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} />
            I've written a complete explanation and checked it against the criteria.
            <span className="ach-note"> (An AI judge will grade this automatically once the grading backend is enabled.)</span>
          </label>
        </section>
      )}

      <div className="nd-complete">
        {alreadyPassed ? (
          <span className="nd-passed">✓ Achievement earned.</span>
        ) : (
          <button
            className="nd-complete-btn"
            disabled={!canClaim}
            onClick={() => { markNodePassed(nodeId); window.location.hash = "#/tree"; }}
          >
            Claim achievement →
          </button>
        )}
        {!canClaim && !alreadyPassed && (
          <p className="ach-blocked">
            {task.deterministic && !detPassed ? "Pass the check above. " : ""}
            {task.openEnded && !openOk ? "Write your explanation and confirm." : ""}
          </p>
        )}
      </div>
    </>
  );
}
