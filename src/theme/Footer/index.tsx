import React from 'react';
import Link from '@docusaurus/Link';
import { navSections, aboutSection } from '@site/src/data/sitePages';
import styles from './styles.module.css';

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.07.07 0 0 0-.074.035c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.075-.035A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.893a.076.076 0 0 0-.041.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.548-13.66a.06.06 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const socials = [
  { label: 'Discord', href: 'https://discord.gg/XpRQJnqZxf', Icon: DiscordIcon },
  { label: 'YouTube', href: 'https://youtube.com/@freemocap', Icon: YouTubeIcon },
  { label: 'GitHub', href: 'https://github.com/freemocap', Icon: GitHubIcon },
];

// "Get started" runs as a row (label + its 4 pages inline) in the masthead
// spot a logo would normally take, instead of as a seventh grid column, so
// the remaining columns get more width.
const getStartedSection = navSections.find((s) => s.id === 'start')!;
const gridSections = navSections.filter((s) => s.id !== 'start');

// The ethereum.org /learn footer, adapted: a sitemap grid matching the
// navbar exactly (skipping About, which belongs to the plain-text row
// below, same as ethereum.org keeps "About us" and legal links out of its
// column grid), a social icon row, then the About section's own links as
// plain text, not a seventh column. Reads from src/data/sitePages.ts, the
// same source the navbar dropdowns use, so this isn't a fourth hand-copy of
// the same links.
export default function Footer(): React.JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.getStartedRow}>
          <Link className={styles.getStartedLabel} to={getStartedSection.hubPath}>
            {getStartedSection.label}
          </Link>
          <ul className={styles.getStartedList}>
            {getStartedSection.pages.map((page) => (
              <li key={page.to}>
                <Link to={page.to}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.grid}>
          {gridSections.map((section) => (
            <div key={section.id}>
              <div className={styles.columnTitle}>{section.label}</div>
              <ul className={styles.columnList}>
                {section.pages.map((page) => (
                  <li key={page.to}>
                    <Link to={page.to}>{page.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.lowerBand}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.socials}>
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={styles.socialLink}
              >
                <Icon />
              </a>
            ))}
          </div>

          <ul className={styles.aboutRow}>
            {aboutSection.pages.map((page) => (
              <li key={page.to}>
                <Link to={page.to}>{page.label}</Link>
              </li>
            ))}
          </ul>

          <div className={styles.copyright}>
            Copyright © {new Date().getFullYear()} FreeMoCap Foundation. Built with{' '}
            <a href="https://github.com/freemocap/skellydocs">SkellyDocs</a>.
          </div>
        </div>
      </div>
    </footer>
  );
}
