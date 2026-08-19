import React, { useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { tutorialTiers as tiers } from '@site/src/data/sitePages';

export default function TutorialsNavbarItem(): React.JSX.Element {
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // The flyout is rendered as a sibling of the tier list, not nested inside
  // it: the tier list is Infima's own .dropdown__menu, which has
  // overflow: auto by default, so a second menu positioned at left: 100%
  // *inside* it doesn't escape, it just grows the scrollable area and hands
  // you a scrollbar. Rendering it as a sibling and positioning it from
  // measured geometry sidesteps that entirely.
  const openTier = (index: number, e: React.MouseEvent<HTMLElement>) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const menuRect = menuRef.current?.getBoundingClientRect();
    const tierRect = e.currentTarget.getBoundingClientRect();
    if (containerRect && menuRect) {
      setFlyoutPos({
        top: tierRect.top - containerRect.top,
        left: menuRect.right - containerRect.left,
      });
    }
    setActiveTier(index);
  };

  return (
    <div
      className="navbar__item dropdown dropdown--hoverable"
      ref={containerRef}
      onMouseLeave={() => setActiveTier(null)}
    >
      <Link className="navbar__link" to="/tutorials/">
        Tutorials
      </Link>
      <ul className="dropdown__menu" ref={menuRef}>
        {tiers.map((tier, index) => (
          <li key={tier.label} onMouseEnter={(e) => openTier(index, e)}>
            <a
              className="dropdown__link"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-haspopup="true"
              aria-expanded={activeTier === index}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}
            >
              {tier.label}
              <span aria-hidden="true" style={{ opacity: 0.6 }}>›</span>
            </a>
          </li>
        ))}
      </ul>
      {activeTier !== null && (
        <ul
          className="dropdown__menu"
          style={{ position: 'absolute', top: flyoutPos.top, left: flyoutPos.left }}
        >
          {tiers[activeTier].pages.map((page) => (
            <li key={page.to}>
              <Link className="dropdown__link" to={page.to}>
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
