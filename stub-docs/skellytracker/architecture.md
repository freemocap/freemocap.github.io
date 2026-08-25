---
title: "Architecture"
type: reference
sidebar_position: 2
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone
draft: false
---

# Architecture

## Tracker

`Tracker` (`core/tracker/tracker.py`) is the top-level orchestrator: a dataclass of `stages` plus a `sessions` dict, built with `Tracker.create(config, sessions)` from a `TrackerConfig`. It is stateless between calls. All temporal history lives in an explicitly passed `TrackerState`.

```python
observation, state = tracker.process_image(image, frame_number, state)
```

- `process_image(image, frame_number, state, timestamp_ms=None)` runs every stage on one frame and returns `(Observation, TrackerState)`. `timestamp_ms` is required by detectors in VIDEO mode (MediaPipe); when omitted those detectors derive one from `time.monotonic()`.
- `process_batch(images, frame_number, states)` runs N cameras in one call. For ONNX-backed detectors all cameras go through a single batched ORT call; non-ONNX detectors get per-camera instances dispatched on a thread pool.
- `close()` releases all detector and session resources; `reset_temporal_state()` wipes cross-frame history (called between independent videos so stateful backends don't try to track across file boundaries).

## `DetectionStage`

`DetectionStage` (`core/tracker/detection_stage.py`) is the compositional unit. Each stage binds:

- one optional `ObjectDetector` (proposes person bounding boxes),
- one or more `KeypointDetector`s (estimate points within a crop),
- optionally child stages that receive the parent's crop and keypoints, enabling hierarchical pipelines such as body → hands/face,
- per-stage temporal configuration: bbox reuse policy, bbox EMA smoothing (`BBoxSmoothingConfig`), keypoint filtering (one-euro or Kalman, via `KeypointSmoothingConfig`/`KalmanKeypointSmoothingConfig`), and a miss-driven detector reset policy (`KeypointResetPolicyConfig`).

`run()` executes, in order: object detection subject to the bbox reuse policy → bbox EMA smoothing → crop → keypoint detection translated back to full-frame coordinates → keypoint temporal filtering → child-stage recursion.

In batch mode (`run_batch`), ONNX detectors preprocess cameras in parallel and infer in one stacked `(N, 3, H, W)` ORT call. Its redetection decisions are deliberately synchronized across cameras for ONNX object detectors, either all cameras redetect or none do, so the batch size stays exactly 0 or N, avoiding repeated JIT recompilation on CoreML and TensorRT. Non-ONNX backends (MediaPipe, ChArUco, ArUco) instead get lazily created per-camera detector instances so stateful timestamp streams stay independent.

## Detectors and the registry

`ObjectDetector` and `KeypointDetector` (`core/detectors/detector_base_classes.py`) are the two primitives. Both implement `detect()` plus the `preprocess()`/`postprocess()` pair the batched path needs, are stateless between calls, and receive their `Session` at construction. Implementations register themselves into module-level `KEYPOINT_DETECTOR_REGISTRY` / `OBJECT_DETECTOR_REGISTRY` dicts (importing a detector module triggers registration as an import side effect); `build_keypoint_detector()` / `build_object_detector()` instantiate from Pydantic configs by looking up `detector_type`.

Each keypoint detector declares its point names and skeleton connections in a YAML file beside its code, loaded by `_schema_loader.py`. Annotators resolve connection name pairs to array indices for drawing.

## Sessions

`Session` (`core/sessions/session.py`) owns computational resources, model weights, device context, GPU memory, created once per backend and shared by every detector using that backend. Concrete implementations:

- **`CpuSession`**, no resources; backs the OpenCV-based detectors (ArUco, ChArUco).
- **`OnnxSession`** (`core/sessions/onnx_session.py`), holds every ONNX model a tracker needs, keyed by name (`session.get_session(model_name)`), so multiple detectors share one CUDA context. `batch_size` is required at construction and should equal the camera count passed to `process_batch()` (a mismatch logs a warning from `run_batched`). Provider selection: `None` auto-detects best available (trt → CUDA → CoreML → CPU); an explicit provider raises `SessionCreationError` immediately if unavailable. There is no silent fallback. Creation ends with a warmup dummy inference at the configured batch size, which forces CoreML/TensorRT lazy JIT compilation (5-30 s) to happen at startup rather than mid-loop. On CUDA/TensorRT the memory arena is sized to 85% of device VRAM; `close()` clears sessions and forces garbage collection so CoreML's Metal resources unwind deterministically rather than at interpreter shutdown.
- **`MediaPipeSession`** (`core/sessions/mediapipe_session.py`), probes whether MediaPipe GPU context creation works (using the lite pose model to keep the probe download small), sets `MEDIAPIPE_DISABLE_GPU` accordingly, and carries the shared `running_mode` (`video` by default, or `image`) that its landmarkers use.
