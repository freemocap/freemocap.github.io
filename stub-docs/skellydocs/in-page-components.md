---
title: "In-page components"
type: reference
sidebar_position: 6
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "Re-read Tip.tsx, LinkedIssues.tsx, AiGeneratedBanner.tsx, CoreFeatureHeader.tsx, types.ts, githubUtils.ts, theme.module.css, CLAUDE.md, and package.json in polyrepo-clones/skellydocs (package 0.3.17, ref main); cross-checked banner defaults against skellydocs-docs/docusaurus.config.ts and skellydocs-docs/docs/ai-generated-banner.mdx"
  - date: "2026-08-24"
    against: "SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs"
---

# In-page components

## Tip

Two modes in one component:

- **Legacy**, pass `text` and get a pure-CSS hover tooltip.
- **Two-stage**, pass `shortInfo` (and optionally `longInfo`): hover shows the short info, clicking expands the full explanation inline, and an optional `href` appends a "Learn more" link. Hides after a 150 ms delay on mouse leave, closes on outside click, and collapses fully on dismiss.

## LinkedIssues

A collapsible "Linked Issues" row (with a count badge) for use near the top of MDX pages. Items need only `label` and `url`; `status`, `type`, and `labels` are fetched from the GitHub API the first time the section is expanded, then cached in `localStorage` for five minutes keyed by the item URLs. Rendered enrichment includes Issue/PR badges, open/closed markers, and label chips colored from each label's GitHub color. Non-GitHub URLs are displayed as plain links without enrichment. An optional `defaultOpen` prop starts the section expanded.

## `AiGeneratedBanner`

A collapsed-by-default `<details>` banner declaring how the page was produced. Three generation types are registered internally:

| Type | Meaning |
|---|---|
| `ai-generated` (default) | Page drafted entirely by AI from the codebase or prompt instructions |
| `ai-transformatted` | Human provided raw material; AI restructured it (livestream to blog post, meeting notes to docs) |
| `human-generated` | Page written entirely by a human author |

Optional props: `humanCurated` (adds a checked "curated" badge and review sentence), `generatedAt` and `model` (shown as metadata rows), `humanNotes` (curator notes in an accented block), and `moreInfoUrl` (defaults to the generation-types explainer on the deployed SkellyDocs site; pass an empty string to hide the link). Expanding the banner also reveals a nested overview of all three types with the current one highlighted. Passing `repo` turns the disclaimer into an actionable one: it links to a prefilled documentation-issue template in that repo.

Per its own repo convention (stated in its CLAUDE.md), every `.mdx` page starts with `<AiGeneratedBanner />`.

## `CoreFeatureHeader`

Renders a feature's icon, summary, and linked issues as a header block, so a feature's doc page visually matches its card on the landing page.
