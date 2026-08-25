import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { type Repo } from '@site/src/utils/repo';
import styles from './styles.module.css';

const BOX_W = 170;
const BOX_H = 84;
const GAP = 110; // horizontal space between boxes, filled by the arrow + label
const ROW_Y = 40;
const CANVAS_H = 190;

type Edge = { from: Repo; to: Repo; label: string };

// Orders repos into a left-to-right chain and finds the produces->consumes
// edge connecting each consecutive pair, purely from repos.yml's own
// `consumes`/`produces` fields. Not hardcoded to today's 4-repo pipeline:
// a repo only appears here if it actually produces or consumes something,
// and the order is derived (topological, sources first), not assumed.
function buildChain(repos: Repo[]): { order: Repo[]; edges: Edge[]; terminalOutputs: { repo: Repo; item: string }[] } {
  const inGraph = repos.filter((r) => r.produces.length > 0 || r.consumes.length > 0);

  const edges: Edge[] = [];
  for (const producer of inGraph) {
    for (const item of producer.produces) {
      const consumer = inGraph.find((r) => r.consumes.includes(item));
      if (consumer) edges.push({ from: producer, to: consumer, label: item });
    }
  }

  // Kahn's algorithm: repeatedly take a not-yet-placed node whose
  // in-edges are all satisfied, so this stays correct even if the chain
  // stops being purely linear later.
  const order: Repo[] = [];
  const placed = new Set<string>();
  const remaining = new Set(inGraph.map((r) => r.id));
  while (remaining.size > 0) {
    const next = inGraph.find(
      (r) => remaining.has(r.id) && edges.every((e) => e.to.id !== r.id || placed.has(e.from.id)),
    );
    if (!next) break; // cycle guard; shouldn't happen for a real pipeline
    order.push(next);
    placed.add(next.id);
    remaining.delete(next.id);
  }

  const terminalOutputs = inGraph.flatMap((r) =>
    r.produces.filter((item) => !edges.some((e) => e.label === item)).map((item) => ({ repo: r, item })),
  );

  return { order, edges, terminalOutputs };
}

export default function DataFlowDiagram(): ReactNode {
  const repos = usePluginData('repos-data-plugin') as Repo[];
  const { order, edges, terminalOutputs } = buildChain(repos);
  const width = order.length * BOX_W + (order.length - 1) * GAP;
  const centerY = ROW_Y + BOX_H / 2;

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${width} ${CANVAS_H}`} className={styles.svg} role="img" aria-label="FreeMoCap data-contract pipeline">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className={styles.arrowhead} />
          </marker>
        </defs>

        {order.map((repo, i) => {
          if (i === order.length - 1) return null;
          const edge = edges.find((e) => e.from.id === repo.id && e.to.id === order[i + 1].id);
          const x1 = i * (BOX_W + GAP) + BOX_W;
          const x2 = (i + 1) * (BOX_W + GAP);
          const midX = (x1 + x2) / 2;
          return (
            <g key={`edge-${repo.id}`}>
              <line x1={x1} y1={centerY} x2={x2 - 4} y2={centerY} className={styles.arrow} markerEnd="url(#arrowhead)" />
              {edge && (
                <text x={midX} y={centerY - 10} textAnchor="middle" className={styles.edgeLabel}>
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {order.map((repo, i) => {
          const x = i * (BOX_W + GAP);
          const cx = x + BOX_W / 2;
          const cy = ROW_Y + BOX_H / 2;
          return (
            <Link key={repo.id} to={repo.route ?? '#'} className={styles.boxLink}>
              <rect x={x} y={ROW_Y} width={BOX_W} height={BOX_H} rx={10} className={styles.box} />
              <text x={cx} y={cy - 12} textAnchor="middle" className={styles.emoji} fontSize={22}>
                {repo.emoji}
              </text>
              <text x={cx} y={cy + 22} textAnchor="middle" className={styles.label}>
                {repo.name}
              </text>
              <title>{repo.responsibility}</title>
            </Link>
          );
        })}
      </svg>

      {terminalOutputs.length > 0 && (
        <p className={styles.terminalNote}>
          Not consumed by another repo in the polyrepo (terminal outputs):{' '}
          {terminalOutputs.map(({ repo, item }, i) => (
            <React.Fragment key={`${repo.id}-${item}`}>
              {i > 0 && ', '}
              <code>{item}</code> (from {repo.name})
            </React.Fragment>
          ))}
          .
        </p>
      )}
    </div>
  );
}
