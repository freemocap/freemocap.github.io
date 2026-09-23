---
title: "How this site uses it"
type: reference
sidebar_position: 2
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "SkellyDocs main re-read directly (package.json v0.3.17, tsup.config.ts, src/index.ts, src/css/custom.css, templates/docusaurus.config.ts.hbs, skellydocs-docs/); this site's docusaurus.config.ts, package.json, src/css/custom.css, and external/skellycam/ re-checked for every claim"
  - date: "2026-08-24"
    against: "SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs"
draft: false
---

# How this site uses it

This site (FreeMoCap.github.io) is itself a consumer, and it exercises a narrower slice of the package than the standalone sub-repo sites do:

- **Theme CSS.** `docusaurus.config.ts` loads `require.resolve('@freemocap/skellydocs/css/custom.css')` as the *first* entry in the classic preset's `customCss` array, with the site's own `src/css/custom.css` layered after it. The package supplies the design-token baseline and dark-theme Infima overrides; everything site-specific (primary color pulled from FreeMoCap.org's palette, navbar dropdown styling, version-badge placement) lives in the local layer. One known gap patched locally: the package defines `--ifm-background-color` only for `[data-theme='dark']` (`#0a0818`) and never for `:root`, so light mode rendered a transparent page background until this site added an explicit white value.
- **A webpack compatibility shim.** The config carries a `skellydocsWebpackFixes` plugin that sets `resolve.fullySpecified: false` for `.m?js` files and ignores `.docusaurus/` in watch options. It exists because the package ships unbundled ESM output (tsup/esbuild strips `.js` extensions from relative imports) while webpack 5 enforces full extensions on ESM. Every SkellyDocs-based site repeats this plugin; the CLI scaffolds it into new ones.
- **Components, indirectly.** This site's own pages do not import the package's React components. The homepage is fully custom. But the aggregated sub-repo docs do: the fetched SkellyCam docs (mounted at `/skellycam/`) import `AiGeneratedBanner`, `Tip`, `CoreFeatureHeader`, and `LinkedIssues` throughout, so those components ship in this site's bundle whether or not its hand-written pages use them.
