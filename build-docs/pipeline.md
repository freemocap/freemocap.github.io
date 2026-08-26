---
title: Follow one recording end to end
type: explanation
sidebar_position: 4
provenance: ai-generated
inFlux: "Pipeline walkthrough section for FreeMoCap core is a work in progress for version alpha. It will stabilize upon beta release."
draft: false
history:
  - date: "2026-08-26"
    against: "re-checked every concrete claim against freemocap source at v2.0.0-alpha.21: core/pipeline/abcs/*.py, core/pipeline/realtime/*.py (incl. exact line counts), core/pipeline/posthoc/*.py, core/tracking/tracker_factory.py and tracker_definitions.py, core/tasks/mocap/posthoc_mocap_task.py, realtime_filtering/*, rigid_body/skeleton_rigidifier.py and online_segment_lengths.py, api/websocket/websocket_server.py and tracker_schema_message.py"
  - date: "2026-08-24"
    against: "FreeMoCap-docs/docs/architecture/backend-pipeline-architecture.mdx and tracking-integration.mdx, cross-checked against FreeMoCap/core/pipeline/realtime/*.py and FreeMoCap/core/tracking/tracker_factory.py in the FreeMoCap clone (v2.0.0-alpha.21)"
---

# Follow one recording end to end

[Architecture overview](/build/architecture) introduced pipelines as graphs of
worker processes connected by the pub/sub system. This page walks through what
actually happens to a frame, from camera to frontend (realtime) or from video
file to disk (posthoc).

Both pipeline types share the same abstract base classes in
`core/pipeline/abcs/`: every node extends `BaseNode` (process lifecycle,
a `shutdown_self_flag`, and a check against the global shutdown flag), and every
pipeline carries a `PipelineIPC` with a `pipeline_id`, a `pipeline_shutdown_flag`,
and a reference to the shared `global_kill_flag`. A node's `should_continue`
property checks all three at once, so a node stops if its own pipeline shuts
down, the whole app shuts down, or the main process dies. Two shutdown paths
exist: `shutdown_pipeline()` stops one pipeline, `kill_everything()` sets the
global flag too, used when a camera node crashes in a way that makes further
output untrustworthy.

## Low latency: the realtime pipeline

```
CameraGroup (shared memory ring buffers, one per camera)
    │
    ▼
CameraNodes (one child process per camera)
    │ reads its ring buffer, runs ChArUco detection on CPU,
    │ publishes CameraNodeOutputMessage per frame
    │
    ▼ (default path)
RealtimeSkeletonInferenceNode (one centralized GPU worker)
    │ one OnnxSession, tracker.process_batch() across all cameras
    │ in a single call, publishes SkeletonInferenceResultMessage
    │
    ▼
RealtimeAggregatorNode
    │ triangulates (DLT), filters, publishes AggregationNodeOutputMessage
    │
    ▼
WebSocket → Frontend
```

By default (`use_centralized_inference=True` on `RealtimePipelineConfig`),
camera nodes only run ChArUco detection; a single `RealtimeSkeletonInferenceNode`
does batched skeleton inference for every camera in one ONNX call. This trades
a small amount of latency for one shared CUDA context instead of one per
camera. Setting `use_centralized_inference=False` moves skeleton detection
back into each camera node individually: more GPU memory used, no batching,
but no dependency on a dedicated inference worker either. Useful for CPU-only
setups.

Reading the actual files rather than repeating claimed sizes: `camera_node.py`
is 358 lines, `realtime_skeleton_inference_node.py` is 433, and
`realtime_aggregator_node.py` is 837, by far the largest of the three since
it owns triangulation, filtering, and backpressure coordination in one place.
`websocket_server.py` (not a pipeline node, but where realtime output actually
reaches the frontend) is 429 lines.

The aggregator's filtering order, after triangulation:

```
Raw 3D keypoints (RTMPose names, millimeters)
    │
RealtimeKeypointFilter    One Euro smoothing + velocity-decay gap fill
    │
RealtimePointGate          rejects points whose velocity implies teleportation
    │
RealtimeSkeletonRigidifier  maps to canonical landmarks, estimates bone
    │                       lengths online (rolling-window median,
    │                       seeded from anthropometry), enforces them with
    │                       one closed-form forward pass, body plus both hands
    │
Center of mass + XCoM       computed on the rigidified skeleton
```

