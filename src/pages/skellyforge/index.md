---
title: SkellyForge
type: reference
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone
draft: false
---

# SkellyForge

SkellyForge is the posthoc processing and kinematic modeling package for FreeMoCap. It takes triangulated 3D marker data and turns it into an analyzed, annotated, exportable skeleton: gap interpolation, Butterworth smoothing, anatomical model construction, center of mass and rigid-bone calculations, and NumPy/CSV/parquet/BVH output. Part of the polyrepo's pantheon tier, alongside SkellyCam, SkellyTracker, and FreeMoCap itself.

Its largest subpackage, `skellymodels`, doubles as the polyrepo's shared skeletal data model: the tracker-output layouts (MediaPipe, RTMPose, ChArUco boards), the tracker-agnostic canonical body and hand models, and the `Actor`/`Aspect`/`Trajectory` object graph built on top of them.

Package facts, from `pyproject.toml` and `__init__.py`: pure Python (>=3.10), AGPLv3+, runtime deps NumPy, SciPy, pandas, `toml`, `pyyaml`, and `pyarrow` (code also imports `tqdm` without declaring it), version `v2024.12.1009` via bumpver. The declared console script `skellyforge = skellyforge.__main__:run` is a placeholder, `__main__.py` contains a single comment, so there is no runnable CLI today.

## Data models (`data_models/`)

- **`Trajectory3d`** (`trajectory_3d.py`) is the currency of the posthoc pipeline: `start_frame`, `end_frame`, a `(frames, markers, 3)` `triangulated_data` array, plus `reprojection_error` and `reprojection_error_by_camera` arrays. `from_observations()` stacks per-frame observations and rejects gaps in frame numbers outright ("Observations are not contiguous"). `save_to_arrays()` writes `{prefix}3d_data_spatial_xyz.npy`, `{prefix}reprojection_error.npy`, and `{prefix}reprojection_error_by_camera.npy`, the raw-data filenames FreeMoCap's own triangulation step produces.
- **`Observation3d`** holds one frame of named triangulated points with optional error data; `to_point_dictionary()` converts it to a dict of named `Point3d` values, skipping NaN markers.
- **`Trajectory2d`** is a thin `(start, end, points)` wrapper, and `type_overloads.py` aliases the dict shapes used to group 2D observations by camera and frame.

## Post-processing (`post_processing/`)

Two small, deliberately pluggable stages. Each is driven by a Pydantic config, dispatched through a registry keyed by a method enum, applied marker-by-marker with a progress bar, and returns a new `Trajectory3d` carrying the original reprojection-error arrays through untouched.

**Interpolation** (`interpolation/`) fills gaps in the triangulated array. `InterpolationConfig` offers exactly one method today, `linear`: the marker's `(frames, dims)` slice goes through `pandas.DataFrame.interpolate(method='linear', axis=0)`. Afterward `fill_in_nans()` replaces any surviving non-finite values (leading/trailing NaNs linear interpolation cannot reach) with the column mean.

**Filtering** (`filters/`) smooths the interpolated signal. `FilterConfig` defaults define the pipeline's standard treatment: a `butter_low_pass` zero-phase Butterworth (SciPy `butter` + `filtfilt`) with cutoff 6 Hz, sampling rate 30 Hz, order 4, applied independently to each marker coordinate column.

## The skeletal data model (`skellymodels/`)

### Tracker layout configs (`tracker_info/`)

Six YAML files describe marker layouts, parsed by `ModelInfo` (`tracking_model_info.py`). Each defines a `name`, a `tracker_name`, an aspect `order`, and per-aspect blocks listing `tracked_points` (explicit names, or a `generated` convention/count pattern for dense regions like faces), optional `virtual_marker_definitions` (weighted sums of real markers), `segment_connections` (proximal/distal pairs), Winter-anthropometry `center_of_mass_definitions`, `bone_length_ratios`, and a `joint_hierarchy`.

| Config | Contents |
|---|---|
| `mediapipe_model_info.yaml` | body (33 landmarks + head/neck/trunk/hips_center virtual markers), both hands (21 points each, full finger segment map), face (136 generated `face_NNNN` contour points) |
| `rtmpose_model_info.yaml` | body (23 COCO-wholebody points + the four computed centers), face (68 generated), hands (21 points each, `hand_root`, `thumb1`, and more) |
| `canonical_body.yaml` | tracker-agnostic body model, see below |
| `canonical_hand.yaml` | tracker-agnostic hand model |
| `charuco_board_5_3.yaml` / `charuco_board_7_5.yaml` | board corners as numbered "markers" with grid segment connections and a joint hierarchy |

`ModelInfo` computes each aspect's slice into the flat tracker output array (`tracked_point_slices`), which is how a single `(frames, all_markers, 3)` array gets split among aspects. Factory functions (`MediapipeModelInfo()`, `RTMPoseModelInfo()`, `CanonicalBodyModelInfo()`, `CanonicalHandModelInfo()`, `CharucoBoard5x3ModelInfo()`/`CharucoBoard7x5ModelInfo()`) load each bundled config.

