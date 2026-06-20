/**
 * Left navigation: the full concept ladder. Authored stages are links with a
 * progress dot (visited / mastered); upcoming stages are shown greyed so the
 * learner always sees the whole trajectory and where they are on it.
 */
import { LESSONS, UPCOMING } from "../content/lessons";
import { useAllProgress } from "../store/progress";

export function Sidebar({
  currentId,
  onOpenGlossary,
}: {
  currentId: string;
  onOpenGlossary: () => void;
}) {
  const progress = useAllProgress();

  return (
    <nav className="sidebar" aria-label="Lessons">
      <div className="sidebar-head">
        <h1 className="brand">The Concept Ladder</h1>
        <p className="brand-sub">Prerequisites for Gödel — kept strictly apart.</p>
      </div>

      <ol className="nav-list">
        {LESSONS.map((l) => {
          const p = progress[l.id];
          const status = p?.mastered ? "mastered" : p?.visited ? "visited" : "new";
          return (
            <li key={l.id}>
              <a
                href={`#/${l.id}`}
                className={`nav-item ${l.id === currentId ? "active" : ""}`}
                aria-current={l.id === currentId ? "page" : undefined}
              >
                <span className={`nav-dot dot-${status}`} aria-hidden />
                <span className="nav-stage">Stage {l.stage}</span>
                <span className="nav-title">{l.title}</span>
                {p?.mastered && <span className="nav-check" title="mastered">✓</span>}
              </a>
            </li>
          );
        })}
        {UPCOMING.map((u) => (
          <li key={u.stage}>
            <span className="nav-item nav-upcoming" aria-disabled>
              <span className="nav-dot dot-locked" aria-hidden />
              <span className="nav-stage">Stage {u.stage}</span>
              <span className="nav-title">{u.title}</span>
              <span className="nav-soon">soon</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="sidebar-foot">
        <button className="glossary-btn" onClick={onOpenGlossary}>
          📖 Glossary <kbd>g</kbd>
        </button>
      </div>
    </nav>
  );
}
