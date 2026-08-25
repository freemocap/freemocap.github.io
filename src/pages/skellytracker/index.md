---
title: SkellyTracker
type: reference
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone
draft: false
---

# SkellyTracker

SkellyTracker is the single-camera image tracking backend for FreeMoCap: it turns raw images into named 2D keypoints and bounding boxes. It wraps several independent computer-vision tools behind one consistent API built around a **Tracker → Session → Detector** pipeline, implemented in the `skellytracker/core/` package. Part of the FreeMoCap polyrepo's pantheon tier.

It serves two distinct jobs for the pipeline:

- **Human pose estimation**, MediaPipe (pose/hands/face) or RTMPose + YOLOX produce whole-body keypoints per frame.
- **Calibration marker detection**, ArUco and ChArUco board detection produce the corner observations FreeMoCap's multi-camera calibration solves against.

Everything operates on single images or batches of images. SkellyTracker knows nothing about cameras, synchronization, recording, or 3D math. SkellyCam supplies frames, and FreeMoCap triangulates the output. Package-wide runtime type checking is enabled via `beartype_this_package()` in `skellytracker/__init__.py`.

## Architecture

### Tracker

`Tracker` (`core/tracker/tracker.py`) is the top-level orchestrator: a dataclass of `stages` plus a `sessions` dict, built with `Tracker.create(config, sessions)` from a `TrackerConfig`. It is stateless between calls. All temporal history lives in an explicitly passed `TrackerState`.

```python
observation, state = tracker.process_image(image, frame_number, state)
```

