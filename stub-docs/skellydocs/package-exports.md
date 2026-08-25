---
title: "What the package exports"
type: reference
sidebar_position: 3
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs
draft: false
---

# What the package exports

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
