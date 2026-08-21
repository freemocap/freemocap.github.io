import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { navSections, aboutSection } from './src/data/sitePages';

// Triangulation, calibration and biomechanics pages carry real equations.
// Without a math plugin, MDX v3 reads the braces in `\varepsilon_{target}` as
// a JSX expression and the build fails.
const mathPlugins = { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] };

type Repo = {
  id: string;
  name: string;
  tier: string;
  docs_path: string | null;
  route: string | null;
};

const repos = yaml.load(readFileSync('./data/repos.yml', 'utf8')) as Repo[];

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
            // banner: 'none', not 'unreleased': the 'unreleased' banner's
            // text points readers at "the latest version," but there is no
            // other version yet, lastVersion is 'current' too, so it was
            // telling readers to go see the exact page they were already
            // on. Revert to 'unreleased' when 1.x (below) actually exists
            // as something distinct to point to.
            current: { label: '2.0 (alpha)', path: '', banner: 'none' },
            // The frozen 1.x version is cut from the reviewed V1 port with:
            //     npm run docusaurus docs:version 1.x
            // Run that ONCE, after the port is reviewed and before the V2
            // rewrites begin, then add:
            //     '1.x': { label: '1.x (legacy)', path: '1.x', banner: 'unmaintained' }
            // Cutting it now would snapshot a version identical to current,
            // which would tell readers something untrue.
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
        editUrl: `${(repo as any).repo}/tree/main/${repo.docs_path}/`,
      },
    ]),

    // Every V1 URL exists in papers, Discord history and YouTube descriptions.
    // All of them resolve. Generated from data/redirects.ts.
    [
      '@docusaurus/plugin-client-redirects',
      { redirects: require('./data/redirects') },
    ],

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
        sectionDropdown(aboutSection),
        sectionDropdown(sectionById('concepts')),
        sectionDropdown(sectionById('build')),
        { type: 'docsVersionDropdown', position: 'right' },
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
