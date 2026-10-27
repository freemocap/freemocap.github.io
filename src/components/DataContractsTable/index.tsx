import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { type Repo } from '@site/src/utils/repo';

// Every field here comes straight from repos.yml's own consumes/produces
// arrays, plus a computed "consumed by" reverse-lookup. Nothing is
// hand-entered, so this can't drift out of sync the way prose describing
// the same relationships would.
export default function DataContractsTable(): ReactNode {
  const repos = usePluginData('repos-data-plugin') as Repo[];
  const inGraph = repos.filter((r) => r.produces.length > 0 || r.consumes.length > 0);

  function consumedBy(item: string): Repo[] {
    return inGraph.filter((r) => r.consumes.includes(item));
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Repo</th>
          <th>Produces</th>
          <th>Consumed by</th>
          <th>Consumes</th>
        </tr>
      </thead>
      <tbody>
        {inGraph.map((repo) => (
          <tr key={repo.id}>
            <td>
              <Link to={repo.route ?? '#'}>{repo.name}</Link>
            </td>
            <td>
              {repo.produces.length === 0 ? (
                <em>none</em>
              ) : (
                repo.produces.map((item, i) => (
                  <React.Fragment key={item}>
                    {i > 0 && <br />}
                    <code>{item}</code>
                  </React.Fragment>
                ))
              )}
            </td>
            <td>
              {repo.produces.length === 0 ? (
                <em>n/a</em>
              ) : (
                repo.produces.map((item, i) => {
                  const consumers = consumedBy(item);
                  return (
                    <React.Fragment key={item}>
                      {i > 0 && <br />}
                      {consumers.length === 0 ? (
                        <em>nobody (terminal output)</em>
                      ) : (
                        consumers.map((c, j) => (
                          <React.Fragment key={c.id}>
                            {j > 0 && ', '}
                            <Link to={c.route ?? '#'}>{c.name}</Link>
                          </React.Fragment>
                        ))
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </td>
            <td>
              {repo.consumes.length === 0 ? (
                <em>none</em>
              ) : (
                repo.consumes.map((item, i) => (
                  <React.Fragment key={item}>
                    {i > 0 && <br />}
                    <code>{item}</code>
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
