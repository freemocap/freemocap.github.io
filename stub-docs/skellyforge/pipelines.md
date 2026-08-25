---
title: "Pipelines"
type: reference
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone
draft: false
---

# Pipelines

Defined in `pipelines/`.

- **`test_pipeline.py`** is the clearest statement of the intended end-to-end flow: raw 3D array to `Trajectory3d`, `interpolate_trajectory`, `filter_trajectory`, then build a `Human` (for MediaPipe, including `put_skeleton_on_ground()` and `fix_hands_to_wrist()`) or an `Animal` from an externally supplied YAML `ModelInfo` (the DeepLabCut path).
- **`dlc_pipeline.py`** aims to run the full animal workflow (load DeepLabCut CSV outputs via SkellyTracker's DLC tracker in an optional import, triangulate against a calibration TOML, save raw arrays), but it imports `skellyforge.triangulation`, a package that does not exist anywhere in the repository tree, so it cannot run as checked in. That triangulation capability now lives in FreeMoCap itself.
