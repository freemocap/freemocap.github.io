---
title: "Data model"
type: reference
sidebar_position: 3
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "core/data_primitives/keypoints.py (names/xyz/visibility fields and shapes confirmed exact, including the x,y-pixels/z-filled-by-triangulation comment) and observation.py (to_keypoints() confirmed to exist)"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# Data model

- **`Keypoints`** (`core/data_primitives/keypoints.py`), named points: `.names` tuple, `.xyz` `(N, 3)` (x,y in pixels; z filled by triangulation later), `.visibility` `(N,)` scores in 0-1. Undetected points are NaN with visibility 0. Provides name-based lookup, slicing, concatenation, confidence masking, and translation.
- **`BoundingBox`**, x1y1x2y2 plus confidence, with crop/clamp/scaling helpers.
- **`StageObservation` / `Observation`** (`core/data_primitives/observation.py`), per-frame result. `observation.stages["name"].keypoints` returns a stage's `Keypoints`; children nest under `.children`. `Observation.to_keypoints()` flattens the whole stage tree into one `Keypoints` with `<stage>.<point>` name prefixes, the docstring calls this "the form passed to FreeMoCap for triangulation."
- **`TrackerState`** (`core/tracker/tracker_state.py`), the explicit external temporal state: per-stage `StageState` holding bbox smoothing state, per-detector keypoint filter states, last keypoints, and consecutive miss/reset counters.
