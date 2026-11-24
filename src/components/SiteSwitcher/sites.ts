// The three FreeMoCap sites, as the docs site lists them in its logo's hover
// menu (src/theme/Navbar/Logo) and at the top of the mobile menu
// (src/theme/NavbarItem/SiteLinksNavbarItem). freemocap.org and the shop
// keep their own copies in the same order.
export const SITE_LINKS = [
  { label: 'Docs Home', href: '/', external: false, target: 'docs' },
  { label: 'Skelly Shop', href: 'https://shop.freemocap.org/?utm_source=docs.freemocap.org&utm_medium=site-switcher', external: true, target: 'shop' },
  { label: 'FreeMoCap.org', href: 'https://freemocap.org/', external: true, target: 'freemocap.org' },
] as const;
