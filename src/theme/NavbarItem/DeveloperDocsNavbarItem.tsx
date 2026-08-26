import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useCollapsible, Collapsible } from '@docusaurus/theme-common';
import IconExternalLink from '@theme/Icon/ExternalLink';
import { type Repo } from '@site/src/utils/repo';

// Same data as the /developers polyrepo tree (data/repos.yml via the
// repos-data plugin), grouped the same way. Every repo gets a real link:
// the ones without docs of their own yet route to a locally-authored
// stand-in docs instance (stub-docs/<id>/, see docusaurus.config.ts's
// stubRepos) rather than being greyed out or left unclickable.
const MORE_LINKS = [
  { label: 'Architecture docs', to: '/build/' },
  { label: 'Full repository directory', to: '/build/repo-directory' },
];
const GITHUB_ORG = 'https://github.com/freemocap';

function useGroupedRepos() {
  const repos = usePluginData('repos-data-plugin') as Repo[];
  return {
    core: repos.filter((r) => r.tier === 'core'),
    pantheon: repos.filter((r) => r.tier === 'pantheon'),
    utility: repos.filter((r) => r.tier === 'utility'),
  };
}

// See TutorialsNavbarItem.tsx for why a custom navbar item reads the
// `mobile` prop itself rather than relying on separate stock desktop/
// mobile item types. This one is a single flat, headered list rather
// than Tutorials' two-level flyout, since there's no third level of
// nesting to show, so it doesn't need that component's measured-flyout
// positioning logic.
export default function DeveloperDocsNavbarItem({
  mobile,
  className,
}: {
  mobile?: boolean;
  className?: string;
}): ReactNode {
  return mobile ? <MobileItem /> : <DesktopItem className={className} />;
}

function DesktopItem({ className }: { className?: string }): ReactNode {
  const { core, pantheon, utility } = useGroupedRepos();
  return (
    <div className={`navbar__item dropdown dropdown--hoverable${className ? ` ${className}` : ''}`}>
      <Link className="navbar__link" to="/developers">
        Developer Docs
      </Link>
      <ul className="dropdown__menu">
        <li>
          <Link className="dropdown__link" to="/developers">
            Dev Docs Home
          </Link>
        </li>
        <RepoGroupDesktop label="Core" repos={core} />
        <RepoGroupDesktop label="Pantheon" repos={pantheon} />
        <RepoGroupDesktop label="Utility" repos={utility} />
        <li className="dropdown__header">More</li>
        {MORE_LINKS.map((link) => (
          <li key={link.to}>
            <Link className="dropdown__link" to={link.to}>
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link className="dropdown__link" to={GITHUB_ORG}>
            GitHub organization <IconExternalLink />
          </Link>
        </li>
      </ul>
    </div>
  );
}

function RepoGroupDesktop({ label, repos }: { label: string; repos: Repo[] }): ReactNode {
  return (
    <>
      <li className="dropdown__header">{label}</li>
      {repos.map((repo) => (
        <li key={repo.id}>
          <Link className="dropdown__link" to={repo.route!}>
            {repo.name}
          </Link>
        </li>
      ))}
    </>
  );
}

// Mirrors Docusaurus's own mobile sidebar category markup (see
// TutorialsNavbarItem.tsx's mobile half for the same reasoning): one
// collapsible level containing the same headered, grouped list as
// desktop, with plain (non-collapsible) rows for the group headers.
function MobileItem(): ReactNode {
  const { collapsed, toggleCollapsed } = useCollapsible({ initialState: true });
  const { core, pantheon, utility } = useGroupedRepos();

  return (
    <li className={`menu__list-item${collapsed ? ' menu__list-item--collapsed' : ''}`}>
      <div className="menu__list-item-collapsible">
        <Link className="menu__link menu__link--sublist" to="/developers">
          Developer Docs
        </Link>
        <button
          type="button"
          className="clean-btn menu__caret"
          aria-label={collapsed ? 'Expand sidebar category "Developer Docs"' : 'Collapse sidebar category "Developer Docs"'}
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.preventDefault();
            toggleCollapsed();
          }}
        />
      </div>
      <Collapsible as="ul" className="menu__list" collapsed={collapsed} lazy>
        <li className="menu__list-item">
          <Link className="menu__link" to="/developers">
            Dev Docs Home
          </Link>
        </li>
        <RepoGroupMobile label="Core" repos={core} />
        <RepoGroupMobile label="Pantheon" repos={pantheon} />
        <RepoGroupMobile label="Utility" repos={utility} />
        <li className="menu__list-item menu__list-item--header">More</li>
        {MORE_LINKS.map((link) => (
          <li className="menu__list-item" key={link.to}>
            <Link className="menu__link" to={link.to}>
              {link.label}
            </Link>
          </li>
        ))}
        <li className="menu__list-item">
          <Link className="menu__link" to={GITHUB_ORG}>
            GitHub organization <IconExternalLink />
          </Link>
        </li>
      </Collapsible>
    </li>
  );
}

function RepoGroupMobile({ label, repos }: { label: string; repos: Repo[] }): ReactNode {
  return (
    <>
      <li className="menu__list-item menu__list-item--header">{label}</li>
      {repos.map((repo) => (
        <li className="menu__list-item" key={repo.id}>
          <Link className="menu__link" to={repo.route!}>
            {repo.name}
          </Link>
        </li>
      ))}
    </>
  );
}
