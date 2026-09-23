import { navSections, aboutSection, tutorialTiers } from '../src/data/sitePages';

// One tree, rendered two ways. To a reader, Start / Tutorials / How-to /
// Reference / About+Key Concepts is one continuous sidebar. Under the
// hood, Key Concepts pages live in a separate, unversioned Docusaurus
// instance (see docusaurus.config.ts for why), which normally means
// Docusaurus swaps in a completely different sidebar the moment a reader
// lands on one of those pages, exactly the "takes me to a separate menu"
// problem this file exists to avoid.
//
// buildDocsTree(activeInstance) builds the identical tree for either
// instance's sidebar config. Pages native to `activeInstance` render as
// real `type: 'doc'` items (bare id, no leading slash), so Docusaurus
// validates them and highlights the current one; every other page
// renders as `type: 'link'` (full href), clickable but not doc-checked.
// The only thing that changes between the two renderings is which
// branch is "real" and which is "links" — same labels, same nesting,
// same order, so clicking between a docs page and a concepts page
// never swaps the sidebar's shape out from under the reader.

type Instance = 'docs' | 'concepts';

function pageItem(to: string, label: string, activeInstance: Instance) {
  const nativeInstance: Instance = to.startsWith('/concepts/') ? 'concepts' : 'docs';
  if (nativeInstance !== activeInstance) {
    return { type: 'link' as const, label, href: to };
  }
  const id = nativeInstance === 'concepts' ? to.slice('/concepts/'.length) : to.slice(1);
  return id.replace(/\/$/, '');
}

function sectionItems(id: string, activeInstance: Instance) {
  const found = navSections.find((s) => s.id === id);
  if (!found) {
    throw new Error(`No navSection "${id}" in src/data/sitePages.ts`);
  }
  return found.pages.map((p) => pageItem(p.to, p.label, activeInstance));
}

function hubLink(docId: string, activeInstance: Instance) {
  return activeInstance === 'docs' ? { type: 'doc' as const, id: docId } : undefined;
}

export function buildDocsTree(activeInstance: Instance) {
  const conceptsPages = navSections.find((s) => s.id === 'concepts')!.pages;

  return [
    {
      type: 'category' as const,
      label: 'Get started',
      link: hubLink('start/index', activeInstance),
      items: sectionItems('start', activeInstance),
    },
    {
      type: 'category' as const,
      label: 'Tutorials',
      link: hubLink('tutorials/index', activeInstance),
      items: tutorialTiers.map((tier, i) => ({
        type: 'category' as const,
        label: tier.label,
        collapsed: i !== 0,
        items: tier.pages.map((p) => pageItem(p.to, p.label, activeInstance)),
      })),
    },
    {
      type: 'category' as const,
      label: 'How-to guides',
      link: hubLink('guides/index', activeInstance),
      items: sectionItems('guides', activeInstance),
    },
    {
      type: 'category' as const,
      label: 'Reference',
      link: hubLink('reference/index', activeInstance),
      items: sectionItems('reference', activeInstance),
    },
    {
      type: 'category' as const,
      label: 'About',
      link: hubLink('about/index', activeInstance),
      items: [
        pageItem('/about/about-us', 'About FreeMoCap', activeInstance),
        // No link of its own, same as the tutorial tiers above: a pure
        // expand/collapse toggle, not a page.
        {
          type: 'category' as const,
          label: 'Key Concepts',
          items: conceptsPages.map((p) => pageItem(p.to, p.label, activeInstance)),
        },
        // about-us is placed first above, and Key Concepts is the real
        // sub-category above too, not this flat "/concepts/" entry:
        // aboutSection.pages carries both only because the navbar
        // dropdown and footer (which can't nest) still read it as one
        // flat list.
        ...aboutSection.pages
          .filter((p) => p.to !== '/about/about-us' && p.to !== '/concepts/')
          .map((p) => pageItem(p.to, p.label, activeInstance)),
      ],
    },
    // Build doesn't get a branch here: it's reached through Developer
    // Docs (the polyrepo tree's core box, plus "Architecture docs"), and
    // stays out of this mirror rather than growing it to cover every
    // present and future per-repo instance too.
    { type: 'link' as const, label: 'Developer Docs', href: '/developers' },
  ];
}
