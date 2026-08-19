import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './HomeSections.module.css';

/**
 * The ethereum.org/learn pattern, structurally.
 *
 * A question-headed section, two or three cards under it, then a flat "More on
 * X" list of plain links. The cards funnel; the list refuses to hide anything.
 * Home routes, it does not teach.
 */

export type Card = {
  title: string;
  description: string;
  cta: string;
  to: string;
};

export type MoreLink = {
  label: string;
  to: string;
};

export function HomeSection({
  heading,
  cards,
  moreLabel,
  more,
}: {
  heading: string;
  cards: Card[];
  moreLabel?: string;
  more?: MoreLink[];
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>{heading}</h2>

      <div className={styles.cardGrid}>
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className={styles.card}>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDescription}>{card.description}</p>
            <span className={styles.cardCta}>{card.cta}</span>
          </Link>
        ))}
      </div>

      {more && more.length > 0 && (
        <div className={styles.more}>
          <h3 className={styles.moreHeading}>{moreLabel ?? 'More'}</h3>
          <ul className={styles.moreList}>
            {more.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function Hero() {
  return (
    <header className={styles.hero}>
      <h1 className={styles.heroTitle}>FreeMoCap</h1>
      <p className={styles.heroTagline}>
        Free and open-source research-grade markerless motion capture with
        ordinary webcams.
      </p>
      <div className={styles.heroButtons}>
        <Link className={styles.buttonPrimary} to="/start/install">
          Install FreeMoCap
        </Link>
        <Link className={styles.buttonSecondary} to="/concepts/what-is-freemocap">
          What is FreeMoCap?
        </Link>
      </div>
    </header>
  );
}

/** Skelly University. Reserved slot, honestly labelled. */
export function ComingSoonSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>Learn the field</h2>
      <div className={styles.cardGrid}>
        <Link to="/university/" className={`${styles.card} ${styles.cardMuted}`}>
          <h3 className={styles.cardTitle}>Skelly University</h3>
          <p className={styles.cardDescription}>
            A course-based path through markerless motion capture, from your first
            recording to specialized tracks in technology, science, and art.
          </p>
          <span className={styles.cardComingSoon}>Coming soon</span>
        </Link>
      </div>
    </section>
  );
}

/**
 * Audience routing lives at the bottom of home, as entry points into content
 * that already exists. One artifact, many doorways. No persona ever appears in
 * a URL and no content is duplicated per audience.
 */
export function AudienceDoorways() {
  const doorways: { label: string; blurb: string; to: string }[] = [
    {
      label: 'Artists and animators',
      blurb: 'Get clean motion onto a rig in Blender.',
      to: '/tutorials/blender',
    },
    {
      label: 'Athletes and coaches',
      blurb: 'Measure movement and get numbers you can compare.',
      to: '/tutorials/analyze-in-python',
    },
    {
      label: 'Clinicians and researchers',
      blurb: 'Understand the output data and what it can support.',
      to: '/concepts/accuracy-and-limits',
    },
    {
      label: 'Developers',
      blurb: 'Read the architecture and make your first change.',
      to: '/build/architecture',
    },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>Find your path</h2>
      <div className={styles.doorwayGrid}>
        {doorways.map((d) => (
          <Link key={d.to} to={d.to} className={styles.doorway}>
            <strong>{d.label}</strong>
            <span>{d.blurb}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function LinkColumns({
  heading,
  columns,
}: {
  heading: string;
  columns: { title: string; links: { label: string; href: string; note?: string }[] }[];
}): ReactNode {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>{heading}</h2>
      <div className={styles.columnGrid}>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className={styles.columnTitle}>{column.title}</h3>
            <ul className={styles.columnList}>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                  {link.note && <span className={styles.columnNote}> {link.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
