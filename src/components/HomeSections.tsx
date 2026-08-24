import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import Link from '@docusaurus/Link';
import styles from './HomeSections.module.css';

/**
 * Homepage structure, top to bottom:
 *   Hero -> TierPicker (3 big boxes: Beginner/Intermediate/Advanced) ->
 *   three Tier groups, each a small Tile grid -> Coming Soon ->
 *   community links -> AudienceDoorways.
 * TierPicker is the big, prominent router. Tiles further down are
 * deliberately small and rely on a "?" tooltip instead of paragraph text,
 * that's the reverse of what it looked like on the first two passes.
 */

export type Tile = {
  title: string;
  /** A sentence or two, always visible under the title. */
  blurb: string;
  /** A short table of contents for the destination page, shown as a
   *  bulleted list in the "?" tooltip on hover. */
  info: string[];
  to: string;
  icon: IconType;
};

/**
 * Groups a Tile grid under a single skill-level label (Beginner /
 * Intermediate / Advanced), so a visitor scrolling past can tell where
 * they are without re-reading anything above. `id` is what TierPicker's
 * big boxes jump to. Same section/heading treatment as Coming Soon and
 * Papers/community below it, on purpose, this is not a different kind of
 * thing, just another top-level section.
 *
 * `tracks`, used only for Advanced, repeats the same specialization chips
 * TierPicker's Advanced box has, right under the heading here too, so
 * the track shortcut is available whether a visitor jumped straight down
 * via the big box or arrived by scrolling.
 */
export function Tier({
  id,
  label,
  tracks,
  children,
}: {
  id?: string;
  label: string;
  tracks?: Track[];
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.sectionHeading}>{label}</h2>
      {tracks && (
        <span className={`${styles.trackTags} ${styles.tierTrackTags}`}>
          {tracks.map((track) => (
            <TrackTag key={track.label} {...track} />
          ))}
        </span>
      )}
      {children}
    </section>
  );
}

const TOOLTIP_WIDTH = 270;
const TOOLTIP_MARGIN = 12;
const TOOLTIP_OFFSET = 10;
/* Bulleted tooltips run much taller than the one-line text they replaced,
   so "is there room above" needs a bigger threshold than a one-liner did,
   otherwise "above" gets chosen when there isn't really room and the top
   of the list ends up above the viewport. */
const TOOLTIP_ABOVE_MIN_SPACE = 240;

type TooltipPosition = { left: number; top: number; placement: 'above' | 'below' };

/**
 * A small "?" badge that shows a positioned, bulleted tooltip on
 * hover/focus, a short table of contents for wherever the tile links.
 * Renders through a portal into document.body so it can never be clipped
 * by an ancestor's overflow or repositioned by an ancestor's transform
 * (a Tile's own hover state included). Position is measured against the
 * viewport on each show, clamped horizontally so it can't run off either
 * edge, and flips above/below depending on available space, so it can't
 * run off the top either.
 *
 * Deliberately does not navigate: Tile wraps this in a link, and this icon
 * calls stopPropagation/preventDefault on click so tapping it (the
 * touch-device equivalent of hover) shows info instead of following the
 * link. That's the fix for the earlier problem where a styled bit of text
 * inside a card felt like a second, different destination from the card
 * itself: there is exactly one thing in the box that navigates (the box),
 * and exactly one thing that only ever shows information (this).
 */
function InfoTooltip({ bullets }: { bullets: string[] }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<TooltipPosition>({ left: 0, top: 0, placement: 'above' });
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    const el = iconRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
    left = Math.max(TOOLTIP_MARGIN, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN));

    const placement: 'above' | 'below' = rect.top < TOOLTIP_ABOVE_MIN_SPACE ? 'below' : 'above';
    const top = placement === 'below' ? rect.bottom + TOOLTIP_OFFSET : rect.top - TOOLTIP_OFFSET;

    setPos({ left, top, placement });
  };

  const show = () => {
    updatePosition();
    setVisible(true);
  };
  const hide = () => setVisible(false);

  return (
    <>
      <span
        ref={iconRef}
        className={styles.infoIcon}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          visible ? hide() : show();
        }}
        tabIndex={0}
        role="button"
        aria-label={`More info: ${bullets.join('. ')}`}
      >
        ?
      </span>
      {mounted && visible &&
        createPortal(
          <div
            className={styles.tooltip}
            role="tooltip"
            style={{
              left: pos.left,
              top: pos.top,
              transform: pos.placement === 'above' ? 'translateY(-100%)' : undefined,
            }}
          >
            <ul className={styles.tooltipList}>
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}

/**
 * A grid of small, single-purpose link boxes, the entire content of each
 * Tier. Every link that used to be a "more" text link is a tile here too,
 * there is no separate flat-link overflow list in a Tier section anymore.
 *
 * Fixed width always, the same width regardless of viewport (313px,
 * computed so exactly 4 fit the container at the site's actual max width
 * of 1320px: `(1320 - 2*16px padding - 3*12px gaps) / 4`). `auto-fill`
 * wraps to fewer per row on narrower viewports without ever resizing a
 * box; a `1fr`-based grid was tried first and rejected, it stretched
 * continuously except for one discontinuous jump exactly at .container's
 * own 1140px->1320px breakpoint, which read as a layout bug.
 *
 * The "?" tooltip is an absolutely-positioned badge in the top-right
 * corner, out of the content flow entirely so it can't collide with
 * anything below it (previously tried inline beneath the icon; that
 * put it in the same vertical band as the icon and blurb and looked
 * cramped). Icon and title share a row below the corner, blurb
 * (always-visible, a sentence or two) underneath.
 */
export function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className={styles.navGrid}>
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <Link key={t.to} to={t.to} className={styles.navBox}>
            <InfoTooltip bullets={t.info} />
            <span className={styles.navBoxRow}>
              <Icon className={styles.navBoxIcon} aria-hidden="true" />
              <span className={styles.navBoxTitle}>{t.title}</span>
            </span>
            <span className={styles.navBoxBlurb}>{t.blurb}</span>
          </Link>
        );
      })}
    </div>
  );
}