- `process_image(image, frame_number, state, timestamp_ms=None)` runs every stage on one frame and returns `(Observation, TrackerState)`. `timestamp_ms` is required by detectors in VIDEO mode (MediaPipe); when omitted those detectors derive one from `time.monotonic()`.
- `process_batch(images, frame_number, states)` runs N cameras in one call. For ONNX-backed detectors all cameras go through a single batched ORT call; non-ONNX detectors get per-camera instances dispatched on a thread pool.
- `close()` releases all detector and session resources; `reset_temporal_state()` wipes cross-frame history (called between independent videos so stateful backends don't try to track across file boundaries).

### `DetectionStage`

`DetectionStage` (`core/tracker/detection_stage.py`) is the compositional unit. Each stage binds:

- one optional `ObjectDetector` (proposes person bounding boxes),
- one or more `KeypointDetector`s (estimate points within a crop),
- optionally child stages that receive the parent's crop and keypoints, enabling hierarchical pipelines such as body → hands/face,
- per-stage temporal configuration: bbox reuse policy, bbox EMA smoothing (`BBoxSmoothingConfig`), keypoint filtering (one-euro or Kalman, via `KeypointSmoothingConfig`/`KalmanKeypointSmoothingConfig`), and a miss-driven detector reset policy (`KeypointResetPolicyConfig`).

`run()` executes, in order: object detection subject to the bbox reuse policy → bbox EMA smoothing → crop → keypoint detection translated back to full-frame coordinates → keypoint temporal filtering → child-stage recursion.

In batch mode (`run_batch`), ONNX detectors preprocess cameras in parallel and infer in one stacked `(N, 3, H, W)` ORT call. Its redetection decisions are deliberately synchronized across cameras for ONNX object detectors, either all cameras redetect or none do, so the batch size stays exactly 0 or N, avoiding repeated JIT recompilation on CoreML and TensorRT. Non-ONNX backends (MediaPipe, ChArUco, ArUco) instead get lazily created per-camera detector instances so stateful timestamp streams stay independent.

### Detectors and the registry

`ObjectDetector` and `KeypointDetector` (`core/detectors/detector_base_classes.py`) are the two primitives. Both implement `detect()` plus the `preprocess()`/`postprocess()` pair the batched path needs, are stateless between calls, and receive their `Session` at construction. Implementations register themselves into module-level `KEYPOINT_DETECTOR_REGISTRY` / `OBJECT_DETECTOR_REGISTRY` dicts (importing a detector module triggers registration as an import side effect); `build_keypoint_detector()` / `build_object_detector()` instantiate from Pydantic configs by looking up `detector_type`.

Each keypoint detector declares its point names and skeleton connections in a YAML file beside its code, loaded by `_schema_loader.py`. Annotators resolve connection name pairs to array indices for drawing.

### Sessions

`Session` (`core/sessions/session.py`) owns computational resources, model weights, device context, GPU memory, created once per backend and shared by every detector using that backend. Concrete implementations:

- **`CpuSession`**, no resources; backs the OpenCV-based detectors (ArUco, ChArUco).
- **`OnnxSession`** (`core/sessions/onnx_session.py`), holds every ONNX model a tracker needs, keyed by name (`session.get_session(model_name)`), so multiple detectors share one CUDA context. `batch_size` is required at construction and should equal the camera count passed to `process_batch()` (a mismatch logs a warning from `run_batched`). Provider selection: `None` auto-detects best available (trt → CUDA → CoreML → CPU); an explicit provider raises `SessionCreationError` immediately if unavailable. There is no silent fallback. Creation ends with a warmup dummy inference at the configured batch size, which forces CoreML/TensorRT lazy JIT compilation (5-30 s) to happen at startup rather than mid-loop. On CUDA/TensorRT the memory arena is sized to 85% of device VRAM; `close()` clears sessions and forces garbage collection so CoreML's Metal resources unwind deterministically rather than at interpreter shutdown.
- **`MediaPipeSession`** (`core/sessions/mediapipe_session.py`), probes whether MediaPipe GPU context creation works (using the lite pose model to keep the probe download small), sets `MEDIAPIPE_DISABLE_GPU` accordingly, and carries the shared `running_mode` (`video` by default, or `image`) that its landmarkers use.

## Data model

- **`Keypoints`** (`core/data_primitives/keypoints.py`), named points: `.names` tuple, `.xyz` `(N, 3)` (x,y in pixels; z filled by triangulation later), `.visibility` `(N,)` scores in 0-1. Undetected points are NaN with visibility 0. Provides name-based lookup, slicing, concatenation, confidence masking, and translation.
- **`BoundingBox`**, x1y1x2y2 plus confidence, with crop/clamp/scaling helpers.
- **`StageObservation` / `Observation`** (`core/data_primitives/observation.py`), per-frame result. `observation.stages["name"].keypoints` returns a stage's `Keypoints`; children nest under `.children`. `Observation.to_keypoints()` flattens the whole stage tree into one `Keypoints` with `<stage>.<point>` name prefixes, the docstring calls this "the form passed to FreeMoCap for triangulation."
- **`TrackerState`** (`core/tracker/tracker_state.py`), the explicit external temporal state: per-stage `StageState` holding bbox smoothing state, per-detector keypoint filter states, last keypoints, and consecutive miss/reset counters.

## Built-in detectors

| Registry key | Class | backend | Output |
|---|---|---|---|
| `aruco` | `ArucoDetector` | OpenCV, CPU | 4 corners per configured marker ID |
| `charuco` | `CharucoDetector` | OpenCV, CPU | all ChArUco corners + board ArUco marker corners |
| `mediapipe_pose` | `MediapipePoseKeypointDetector` | MediaPipe | 33 body landmarks |
| `mediapipe_hand` | `MediapipeHandKeypointDetector` | MediaPipe | 42 hand points (21 per hand, `right_hand_`/`left_hand_` prefixed) |
| `mediapipe_face` | `MediapipeFaceKeypointDetector` | MediaPipe | face contour subset of the 478-point mesh, named `face_NNNN` |
| `rtmpose_body` | `RTMPoseBodyDetector` | ONNX Runtime | 23 body keypoints (COCO17 + feet) |
| `rtmpose` | `RTMPoseKeypointDetector` | ONNX Runtime | 133 whole-body keypoints |
| `yolox_person` | `YoloxPersonDetector` | ONNX Runtime | person bounding boxes |

### ArUco and ChArUco

`ArucoDetector` detects standalone ArUco markers (default IDs `(0, 1, 2, 3)`, `DICT_4X4_50`) and returns four named corners per configured ID. `CharucoDetector` detects a full ChArUco board via `cv2.aruco.CharucoDetector.detectBoard`, returning every possible internal corner (`CharucoCorner-{id}`) followed by the board markers' corners (`ArucoMarkerCorner-{id}-{j}`), NaN where undetected.

Board geometry lives in `CharucoBoardDefinition`, squares X/Y, square length in mm, marker-length ratio, dictionary, described as the "single source of truth" used by both the detector and calibration solvers. It derives corner count (`(squares_x-1) × (squares_y-1)`) and board-frame corner positions; presets include `create_letter_size_5x3()` (54 mm squares, 8 corners) and `create_test_data_7x5()`. The `charuco` subpackage also provides `compute_board_pose()` (solvePnP board pose; needs at least 6 detected corners), `transform_to_camera_coordinates()`, and Anipose-format row export, see the ChArUco README in-repo for the multi-camera calibration walkthrough.

These detectors exist for camera calibration, not pose estimation. FreeMoCap's calibration tasks consume their observations directly (below).

### MediaPipe

Three landmarkers (Pose, Hand, Face) share one `MediaPipeSession`, each wrapping the MediaPipe Tasks API in VIDEO or IMAGE running mode. Pose model size is selectable (`MediapipePoseModelComplexity`: LITE/FULL/HEAVY, downloaded on demand). Hands return 42 named points; the face detector extracts the contour subset (names like `face_0033`) from the 478-point FaceLandmarker mesh. Because MediaPipe tracks across frames internally, the reset policy matters here: a stuck VIDEO-mode landmarker silently returning empty results is recovered by `reset_temporal_state()` after `max_consecutive_misses` misses, with exponential backoff while the subject stays out of frame.

### RTMPose + YOLOX

The top-down pairing: `YoloxPersonDetector` proposes person boxes, `RTMPoseKeypointDetector` estimates keypoints inside each crop. Both run through `OnnxSession`.

- YOLOX variants: `yolox-m` (640×640) and `yolox-tiny` (416×416); score threshold 0.7, NMS 0.45, `max_detections` default 1. The downloaded graph gets dynamic-batch surgery applied at load time.
- RTMPose whole-body variants: `rtmw-x-l_256x192` (default), `rtmw-x-l_384x288` (higher resolution), `rtmw-l-m_256x192`; SIMCC outputs decoded through letterbox metadata; confidence threshold 0.004 by default (below-threshold points become NaN with visibility 0). The RTMW models natively emit COCO-wholebody order (body, face, left hand, right hand); the detector permutes them to the schema order (body, right hand, left hand, face) defined in `rtmpose_wholebody.yaml`. A lighter `rtmpose_body` variant (`rtmpose-s/m`, 23 keypoints) also exists.

## Temporal processing

`core/temporal_processing/` implements the cross-frame machinery, all persisted in `TrackerState`:

- **`BBoxPolicy`** decides when the object detector reruns (`redetect_interval`, plus pluggable fitness checks such as `keypoints_within_bbox_ratio` or bbox-area-collapse detection) and what to use when it doesn't: a crop predicted from the previous frame's keypoints. Prediction includes anti-collapse guards documented extensively in source: a per-frame shrink rate limit, a floor tied to the detector's last actual measurement, and an absolute pixel floor, without these the keypoint-derived crop can ratchet smaller until the subject can never be reacquired.
- **`apply_bbox_ema`** smooths the crop across frames.
- **`OneEuroFilter` / `KalmanFilter`** smooth keypoint coordinates; gap-fill and velocity-anomaly rejection are configurable. One current caveat, stated in source: the per-frame timestep is hardcoded to 1.0, so filter cutoffs are in frame units rather than Hz.
- **`KeypointResetPolicy`** recovers stuck stateful detectors after consecutive empty detections, with backoff so an off-frame subject doesn't trigger resets forever. Off by default; FreeMoCap enables it (10 misses) for MediaPipe.

## Multi-person tracking

`MultiPersonTracker` (`core/tracker/multi_person_tracker.py`) extends the same stage machinery to several people: the root stage's object detector runs every frame to propose candidates, candidates are matched to existing `PersonTrackState`s by Hungarian assignment on a cost blending bbox IoU and keypoint displacement (`MultiPersonTrackingConfig`: weights 0.5/0.5, `max_age` 10, `min_hits` 3), and matched detections are finalized with each track's own accumulated temporal state. Unmatched detections spawn new tracks; unmatched tracks age out.

FreeMoCap does not use this today, its configs cap detections to one crop per camera, with an in-source comment explaining that a fixed batch size prevents intermittent GPU OOMs from spurious detections.

## Video IO, annotation, and demos

- `process_video` / `process_video_list` / `process_folder` (`core/io/process_video.py`) run a tracker over video files and save per-video `(frames, points, 3)` arrays as `.npy` (or JSON) via `DataStore`. The list/folder forms open all videos simultaneously and call `process_batch` once per frame, a single GPU call per model per frame, suiting synchronized multi-camera recordings; they recommend creating the `OnnxSession` with `batch_size` equal to the video count.
- `KeypointAnnotator` (`core/annotation/keypoint_annotator.py`) draws any `Observation` given per-stage visual schemas (connections, colors, optional colored connection groups, box overlays that distinguish "detector ran" from "bbox reused"). A dedicated ChArUco annotator also exists.
- The `skellytracker` console script (`python -m skellytracker`) opens a live webcam demo: `--tracker {mediapipe,rtmpose,aruco,charuco}`, `--camera`, `--rotate`, `--list`; each detector's `run_demo` module exposes finer options.

## Install extras and hardware

Base install (`pip install skellytracker`) covers the OpenCV detectors. Detector libraries and ONNX Runtime backends come via extras: `mediapipe`; `onnx`; and mutually exclusive session backends `onnx-cpu`, `onnx-cuda` (CUDA 12 + cuDNN 9 pip wheels, no system toolkit needed), `onnx-trt` (TensorRT, engines compiled on first run), `onnx-directml` (any GPU on Windows). Bundles: `recommended-cpu`, `recommended-cuda`, and `all-*` equivalents. See the repo README and `GPU_SETUP_GUIDE.md` for details.

## How FreeMoCap uses SkellyTracker

### Dependency wiring

`freemocap/pyproject.toml` pulls `skellytracker` from `git+https://github.com/freemocap/skellytracker` (main). The published extras mirror SkellyTracker's bundles, `pip install freemocap[cuda]` → `skellytracker[all-cuda]`, `freemocap[cpu]` → `skellytracker[all-cpu]`, and plain `uv sync` uses a platform-switched `tracker-default` group (CUDA on Windows/Linux, CPU/macOS incl. CoreML on Apple Silicon). The two ONNX backends can't coexist on disk, and FreeMoCap repeats SkellyTracker's `rtmlib` metadata override to strip the CPU-only `onnxruntime` conflict from resolution.

### Tracker construction: `freemocap.core.tracking`

This small package is the integration seam:

- **`tracker_factory.py`** centralizes every `Tracker.create()` call so registry side-effect imports happen reliably. Builders: `build_charuco_tracker(board_def)` (a ChArUco stage on a `CpuSession`), `build_skeleton_onnx_session(...)` (one `OnnxSession` loading YOLOX + RTMPose specs, sized for a camera count), `build_skeleton_tracker(onnx_session, ...)` (a `body` stage: YOLOX object detector + RTMPose keypoint detector, redetection every 5 s scaled by fps, keypoint-bbox tracking enabled, bbox EMA α 0.4), and `build_mediapipe_tracker(...)` (pose + hands + face detectors combined in one `body` stage on a `MediaPipeSession`, with the keypoint reset policy set to 10 consecutive misses).
- **`tracker_definitions.py`** loads point names and connections out of SkellyTracker's YAML files into lightweight `TrackerDefinition` objects (`RTMPOSE_WHOLEBODY_DEFINITION`, `MEDIAPIPE_BODY_DEFINITION`, and a composite `MEDIAPIPE_WHOLEBODY_DEFINITION` assembled by prefixing hand points). Its docstring records an integration subtlety: both the single-camera projection and multi-camera triangulation paths strip the stage prefix that `Observation.to_keypoints()` adds, so keypoint arrays arrive without the `body.` prefix.
- **`observation_buffer.py`** provides `ObservationBuffer`, described in-source as "a lightweight replacement for SkellyTracker's BaseRecorder." It accumulates per-camera Observations for the calibration and mocap tasks: `to_keypoints_array()` stacks merged stage keypoints into `(frames, keypoints, 3)`; `to_stage_array(stage_name, n_points)` extracts one stage, clamped to the first N points (used for ChArUco, whose flat array puts all corners before marker corners).

### `freemocap.core.pipeline.realtime`: the realtime pipeline

`CameraNodeConfig` holds SkellyTracker objects directly: a `charuco_tracker_config` rebuilt whenever the client-set `charuco_board` changes, and a `skeleton_tracker_config` defaulting to the RTMPose body stage (realtime tightens the confidence threshold to 0.0025 and uses LITE MediaPipe by default, versus HEAVY posthoc). `detector_type` switches between `"rtmpose"` and `"mediapipe"`.

Frames originate in SkellyCam, but note the direction of dependencies: SkellyCam has no code dependency on SkellyTracker anywhere in its source. The bridge is FreeMoCap's pipeline, nodes read frames out of SkellyCam's shared-memory ring buffers and feed them to SkellyTracker trackers.

Two execution topologies exist:

- **Per-camera** (`CameraNode`): each camera process builds its own ChArUco and skeleton trackers, calls `process_image` per frame, optionally applies FreeMoCap's own 2D one-euro filter and NaN-gates low-confidence keypoints, and publishes a `CameraNodeOutputMessage` carrying the ChArUco and skeleton Observations. Used for skeleton tracking when inference is not centralized.
- **Centralized** (`RealtimeSkeletonInferenceNode`, the default via `use_centralized_inference=True`): one worker owns a single tracker/session for all cameras. It reads frame N from every camera ring buffer directly and issues one `tracker.process_batch(images_dict, ...)` per frame, one CUDA context and one batched ORT call for RTMPose (`batch_size = min(max_batch_size=8, num_cameras)`), and GIL-releasing threaded concurrency for MediaPipe. Its backpressure handling drops stale frame requests rather than queueing lag; GPU OOM triggers a tracked session rebuild (up to 3 attempts) before giving up. Results reach the aggregator as `SkeletonInferenceResultMessage` and are spliced into the camera outputs so downstream triangulation code needs no changes.

Downstream, `RealtimeAggregatorNode` triangulates the per-camera skeleton and ChArUco Observations against the loaded calibration, filters, rigidifies, and republishes, all operating on the `Observation` objects SkellyTracker produced.

### `freemocap.core.pipeline.posthoc`: the posthoc pipeline

`VideoNode` is generic over a SkellyTracker `TrackerConfig`, the same node handles ChArUco detection, RTMPose, or MediaPipe on recorded videos. `_build_tracker` inspects the config and routes to the factory builder, direct `Tracker.create` for MediaPipe, or an ONNX session for RTMPose; `_build_annotator` pairs `KeypointAnnotator` (with stage schemas built from `tracker_definitions`) or the ChArUco annotator, layering new annotations onto previously annotated videos. `PosthocMocapPipelineConfig` translates user-facing detector settings into a `TrackerConfig` (RTMPose confidence 0.004, redetect interval computed from the video's actual fps). During calibration recordings, `CharucoRecorderNode` pickles realtime ChArUco Observations to disk, and `VideoNode` later replays that cache, validated against the board geometry and aligned frame-by-frame through the timestamps CSV, instead of re-running OpenCV detection.

### Calibration

The calibration stack is built on SkellyTracker's ChArUco types end to end: `CalibrationTaskConfig` carries a `CharucoBoardDefinition`, the Anipose solver accepts that same board definition, and corner observations arrive as `ObservationBuffer` arrays sliced with `to_stage_array("charuco", n_points=board.n_corners)`. Board pose helpers (`compute_board_pose`, transforms, Anipose row export) live in SkellyTracker itself, keeping geometry knowledge in the repo that detects the corners.

## Repository pointers

- Source layout follows the architecture preceding: `skellytracker/core/{tracker,detectors,sessions,temporal_processing,data_primitives,config,io,annotation}`.
- Tests: `pytest skellytracker/tests` (slow real-inference tests marked `video`; skip with `-m 'not video'`). Lint: `ruff check skellytracker/`.
- Extending: subclass `KeypointDetector` or `ObjectDetector`, register in the corresponding registry, and define the point-name/connection YAML.

[← Back to Developer Docs](/developers)
