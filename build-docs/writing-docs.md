---
title: Contributing to the docs
type: how-to
provenance: human-checked
inFlux: "Docs contribution section for FreeMoCap core is a work in progress for version alpha. It's expected to stabilize by beta."
history:
  - date: "2026-10-27"
    against: "this site's own repo (freemocap/freemocap.github.io): README.md, .github/workflows/deploy.yml triggers and CI steps, package.json scripts, docusaurus.config.ts docs instances, and data/redirects.js"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
The docs are plain Markdown in the [freemocap.github.io repository](https://github.com/freemocap/freemocap.github.io), built with [Docusaurus](https://docusaurus.io/). Any text editor works. Every page has an **Edit this page** link that opens its file on GitHub.

## Where pages live

| Section | Folder |
|---|---|
| Start, tutorials, guides, reference, about | `docs/` |
| Concepts | `concepts/` |
| Build (developer docs) | `build-docs/` |
| SkellyCam | fetched from the `skellycam` repo at build time |

## Make a change

1. Fork the repository (outside the FreeMoCap organization) or create a branch (inside it).
2. Edit the Markdown. To preview, run `npm install`, `npm run fetch`, then `npm start` (Node.js 22 recommended). See [Docusaurus Markdown features](https://docusaurus.io/docs/markdown-features).
3. Keep each page's frontmatter current: `provenance`, plus a `history` entry with today's date and what you checked the page against.
4. Open a pull request into `main`. The build runs on the PR, and a broken internal link fails it.
5. Once merged, the site updates by itself within a few minutes.

For the Git workflow itself, see [Contributing to FreeMoCap](/build/contributing).

## Moving or renaming a page

Add the old URL to `data/redirects.js` so existing links keep working.
