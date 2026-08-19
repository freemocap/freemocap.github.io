---
title: <RepoName> docs
type: repo-home
repo: <github url>
tier_in_map: <core | pantheon | utility>
---

<!--
Landing page for ONE repo's standalone docs (SkellyDocs-scaffolded).
Golden rule: this repo documents itself as if it were a standalone tool.
Every pantheon/utility repo uses THIS SAME shape so readers can navigate any of them.
-->

# <RepoName>

**One line:** <this component's single responsibility, in isolation>

## Where it sits in the map
<!-- The "you are here" panel — this is what makes bottom-up + inside-out navigation work. -->
- **Consumes:** <input data type> ← from <upstream repo, linked>
- **Produces:** <output data type> → to <downstream repo, linked>
- **Part of:** FreeMoCap → [global architecture map](<link>)

```
… ─→ [ THIS REPO ] ─→ …
```

## Quick start (standalone)
Install and use <RepoName> by itself:
```bash
pip install <package>
```
<Minimal standalone example.>

## Sections
- **Tutorials** — <link>
- **How-to guides** — <link>
- **Concepts / architecture** — how <RepoName> works internally, its core data types.
- **API / reference** — the public surface.
- **Contributing** — develop <RepoName> itself.

## Zoom out
- ↑ **Whole project:** [FreeMoCap architecture](<link>)
- ← / → **Neighbors:** <upstream repo> · <downstream repo>
