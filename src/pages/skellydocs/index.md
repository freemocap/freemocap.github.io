---
title: SkellyDocs
type: reference
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs
draft: false
---

# SkellyDocs

`@freemocap/skellydocs` is the shared Docusaurus theme package and CLI for every FreeMoCap documentation site. Each repo's docs folder contains only content, markdown, images, and a thin config, while the React components, CSS design tokens, and site scaffolding come from this package. It is published to npm, MIT licensed, and part of the polyrepo's utility tier: infrastructure any of the pipeline repos can depend on.

Runtime dependencies are just `handlebars` and `prompts` (both used only by the CLI). Everything Docusaurus-related is a peer dependency: `@docusaurus/core`, `@docusaurus/preset-classic`, `@docusaurus/theme-mermaid`, `@mdx-js/react`, `prism-react-renderer`, and React 18 or 19. Building it requires Node >= 24.

Version note: this site declares `^0.3.10` in its `package.json`; the source clone documented here is at 0.3.17.

## How this site uses it

This site (FreeMoCap.github.io) is itself a consumer, and it exercises a narrower slice of the package than the standalone sub-repo sites do:

- **Theme CSS.** `docusaurus.config.ts` loads `require.resolve('@freemocap/skellydocs/css/custom.css')` as the *first* entry in the classic preset's `customCss` array, with the site's own `src/css/custom.css` layered after it. The package supplies the design-token baseline and dark-theme Infima overrides; everything site-specific (primary color pulled from FreeMoCap.org's palette, navbar dropdown styling, version-badge placement) lives in the local layer. One known gap patched locally: the package defines `--ifm-background-color` only for `[data-theme='dark']` (`#0a0818`) and never for `:root`, so light mode rendered a transparent page background until this site added an explicit white value.
- **A webpack compatibility shim.** The config carries a `skellydocsWebpackFixes` plugin that sets `resolve.fullySpecified: false` for `.m?js` files and ignores `.docusaurus/` in watch options. It exists because the package ships unbundled ESM output (tsup/esbuild strips `.js` extensions from relative imports) while webpack 5 enforces full extensions on ESM. Every SkellyDocs-based site repeats this plugin; the CLI scaffolds it into new ones.
- **Components, indirectly.** This site's own pages do not import the package's React components. The homepage is fully custom. But the aggregated sub-repo docs do: the fetched SkellyCam docs (mounted at `/skellycam/`) import `AiGeneratedBanner`, `Tip`, `CoreFeatureHeader`, and `LinkedIssues` throughout, so those components ship in this site's bundle whether or not its hand-written pages use them.

## What the package exports

The entry point (`src/index.ts`) re-exports everything below plus the shared TypeScript types.

| Export | Kind | Purpose |
|---|---|---|
| `IndexPage` | Component | Full landing page: hero, feature cards, guarantees |
| `HeroSection`, `FeaturesSection`, `GuaranteesSection` | Components | The individual landing-page sections, for compose-it-yourself layouts |
| `RoadmapPage` | Component | `/roadmap` route wrapper around `RoadmapContent` |
| `RoadmapContent` | Component | The roadmap dashboard: fetch, cache, filter, search, sort, grid/list views |
| `RoadmapEntry` | Component | A single roadmap card |
| `Tip` | Component | Inline tooltip, CSS-only hover or two-stage progressive disclosure |
| `LinkedIssues` | Component | Collapsible list of GitHub issues/PRs with badges, enriched live |
| `AiGeneratedBanner` | Component | Collapsible AI-content disclaimer banner |
| `CoreFeatureHeader` | Component | Summary-plus-linked-issues block for feature doc pages |
| `collectLinkedUrls` | Function | Extracts every unique issue/PR URL from a content config |
| `./css/custom.css`, `./css/theme.module.css` | CSS | Design tokens and component styles, exported from source |

## The content config and landing page

A consuming repo describes its landing page in a typed `content.config.tsx` implementing `SkellyDocsConfig`:

| Field | Type | Notes |
|---|---|---|
| `hero` | `HeroConfig` | `title`, `accentedSuffix` (rendered in the accent color), `subtitle`, `tagline`, `logoSrc`, `parentProject` (`name`/`url`, auto-linkified wherever it appears in `subtitle`), optional `ctaButtons` |
| `features` | `CoreFeature[]` | Each has `id`, `icon`, `title`, `description`, `summary` (ReactNode shown on the card), `issues` (`LinkedIssue[]`), and `docPath` (the card links to `/docs/<docPath>`) |
| `guarantees` | `string[]` | Legacy plain-string list |
| `guaranteeIssues` | `LinkedIssue[]` | Legacy issues attached to the guarantees section |
| `guaranteesConfig` | optional override | Replaces the guarantees section's `title`, `items`, and `issues` wholesale; takes precedence over the two legacy fields |
| `hideSections` | optional | Array of `"hero" \| "features" \| "guarantees"` to drop from the default layout |
| `projectBoardUrl` | optional | Adds a "View full project board" link on the roadmap page |

`IndexPage` supports three levels of customization, per its own docstring: set config fields (including the overrides preceding); pass `children` to replace the default section layout entirely; or skip `IndexPage` and import `HeroSection`/`FeaturesSection`/`GuaranteesSection` directly to reorder or interleave sections. Cards render their `issues` through `LinkedIssues`, and feature-card links assume the standard `routeBasePath: 'docs'` layout.

## The roadmap

`RoadmapPage` takes a `repo` slug (plus optional `roadmapLabel`, `pinnedIssues`, `title`, `projectBoardUrl`) and fills itself from the GitHub API. Items reach the dashboard two ways, merged and deduplicated by issue number:

1. **Labeled**, anything carrying the `roadmap` label in the repo, fetched via `api.github.com` with `state=all` and up to 100 items. The label itself is filtered out of the displayed chips.
2. **Pinned**, any issue/PR URL referenced anywhere in the content config, collected by `collectLinkedUrls` and passed as `pinnedIssues`. Pinned items get a "pinned" badge; an item that is both labeled and pinned counts once.

Caching lives in `localStorage` with a five-minute TTL and ETag support: repeat visits send `If-None-Match`, a `304` refreshes the timestamp without refetching, and a `403` (rate limit) falls back to cached data with an error banner explaining exactly that. A Retry button clears the caches and refetches.

The UI offers free-text search across titles and excerpts, chip filters for type (issue/PR), status (open/closed), and source (labeled/pinned, only when pins exist), clickable label pills derived from the fetched items, sort by recently updated/newest/oldest, and a grid/list toggle. A collapsible "About this roadmap" section explains the mechanics, including an issues-vs-pull-requests primer aimed at non-developer readers. Card excerpts are generated from the issue body: code fences and HTML comments stripped, markdown characters removed, first two sentences capped at 280 characters.

## In-page components

### Tip

Two modes in one component:

- **Legacy**, pass `text` and get a pure-CSS hover tooltip.
- **Two-stage**, pass `shortInfo` (and optionally `longInfo`): hover shows the short info, clicking expands the full explanation inline, and an optional `href` appends a "Learn more" link. Hides after a 150 ms delay on mouse leave, closes on outside click, and collapses fully on dismiss.

### LinkedIssues

A collapsible "Linked Issues" row (with a count badge) for use near the top of MDX pages. Items need only `label` and `url`; `status`, `type`, and `labels` are fetched from the GitHub API the first time the section is expanded, then cached in `localStorage` for five minutes keyed by the item URLs. Rendered enrichment includes Issue/PR badges, open/closed markers, and label chips colored from each label's GitHub color. Non-GitHub URLs are displayed as plain links without enrichment. An optional `defaultOpen` prop starts the section expanded.

### `AiGeneratedBanner`

A collapsed-by-default `<details>` banner declaring how the page was produced. Three generation types are registered internally:

| Type | Meaning |
|---|---|
| `ai-generated` (default) | Page drafted entirely by AI from the codebase or prompt instructions |
| `ai-transformatted` | Human provided raw material; AI restructured it (livestream to blog post, meeting notes to docs) |
| `human-generated` | Page written entirely by a human author |

Optional props: `humanCurated` (adds a checked "curated" badge and review sentence), `generatedAt` and `model` (shown as metadata rows), `humanNotes` (curator notes in an accented block), and `moreInfoUrl` (defaults to the generation-types explainer on the deployed SkellyDocs site; pass an empty string to hide the link). Expanding the banner also reveals a nested overview of all three types with the current one highlighted. Passing `repo` turns the disclaimer into an actionable one: it links to a prefilled documentation-issue template in that repo.

Per its own repo convention (stated in its CLAUDE.md), every `.mdx` page starts with `<AiGeneratedBanner />`.

### `CoreFeatureHeader`

Renders a feature's icon, summary, and linked issues as a header block, so a feature's doc page visually matches its card on the landing page.

## CSS design tokens

`custom.css` defines the palette as `--sk-*` variables consumed by `theme.module.css`, so overriding one variable re-themes every component:

| Token | Default | Purpose |
|---|---|---|
| `--sk-bg-deep` | `#06050e` | Page background |
| `--sk-bg-surface` | `#0e0c1a` | Card/surface background |
| `--sk-border` | `#1a1730` | Borders and dividers |
| `--sk-text` | `#e8e6f0` | Primary text |
| `--sk-text-dim` | `#b0aec3` | Secondary/muted text |
| `--sk-accent` | `#6ee7b7` | Accent color |
| `--sk-accent-dim` | `rgba(110, 231, 183, 0.15)` | Accent background tint |
| `--sk-purple` | `#a78bfa` | Secondary accent |
| `--sk-purple-dim` | `rgba(167, 139, 250, 0.1)` | Secondary accent tint |
| `--sk-mono` | JetBrains Mono stack | Monospace font |

Beyond the tokens, the style sheet also sets Infima-level values: a purple `--ifm-color-primary` scale, dark backgrounds (`#0a0818` page, `#110e20` surface), a blurred translucent navbar, footer and active-sidebar-item styling, and a JetBrains Mono import. The file's own header calls it "plumbing only." Component styles belong in `theme.module.css`.

## The CLI

The `skellydocs` binary (built from `src/bin/create-skellydocs.ts` into a single bundled file with a node shebang) has two commands; running it bare runs `init`.

### `init`

Prompts for:

- Project name (defaults to the current directory's name)
- Source code URL (bare `org/repo` slugs are normalized to GitHub URLs; GitLab, Codeberg, Gitea-style forges are recognized when building edit links)
- Project website URL
- Project board URL (GitHub Projects, Linear, etc.)
- Path to a logo file (validated to exist; skipped means a placeholder skeleton logo)

It then scaffolds `<projectName>-docs/` containing a complete site: `package.json` (pinning `@freemocap/skellydocs` to the CLI's own version), `docusaurus.config.ts` (dark mode by default, mermaid enabled, the webpack fix plugin, the package CSS, and a "Built with SkellyDocs" footer), `content.config.tsx` pre-filled with example features and guarantees, `sidebars.ts`, `tsconfig.json`, starter `intro.mdx` and `ai-generated-banner.mdx` docs, a welcome blog post, `src/pages/index.tsx` and `roadmap.tsx` wrappers wired to the config, and the logo. The `editUrl` is constructed per forge, and the site `url`/`baseUrl` are derived from the answers.

One special case: scaffolding *inside* the SkellyDocs repo itself wires the dependency as `file:..` instead of a version. That is exactly how the `skellydocs-docs/` dogfood site is produced.

The completion message documents the two ways onto the roadmap (add the `roadmap` label, or reference issues in the config) and points at the `update` command.

### `update`

Pulls the latest published theme into an existing site, from the site root:

```bash
npx @freemocap/skellydocs@latest update
```

It is deliberately defensive. It refuses to run where there is no `package.json`, where SkellyDocs is not a dependency at all, and where the dependency is a `file:`/`link:`/`workspace:` spec (that is the dogfood site, which tracks the workspace directly). It reports the declared spec, the installed version, and the latest version from the npm registry; if both the install and the spec are already current it no-ops. Otherwise it installs `@freemocap/skellydocs@latest` (preserving a devDependency declaration), then runs the site's build to prove nothing broke, unless `--skip-build` was passed. Running via `npx ...@latest` means even sites whose installed version predates the `update` command can use it.

Because components update through the package, new props are opt-in additions; existing sites keep building unchanged.

## Layout and development

```
skellydocs/
├── src/
│   ├── index.ts               Package entry, re-exports components + types
│   ├── types.ts               All shared TypeScript types
│   ├── bin/create-skellydocs.ts   CLI (Node.js APIs allowed here only)
│   ├── theme/                 React components (browser-side, no Node.js APIs)
│   └── css/                   custom.css (tokens) + theme.module.css (component styles)
├── templates/                 Handlebars templates the CLI renders
├── scripts/                   copy-css.mjs, rebuild-dogfood.mjs
├── skellydocs-docs/           Dogfood docs site (workspace member, generated)
└── tsup.config.ts             Two build configs (see below)
```

tsup produces two separate bundles. Theme components compile unbundled as ESM (so relative CSS-module imports survive and Docusaurus's webpack resolves them at site build time) with React, Docusaurus, and CSS marked external; the CLI compiles as one self-contained bundle, with `handlebars` and `prompts` kept external because their CommonJS dynamic requires of Node builtins cannot be converted to ESM. A post-build script copies `src/css` into `dist/css`, the package exports CSS from source, not from the build output.

Development workflow (from the repo):

```bash
npm install                    # workspace setup
npm run build                  # build the theme package (required before the docs site)
npm run dev                    # watch mode
npm start -w skellydocs-docs   # run the dogfood site
npm run typecheck              # tsc --noEmit
```

The dogfood site is treated as a faithful rendering of CLI output and is never edited directly: fix things in `templates/` and regenerate with `npm run rebuild-dogfood`, which deletes the site, rebuilds the package, re-scaffolds from the templates, and reinstalls workspace links (`scripts/rebuild-dogfood.mjs` also accepts `--keep` to regenerate without deleting first, and is the non-interactive equivalent of `init`). Stop any running dev server before rebuilding, regenerating underneath a watching webpack can corrupt its cache.

Releases use release-it: `npm run release` (interactive) bumps the version, commits, tags, pushes, and creates a GitHub Release with auto-generated notes, gated on a clean working directory on `main` and on typecheck plus build passing first. npm publishing itself is turned off in the release config, CI publishes. Dry-run with `npm run release -- --dry-run`.

Contributing conventions, per the repo's CLAUDE.md: use `.mdx` everywhere so component imports are explicit; start every page with `AiGeneratedBanner`; keep Node.js imports out of `src/theme/` (it compiles for the browser, Node APIs belong in `src/bin/`); and use `--sk-*` tokens rather than hardcoded values in component styles.

[← Back to Developer Docs](/developers)
