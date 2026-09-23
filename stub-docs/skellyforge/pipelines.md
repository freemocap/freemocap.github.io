---
title: "Pipelines"
type: reference
sidebar_position: 5
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Re-read pipelines/test_pipeline.py and pipelines/dlc_pipeline.py against SkellyForge main (Trajectory3d flow, interpolate_trajectory/filter_trajectory, Human put_skeleton_on_ground and fix_hands_to_wrist, Animal and Actor.from_tracked_points_numpy_array, ModelInfo.from_config_path YAML loading), confirmed skellyforge.triangulation absent (tree-wide search plus flit packaging in pyproject.toml), confirmed triangulate_dict in the FreeMoCap clone, and confirmed current SkellyTracker ships no DeepLabCut tracker"
  - date: "2026-08-24"
    against: "SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone"
draft: false
---

# Pipelines

Defined in `pipelines/`.

- **`test_pipeline.py`** is the clearest statement of the intended end-to-end flow: raw 3D array to `Trajectory3d`, `interpolate_trajectory`, `filter_trajectory`, then build a `Human` (for MediaPipe, including `put_skeleton_on_ground()` and `fix_hands_to_wrist()`) or an `Animal` from an externally supplied YAML `ModelInfo` (the DeepLabCut path).
- **`dlc_pipeline.py`** aims to run the full animal workflow (load DeepLabCut CSV outputs via an optional import of a `DeepLabCutTracker` from SkellyTracker, triangulate against a calibration TOML, save raw arrays), but it imports `skellyforge.triangulation`, a package that does not exist anywhere in the repository tree, so it cannot run as checked in. Its `DeepLabCutTracker` import cannot succeed either: it targets `skellytracker.trackers.dlc_tracker.__dlc_tracker`, a module that does not exist anywhere in the current SkellyTracker tree, which organizes everything under `skellytracker.core` and ships no DeepLabCut tracker at all (its keypoint detectors are ArUco, ChArUco, MediaPipe, and RTMPose). That triangulation capability now lives in FreeMoCap itself.
