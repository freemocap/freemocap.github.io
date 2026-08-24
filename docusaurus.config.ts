import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { navSections, aboutSection } from './src/data/sitePages';
import { loadRepos } from './data/repos';

// Triangulation, calibration and biomechanics pages carry real equations.
// Without a math plugin, MDX v3 reads the braces in `\varepsilon_{target}` as
// a JSX expression and the build fails.
const mathPlugins = { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] };

const repos = loadRepos(__dirname);

// Only repos that actually have docs get a plugin instance. Today that is
// freemocap and skellycam. The rest join by setting docs_path in repos.yml.
const externalRepos = repos.filter((r) => r.docs_path && r.route && r.id !== 'freemocap');

const sectionById = (id: string) => {
  const section = navSections.find((s) => s.id === id);
  if (!section) throw new Error(`No section "${id}" in src/data/sitePages.ts`);
  return section;
};

const sectionDropdown = (section: { hubPath: string; label: string; pages: { to: string; label: string }[] }) => ({
  type: 'dropdown' as const,
  to: section.hubPath,
  label: section.label,
  position: 'left' as const,
  items: section.pages.map((page) => ({ to: page.to, label: page.label })),
});

const config: Config = {
  title: 'FreeMoCap',
  tagline: 'Free and open-source research-grade markerless motion capture with ordinary webcams.',
  favicon: 'img/favicon.ico',

  url: 'https://docs.freemocap.org',
  baseUrl: '/',

  organizationName: 'freemocap',
  projectName: 'freemocap.github.io',

  // The mechanical enforcement of "no dead ends". Do not downgrade this to 'warn'.
  onBrokenLinks: 'throw',

  // #beginner/#intermediate/#advanced on the homepage are manually-added
  // ids on a custom React page, not MDX-generated heading anchors. They
  // work correctly (present in the built HTML, verified), but Docusaurus's
  // anchor checker only sees MDX-compiled anchors and flags these as
  // broken on every single build regardless. Confirmed false positive,
  // not a real defect, this isn't lowering rigor the way downgrading
  // onBrokenLinks above would. If a genuinely broken anchor shows up
  // elsewhere later, this won't catch it either, that's the tradeoff.
  onBrokenAnchors: 'ignore',


  markdown: { mermaid: true, hooks: { onBrokenMarkdownLinks: 'throw' } },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Local Lunr index, built at compile time. No external service, works
      // offline and on localhost. Swap for Algolia DocSearch if/when the
      // application is approved; the rest of the config is unaffected.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsPluginIdForPreferredVersion: 'default',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        // Instance 1: the versioned user docs (start, tutorials, guides, reference).
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars/docs.ts',
          ...mathPlugins,
          editUrl: 'https://github.com/freemocap/freemocap.github.io/tree/main/',
          lastVersion: 'current',
          versions: {
            // banner: 'none', permanently, not just until 1.x exists.
            // Docusaurus's 'unreleased' banner links to lastVersion (set
            // below this block to 'current'), so as long as current IS
            // lastVersion, that banner is self-referential regardless of
            // how many older versions exist. Confirmed live: with 1.x cut
            // and this set to 'unreleased', the banner read "see the
            // latest version (2.0 (alpha))" while standing on 2.0 (alpha).
            // A prior session's comment here assumed cutting 1.x alone
            // would fix it; it does not, this is why.
            current: { label: '2.0 (alpha)', path: '', banner: 'none' },
            // Cut from the V1 port with: npm run docusaurus docs:version 1.x
            // 'unmaintained' is correct here, non-circular: it points at
            // lastVersion ('current'), which is a different, newer version.
            '1.x': { label: '1.x (legacy)', path: '1.x', banner: 'unmaintained' },
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          editUrl: 'https://github.com/freemocap/freemocap.github.io/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            require.resolve('@freemocap/skellydocs/css/custom.css'),
            './src/css/custom.css',
          ],
        },
      },
    ],
  ],

  plugins: [
    // Instance 2: concepts. UNVERSIONED, deliberately.
    //
    // Docusaurus versions by copying the whole folder into a frozen snapshot.
    // That is correct for pages describing the software (2.0 install steps
    // differ from 2.1) and wrong for pages describing reality (what
    // triangulation is did not change between releases). Versioning is
    // configured per instance, so keeping concept pages unversioned means
    // keeping them in their own instance. Readers never see the seam.
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'concepts',
        path: 'concepts',
        routeBasePath: 'concepts',
        sidebarPath: './sidebars/concepts.ts',
        ...mathPlugins,
        editUrl: 'https://github.com/freemocap/freemocap.github.io/tree/main/',
      },
    ],

    // Instance 3: developer and architecture docs. Versions with the app.
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'build',
        path: 'build-docs',
        routeBasePath: 'build',
        sidebarPath: './sidebars/build.ts',
        ...mathPlugins,
        editUrl:
          'https://github.com/freemocap/freemocap/tree/main/freemocap-docs/',
      },
    ],

    // One instance per sub-repo with a docs source, generated from repos.yml.
    // Adding SkellyForge docs later is a one-line change to that file.
    ...externalRepos.map((repo) => [
      '@docusaurus/plugin-content-docs',
      {
        id: repo.id,
        // basename of docs_path: the fetch script copies the docs folder's
        // parent, so the sub-repo's own relative imports keep resolving.
        path: `external/${repo.id}/${repo.docs_path!.split('/').pop()}`,
        routeBasePath: repo.id,
        sidebarPath: './sidebars/external.ts',
        ...mathPlugins,
        editUrl: `${repo.repo}/tree/main/${repo.docs_path}/`,
      },
    ]),

    // Every V1 URL exists in papers, Discord history and YouTube descriptions.
    // All of them resolve. Generated from data/redirects.ts.
    [
      '@docusaurus/plugin-client-redirects',
      { redirects: require('./data/redirects') },
    ],

    // Exposes data/repos.yml to page components via usePluginData('repos-data-plugin').
    // The /developers polyrepo tree is the only consumer so far.
    require.resolve('./src/plugins/repos-data'),

    // Webpack 5 enforces full file extensions on ESM imports; tsup/esbuild
    // strips .js in unbundled output. Carried over from freemocap-docs.
    function skellydocsWebpackFixes() {
      return {
        name: 'skellydocs-webpack-fixes',
        configureWebpack() {
          return {
            module: {
              rules: [{ test: /\.m?js$/, resolve: { fullySpecified: false } }],
            },
            watchOptions: { ignored: ['**/.docusaurus/**'] },
          };
        },
      };
    },
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    image: 'img/og-image.png',
    colorMode: { defaultMode: 'dark', respectPrefersColorScheme: true },
    // Expanding one sidebar category collapses its sibling categories, so
    // moving from Tutorials to How-to (or between tutorial tiers) doesn't
    // leave every previously-visited section expanded at once.
    docs: { sidebar: { autoCollapseCategories: true } },
    navbar: {
      title: 'FreeMoCap',
      logo: { alt: 'FreeMoCap', src: 'img/logo.svg' },
      items: [
        // Start / Tutorials / How-to / Reference / About are one Docusaurus
        // instance (one sidebar, versioned together) and stay contiguous so
        // moving between them never swaps the whole sidebar out. Concepts
        // and Build are each a separate instance with their own sidebar
        // (see the "Instance" comments in the plugins list below); each
        // sits on only one edge of the group so a reader crosses that seam
        // once, not back and forth.
        //
        // Dropdown items come from src/data/sitePages.ts, the same source
        // the footer sitemap reads, so there is one list to update per
        // section instead of three. Docusaurus dropdown navbar items expand
        // on hover on desktop by default; no custom JS needed.
        sectionDropdown(sectionById('start')),
        // The one two-level menu on the site: tiers as the first level,
        // flyout-on-hover to each tier's pages as the second, matching the
        // sidebar's own Tier 1/2/3 grouping. Docusaurus's stock dropdown
        // rejects a dropdown nested inside a dropdown ("Nested dropdowns are
        // not allowed"), so this is a custom navbar item; see
        // src/theme/NavbarItem/TutorialsNavbarItem.tsx and the
        // ComponentTypes swizzle beside it. Every other section stays flat.
        //
        // Docusaurus renders every navbar item twice (desktop bar, mobile
        // drawer) and passes a `mobile` prop so an item can tell which one
        // it's in; the component itself branches on that to render a hover
        // flyout for desktop and a real two-level tap accordion (using
        // Docusaurus's own Collapsible primitive) for the drawer, so both
        // keep the tier grouping. An earlier version fell back to a second,
        // flat stock dropdown for mobile, which lost the tiers entirely.
        { type: 'custom-tutorialsDropdown', position: 'left' },
        sectionDropdown(sectionById('guides')),
        sectionDropdown(sectionById('reference')),
        // Concepts and Build are still separate Docusaurus instances (see
        // the comments at their plugin registrations below for why: per-
        // instance versioning, and Build standing in for a future fetched
        // instance), but that's an internal-only reason and doesn't need
        // two more top-level dropdowns exposing it. Concepts is reachable
        // as "Key Concepts" inside the About dropdown (see aboutSection in
        // src/data/sitePages.ts); Build is reachable through Developer
        // Docs below, which is already its front door (the polyrepo tree's
        // core box, plus the "Architecture docs" link).
        sectionDropdown(aboutSection),
        // Custom, not sectionDropdown, like Tutorials: Core/Pantheon/
        // Utility/More is a grouped, headered list, which Docusaurus's
        // stock flat dropdown can't render; see
        // src/theme/NavbarItem/DeveloperDocsNavbarItem.tsx. className
        // gives it the boxed look that sets it apart as a different kind
        // of section (contributor-facing, not part of the reader-facing
        // IA); see .navbar-developer-docs-item in src/css/custom.css.
        {
          type: 'custom-developerDocsDropdown',
          position: 'left',
          className: 'navbar-developer-docs-item',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          // Subtle only: this is the one dropdown that keeps Infima's own
          // small caret (every other one hides it, see the ::after rule
          // in custom.css), since it's the only item in the bar that
          // looks like a plain label otherwise, with nothing marking it
          // as a switcher.
          className: 'navbar-version-dropdown-item',
        },
        // The real download page (OS/GPU detection, release selector) lives
        // on the top-level site, not here, so this points straight at it
        // rather than routing through an internal page first. Same pattern
        // as the Code link below.
        { href: 'https://freemocap.org/download', label: 'Download', position: 'right' },
        {
          href: 'https://github.com/freemocap/freemocap',
          label: 'Code',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python', 'typescript', 'yaml'],
    },
    mermaid: { theme: { light: 'neutral', dark: 'dark' } },
  },
};

export default config;
