import React, { type ReactNode } from 'react';
import styles from './styles.module.css';

// Local, no-emoji provenance banner. Deliberately not skellydocs'
// AiGeneratedBanner: that component hardcodes emoji into its icon set
// (no prop to override them), and its three-valued GenerationType
// doesn't map cleanly onto this site's two-valued `provenance`
// frontmatter anyway. See /about/how-these-docs-are-written.

const REPO = 'freemocap/freemocap.github.io';
const EXPLAINER_URL = '/about/how-these-docs-are-written';

const LABELS: Record<string, string> = {
  'ai-generated': 'AI-generated documentation',
  'human-checked': 'Human-checked documentation',
};

const DISCLAIMERS: Record<string, string> = {
  'ai-generated':
    'This page was drafted by an AI assistant from source material and may contain inaccuracies.',
  'human-checked':
    'This page is adapted from real, human-written FreeMoCap documentation.',
};

export type HistoryEntry = { date: string; against?: string };

export default function ProvenanceBanner({
  provenance,
  history = [],
}: {
  provenance: string;
  history?: HistoryEntry[];
}): ReactNode {
  const label = LABELS[provenance] ?? `Provenance: ${provenance}`;
  const disclaimer = DISCLAIMERS[provenance] ?? '';
  const issueUrl = `https://github.com/${REPO}/issues/new?labels=documentation`;
  const hasCheck = history.some((entry) => entry.against && entry.against !== 'none');

  return (
    <details className={styles.banner}>
      <summary className={styles.summary}>
        <span>{label}</span>
        <span className={hasCheck ? styles.checked : styles.unchecked}>
          {hasCheck ? 'checked against source' : 'not yet checked against current software'}
        </span>
      </summary>
      <div className={styles.body}>
        <p>
          {disclaimer} If you spot something wrong, please{' '}
          <a href={issueUrl}>open an issue</a> or use the <em>Edit this page</em>{' '}
          link below to submit a fix.
        </p>
        {history.length > 0 && (
          <dl className={styles.meta}>
            {history.map((entry, i) => (
              <React.Fragment key={`${entry.date}-${i}`}>
                <dt>{entry.date}</dt>
                <dd>
                  {entry.against && entry.against !== 'none'
                    ? entry.against
                    : 'not checked against a specific version'}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        )}
        <a className={styles.moreInfo} href={EXPLAINER_URL}>
          More about how these docs are written
        </a>
      </div>
    </details>
  );
}
