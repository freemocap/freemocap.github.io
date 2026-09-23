import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import styles from './HomeSections.module.css';

/**
 * Homepage structure, top to bottom:
 *   Hero -> TierPicker (3 big boxes: Beginner/Intermediate/Advanced) ->
 *   three Tier groups, each a small Tile grid -> Coming Soon ->
 *   community links.
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
 * Groups a Tile grid under a single skill-level label (Get Started /
 * Beginner / Intermediate / Advanced), so a visitor scrolling past can
 * tell where they are without re-reading anything above. `id` is what
 * TierPicker's big boxes jump to. Same section/heading treatment as
 * Coming Soon and Papers/community below it, on purpose, this is not a
 * different kind of thing, just another top-level section.
 *
 * The specialization chips (Technology/Science/Art) live only on
 * TierPicker's Advanced box now, not repeated here too, per explicit
 * instruction: one appearance near the top of the page, not two.
 */
export function Tier({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.sectionHeading}>{label}</h2>
      {children}
    </section>
  );
}

/** The four Advanced columns/pills, shared between PathGroup and TrackTag
 *  so both sides of the same color-coordination stay in sync: adding a
 *  fifth column means the type error shows up in both places, not just
 *  a silent missing color. Maps 1:1 to the --fmc-track- CSS variables in
 *  src/css/custom.css and the pathGroup/trackTag variant modifier
 *  classes in HomeSections.module.css. */
export type TrackVariant = 'dev' | 'technology' | 'science' | 'art';

/**
 * One column's own labeled tile grid inside the Advanced tier (Technology /
 * Science / Art / FMC Dev). Always used inside a `PathColumns` wrapper,
 * never standalone.
 *
 * `note`, when given, is a one-line subcaption under the heading saying
 * where this column's tiles actually go: Technology/Science/Art tiles
 * leave the site for Skelly University's own curriculum on GitHub, FMC
 * Dev's stay on this site. Without it, a reader can't tell the two kinds
 * of card apart until they've already clicked one; this site treats
 * provenance as reader-facing everywhere else (see ProvenanceBanner on
 * every doc page), so the same honesty belongs here.
 *
 * `variant` tints just this column's tile borders (very subtle, see
 * custom.css) so it visually pairs with its matching TrackTag pill on
 * TierPicker's Advanced box above. Required, not optional: all four
 * current PathGroups are one of the four tracks, there's no neutral case.
 */
