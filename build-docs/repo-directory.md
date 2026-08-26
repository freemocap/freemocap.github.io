---
title: All repositories
type: reference
sidebar_position: 8
provenance: ai-generated
inFlux: "This repo directory is a stand-in for the core freemocap repo's own developer docs, still being consolidated there; expect it to move once that lands."
history:
  - date: "2026-08-26"
    against: "data/repos.yml's 9-repo list, tiers, routes, and GitHub URLs cross-checked against the 9 polyrepo clones; RepoDirectory, PolyrepoTree, and DataContractsTable components, the repos-data-plugin, and the stub/external docs-instance wiring in docusaurus.config.ts; the-map.md and data-contracts.md confirmed to leave out the utility tier"
  - date: "2026-08-24"
    against: "generated live from data/repos.yml, not hand-written"
draft: false
---

import RepoDirectory from '@site/src/components/RepoDirectory';

# All repositories

Every repository in the FreeMoCap polyrepo, grouped by tier, generated live
from `data/repos.yml` at page-load time. This is the complete list,
including the utility tier that [the polyrepo map](/build/the-map) and
[data contracts](/build/data-contracts) pages leave out because those two
are specifically about the data-flow pipeline, not the whole org.

<RepoDirectory />

A repo without a "docs" link here doesn't have its own documentation site
plugged into this build yet; its GitHub link still works, and its box on
the developer docs homepage at `/developers` points at whatever page this
build serves for that repo in the meantime.

[← Architecture overview](/build/architecture)
