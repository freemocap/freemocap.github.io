import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { type Repo, type RepoTier } from '@site/src/utils/repo';

const TIER_LABELS: Record<RepoTier, string> = {
  core: 'Core',
  pantheon: 'Pantheon',
  utility: 'Utility',
};

const TIER_ORDER: RepoTier[] = ['core', 'pantheon', 'utility'];

// The full repos.yml listing, grouped by tier. Every field (including
// whether a repo has its own docs yet) is read live, so a repo gaining a
// docs_path later shows up here correctly without anyone editing this page.
export default function RepoDirectory(): ReactNode {
  const repos = usePluginData('repos-data-plugin') as Repo[];

  return (
    <>
      {TIER_ORDER.map((tier) => {
        const tierRepos = repos.filter((r) => r.tier === tier);
        if (tierRepos.length === 0) return null;
        return (
          <div key={tier}>
            <h2>{TIER_LABELS[tier]}</h2>
            <table>
              <thead>
                <tr>
                  <th>Repo</th>
                  <th>Responsibility</th>
                  <th>Domain</th>
                  <th>Docs</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {tierRepos.map((repo) => (
                  <tr key={repo.id}>
                    <td>
                      {repo.emoji} <strong>{repo.name}</strong>
                    </td>
                    <td>{repo.responsibility}</td>
                    <td>{repo.domain}</td>
                    <td>
                      {repo.route ? <Link to={repo.route}>docs</Link> : <em>none yet</em>}
                    </td>
                    <td>
                      <a href={repo.repo} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
