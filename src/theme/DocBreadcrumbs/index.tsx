import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useSidebarBreadcrumbs, useActivePlugin } from '@docusaurus/plugin-content-docs/client';
import { useHomePageRoute } from '@docusaurus/theme-common/internal';
import { usePluginData } from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';
import { type Repo } from '@site/src/utils/repo';

import styles from './styles.module.css';

// TODO move to design system folder
function BreadcrumbsItemLink({
  children,
  href,
  isLast,
}: {
  children: ReactNode;
  href: string | undefined;
  isLast: boolean;
}): ReactNode {
  const className = 'breadcrumbs__link';
  if (isLast) {
    return <span className={className}>{children}</span>;
  }
  return href ? (
    <Link className={className} href={href}>
      <span>{children}</span>
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}

// TODO move to design system folder
function BreadcrumbsItem({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}): ReactNode {
  return (
    <li
      className={clsx('breadcrumbs__item', {
        'breadcrumbs__item--active': active,
      })}>
      {children}
    </li>
  );
}

type ExtraCrumb = { label: string; href: string };

// "build" and every per-repo instance (data/repos.yml, via the repos-data
// plugin, not a hardcoded id list, so a repo joining this set later doesn't
// need this file touched) get "Developer Docs" prepended: it's their real
// parent in the nav, but a separate, independently-sidebarred instance (see
// docusaurus.config.ts's externalRepos/stubRepos), so without this a reader
// landing on one of these pages only sees that instance's own local trail,
// with no way back except the navbar or the Home icon. Every non-freemocap
// repo has an instance one way or another now (a real fetched one via
// externalRepos, or a locally-authored stand-in via stubRepos), so this no
// longer needs to distinguish which kind, just whether the id matches one.
//
// A second crumb carries the repo's own display name (data/repos.yml's
// `name`, e.g. "SkellyForge"), so "Developer Docs / Data models" (which repo
// is that?) becomes "Developer Docs / SkellyForge / Data models". "build"
// maps to the `freemocap` repos.yml entry, its plugin id and repo id differ
// (see docusaurus.config.ts's "build" instance) everywhere else they match.
// Skipped on the repo's own hub page (useSidebarBreadcrumbs()'s own leading
// crumb already points at repo.route there), so the hub doesn't repeat its
// own name: "Developer Docs / SkellyForge / SkellyForge" would be noise, not
// signal.
//
// Concepts doesn't need any of this: sidebars/concepts.ts mirrors the main
// sidebar (see sharedDocsTree.ts) and nests concepts pages for real
// under About > Key Concepts there, so useSidebarBreadcrumbs() below
// already produces that chain on its own.
function useExtraCrumbs(
  breadcrumbs: ReturnType<typeof useSidebarBreadcrumbs>,
): ExtraCrumb[] {
  const activePlugin = useActivePlugin();
  const repos = usePluginData('repos-data-plugin') as Repo[];
  if (!activePlugin) {
    return [];
  }
  const repoId = activePlugin.pluginId === 'build' ? 'freemocap' : activePlugin.pluginId;
  const repo = repos.find((r) => r.id === repoId);
  if (!repo) {
    return [];
  }
  const crumbs: ExtraCrumb[] = [{ label: 'Developer Docs', href: '/developers' }];
  const onRepoHub = breadcrumbs?.[0]?.href === repo.route;
  if (!onRepoHub && repo.route) {
    crumbs.push({ label: repo.name, href: repo.route });
  }
  return crumbs;
}

export default function DocBreadcrumbs(): ReactNode {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const extraCrumbs = useExtraCrumbs(breadcrumbs);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <nav
        className={clsx(
          ThemeClassNames.docs.docBreadcrumbs,
          styles.breadcrumbsContainer,
        )}
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.navAriaLabel',
          message: 'Breadcrumbs',
          description: 'The ARIA label for the breadcrumbs',
        })}>
        <ul className="breadcrumbs">
          {homePageRoute && <HomeBreadcrumbItem />}
          {extraCrumbs.map((crumb) => (
            <BreadcrumbsItem key={crumb.href}>
              <BreadcrumbsItemLink href={crumb.href} isLast={false}>
                {crumb.label}
              </BreadcrumbsItemLink>
            </BreadcrumbsItem>
          ))}
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const href =
              item.type === 'category' && item.linkUnlisted
                ? undefined
                : item.href;
            return (
              <BreadcrumbsItem key={idx} active={isLast}>
                <BreadcrumbsItemLink href={href} isLast={isLast}>
                  {item.label}
                </BreadcrumbsItemLink>
              </BreadcrumbsItem>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