export function PathGroup({
  label,
  note,
  variant,
  children,
}: {
  label: string;
  note?: string;
  variant: TrackVariant;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.pathGroup} ${styles[`pathGroup--${variant}`]}`}>
      <h3 className={styles.pathHeading}>{label}</h3>
      {note && <p className={styles.pathNote}>{note}</p>}
      {children}
    </div>
  );
}

/**
 * Lays its PathGroup children out as side-by-side vertical columns
 * (one per Advanced column) rather than stacked, so they read as parallel
 * tracks, not one long scroll. Steps down to 2 columns then 1 as the
 * viewport narrows, its own breakpoints since 4 columns needs an
 * intermediate step the rest of this page's grids don't.
 */
export function PathColumns({ children }: { children: ReactNode }) {
  return <div className={styles.pathColumns}>{children}</div>;
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

const SEQUENCE_ROW_SIZE = 3;

/** A continuous line with a solid CSS-triangle arrowhead flush against
 *  its end, no gap between the two: a stock icon (FiArrowRight) was
 *  tried first and rejected, Feather's glyphs sit inset from their own
 *  SVG viewBox edge, which read as a floating chevron with a gap before
 *  it no matter how tight the layout around it was. A border-triangle
 *  has no such inset, so it butts straight up against the line. Flush
 *  against the boxes on either side of the whole thing too, "like a
 *  flowchart" rather than a small icon floating in a gap. Orientation/
 *  mirroring is handled by its ancestor's CSS (row vs. row-reverse vs.
 *  the row-to-row vertical connector, see HomeSections.module.css),
 *  this just renders the two pieces every connector is made of. */
function Connector({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden="true">
      <span className={styles.sequenceConnectorLine} />
      <span className={styles.sequenceConnectorArrow} />
    </span>
  );
}

/**
 * A numbered, line-connected variant of TileGrid, used only for Get
 * Started (3 tiles) and Beginner (6 tiles): the two Tiers whose tile
 * count divides evenly into rows of 3, per explicit request to present
 * them as a numbered sequence rather than a plain grid. Everywhere else
 * on the page keeps using plain TileGrid untouched. Deliberately reads
 * as a different kind of component, not a themed TileGrid variant: full-
 * width flexible boxes (not TileGrid's fixed 313px), a big uncircled
 * number instead of a small badge, and continuous flowchart-style
 * connector lines instead of a floating arrow icon.
 *
 * Rows are chunked in JS (always exactly 3 wide, the entire point of
 * this component), not left to CSS auto-fill, so the "row" the
 * connectors reason about always matches the DOM's own grouping, at
 * every viewport width, and every box in a row shares the remaining
 * space equally (`flex: 1 1 0`) rather than sitting at a fixed width
 * with slack around it.
 *
 * Every row reads left-to-right, above the 1100px breakpoint (reusing
 * PathColumns' own breakpoint, not inventing a new one) and below it
 * alike - no boustrophedon/alternating-direction reversal (an earlier
 * version of this component did that; see git history if this is ever
 * worth reviving). Box 3 (end of row 1) sits at the opposite corner
 * from box 4 (start of row 2), so the row-to-row connector
 * (`RowElbowConnector` below) is an orthogonal line - down from box 3,
 * across, down into box 4 - long enough to actually bridge them,
 * rather than a short straight connector.
 *
 * Built from 2 CSS border-boxes, not 3 separate line pieces: an
 * earlier version butted a vertical line span against a horizontal
 * line span, which is 2 independently-positioned elements and can show
 * a hairline gap at the seam depending on sub-pixel rounding, and
 * can't round the bend where they meet (a border-radius needs to be
 * one element's own corner, not the join between two). Each "L" here
 * is a single absolutely-positioned box with only 2 of its 4 borders
 * visible (right+bottom for the box-3 side, left+top for the box-4
 * side) and a border-radius on just the corner where those 2 borders
 * meet, so the bend is that one element's own rounded corner: no seam
 * to gap, and the curve is real. `right`/`left`/`width` all reuse the
 * same `calc(100% / 6 - 1rem)` box-column math the old version used
 * (a row is 3 equal box columns plus 2 fixed 3rem gaps, so a column's
 * center sits that far in from its nearer edge) - by symmetry the two
 * L's meet exactly at the horizontal center, whatever the row's actual
 * width is at a given viewport.
 *
 * Below 1100px, rows collapse to a single column where box 3 and box 4
 * are already directly stacked, so the two L's disappear entirely and
 * a plain straight-down connector (same line+arrow pieces every other
 * inter-box connector uses) takes over instead, see
 * HomeSections.module.css. DOM order and visual order match throughout
 * (no reversal to account for); the numbers and connectors are purely
 * decorative (`aria-hidden`) sighted-reader aids, not the thing
 * establishing the real order.
 */
function RowElbowConnector() {
  return (
    <div className={styles.sequenceRowConnectorElbow} aria-hidden="true">
      <span className={styles.sequenceRowConnectorMobileLine}>
        <span className={styles.sequenceConnectorLine} />
        <span className={styles.sequenceConnectorArrow} />
      </span>
      <span className={styles.sequenceRowConnectorElbowRight} />
      <span className={styles.sequenceRowConnectorElbowLeft} />
      <span className={styles.sequenceRowConnectorElbowArrow} />
    </div>
  );
}

export function SequenceGrid({ tiles }: { tiles: Tile[] }) {
  const rows: Tile[][] = [];
  for (let i = 0; i < tiles.length; i += SEQUENCE_ROW_SIZE) {
    rows.push(tiles.slice(i, i + SEQUENCE_ROW_SIZE));
  }

  return (
    <div className={styles.sequenceGrid}>
      {rows.map((row, rowIndex) => (
        <Fragment key={rowIndex}>
          {rowIndex > 0 && <RowElbowConnector />}
          <div className={styles.sequenceRow}>
            {row.map((t, i) => {
              const Icon = t.icon;
              const number = rowIndex * SEQUENCE_ROW_SIZE + i + 1;
              return (
                <Fragment key={t.to}>
                  <Link to={t.to} className={styles.sequenceBox}>
                    <span className={styles.sequenceNumber} aria-hidden="true">
                      {number}
                    </span>
                    <span className={styles.sequenceContent}>
                      <InfoTooltip bullets={t.info} />
                      <span className={styles.navBoxRow}>
                        <Icon className={styles.navBoxIcon} aria-hidden="true" />
                        <span className={styles.navBoxTitle}>{t.title}</span>
                      </span>
                      <span className={styles.navBoxBlurb}>{t.blurb}</span>
                    </span>
                  </Link>
                  {i < row.length - 1 && <Connector className={styles.sequenceConnector} />}
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/** `external` picks how TrackTag navigates: `window.open` in a new tab
 *  for a Skelly University curriculum link, in-app history.push for a
 *  page on this site. `variant` picks this pill's accent, matching its
 *  PathGroup column below (see TrackVariant above). */
export type Track = { label: string; href: string; external: boolean; variant: TrackVariant };

/**
 * The curriculum DAG's 3100/3200/3300 specialization split, used by
 * TierPicker's Advanced box. Links go straight to the real, existing
 * module content in the `freemocap/university` repo (verified via the
 * GitHub API this session, not guessed) rather than the not-yet-built
 * Skelly University site, since that's the closest real thing to link
 * to today.
 */
export const SPECIALIZATION_TRACKS: Track[] = [
  {
    label: 'Technology',
    href: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3100-tech-overview.md',
    external: true,
    variant: 'technology',
  },
  {
    label: 'Science',
    href: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3200-science/3200-science-overview.md',
    external: true,
    variant: 'science',
  },
  {
    label: 'Art',
    href: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3300-art/3300-art-overview.md',
    external: true,
    variant: 'art',
  },
];

/**
 * Not one of the three specialization tracks, FMC Dev's own chip: this
 * site's Developer Docs landing page, not `freemocap/university`. Kept
 * separate from SPECIALIZATION_TRACKS (that name means the three career
 * tracks specifically) and placed first in TierPicker's Advanced box, to
 * match FMC Dev now being the first of the four Advanced columns.
 */
const DEV_TRACK: Track = { label: 'Dev', href: '/developers', external: false, variant: 'dev' };

/**
 * One chip inside the Advanced TierPicker box. Not a real `<a>`, an `<a>`
 * nested inside the box's own `<Link>` would be invalid HTML and browsers
 * handle that inconsistently. Instead this is a span styled and behaving
 * like a link (role, tabIndex, Enter/Space), that stops the click from
 * reaching the parent box and navigates itself: `window.open` for an
 * external track, in-app `history.push` for FMC Dev's own `/developers`
 * link, so leaving this site is the exception, not silently the default
 * for every chip here. Deliberately the opposite case from the "?"
 * tooltip: that button only ever informs and never navigates, this one
 * only ever navigates (elsewhere) and never informs.
 */
function TrackTag({ label, href, external, variant }: Track) {
  const history = useHistory();
  const go = () => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      history.push(href);
    }
  };
  return (
    <span
      className={`${styles.trackTag} ${styles[`trackTag--${variant}`]}`}
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
 * The top-level router, right under the hero: four big boxes, one per
 * curriculum level, each jumping straight to its matching Tier further
 * down the page. This, not the tiles inside each Tier, is meant to be the
 * first, most prominent choice a visitor makes. Whole box is the only
 * link, no separate styled CTA text inside it (that was the earlier "goes
 * to a different place than the box" problem).
 *
 * The four labels (Get Started / Beginner / Intermediate / Advanced) are
 * ordered to match Skelly University's own 1000/2000/3000/4000 module
 * numbering, but the numbers themselves aren't shown, just the ordering.
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
      label: 'Get Started',
      description: 'Install FreeMoCap and make your first recording.',
      to: '#get-started',
    },
    {
      label: 'Beginner',
      description: 'Set up your cameras and record with one, then several.',
      to: '#beginner',
    },
    {
      label: 'Intermediate',
      description: 'Dial in your calibration, choose a tracker, and process your data.',
      to: '#intermediate',
    },
    {
      label: 'Advanced',
      description: 'Specialization tracks.',
      to: '#advanced',
      tracks: [DEV_TRACK, ...SPECIALIZATION_TRACKS],
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
        User documentation for the <a href="https://freemocap.org" target="_blank" rel="noopener noreferrer">FreeMoCap</a> project.
      </p>
      <div className={styles.heroButtons}>
        <Link className={styles.buttonPrimary} to="/start/">
          Get Started
        </Link>
        <Link className={styles.buttonSecondary} to="/concepts/what-is-freemocap">
          What is FreeMoCap?
        </Link>
        <Link className={styles.buttonSecondary} to="/developers">
          Developer Docs
        </Link>
      </div>
    </header>
  );
}

/**
 * Skelly University. Reserved slot, honestly labelled. Links to this
 * site's own /tutorials/skelly-university explainer, not straight to
 * GitHub: that page is the canonical description now (it exists so
 * Tutorials' Tier 3 doesn't have to link out to the homepage or to raw
 * GitHub for this), and it links to the real curriculum repo itself as
 * its own next step. This card's blurb is a short teaser, not a copy of
 * that page's prose, the two are allowed to differ in wording as long as
 * they agree on the facts.
 */
export function ComingSoonSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>Coming Soon</h2>
      <div className={styles.cardGrid}>
        <Link to="/tutorials/skelly-university" className={`${styles.card} ${styles.cardMuted}`}>
          <h3 className={styles.cardTitle}>Skelly University</h3>
          <p className={styles.cardDescription}>
            A course-based path through markerless motion capture from first
            recording to specialized tracks in technology, science, and art. Will offer microcertification.
          </p>
          <span className={styles.cardComingSoon}>Read more</span>
        </Link>
      </div>
    </section>
  );
}

// Generic heading + multi-column link list section. Currently has exactly
// one call site: src/pages/index.tsx renders it with
// heading="Papers, talks, and community" as the homepage's canonical
// "Papers, talks, and community" section (see site-structure naming in
// src/theme/Footer/index.tsx) — a page-content section, not part of the
// footer, even though it sits directly above it on the homepage.
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
