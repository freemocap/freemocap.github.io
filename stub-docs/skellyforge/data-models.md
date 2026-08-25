---
title: "Data models"
type: reference
sidebar_position: 2
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone
draft: false
---

# Data models

Defined in `data_models/`.

- **`Trajectory3d`** (`trajectory_3d.py`) is the currency of the posthoc pipeline: `start_frame`, `end_frame`, a `(frames, markers, 3)` `triangulated_data` array, plus `reprojection_error` and `reprojection_error_by_camera` arrays. `from_observations()` stacks per-frame observations and rejects gaps in frame numbers outright ("Observations are not contiguous"). `save_to_arrays()` writes `{prefix}3d_data_spatial_xyz.npy`, `{prefix}reprojection_error.npy`, and `{prefix}reprojection_error_by_camera.npy`, the raw-data filenames FreeMoCap's own triangulation step produces.
- **`Observation3d`** holds one frame of named triangulated points with optional error data; `to_point_dictionary()` converts it to a dict of named `Point3d` values, skipping NaN markers.
- **`Trajectory2d`** is a thin `(start, end, points)` wrapper, and `type_overloads.py` aliases the dict shapes used to group 2D observations by camera and frame.
