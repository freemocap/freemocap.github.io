import React, { type ReactNode } from 'react';
import NavbarLogo from '@theme-original/Navbar/Logo';
import Link from '@docusaurus/Link';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import { SITE_LINKS } from '@site/src/components/SiteSwitcher/sites';
import styles from './styles.module.css';

// The navbar logo, wrapped. Clicking it goes to the docs home, as always. On
// desktop, hovering it (or tabbing to it) also opens a menu of the three
// FreeMoCap sites. On phones it just goes home; the three sites are at the
// top of the mobile menu (src/theme/NavbarItem/SiteLinksNavbarItem).
//
// Docusaurus renders this same component in the mobile menu's header, where
// it's the plain logo.
export default function NavbarLogoWrapper(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  if (mobileSidebar.shown) return <NavbarLogo />;

  return (
    <div className={styles.switcher}>
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
