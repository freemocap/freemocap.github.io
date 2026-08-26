---
title: Build with FreeMoCap
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "hub pass: every link target resolved against the local site tree (build-docs/* files, src/pages/developers.tsx, sidebars/build.ts, the build docs instance in docusaurus.config.ts, and the repos.yml generation claims behind the-map/data-contracts/repo-directory); the Design proposals blurb re-checked against the centroidal-kinematics proposal sources and the real implementation in polyrepo-clones/freemocap (core/kinematics/, freemocap/tests/kinematics/, freemocap-ui/src/components/viewport3d/) at v2.0.0-alpha.21"
  - date: "2026-08-24"
    against: "none, this page is a hub linking to already-written pages, not sourced content itself"
draft: false
---

# Build with FreeMoCap

Developer documentation for the `freemocap` core repository: how the
app is put together, how it fits into the wider polyrepo, and how
to build, test, and contribute to it. If you're looking for a specific
sibling repo's own documentation (SkellyCam, SkellyTracker, and so on),
start at [the developer docs homepage](/developers) instead, this section is
specifically about the `freemocap` app itself.

## Architecture

- [Architecture overview](/build/architecture): the FastAPI backend, the
  React/Electron frontend, and how they connect. Start here.
- [backend architecture](/build/backend): pub/sub, the websocket server,
  calibration, and triangulation.
- [frontend architecture](/build/frontend): providers, routing, state
  management, and styling.
- [Follow one recording end to end](/build/pipeline): realtime and posthoc
  pipeline topology, from camera to frontend, or video to disk.
- [The polyrepo map](/build/the-map): the data-contract pipeline across
  repos, generated from `data/repos.yml`.
- [Data contracts between components](/build/data-contracts): the reference
  table behind that map.
- [All repositories](/build/repo-directory): every repo in the polyrepo,
  including the utility tier.

## Contributing

- [Contributing to FreeMoCap](/build/contributing)
- [Contributing to the docs](/build/writing-docs)
- [Python code style](/build/code-style)
- [Building and packaging](/build/building)
- [Testing](/build/testing)

## Design proposals

- [Design proposals](/build/proposals): in-progress design work, part of
  which has already landed in the current code; the linked page tracks
  exactly what is built versus still proposed.
