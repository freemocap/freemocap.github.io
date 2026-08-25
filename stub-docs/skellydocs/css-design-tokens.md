---
title: "CSS design tokens"
type: reference
sidebar_position: 7
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyDocs source read directly (package at 0.3.17, main); consumer usage verified in this site's package.json, Docusaurus config, custom.css, and fetched SkellyCam docs
draft: false
---

# CSS design tokens

`custom.css` defines the palette as `--sk-*` variables consumed by `theme.module.css`, so overriding one variable re-themes every component:

| Token | Default | Purpose |
|---|---|---|
| `--sk-bg-deep` | `#06050e` | Page background |
| `--sk-bg-surface` | `#0e0c1a` | Card/surface background |
| `--sk-border` | `#1a1730` | Borders and dividers |
| `--sk-text` | `#e8e6f0` | Primary text |
| `--sk-text-dim` | `#b0aec3` | Secondary/muted text |
| `--sk-accent` | `#6ee7b7` | Accent color |
| `--sk-accent-dim` | `rgba(110, 231, 183, 0.15)` | Accent background tint |
| `--sk-purple` | `#a78bfa` | Secondary accent |
| `--sk-purple-dim` | `rgba(167, 139, 250, 0.1)` | Secondary accent tint |
| `--sk-mono` | JetBrains Mono stack | Monospace font |

Beyond the tokens, the style sheet also sets Infima-level values: a purple `--ifm-color-primary` scale, dark backgrounds (`#0a0818` page, `#110e20` surface), a blurred translucent navbar, footer and active-sidebar-item styling, and a JetBrains Mono import. The file's own header calls it "plumbing only." Component styles belong in `theme.module.css`.
