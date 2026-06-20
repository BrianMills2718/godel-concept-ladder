/**
 * The concept graph itself (ADR-0003/0004), rendered with the shared React Flow
 * engine. Nodes are concepts, laid out left-to-right by dependency depth.
 *
 *   - solid arrow  P → C : C has prerequisite P
 *   - dashed line  A — B : A and B contrast (mutual; not a dependency)
 *   - double border       : the concept is in a dependency cycle — a modeling
 *                           error to fix (acyclic is enforced, so this is a
 *                           visual linter that should never light up)
 *
 * Clicking a concept inspects its definition + example. This is the structural
 * view the per-stage panels summarize one group at a time.
 */
import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { CONCEPT_GRAPH, CONCEPT_BY_ID } from "../content/concepts";
import { conceptSCCs } from "../content/derive";
import { LAYER_META } from "./viz/legend";
import { flowNodeTypes, flowEdgeTypes, pickHandles } from "./viz/flow";
import { RichLine } from "./Math";

/** Dependency depth (longest prerequisite chain), cycle-tolerant. */
function depthMap(): Record<string, number> {
  const depth: Record<string, number> = {};
  const computing = new Set<string>();
  const d = (id: string): number => {
    if (depth[id] !== undefined) return depth[id];
    if (computing.has(id)) return 0; // break cycles
    computing.add(id);
    const ps = CONCEPT_BY_ID[id]?.prerequisites ?? [];
    const val = ps.length ? 1 + Math.max(...ps.map((p) => d(p))) : 0;
    computing.delete(id);
    return (depth[id] = val);
  };
  CONCEPT_GRAPH.concepts.forEach((c) => d(c.id));
  return depth;
}

function layout(): Record<string, { x: number; y: number }> {
  const depth = depthMap();
  const byDepth: Record<number, string[]> = {};
  for (const c of CONCEPT_GRAPH.concepts) (byDepth[depth[c.id]] ??= []).push(c.id);
  const pos: Record<string, { x: number; y: number }> = {};
  for (const k of Object.keys(byDepth)) {
    const col = Number(k);
    byDepth[col].forEach((id, i) => {
      pos[id] = { x: col * 250 + 20, y: i * 78 + 20 };
    });
  }
  return pos;
}

const plain = (s: string) => s.replace(/@[cnt]\{([^}|]+)(?:\|[^}]+)?\}/g, "$1").replace(/\$/g, "");

export function ConceptGraphView() {
  const [sel, setSel] = useState<string | null>(null);
  const positions = useMemo(layout, []);
  const clusterOf = useMemo(() => {
    const m: Record<string, number> = {};
    conceptSCCs().forEach((comp, i) => {
      if (comp.length > 1) comp.forEach((id) => (m[id] = i));
    });
    return m;
  }, []);

  const nodes: Node[] = useMemo(
    () =>
      CONCEPT_GRAPH.concepts.map((c) => {
        const meta = LAYER_META[c.layer];
        const inCluster = clusterOf[c.id] !== undefined;
        return {
          id: c.id,
          type: "hnode",
          position: positions[c.id],
          data: {
            label: (
              <div className="cg-node-inner" title={plain(c.short)}>
                <span className="cg-node-term">{c.term}</span>
                {inCluster && <span className="cg-cluster">⟲ cluster</span>}
              </div>
            ),
          },
          style: {
            borderColor: meta.color,
            borderWidth: inCluster ? 3 : 2,
            borderStyle: inCluster ? "double" : "solid",
            borderRadius: 8,
            background: "#fff",
            padding: 6,
            fontSize: 12,
            width: 152,
          },
        };
      }),
    [positions, clusterOf],
  );

  const edges: Edge[] = useMemo(() => {
    const es: Edge[] = [];
    for (const c of CONCEPT_GRAPH.concepts) {
      const meta = LAYER_META[c.layer];
      for (const p of c.prerequisites) {
        if (!positions[p]) continue;
        es.push({
          id: `pq-${p}-${c.id}`,
          type: "annot",
          source: p,
          target: c.id,
          ...pickHandles(positions[p], positions[c.id]),
          data: { short: "", color: meta.color },
          style: { stroke: meta.color, strokeWidth: 1.5, opacity: 0.85 },
          markerEnd: { type: MarkerType.ArrowClosed, color: meta.color },
        });
      }
    }
    // contrast edges, one per unordered pair
    const seen = new Set<string>();
    for (const c of CONCEPT_GRAPH.concepts) {
      for (const x of c.contrasts ?? []) {
        const key = [c.id, x].sort().join("|");
        if (seen.has(key) || !positions[x]) continue;
        seen.add(key);
        es.push({
          id: `ct-${key}`,
          type: "annot",
          source: c.id,
          target: x,
          ...pickHandles(positions[c.id], positions[x]),
          data: { short: "contrasts", verbose: "understood against each other — not a dependency", color: "#64748b" },
          style: { stroke: "#94a3b8", strokeWidth: 1.5, strokeDasharray: "4 4" },
        });
      }
    }
    return es;
  }, [positions]);

  const selected = sel ? CONCEPT_BY_ID[sel] : null;

  return (
    <div className="concept-graph-view">
      <header className="cgv-head">
        <h2>Concept graph</h2>
        <p>
          The source of truth (ADR-0003/0004): every concept and what it depends on. The skill map is
          <em> derived</em> from this. Drag nodes; click one to inspect it.
        </p>
        <ul className="cgv-legend">
          <li><span className="cgv-key solid" /> prerequisite (A → B: B needs A)</li>
          <li><span className="cgv-key dashed" /> contrasts (mutual, not a dependency)</li>
          <li><span className="cgv-key cluster" /> in a dependency cycle (a modeling error — should not appear)</li>
        </ul>
      </header>

      <div className="cgv-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={flowNodeTypes}
          edgeTypes={flowEdgeTypes}
          onNodeClick={(_, n) => setSel(n.id)}
          fitView
          nodesDraggable
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} color="#eef2f7" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {selected && (
        <aside className="cgv-inspect" role="dialog" aria-label={`Concept: ${selected.term}`}>
          <button className="cgv-close" onClick={() => setSel(null)} aria-label="Close">×</button>
          <div className="cgv-inspect-term">{selected.term}</div>
          <div className="cgv-inspect-def"><RichLine text={selected.short} /></div>
          {selected.example && (
            <div className="cgv-inspect-eg">e.g. <RichLine text={selected.example} /></div>
          )}
          <div className="cgv-inspect-meta">
            needs:{" "}
            {selected.prerequisites.length
              ? selected.prerequisites.map((p) => CONCEPT_BY_ID[p]?.term ?? p).join(", ")
              : "— (primitive)"}
          </div>
        </aside>
      )}
    </div>
  );
}
