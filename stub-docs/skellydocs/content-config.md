---
title: "The content config and landing page"
type: reference
sidebar_position: 4
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs
draft: false
---

# The content config and landing page

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
