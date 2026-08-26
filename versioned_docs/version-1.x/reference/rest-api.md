---
title: REST API
type: reference
sidebar_position: 15
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)
draft: false
---

# REST API

FreeMoCap's desktop app talks to its own local backend
(`http://localhost:53117` by default) over a REST API, the same one the
bundled frontend uses. It's not a public, versioned API meant for
third-party integration, and the project's own architecture docs
describe it as actively being redesigned toward a more consistent,
recording-centric shape. Treat anything below as a snapshot, not a
stable contract.

## What it covers

Broadly, one route group per concern:

| Area | Handles |
|---|---|
| Cameras (`/skellycam/camera/*`) | Detecting, connecting to, and configuring cameras |
| Recording (`/skellycam/camera/group/all/record/*`) | Starting and stopping a recording |
| Calibration (`/freemocap/calibration/*`) | Running the calibration solver on a calibration recording |
| Mocap (`/freemocap/mocap/*`) | Starting, stopping, and post-processing a mocap recording |
| Realtime pipeline (`/freemocap/realtime/*`) | Creating or tearing down a live processing pipeline |
| Playback (`/freemocap/playback/*`) | Listing recordings and serving their videos, timestamps, and data back out |
| Blender (`/freemocap/blender/*`) | Detecting Blender, installing the addon, exporting, opening the result |

## If you actually need to build against this

The full, current endpoint-by-endpoint reference, including exact
request and response shapes, lives in the `freemocap` repository's own
architecture docs
([API Boundary](https://github.com/freemocap/freemocap/blob/main/freemocap-docs/docs/architecture/api-boundary.mdx)),
kept closer to the actual code than anything ported here could stay.
That page also documents the planned API redesign, worth reading before
building against routes that are expected to change shape.

## Next steps

- [WebSocket API](/reference/websocket-api)
- [Recording folder structure](/reference/recording-structure)
