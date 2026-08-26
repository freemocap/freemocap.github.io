---
title: Contributing to the docs
type: how-to
provenance: human-checked
inFlux: "This page is a stand-in for the core freemocap repo's own developer docs, still being consolidated there; expect it to move once that lands."
history:
  - date: "2026-08-26"
    against: "polyrepo-clones/freemocap (v2.0.0-alpha.21): freemocap-docs/ Docusaurus v3 site (package.json scripts, docusaurus.config.ts), .github/workflows/deploy-docs.yml triggers and paths, CONTRIBUTING.md GitHub Flow and PR steps, the single legacy Writerside mention left in README.md, and data/redirects.js mapping the old /documentation/*.html URLs to their live equivalents"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
* Our documentation uses [Docusaurus](https://docusaurus.io/) and lives in the `freemocap-docs/` directory of the [freemocap repository](https://github.com/freemocap/freemocap).
* The docs are plain Markdown and can be written and edited with any text editor, no special IDE plugin required.
* These instructions ensure a reliable workflow using that specific toolset.
* Because our documentation site deploys automatically from a GitHub Actions workflow whenever changes under `freemocap-docs/` land on `main`, we require pull requests for all changes.  

> For more about our workflow, refer to [Contributing to the FreeMoCap Project](/build/contributing).

# If you **ARE NOT** a member of the FreeMoCap organization

1. Fork the repository and clone the forked repository's URL.
    * URL: https://github.com/[YOUR USERNAME]/freemocap/
> For more information about forking, refer to [Fork a Repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) on GitHub Docs.
2. Edit the documentation under `freemocap-docs/docs/`. To preview your changes locally, run `npm install` followed by `npm run start` inside the `freemocap-docs/` folder (this requires Node.js 20 or newer).
3. Use standard Markdown as supported by Docusaurus: [Markdown Features - Docusaurus Documentation](https://docusaurus.io/docs/markdown-features)
4. Once you've finished making your updates to documentation, submit a PR onto `main`.

# If you **ARE** a member of the FreeMoCap organization

1. Select `Git` → `Clone` from the top menu.
    * URL: [https://github.com/freemocap/freemocap/](https://github.com/freemocap/freemocap/)
2. Create a branch. 
    * This can be done in your IDE by clicking `main` in the top left and selecting `+ New Branch`.
3. Edit the documentation under `freemocap-docs/docs/`. To preview your changes locally, run `npm install` followed by `npm run start` inside the `freemocap-docs/` folder (this requires Node.js 20 or newer).
4. Use standard Markdown as supported by Docusaurus: [Markdown Features - Docusaurus Documentation](https://docusaurus.io/docs/markdown-features)
5. Once you've finished making your updates to documentation, submit a PR onto `main`.
