---
title: "Temporal processing"
type: reference
sidebar_position: 5
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "core/temporal_processing/ (bbox_policy.py, keypoint_reset_policy.py, keypoint_filtering.py, temporal_processing_config.py) confirmed to exist exactly as described; keypoint_filtering.py's own comment (\"else 1.0 frame units\") confirms the hardcoded-timestep caveat"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# Temporal processing

`core/temporal_processing/` implements the cross-frame machinery, all persisted in `TrackerState`:

- **`BBoxPolicy`** decides when the object detector reruns (`redetect_interval`, plus pluggable fitness checks such as `keypoints_within_bbox_ratio` or bbox-area-collapse detection) and what to use when it doesn't: a crop predicted from the previous frame's keypoints. Prediction includes anti-collapse guards documented extensively in source: a per-frame shrink rate limit, a floor tied to the detector's last actual measurement, and an absolute pixel floor, without these the keypoint-derived crop can ratchet smaller until the subject can never be reacquired.
- **`apply_bbox_ema`** smooths the crop across frames.
- **`OneEuroFilter` / `KalmanFilter`** smooth keypoint coordinates; gap-fill and velocity-anomaly rejection are configurable. One current caveat, stated in source: the per-frame timestep is hardcoded to 1.0, so filter cutoffs are in frame units rather than Hz.
- **`KeypointResetPolicy`** recovers stuck stateful detectors after consecutive empty detections, with backoff so an off-frame subject doesn't trigger resets forever. Off by default; FreeMoCap enables it (10 misses) for MediaPipe.
