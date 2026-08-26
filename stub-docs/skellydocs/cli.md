---
title: "The CLI"
type: reference
sidebar_position: 8
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "SkellyDocs CLI (src/bin/create-skellydocs.ts), tsup.config.ts, all Handlebars templates under templates/, scripts/rebuild-dogfood.mjs, and the dogfood site's package.json re-read against main (package 0.3.17)"
  - date: "2026-08-24"
    against: "SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs"
---

# The CLI

The `skellydocs` binary (built from `src/bin/create-skellydocs.ts` into a single bundled file with a node shebang) has two commands; running it bare runs `init`.

## `init`

Prompts for:

- Project name (defaults to the current directory's name)
- Source code URL (bare `org/repo` slugs are normalized to GitHub URLs; GitLab, Codeberg, Gitea-style forges are recognized when building edit links)
- Project website URL
- Project board URL (GitHub Projects, Linear, etc.)
- Path to a logo file (validated to exist; skipped means a placeholder skeleton logo)

It then scaffolds `<projectName>-docs/` containing a complete site: `package.json` (writing `@freemocap/skellydocs` as a caret range on the CLI's own version), `docusaurus.config.ts` (dark mode by default, mermaid enabled, the webpack fix plugin, the package CSS, and a "Built with SkellyDocs" footer), `content.config.tsx` pre-filled with example features and guarantees, `sidebars.ts`, starter `intro.mdx` and `ai-generated-banner.mdx` docs, a welcome blog post, `src/pages/index.tsx` and `roadmap.tsx` wrappers wired to the config, and the logo. The `editUrl` is constructed per forge, and the site `url`/`baseUrl` are derived from the answers.

One special case: scaffolding *inside* the SkellyDocs repo itself wires the dependency as `file:..` instead of a version. That is exactly how the `skellydocs-docs/` dogfood site is produced.

The completion message documents the two ways onto the roadmap (add the `roadmap` label, or reference issues in the config) and points at the `update` command.

## `update`

Pulls the latest published theme into an existing site, from the site root:

```bash
npx @freemocap/skellydocs@latest update
```

It is deliberately defensive. It refuses to run where there is no `package.json`, where SkellyDocs is not a dependency at all, and where the dependency is a `file:`/`link:`/`workspace:` spec (that is the dogfood site, which tracks the workspace directly). It reports the declared spec, the installed version, and the latest version from the npm registry; if both the install and the spec are already current it no-ops. Otherwise it installs `@freemocap/skellydocs@latest` (preserving a devDependency declaration), then runs the site's build to prove nothing broke, unless `--skip-build` was passed. Running via `npx ...@latest` means even sites whose installed version predates the `update` command can use it.

Because components update through the package, new props are opt-in additions; existing sites keep building unchanged.
