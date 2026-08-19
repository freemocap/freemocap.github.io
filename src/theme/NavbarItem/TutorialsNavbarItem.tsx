import React, { useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { useCollapsible, Collapsible } from '@docusaurus/theme-common';
import { tutorialTiers as tiers, type Tier } from '@site/src/data/sitePages';

// Docusaurus renders every navbar item twice, once for the desktop bar
// (Navbar/Content, no `mobile` prop) and once for the drawer
// (Navbar/MobileSidebar/PrimaryMenu, `mobile` prop set, see
// node_modules/@docusaurus/theme-classic/src/theme/Navbar/MobileSidebar/PrimaryMenu).
// Stock item types have separate desktop/mobile implementations Docusaurus
// picks between; a custom type gets one component for both, so this reads
// that prop itself and renders two genuinely different things: a
// hover flyout for desktop, a tap accordion for the drawer, both built from
// the same tiers/pages data. Docusaurus's own CSS already hides whichever
// container doesn't match the viewport, so neither branch needs its own
// show/hide CSS.
export default function TutorialsNavbarItem({
  mobile,
  onClick,
  className,
}: {
  mobile?: boolean;
  onClick?: () => void;
  className?: string;
}): React.JSX.Element {
  return mobile ? (
    <TutorialsMobileItem onClick={onClick} />
  ) : (
    <TutorialsDesktopItem className={className} />
  );
}

function TutorialsDesktopItem({ className }: { className?: string }): React.JSX.Element {
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
      className={`navbar__item dropdown dropdown--hoverable${className ? ` ${className}` : ''}`}
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

// Mirrors Docusaurus's own mobile sidebar category markup exactly
// (.menu__list-item / .menu__list-item-collapsible / .menu__caret /
// .menu__list, plus the theme-common Collapsible it uses internally) so
// this looks and animates identically to every native item, two levels
// deep: Tutorials, then each tier, then its pages.
function TutorialsMobileItem({ onClick }: { onClick?: () => void }): React.JSX.Element {
  const { collapsed, toggleCollapsed } = useCollapsible({ initialState: true });

  return (
    <li className={`menu__list-item${collapsed ? ' menu__list-item--collapsed' : ''}`}>
      <div className="menu__list-item-collapsible">
        <Link className="menu__link menu__link--sublist" to="/tutorials/" onClick={onClick}>
          Tutorials
        </Link>
        <button
          type="button"
          className="clean-btn menu__caret"
          aria-label={collapsed ? 'Expand sidebar category "Tutorials"' : 'Collapse sidebar category "Tutorials"'}
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.preventDefault();
            toggleCollapsed();
          }}
        />
      </div>
      <Collapsible as="ul" className="menu__list" collapsed={collapsed} lazy>
        {tiers.map((tier) => (
          <TierMobileItem key={tier.label} tier={tier} onClick={onClick} />
        ))}
      </Collapsible>
    </li>
  );
}

function TierMobileItem({ tier, onClick }: { tier: Tier; onClick?: () => void }): React.JSX.Element {
  const { collapsed, toggleCollapsed } = useCollapsible({ initialState: true });

  return (
    <li className={`menu__list-item${collapsed ? ' menu__list-item--collapsed' : ''}`}>
      <div className="menu__list-item-collapsible">
        <a
          className="menu__link menu__link--sublist"
          href="#"
          role="button"
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.preventDefault();
            toggleCollapsed();
          }}
        >
          {tier.label}
        </a>
        <button
          type="button"
          className="clean-btn menu__caret"
          aria-label={collapsed ? `Expand sidebar category "${tier.label}"` : `Collapse sidebar category "${tier.label}"`}
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.preventDefault();
            toggleCollapsed();
          }}
        />
      </div>
      <Collapsible as="ul" className="menu__list" collapsed={collapsed} lazy>
        {tier.pages.map((page) => (
          <li className="menu__list-item" key={page.to}>
            <Link className="menu__link" to={page.to} onClick={onClick}>
              {page.label}
            </Link>
          </li>
        ))}
      </Collapsible>
    </li>
  );
}
