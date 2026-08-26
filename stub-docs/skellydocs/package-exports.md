---
title: "What the package exports"
type: reference
sidebar_position: 3
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "skellydocs main re-read: full src/index.ts export list, all 12 shared types in src/types.ts, every theme component source (IndexPage with HeroSection/FeaturesSection/GuaranteesSection, RoadmapPage, RoadmapContent, RoadmapEntry, Tip, LinkedIssues, AiGeneratedBanner, CoreFeatureHeader, collectLinkedUrls), package.json version 0.3.17 and its css subpath exports map, plus consumption verified in this site's docusaurus.config.ts and external/skellycam/content.config.tsx"
  - date: "2026-08-24"
    against: "SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs"
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
