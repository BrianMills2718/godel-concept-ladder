/**
 * KaTeX rendering primitives.
 *
 * WHY a custom wrapper instead of react-katex: we want one place that (a) never
 * throws on a bad formula (teaching content is edited often — a typo must not
 * blank the page), and (b) lets prose mix inline `$...$` and block `$$...$$`
 * math without a heavyweight markdown pipeline.
 */
import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function renderTex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false, // render the source in red rather than crashing
      strict: false,
    });
  } catch {
    return `<span class="tex-error">${tex}</span>`;
  }
}

/** Inline math, e.g. <Tex>{"\\forall x"}</Tex>. */
export function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = useMemo(() => renderTex(children, block), [children, block]);
  const Tag = block ? "div" : "span";
  return <Tag className="tex" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Rich text: a string with `$...$` (inline) and `$$...$$` (block) math, and
 * blank-line-separated paragraphs. This is deliberately tiny — not full
 * markdown — because lesson bodies only need math + paragraphs.
 */
export function RichText({ text }: { text: string }) {
  const paragraphs = text.trim().split(/\n\s*\n/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="rich-p">
          <RichLine text={p} />
        </p>
      ))}
    </>
  );
}

/** Render a single paragraph, splicing in math spans. Exported so labels
 *  (graph nodes, quiz options, table cells) can contain math too. */
export function RichLine({ text }: { text: string }) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <>
      {parts.map((part, i) =>
        part.type === "text" ? (
          <span key={i}>{part.value}</span>
        ) : (
          <Tex key={i} block={part.block}>
            {part.value}
          </Tex>
        ),
      )}
    </>
  );
}

type Part =
  | { type: "text"; value: string }
  | { type: "math"; value: string; block: boolean };

/** Split on $$...$$ first, then $...$. Tolerant of unmatched delimiters. */
function splitMath(text: string): Part[] {
  const parts: Part[] = [];
  // Matches $$...$$ or $...$ (non-greedy). The block group is checked first.
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    if (m[1] !== undefined) parts.push({ type: "math", value: m[1], block: true });
    else parts.push({ type: "math", value: m[2], block: false });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
