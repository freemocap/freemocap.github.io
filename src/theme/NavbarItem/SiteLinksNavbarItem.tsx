import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { SITE_LINKS } from '@site/src/components/SiteSwitcher/sites';

// The three FreeMoCap sites at the top of the mobile menu. Nothing on
// desktop, where the logo's hover menu lists them instead
// (src/theme/Navbar/Logo).
export default function SiteLinksNavbarItem({ mobile }: { mobile?: boolean }): ReactNode {
  if (!mobile) return null;
  return (
    <li className="menu__list-item site-links-mobile">
      {SITE_LINKS.map((site) => (
        <Link
          key={site.label}
          className="site-links-mobile__link"
          to={site.href}
          {...(site.external ? { target: '_self', rel: 'noopener' } : {})}
          data-umami-event={site.external ? 'site_switch' : undefined}
          data-umami-event-target={site.external ? site.target : undefined}
        >
          {site.label}
        </Link>
      ))}
    </li>
  );
}
