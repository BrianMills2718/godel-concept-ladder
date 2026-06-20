/**
 * App shell + routing. Routing is hash-based on purpose: the site is a static
 * bundle that must work on GitHub Pages / any subpath with no server config.
 * `#/stage-1` selects a lesson; everything else is data-driven off LESSONS.
 */
import { useEffect, useState } from "react";
import { LESSONS, lessonById } from "./content/lessons";
import { Sidebar } from "./components/Sidebar";
import { LessonPage } from "./components/LessonPage";
import { GlossaryDrawer } from "./components/GlossaryDrawer";

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash.slice(2) || LESSONS[0].id);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.slice(2) || LESSONS[0].id);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

export function App() {
  const route = useHashRoute();
  const lesson = lessonById(route) ?? LESSONS[0];
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  // Keyboard: 'g' toggles the glossary drawer (when not typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA") return;
      if (e.key === "g") setGlossaryOpen((o) => !o);
      if (e.key === "Escape") setGlossaryOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <Sidebar currentId={lesson.id} onOpenGlossary={() => setGlossaryOpen(true)} />
      <main id="main" className="main" tabIndex={-1}>
        <LessonPage lesson={lesson} />
      </main>
      <GlossaryDrawer open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}
