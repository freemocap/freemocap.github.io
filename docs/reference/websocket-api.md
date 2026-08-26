---
title: WebSocket API
type: reference
sidebar_position: 16
provenance: ai-generated
history:
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 websocket source (api/websocket/websocket_server.py, websocket_connect.py, websocket_message_types.py, binary_keypoints_protocol.py, api/routers.py, app/app.py, api/server_constants.py), freemocap-ui ServerContextProvider.tsx and websocket-connection.ts, and freemocap-docs backend-websocket-server.mdx and api-boundary.mdx"
  - date: "2026-08-21"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
draft: false
---

# WebSocket API

Alongside the [REST API](/reference/rest-api), FreeMoCap's backend keeps
a single persistent WebSocket connection open
(`ws://localhost:53117/websocket/connect`) for everything that needs to
stream continuously: camera frames, live keypoints, logs, and
processing progress. Like the REST API, this is the internal contract
between the bundled frontend and backend, not a stable public interface.

## What flows over it

| Direction | Message | Carries |
|---|---|---|
| Server → client | Frame data | Binary JPEG frames per camera, plus keypoints, sent every processed frame |
| Server → client | Framerate updates | Backend and frontend FPS, a few times a second |
| Server → client | Pipeline progress | Post-hoc calibration/mocap processing status |
| Server → client | Log records | Backend log lines, for the in-app log viewer |
| Server → client | Tracker schema handshake | Keypoint names and connections for the active trackers, sent once on connect |
| Server → client | App state | Application-state snapshot, sent on connect and again whenever the state changes |
| Client → server | Frame acknowledgment | Confirms a frame was received, see below |

## Why acknowledgment matters

The backend can produce frames faster than a client can render them.
Each frame batch is tagged with a number, and the client sends that
number back as soon as it receives it (well before it finishes decoding
the frames); the backend won't send the next batch until it gets that
acknowledgment. If a client falls 300 frames behind, the backend stops
waiting and resets its counter instead of stalling forever. If you're
writing your own client against this connection, skipping the
acknowledgment message is the most common way to end up with a
connection that appears to hang after the first few hundred frames.

## If you actually need to build against this

The full binary frame protocol (exact byte layout), every message type,
and the reconnection/heartbeat behavior are documented in the
`freemocap` repository's own architecture docs
([WebSocket Server](https://github.com/freemocap/freemocap/blob/main/freemocap-docs/docs/architecture/backend-websocket-server.mdx)).
That's the version worth trusting, this protocol is still evolving and
a page ported here would go stale faster than the source does.

## Next steps

- [REST API](/reference/rest-api)
- [Recording folder structure](/reference/recording-structure)
