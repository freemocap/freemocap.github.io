---
title: REST API
type: reference
sidebar_position: 15
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): app.py router mounting (freemocap routers under /freemocap, skellycam under /skellycam; FastAPI defaults leave /docs on), api/http/* router prefixes (added posthoc, ffmpeg, telemetry), server_constants.py (port 53117). Pointer to the in-repo api-boundary.mdx replaced with the live /docs page. Not checked against a running server."
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 source (app/app.py route registration, api/routers.py, api/server_constants.py, api/http routers for calibration/mocap/realtime/playback/blender/app), skellycam camera_router, and freemocap-docs architecture/api-boundary.mdx plus notes/api-notes.mdx"
  - date: "2026-08-21"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# REST API

The FreeMoCap app talks to its local server over a REST API at `http://localhost:53117`. It isn't a
stable public API, so routes may change between releases.

## Browse the full API

While FreeMoCap is open, go to [http://localhost:53117/docs](http://localhost:53117/docs) in a web
browser. It lists every route with its exact request and response shapes, and lets you try them.
Because it comes from the running app, it always matches your version.

## Route groups

| Area | Handles |
|---|---|
| Cameras (`/skellycam/camera/*`) | Detecting, connecting to, and configuring cameras |
| Recording (`/skellycam/camera/group/all/record/*`) | Starting and stopping a recording |
| Calibration (`/freemocap/calibration/*`) | Recording a calibration and running the calibration solver |
| mocap (`/freemocap/mocap/*`) | Processing recordings, including `POST /freemocap/mocap/recording/process` |
| Post-hoc (`/freemocap/posthoc/*`) | Stopping running processing jobs |
| realtime pipeline (`/freemocap/realtime/*`) | Starting and stopping the live processing pipeline |
| Playback (`/freemocap/playback/*`) | Listing recordings and serving their videos, timestamps, and data |
| Blender (`/freemocap/blender/*`) | Detecting Blender, exporting, and opening the result |
| FFmpeg (`/freemocap/ffmpeg/*`) | Checking whether FFmpeg is installed |
| Telemetry (`/freemocap/telemetry/*`) | Recording anonymous usage events |

## Next steps

- [websocket API](/reference/websocket-api)
- [Recording folder structure](/reference/recording-structure)
