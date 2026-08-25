---
title: Backend architecture
type: explanation
sidebar_position: 7
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: FreeMoCap-docs/docs/architecture/backend-pubsub.mdx, backend-websocket-server.mdx, backend-calibration.mdx, backend-mocap.mdx, cross-checked against FreeMoCap/pubsub/, FreeMoCap/core/tasks/calibration/, FreeMoCap/core/tasks/triangulation/triangulator.py, and websocket_server.py in the FreeMoCap clone (v2.0.0-alpha.21)
draft: false
---

# Backend architecture

[Architecture overview](/build/architecture) covers the FastAPI app, its
route groups, and the `FreemocapApplication` singleton. This page goes one
level deeper into four systems that sit underneath that surface: the pub/sub
bus pipeline nodes use to talk to each other, the websocket server that
relays their output, calibration, and triangulation. Node topology itself
(how camera and video nodes fit into a pipeline) is covered in
[Follow one recording end to end](/build/pipeline); this page assumes that
context.

## Pub/sub: how pipeline nodes talk to each other

Pipeline nodes run in separate `multiprocessing` child processes and need to
communicate without coupling their lifetimes together: camera nodes send
observations to the aggregator, the aggregator asks for the next frame,
config changes need to reach every worker. `freemocap/pubsub/` (
`pubsub_abcs.py`, `pubsub_manager.py`, `pubsub_relay.py`, `pubsub_topics.py`)
implements a small topic-based message bus for this, one instance per
pipeline, not global.

Each topic is a pair of `multiprocessing.Queue`s: one publication queue that
producers write to, and one subscription queue per subscriber. A background
`PubSubRelay` thread (created once per pipeline, not per topic) polls every
topic's publication queue and fans messages out to subscribers. If a
subscriber's queue is full, the relay evicts the oldest message rather than
blocking, so a slow subscriber sees the latest data instead of falling
further and further behind on stale data. Bare `Queue` handles, not the
manager object itself, are what gets passed into child processes as keyword
arguments, since the manager holds non-picklable state and only needs to
exist in the main process.

Message types are plain dataclasses (`ProcessFrameNumberMessage`,
`CameraNodeOutputMessage`, `SkeletonInferenceResultMessage`,
`AggregationNodeOutputMessage`, and others), each carrying exactly the fields
its consumers need. If a relay thread hits a fatal, unrecoverable error, it
sets the shared `global_kill_flag`, the same nuclear option a crashing camera
node can trigger, since a broken message bus means nothing downstream can be
trusted either.

## The websocket server

A single endpoint, `ws://localhost:53117/websocket/connect`, is the only path
data takes from backend to frontend once a client is connected. On connect,
`websocket_connect.py` launches three concurrent `asyncio` tasks on the same
connection:

- **The frame relay** is the main data path. Each tick it drains posthoc
  progress messages unconditionally (small, time-sensitive), then checks
  whether the frontend has acknowledged the last frame it was sent; if not,
  it waits rather than piling up more frames the frontend hasn't caught up
  on yet. Once clear, it blocks on the realtime pipeline's result-ready
  signal (up to half a second), then sends the next payload: JSON metadata
  plus binary image bytes, and optionally a binary keypoints block.
- **The log relay** drains the shared `skellylogs` websocket queue that every
  child process feeds into, so backend logs show up in the frontend's log
  terminal, and tolerates `EOFError`/`OSError` from a child process dying
  mid-write rather than taking the whole relay down with it.
- **The client message handler** processes incoming frontend messages: frame
  acknowledgments (the other half of the backpressure protocol), overlay
  sizing hints, and a ping/pong heartbeat.

The exact message catalog, both directions, is documented in
[websocket API](/reference/websocket-api); this page is about the
implementation shape, not the wire format. One implementation detail worth
knowing if you're debugging serialization: outgoing JSON goes through
`msgspec.json.Encoder` with a custom hook that knows how to flatten Pydantic
models, dataclasses, and NumPy scalars/arrays, so most Python objects can be
handed to it directly rather than pre-serialized by callers. A send lock
guards the single websocket connection, since all three tasks can produce
outgoing messages concurrently.

On connect, the server also sends every active tracker's schema (point names
and connections) once, so the frontend never needs to hardcode a tracker's
layout. See [Follow one recording end to end](/build/pipeline) for where that
schema comes from.

## Calibration

Calibration turns synchronized views of a ChArUco board into a
`CalibrationResult`: one camera model per camera (intrinsics, extrinsics,
world pose) plus solver diagnostics (reprojection error, iteration count,
cost). ChArUco detection itself belongs to SkellyTracker; calibration
consumes the resulting observations.

Two solvers exist side by side under `core/tasks/calibration/`:

- **Anipose** (`anipose_calibration/`, the default) is bundle adjustment via
  SciPy's `least_squares`, adapted from the
  [aniposelib](https://github.com/lambdaloop/aniposelib) library into
  FreeMoCap's own pipeline: loading from TOML, hot-reloading, and handling
  partial detections and varying camera counts, which aniposelib's original
  notebook-oriented design didn't need to.
- **PyCeres** (`pyceres_calibration/`) is a Google Ceres-based bundle
  adjustment, developed as an alternative backend. Both solver directories
  contain real, substantial implementations (cost functions, initialization,
  postprocessing, on the order of several hundred lines each), not stubs.

Calibration runs in two different contexts with different lifecycles. In
realtime sessions, a `CalibrationStateTracker` loads the most recent
calibration TOML on creation and checks for file changes roughly once a
second, so recalibrating doesn't require restarting a live session. In
posthoc calibration, which runs as a one-shot pipeline, video nodes detect
ChArUco corners per frame and the aggregator collects them and runs the
configured solver.

After solving, the world coordinate system is aligned so the ChArUco board
defines the ground plane, with the up-vector disambiguated to point toward
the cameras (they're assumed to be preceding the board, looking down).
`CalibrationResult` serializes to an Anipose-compatible TOML, which is what
gets copied into each recording folder and what
[the CLI's segment-length diagnostic](/reference/cli) and the Blender export
step both read back.

## The triangulator

`Triangulator` (`core/tasks/triangulation/triangulator.py`, 579 lines) is a
standalone Direct Linear Transform implementation with no dependency on
Anipose. Given a `CalibrationResult`, it precomputes each camera's extrinsics
and distortion coefficients once, then per frame: undistorts the 2D
observations, triangulates via DLT from two or more views, and rejects
outliers using a subset-ensemble method that tries different combinations of
camera subsets and discards points with high reprojection error across all
of them. Everything is vectorized over points rather than looped, and it
accepts single frames or batched multi-frame arrays.

## Blender export

Triggered automatically after mocap processing, or manually over REST. The
backend runs Blender itself in `--background` mode
(`--python run_blender_export.py`), injecting the FreeMoCap virtualenv's
`site-packages` onto Blender's `sys.path` so the
`freemocap_blender_addon` package is importable without being installed into
Blender's own addon directory. It waits for the subprocess, confirms the
resulting `.blend` file exists and is non-empty, and can optionally reopen it
in the Blender GUI afterward. See [SkellyBlender](/skellyblender/) for what
that subprocess actually does once it starts, including the input files it
expects and the export formats it supports.

[← Architecture overview](/build/architecture)
