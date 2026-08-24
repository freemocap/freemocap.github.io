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

import styles from './styles.module.css';

type Repo = { id: string; docs_path: string | null };

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

// "build" and any per-repo instance with real docs (data/repos.yml, via
// the repos-data plugin, not a hardcoded id list, so a repo joining this
// set later doesn't need this file touched) get "Developer Docs"
// prepended: it's their real parent in the nav, but a separate,
// independently-sidebarred instance (see docusaurus.config.ts), so
// without this a reader landing on one of these pages only sees that
// instance's own local trail, with no way back except the navbar or the
// Home icon.
//
// Concepts doesn't need this: sidebars/concepts.ts mirrors the main
// sidebar (see sharedDocsTree.ts) and nests concepts pages for real
// under About > Key Concepts there, so useSidebarBreadcrumbs() below
// already produces that chain on its own.
function useExtraCrumbs(): ExtraCrumb[] {
  const activePlugin = useActivePlugin();
  const repos = usePluginData('repos-data-plugin') as Repo[];
  if (!activePlugin) {
    return [];
  }
  const isDeveloperDocsInstance =
    activePlugin.pluginId === 'build' ||
    repos.some((repo) => repo.id === activePlugin.pluginId && Boolean(repo.docs_path));
  return isDeveloperDocsInstance ? [{ label: 'Developer Docs', href: '/developers' }] : [];
}

export default function DocBreadcrumbs(): ReactNode {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const extraCrumbs = useExtraCrumbs();

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
