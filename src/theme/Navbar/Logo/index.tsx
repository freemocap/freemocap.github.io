import React, { type MouseEvent, type ReactNode } from 'react';
import NavbarLogo from '@theme-original/Navbar/Logo';
import Link from '@docusaurus/Link';
import { useWindowSize } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import { SITE_LINKS } from '@site/src/components/SiteSwitcher/sites';
import styles from './styles.module.css';

// The navbar logo, wrapped. Clicking it still goes to the docs home. On
// desktop, hovering it (or tabbing to it) opens a menu of the three FreeMoCap
// sites. On phones the first tap opens the mobile menu instead (where the
// sites are listed at the top); the logo in the open menu's header goes home.
//
// Docusaurus renders this same component in the mobile menu's header, where
// the menu is already open, so there it's the plain logo.
export default function NavbarLogoWrapper(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const windowSize = useWindowSize();

  if (mobileSidebar.shown) return <NavbarLogo />;

  const onClickCapture = (e: MouseEvent) => {
    if (windowSize === 'mobile' && !mobileSidebar.disabled) {
      e.preventDefault();
      e.stopPropagation();
      mobileSidebar.toggle();
    }
  };

  return (
    <div className={styles.switcher} onClickCapture={onClickCapture}>
      <NavbarLogo />
      <span className={styles.chevron} aria-hidden="true">
        ▾
      </span>
      <ul className={styles.menu} aria-label="FreeMoCap sites">
        {SITE_LINKS.map((site) => (
          <li key={site.label}>
            <Link
              className="dropdown__link"
              to={site.href}
              {...(site.external ? { target: '_self', rel: 'noopener' } : {})}
              data-umami-event={site.external ? 'site_switch' : undefined}
              data-umami-event-target={site.external ? site.target : undefined}
            >
              {site.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
