---
title: "Layout and development"
type: reference
sidebar_position: 9
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs
draft: false
---

# Layout and development

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