The rigidifier is the realtime counterpart to SkellyForge's posthoc
`enforce_rigid_bones` step: same idea (bone lengths should be stable over
time, not re-measured noisily every frame), different implementation, since
realtime has to do it incrementally, one frame at a time, with no lookahead.

This pipeline-internal backpressure (not to be confused with the websocket's
own frontend-facing backpressure, covered in
[backend architecture](/build/backend)) means the aggregator requests the next
frame optimistically, before it finishes processing the current one, so
camera nodes can work on frame N+1 while the aggregator is still triangulating
frame N.

## Completeness: the posthoc pipeline

```
VideoGroup (synchronized video files on disk)
    │
    ▼
VideoNodes (one child process per video)
    │ reads sequentially via OpenCV, runs the configured detector
    │ (ChArUco, MediaPipe, or RTMPose), publishes VideoNodeOutputMessage
    │
    ▼
PosthocAggregatorNode
    │ collects every video's observations for calibration or mocap,
    │ writes output artifacts to disk
    │
    ▼
Files on disk → served over REST for playback
```

The two pipeline types trade the same thing in opposite directions: realtime
drops frames under load to stay live, posthoc never drops a frame because
nothing is live, the video already happened. Calibration and mocap are both
posthoc tasks that share this machinery; they differ only in which task
function the aggregator runs and what it writes out.

The posthoc mocap task specifically (`run_posthoc_mocap_aggregator_task`): collects
each camera's per-frame observations into an `ObservationBuffer`, resolves
which calibration file to use (an explicit path if given, otherwise the most
recent successful calibration, copied into the recording folder), triangulates
into `output_data/`, writes `tracker_schema.json` from
`RTMPOSE_WHOLEBODY_DEFINITION`, and optionally kicks off Blender export. See
[SkeletonModels and output arrays](/reference/data-arrays) for what actually
ends up in those output files, and [Calibration](/build/backend) for how the
calibration file itself gets produced.

## Where pose estimation actually happens

Neither pipeline implements pose estimation itself. Both build and drive a
SkellyTracker `Tracker` through one shared module,
`core/tracking/tracker_factory.py`, so that detector registration, config
construction, and session creation only happen in one place:

| Builder | Session | Produces |
|---|---|---|
| `build_charuco_tracker(board_def)` | `CpuSession` | ChArUco board detector, used for calibration markers |
| `build_skeleton_onnx_session(...)` | `OnnxSession` | Shared RTMPose/YOLOX session, batch size = min(camera count, `max_batch_size`) |
| `build_skeleton_tracker(...)` | (the session preceding) | Body-pose tracker: YOLOX crop into RTMPose |
| `build_mediapipe_tracker(...)` | `MediaPipeSession` | MediaPipe body, hands, and face tracker |

Per frame, the pipeline calls `tracker.process_image(...)` (one camera) or
`tracker.process_batch(...)` (all cameras in one GPU call) and gets back an
`Observation` plus updated `TrackerState`. Everything past that point (
triangulation, filtering, rigidifying, export) is FreeMoCap's own code;
detector implementations, ONNX/CoreML session management, and the batched
inference call itself belong to SkellyTracker. See
[SkellyTracker](/skellytracker/) for that side of the boundary.

## Tracker schemas reach the frontend without hardcoding

So the frontend can draw skeleton connections without a hardcoded topology
per tracker, the backend sends a `TrackerSchemasMessage` on websocket connect:
every active tracker's `TrackerDefinition` (from
`core/tracking/tracker_definitions.py`, for example
`RTMPOSE_WHOLEBODY_DEFINITION`), each carrying its ordered point names and
connections. See [keypoint names and indices by model](/reference/skeleton-models)
for the actual point sets these definitions carry, including a real ordering
mismatch found there in RTMPose output arrays that this schema handshake does
not have (the handshake describes the frontend-facing point order correctly;
the output-file column order is a separate system that currently disagrees
with it for RTMPose).

[← Architecture overview](/build/architecture)
