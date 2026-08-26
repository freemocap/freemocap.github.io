---
title: "How FreeMoCap uses SkellyTracker"
type: reference
sidebar_position: 9
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "freemocap/core/tracking/tracker_factory.py (BBoxSmoothingConfig(alpha=0.4), KeypointResetPolicyConfig(max_consecutive_misses=10), _REDETECT_SECONDS = 5.0, all exact), core/pipeline/realtime/camera_node_config.py (confidence_threshold=0.0025, exact, vs. posthoc's 0.004 confirmed separately), realtime_skeleton_inference_node.py (batch_size = min(max_batch_size=8, num_cameras), exact), and confirmed skellycam's pyproject.toml has no skellytracker dependency anywhere"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# How FreeMoCap uses SkellyTracker

## Dependency wiring

`freemocap/pyproject.toml` pulls `skellytracker` from `git+https://github.com/freemocap/skellytracker` (main). The published extras mirror SkellyTracker's bundles, `pip install freemocap[cuda]` → `skellytracker[all-cuda]`, `freemocap[cpu]` → `skellytracker[all-cpu]`, and plain `uv sync` uses a platform-switched `tracker-default` group (CUDA on Windows/Linux, CPU/macOS incl. CoreML on Apple Silicon). The two ONNX backends can't coexist on disk, and FreeMoCap repeats SkellyTracker's `rtmlib` metadata override to strip the CPU-only `onnxruntime` conflict from resolution.

## Tracker construction: `freemocap.core.tracking`

This small package is the integration seam:

- **`tracker_factory.py`** centralizes every `Tracker.create()` call so registry side-effect imports happen reliably. Builders: `build_charuco_tracker(board_def)` (a ChArUco stage on a `CpuSession`), `build_skeleton_onnx_session(...)` (one `OnnxSession` loading YOLOX + RTMPose specs, sized for a camera count), `build_skeleton_tracker(onnx_session, ...)` (a `body` stage: YOLOX object detector + RTMPose keypoint detector, redetection every 5 s scaled by fps, keypoint-bbox tracking enabled, bbox EMA α 0.4), and `build_mediapipe_tracker(...)` (pose + hands + face detectors combined in one `body` stage on a `MediaPipeSession`, with the keypoint reset policy set to 10 consecutive misses).
- **`tracker_definitions.py`** loads point names and connections out of SkellyTracker's YAML files into lightweight `TrackerDefinition` objects (`RTMPOSE_WHOLEBODY_DEFINITION`, `MEDIAPIPE_BODY_DEFINITION`, and a composite `MEDIAPIPE_WHOLEBODY_DEFINITION` assembled by prefixing hand points). Its docstring records an integration subtlety: both the single-camera projection and multi-camera triangulation paths strip the stage prefix that `Observation.to_keypoints()` adds, so keypoint arrays arrive without the `body.` prefix.
- **`observation_buffer.py`** provides `ObservationBuffer`, described in-source as "a lightweight replacement for SkellyTracker's BaseRecorder." It accumulates per-camera Observations for the calibration and mocap tasks: `to_keypoints_array()` stacks merged stage keypoints into `(frames, keypoints, 3)`; `to_stage_array(stage_name, n_points)` extracts one stage, clamped to the first N points (used for ChArUco, whose flat array puts all corners before marker corners).

## `freemocap.core.pipeline.realtime`: the realtime pipeline

`CameraNodeConfig` holds SkellyTracker objects directly: a `charuco_tracker_config` rebuilt whenever the client-set `charuco_board` changes, and a `skeleton_tracker_config` defaulting to the RTMPose body stage (realtime tightens the confidence threshold to 0.0025 and uses LITE MediaPipe by default, versus HEAVY posthoc). `detector_type` switches between `"rtmpose"` and `"mediapipe"`.

Frames originate in SkellyCam, but note the direction of dependencies: SkellyCam has no code dependency on SkellyTracker anywhere in its source. The bridge is FreeMoCap's pipeline, nodes read frames out of SkellyCam's shared-memory ring buffers and feed them to SkellyTracker trackers.

Two execution topologies exist:

- **Per-camera** (`CameraNode`): each camera process builds its own ChArUco and skeleton trackers, calls `process_image` per frame, optionally applies FreeMoCap's own 2D one-euro filter and NaN-gates low-confidence keypoints, and publishes a `CameraNodeOutputMessage` carrying the ChArUco and skeleton Observations. Used for skeleton tracking when inference is not centralized.
- **Centralized** (`RealtimeSkeletonInferenceNode`, the default via `use_centralized_inference=True`): one worker owns a single tracker/session for all cameras. It reads frame N from every camera ring buffer directly and issues one `tracker.process_batch(images_dict, ...)` per frame, one CUDA context and one batched ORT call for RTMPose (`batch_size = min(max_batch_size=8, num_cameras)`), and GIL-releasing threaded concurrency for MediaPipe. Its backpressure handling drops stale frame requests rather than queueing lag; GPU OOM triggers a tracked session rebuild (up to 3 attempts) before giving up. Results reach the aggregator as `SkeletonInferenceResultMessage` and are spliced into the camera outputs so downstream triangulation code needs no changes.

Downstream, `RealtimeAggregatorNode` triangulates the per-camera skeleton and ChArUco Observations against the loaded calibration, filters, rigidifies, and republishes, all operating on the `Observation` objects SkellyTracker produced.

## `freemocap.core.pipeline.posthoc`: the posthoc pipeline

`VideoNode` is generic over a SkellyTracker `TrackerConfig`, the same node handles ChArUco detection, RTMPose, or MediaPipe on recorded videos. `_build_tracker` inspects the config and routes to the factory builder, direct `Tracker.create` for MediaPipe, or an ONNX session for RTMPose; `_build_annotator` pairs `KeypointAnnotator` (with stage schemas built from `tracker_definitions`) or the ChArUco annotator, layering new annotations onto previously annotated videos. `PosthocMocapPipelineConfig` translates user-facing detector settings into a `TrackerConfig` (RTMPose confidence 0.004, redetect interval computed from the video's actual fps). During calibration recordings, `CharucoRecorderNode` pickles realtime ChArUco Observations to disk, and `VideoNode` later replays that cache, validated against the board geometry and aligned frame-by-frame through the timestamps CSV, instead of re-running OpenCV detection.

## Calibration

The calibration stack is built on SkellyTracker's ChArUco types end to end: `CalibrationTaskConfig` carries a `CharucoBoardDefinition`, the Anipose solver accepts that same board definition, and corner observations arrive as `ObservationBuffer` arrays sliced with `to_stage_array("charuco", n_points=board.n_corners)`. Board pose helpers (`compute_board_pose`, transforms, Anipose row export) live in SkellyTracker itself, keeping geometry knowledge in the repo that detects the corners.
