---
title: SkellyDocs
type: hub
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

## Contents

- [How this site uses it](/skellydocs/how-this-site-uses-it)
- [What the package exports](/skellydocs/package-exports)
- [The content config and landing page](/skellydocs/content-config)
- [The roadmap](/skellydocs/roadmap)
- [In-page components](/skellydocs/in-page-components)
- [CSS design tokens](/skellydocs/css-design-tokens)
- [The CLI](/skellydocs/cli)
- [Layout and development](/skellydocs/layout-and-development)