export type Track = { label: string; href: string };

/**
 * The curriculum DAG's 3100/3200/3300 specialization split. Single
 * source of truth, used by both TierPicker's Advanced box and the
 * Advanced Tier heading further down, so the two never drift apart.
 * Links go straight to the real, existing module content in the
 * `freemocap/university` repo (verified via the GitHub API this
 * session, not guessed) rather than the not-yet-built Skelly University
 * site, since that's the closest real thing to link to today.
 */
export const SPECIALIZATION_TRACKS: Track[] = [
  {
    label: 'Technology',
    href: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3100-tech-overview.md',
  },
  {
    label: 'Science',
    href: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3200-science/3200-science-overview.md',
  },
  {
    label: 'Art',
    href: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3300-art/3300-art-overview.md',
  },
];

/**
 * One specialization-track chip inside the Advanced TierPicker box. Not a
 * real `<a>`, an `<a>` nested inside the box's own `<Link>` would be
 * invalid HTML and browsers handle that inconsistently. Instead this is a
 * span styled and behaving like a link (role, tabIndex, Enter/Space),
 * that stops the click from reaching the parent box and opens the track
 * itself. Deliberately the opposite case from the "?" tooltip: that
 * button only ever informs and never navigates, this one only ever
 * navigates (elsewhere) and never informs.
 */
function TrackTag({ label, href }: Track) {
  const go = () => window.open(href, '_blank', 'noopener,noreferrer');
  return (
    <span
      className={styles.trackTag}
      role="link"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        go();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          go();
        }
      }}
    >
      {label}
    </span>
  );
}

/**
 * The top-level router, right under the hero: three big boxes, one per
 * skill level, each jumping straight to its matching Tier further down the
 * page. This, not the tiles inside each Tier, is meant to be the first,
 * most prominent choice a visitor makes. Whole box is the only link, no
 * separate styled CTA text inside it (that was the earlier "goes to a
 * different place than the box" problem).
 *
 * The Advanced box is the one exception, deliberately: its
 * SPECIALIZATION_TRACKS chips go somewhere different from the box itself
 * on purpose, styled as chips specifically so that's obvious at a glance
 * rather than a repeat of the earlier "styled text that quietly goes
 * somewhere else" problem.
 */
export function TierPicker() {
  const tiers: { label: string; description: string; to: string; tracks?: Track[] }[] = [
    {
      label: 'Beginner',
      description: 'Install FreeMoCap and make your first recording.',
      to: '#beginner',
    },
    {
      label: 'Intermediate',
      description: 'Optimize your capture and understand your output data.',
      to: '#intermediate',
    },
    {
      label: 'Advanced',
      description: 'Explore the architecture, contribute, or specialize.',
      to: '#advanced',
      tracks: SPECIALIZATION_TRACKS,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.cardGrid}>
        {tiers.map((t) => (
          <Link key={t.to} to={t.to} className={styles.card}>
            <h2 className={styles.cardTitle}>{t.label}</h2>
            <p className={styles.cardDescription}>{t.description}</p>
            {t.tracks && (
              <span className={styles.trackTags}>
                {t.tracks.map((track) => (
                  <TrackTag key={track.label} {...track} />
                ))}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <header className={styles.hero}>
      <h1 className={styles.heroTitle}>FreeMoCap</h1>
      <p className={styles.heroTagline}>
        User documentation for the FreeMoCap project.
      </p>
      <div className={styles.heroButtons}>
        <Link className={styles.buttonPrimary} to="/start/">
          Get Started
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
      <h2 className={styles.sectionHeading}>Coming Soon</h2>
      <div className={styles.cardGrid}>
        <a
          href="https://github.com/freemocap/university"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.card} ${styles.cardMuted}`}
        >
          <h3 className={styles.cardTitle}>Skelly University</h3>
          <p className={styles.cardDescription}>
            A course-based path through markerless motion capture, from your first
            recording to specialized tracks in technology, science, and art.
          </p>
          <span className={styles.cardComingSoon}>https://github.com/freemocap/university</span>
        </a>
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