`canonical_body.yaml` deserves special mention because FreeMoCap's realtime pipeline treats it as the single source of truth for the body skeleton: 27 landmarks (23 COCO-wholebody body points plus the four computed centers), 23 segments, Winter 2009 center-of-mass parameters, a joint hierarchy rooted at `hips_center`, and `bone_length_ratios` (bone length over standing height for all 26 tree bones) that seed FreeMoCap's online segment-length estimator. Its header notes the per-tracker mapping YAMLs that say *how* each canonical landmark is produced from raw tracker keypoints live in SkellyTracker, not here.

### Structure and data classes (`models/`)

- **`AnatomicalStructure`** is the validated anatomy scaffold for one aspect. Its cross-field validator checks virtual-marker weights sum to roughly 1, that every referenced marker actually exists, that center-of-mass definitions have matching segments, and that joint-hierarchy parents and children are known markers.
- **`Aspect`** bundles one anatomical region: its `AnatomicalStructure`, a dict of named `Trajectory`s, optional `Error` (reprojection), and metadata. `add_tracked_points()` stores the incoming array as the `3d_xyz` trajectory, appending computed virtual markers (weighted sums) onto the end; `add_reprojection_error()` shape-validates before storing. Convenience properties expose `xyz`, `rigid_xyz`, `total_body_com`, and `segment_com`.
- **`Trajectory`** wraps a `(frames, markers, 3)` array with its ordered `landmark_names` (validated against each other) and offers dict, tidy long-form DataFrame (`frame`, `keypoint`, `x`, `y`, `z`), and raw-array views plus a `segment_data()` helper returning proximal/distal endpoint arrays per segment.
- **`Error`** is the same pattern for 2D per-marker error data.

### Managers: `Actor`, `Animal`, `Human`, `Board` (`managers/`)

**`Actor`** (ABC) is the container for everything tracked about one subject: a name, a dict of `Aspect`s, the tracker name and aspect ordering taken from `ModelInfo`. Key API:

- `from_tracked_points_numpy_array()` builds an actor and distributes a full `(frames, markers, 3)` array into aspects by slice.
- `from_parquet()` / `from_data()` reload an actor from the tidy `freemocap_data_by_frame.parquet` file, whose embedded metadata attributes carry the `model_info` needed to reconstruct the layout.
- `calculate(pipeline=STANDARD_PIPELINE)` runs the biomechanics pipeline (below) on every aspect.
- Exporters: per-trajectory `.npy` and `.csv` files named `{tracker}_{aspect}_{trajectory}`, a combined `{tracker}_skeleton_3d.npy`, the combined tidy CSV, and the metadata-bearing parquet.
- `to_data3d_frame_id_xyz_array()` concatenates every trajectory into one `(frames, markers, 3)` array with `{aspect}.{trajectory}.{landmark}` marker IDs, and `get_data3d_marker_mapping()` returns the index-to-name map, the shape downstream visualization wants.

Subclasses pick the aspect set: **`Animal`** gets a single `body` aspect (used for DeepLabCut-style animal data), **`Human`** adds `face`, `left_hand`, and `right_hand` aspects when the model config includes them, and **`Board`** represents a ChArUco board. Two `Human` posture helpers matter to FreeMoCap:

- `fix_hands_to_wrist()` translates each whole hand aspect so its wrist marker coincides with the corresponding body wrist (using the rigid trajectory when available), closing the gap between separately tracked hand and body skeletons.
- `put_skeleton_on_ground()` finds the lowest-velocity frame from the heel and foot-index markers, then builds an orthonormal basis from the foot-line forward direction and the neck-center up direction and rigidly rotates and translates every aspect so the skeleton stands on z = 0 facing its actual walking direction.

### Biomechanics calculations (`skellymodels/biomechanics/`)

Calculations follow an `AnatomicalCalculation` ABC (`calculate()` producing a `CalculationResult`, `store()` writing results back as new trajectories), composed into a `CalculationPipeline`. `STANDARD_PIPELINE` runs two:

- **`CenterOfMassCalculation`** computes each segment's COM along the proximal-to-distal axis at the configured fraction, then the total-body COM as the mass-weighted sum using the Winter segment-percentage table from the YAML. Adds `total_body_com` (one virtual marker) and `segment_com` (one per segment) trajectories.
- **`RigidBonesEnforcement`** measures each parent-child bone's median length over the recording, then makes a single forward pass down the joint hierarchy placing each child at `parent + normalize(child - parent) * median_length`, keeping observed pose while forcing constant bone lengths. Adds the `rigid_3d_xyz` trajectory. Either calculation skips itself gracefully (with a logged message in the result) when its required YAML fields are absent.

(A duplicated copy of this subpackage sits at the repo top level under `skellyforge/biomechanics/`; the `skellymodels` copy is the one everything, including FreeMoCap, imports.)

### BVH export (`skellymodels/bvh_exporter/`)

