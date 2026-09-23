import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { type Repo } from '@site/src/utils/repo';
import styles from './styles.module.css';

const CANVAS_W = 960;
const CANVAS_H = 400;

const CORE_BOX = { w: 240, h: 100 };
const PANTHEON_BOX = { w: 170, h: 84 };
const UTILITY_BOX = { w: 130, h: 64 };

const CAPTION_CORE_Y = 16;
const CORE_Y = 30;
const BRANCH_Y = 158; // horizontal connector between the trunk and the pantheon stems
const CAPTION_PANTHEON_Y = 172;
const PANTHEON_Y = 186;
// Wider gap than core-to-pantheon: the utility tier isn't wired into the
// tree at all (see the connectors group below), and the extra vertical
// distance is what reads as "floating" on its own, no line needed.
const CAPTION_UTILITY_Y = 302;
const UTILITY_Y = 316;

// Left-edge x for `count` boxes of `boxWidth`, evenly spaced with `gap`,
// centered in a canvas of `canvasWidth`. Used for both the pantheon and
// utility rows so a repo joining either tier just needs a new entry in
// data/repos.yml, not a layout change here.
function rowLefts(count: number, boxWidth: number, gap: number, canvasWidth: number): number[] {
  const totalWidth = count * boxWidth + (count - 1) * gap;
  const start = (canvasWidth - totalWidth) / 2;
  return Array.from({ length: count }, (_, i) => start + i * (boxWidth + gap));
}

function Box({
  x,
  y,
  w,
  h,
  repoId,
  name,
  route,
  variant,
  fontSize,
  iconSize,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  repoId: string;
  name: string;
  route: string;
  variant: 'core' | 'pantheon' | 'utility';
  fontSize: number;
  iconSize: number;
}): ReactNode {
  const cx = x + w / 2;
  const iconTop = y + h * 0.08;
  return (
    <Link to={route} className={styles.boxLink}>
      <rect x={x} y={y} width={w} height={h} rx={variant === 'utility' ? 8 : 12} className={[styles.box, styles[variant]].join(' ')} />
      {/* The 7 composite logos (not the bare freemocap skull, not skellycam's
          own real art) bake `opacity="0.55"` into their <image>, muting the
          skull by blending toward whatever's behind it. .core/.pantheon's
          fill is var(--ifm-color-emphasis-100) (theme-reactive) and .utility
          is transparent, so in light mode that blend target is near-white
          and the skull washes out. A plain rect behind the image fixed the
          wash-out but showed as a visible black square around the skull
          (2026-08-25 feedback: looked bad, mask it to the logo's own shape
          instead). Using the same logo image as an alpha mask on the rect
          means the dark fill only shows through exactly where the logo
          itself has non-transparent pixels, no visible box. Fully-opaque
          images (freemocap) mask in as a full square, same as before, zero
          visible difference since the image already covers it completely. */}
      <mask id={`logo-mask-${repoId}`} className={styles.alphaMask}>
        <image
          href={`/img/logos/${repoId}.svg`}
          x={cx - iconSize / 2}
          y={iconTop}
          width={iconSize}
          height={iconSize}
        />
      </mask>
      <rect
        x={cx - iconSize / 2}
        y={iconTop}
        width={iconSize}
        height={iconSize}
        fill="#0a0818"
        mask={`url(#logo-mask-${repoId})`}
      />
      <image
        href={`/img/logos/${repoId}.svg`}
        x={cx - iconSize / 2}
        y={iconTop}
        width={iconSize}
        height={iconSize}
        className={styles.icon}
      />
      <text x={cx} y={y + h - 10} textAnchor="middle" className={styles.label} fontSize={fontSize}>
        {name}
      </text>
      <title>{name}</title>
    </Link>
  );
}

export default function PolyrepoTree({ repos }: { repos: Repo[] }): ReactNode {
  const core = repos.find((r) => r.tier === 'core');
  const pantheon = repos.filter((r) => r.tier === 'pantheon');
  const utility = repos.filter((r) => r.tier === 'utility');

  const pantheonLefts = rowLefts(pantheon.length, PANTHEON_BOX.w, 24, CANVAS_W);
  const utilityLefts = rowLefts(utility.length, UTILITY_BOX.w, 24, CANVAS_W);
  const pantheonCenters = pantheonLefts.map((x) => x + PANTHEON_BOX.w / 2);
  const coreX = (CANVAS_W - CORE_BOX.w) / 2;
  const coreCenterX = CANVAS_W / 2;

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className={styles.svg} role="img" aria-label="FreeMoCap polyrepo architecture">
        <g className={styles.captions}>
          <text x={coreCenterX} y={CAPTION_CORE_Y} textAnchor="middle">Core</text>
          <text x={coreCenterX} y={CAPTION_PANTHEON_Y} textAnchor="middle">Pantheon</text>
          <text x={coreCenterX} y={CAPTION_UTILITY_Y} textAnchor="middle">Utility</text>
        </g>

        {/* Core-to-pantheon connectors only: the utility tier floats,
            deliberately not wired into the tree, since those repos are
            shared infrastructure any part of the pipeline can depend on
            rather than pipeline stages themselves. */}
        <g className={styles.connectors}>
          <line x1={coreCenterX} y1={CORE_Y + CORE_BOX.h} x2={coreCenterX} y2={BRANCH_Y} />
          <line x1={pantheonCenters[0]} y1={BRANCH_Y} x2={pantheonCenters[pantheonCenters.length - 1]} y2={BRANCH_Y} />
          {pantheonCenters.map((cx, i) => (
            <line key={i} x1={cx} y1={BRANCH_Y} x2={cx} y2={PANTHEON_Y} />
          ))}
        </g>

        {core && (
          <Box
            x={coreX}
            y={CORE_Y}
            w={CORE_BOX.w}
            h={CORE_BOX.h}
            repoId={core.id}
            name={core.name}
            route={core.route!}
            variant="core"
            fontSize={16}
            iconSize={56}
          />
        )}

        {pantheon.map((repo, i) => (
          <Box
            key={repo.id}
            x={pantheonLefts[i]}
            y={PANTHEON_Y}
            w={PANTHEON_BOX.w}
            h={PANTHEON_BOX.h}
            repoId={repo.id}
            name={repo.name}
            route={repo.route!}
            variant="pantheon"
            fontSize={13}
            iconSize={46}
          />
        ))}

        {utility.map((repo, i) => (
          <Box
            key={repo.id}
            x={utilityLefts[i]}
            y={UTILITY_Y}
            w={UTILITY_BOX.w}
            h={UTILITY_BOX.h}
            repoId={repo.id}
            name={repo.name}
            route={repo.route!}
            variant="utility"
            fontSize={11}
            iconSize={34}
          />
        ))}
      </svg>
    </div>
  );
}