`BVHExporter.export_from_actor()` writes a standard BVH file from any actor aspect that has a joint hierarchy: the HIERARCHY section is built recursively from the YAML hierarchy with joint offsets taken from time-averaged positions, and the MOTION section carries per-frame channel data with rotations derived from bone orientations. The source is candid that this rotation math is a simplified direction-vector conversion (Y-up assumed, roll fixed at zero) and suggests inverse kinematics for production use. Two companion modules are staged but not yet wired in: `actor_bvh_extension.py` defines an `export_to_bvh()` method meant to be attached to `Actor`, and `advanced_bvh_rotation.py` implements the fuller IK-style rotation calculator (proper Euler decomposition via SciPy, quaternion window smoothing) with a note that the exporter can import it.

## Pipelines (`pipelines/`)

- **`test_pipeline.py`** is the clearest statement of the intended end-to-end flow: raw 3D array to `Trajectory3d`, `interpolate_trajectory`, `filter_trajectory`, then build a `Human` (for MediaPipe, including `put_skeleton_on_ground()` and `fix_hands_to_wrist()`) or an `Animal` from an externally supplied YAML `ModelInfo` (the DeepLabCut path).
- **`dlc_pipeline.py`** aims to run the full animal workflow (load DeepLabCut CSV outputs via SkellyTracker's DLC tracker in an optional import, triangulate against a calibration TOML, save raw arrays), but it imports `skellyforge.triangulation`, a package that does not exist anywhere in the repository tree, so it cannot run as checked in. That triangulation capability now lives in FreeMoCap itself.

## Logging (`system/logging_configuration/`)

SkellyForge does not depend on the SkellyLogs package. It carries its own vendored variant of the same design: importing `skellyforge` calls `configure_logging(LogLevels.TRACE)`, which registers custom levels (`LOOP` 3, `TRACE` 5, `SUCCESS` 22, `API` 25) plus their `logger.trace()`-style methods, quiets noisy third-party packages, and attaches handlers to the root logger: a colored console handler, a file handler always at TRACE (timestamped file under `~/skellyforge_data/logs_info_and_settings/logs/`), and a `QueueHandler`-based websocket handler fed by a size-capped multiprocessing queue created only in the main process (child processes skip configuration unless handed the queue). Configuration is skipped in non-main processes unless a queue is passed, mirroring SkellyLogs' multiprocessing story, though the record serialization is the plain stdlib `QueueHandler` form rather than SkellyLogs' custom payload.

## Utilities

`utilities/get_files_from_folder.py` globs synchronized-video folders for `.mp4` files and DeepLabCut export folders for `*snapshot*.csv` files, with dedupe and sorting.

## How FreeMoCap uses SkellyForge

`freemocap/pyproject.toml` depends on SkellyForge from GitHub main. The split between direct calls and reimplemented mirrors matters:

**Direct calls, the posthoc pipeline.** FreeMoCap's mocap helpers do their own triangulation, then hand the result to SkellyForge: wrap the points in a `Trajectory3d`, run `interpolate_trajectory` then `filter_trajectory`, build a `Human` from `MediapipeModelInfo()` or `RTMPoseModelInfo()`, call `put_skeleton_on_ground()` when the calibration is not ground-plane aligned and `fix_hands_to_wrist()`, run `calculate()`, and write all five save-out formats. The same shape produces the `Board` model from triangulated ChArUco corners. `MocapTaskConfig` takes its filter settings as SkellyForge's own `FilterConfig`.

**Canonical models and mirrored math, the realtime pipeline.** For latency reasons the realtime aggregator does not call SkellyForge's batch functions; instead it loads SkellyForge's canonical models once (`CanonicalBodyModelInfo` and `CanonicalHandModelInfo` through `AnatomicalStructure.from_model_info`, giving the joint hierarchies, `bone_length_ratios` seeds, and Winter COM table), maps raw detector keypoints onto canonical names using SkellyTracker's per-tracker mapping YAMLs, and reimplements the same algorithms per frame. Its `RealtimeSkeletonRigidifier` docstring states this plainly: the streaming counterpart of SkellyForge's posthoc `enforce_rigid_bones`, same median-length plus forward-pass method applied online. Likewise the realtime `center_of_mass` module follows "the same Winter-table math as SkellyForge" adapted to single-frame inputs.

**Shared plumbing.** `Point3d` from `skellyforge.data_models.trajectory_3d` is the wire type for skeleton points across FreeMoCap's pubsub topics, frontend payloads, and streaming kinematics. The websocket server derives the `canonical_body` and `canonical_hand` schemas it sends to the UI from SkellyForge's `AnatomicalStructure` (landmarks plus segment connections), so the frontend renders 3D skeleton connections without hardcoding them. The startup banner reports the installed SkellyForge version alongside the other Skelly packages.

## Caveats for readers

- The repo README documents a `postprocess_GUI.py` tkinter tool aimed at FreeMoCap 1.0-era file layouts; no such file exists in the current tree, so treat the README as stale.
- `pyproject.toml` still carries template boilerplate (description "Basic template of a python repository").

[← Back to Developer Docs](/developers)
