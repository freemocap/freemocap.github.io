---
title: "The skeletal data model"
type: reference
sidebar_position: 4
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "Line-by-line recheck against SkellyForge main clone: all six tracker_info YAMLs, tracking_model_info.py, models package (AnatomicalStructure, Aspect, Trajectory, Error), managers (Actor, Animal, Human, Board), skellymodels/biomechanics calculations plus its top-level duplicate under skellyforge/biomechanics, and the three bvh_exporter modules; FreeMoCap-side integration claims rechecked against the v2.0.0-alpha.21 clone"
  - date: "2026-08-24"
    against: "SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone"
---

# The skeletal data model

Defined in `skellymodels/`.

## Tracker layout configs (`tracker_info/`)

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

## Structure and data classes (`models/`)

- **`AnatomicalStructure`** is the validated anatomy scaffold for one aspect. Its cross-field validator checks virtual-marker weights sum to roughly 1, that every referenced marker actually exists, that center-of-mass definitions have matching segments, and that joint-hierarchy parents and children are known markers.
- **`Aspect`** bundles one anatomical region: its `AnatomicalStructure`, a dict of named `Trajectory`s, optional `Error` (reprojection), and metadata. `add_tracked_points()` stores the incoming array as the `3d_xyz` trajectory, appending computed virtual markers (weighted sums) onto the end; `add_reprojection_error()` shape-validates before storing. Convenience properties expose `xyz`, `rigid_xyz`, `total_body_com`, and `segment_com`.
- **`Trajectory`** wraps a `(frames, markers, 3)` array with its ordered `landmark_names` (validated against each other) and offers dict, tidy long-form DataFrame (`frame`, `keypoint`, `x`, `y`, `z`), and raw-array views plus a `segment_data()` helper returning proximal/distal endpoint arrays per segment.
- **`Error`** is the same pattern for 2D per-marker error data.

## Managers: `Actor`, `Animal`, `Human`, `Board` (`managers/`)

**`Actor`** (ABC) is the container for everything tracked about one subject: a name, a dict of `Aspect`s, the tracker name and aspect ordering taken from `ModelInfo`. Key API:

- `from_tracked_points_numpy_array()` builds an actor and distributes a full `(frames, markers, 3)` array into aspects by slice.
- `from_parquet()` / `from_data()` reload an actor from the tidy `freemocap_data_by_frame.parquet` file, whose embedded metadata attributes carry the `model_info` needed to reconstruct the layout.
- `calculate(pipeline=STANDARD_PIPELINE)` runs the biomechanics pipeline (below) on every aspect.
- Exporters: per-trajectory `.npy` and `.csv` files named `{tracker}_{aspect}_{trajectory}`, a combined `{tracker}_skeleton_3d.npy`, the combined tidy CSV, and the metadata-bearing parquet.
- `to_data3d_frame_id_xyz_array()` concatenates every trajectory into one `(frames, markers, 3)` array with `{aspect}.{trajectory}.{landmark}` marker IDs, and `get_data3d_marker_mapping()` returns the index-to-name map, the shape downstream visualization wants.

Subclasses pick the aspect set: **`Animal`** gets a single `body` aspect (used for DeepLabCut-style animal data), **`Human`** adds `face`, `left_hand`, and `right_hand` aspects when the model config includes them, and **`Board`** represents a ChArUco board. Two `Human` posture helpers matter to FreeMoCap:

- `fix_hands_to_wrist()` translates each whole hand aspect so its wrist marker coincides with the corresponding body wrist (using the rigid trajectory when available), closing the gap between separately tracked hand and body skeletons.
- `put_skeleton_on_ground()` finds the lowest-velocity frame from the heel and foot-index markers, then builds an orthonormal basis from the foot-line forward direction and the neck-center up direction and rigidly rotates and translates every aspect so the skeleton stands on z = 0 facing its actual walking direction.

## Biomechanics calculations (`skellymodels/biomechanics/`)

Calculations follow an `AnatomicalCalculation` ABC (`calculate()` producing a `CalculationResult`, `store()` writing results back as new trajectories), composed into a `CalculationPipeline`. `STANDARD_PIPELINE` runs two:

- **`CenterOfMassCalculation`** computes each segment's COM along the proximal-to-distal axis at the configured fraction, then the total-body COM as the mass-weighted sum using the Winter segment-percentage table from the YAML. Adds `total_body_com` (one virtual marker) and `segment_com` (one per segment) trajectories.
- **`RigidBonesEnforcement`** measures each parent-child bone's median length over the recording, then makes a single forward pass down the joint hierarchy placing each child at `parent + normalize(child - parent) * median_length`, keeping observed pose while forcing constant bone lengths. Adds the `rigid_3d_xyz` trajectory. Either calculation skips itself gracefully (with a logged message in the result) when its required YAML fields are absent.

(A duplicated copy of this subpackage sits at the repo top level under `skellyforge/biomechanics/`; the `skellymodels` copy is the one everything, including FreeMoCap, imports.)

## BVH export (`skellymodels/bvh_exporter/`)

`BVHExporter.export_from_actor()` writes a standard BVH file from any actor aspect that has a joint hierarchy: the HIERARCHY section is built recursively from the YAML hierarchy with joint offsets taken from time-averaged positions, and the MOTION section carries per-frame channel data with rotations derived from bone orientations. The source is candid that this rotation math is a simplified direction-vector conversion (Y-up assumed, roll fixed at zero) and suggests inverse kinematics for production use. Two companion modules are staged but not yet wired in: `actor_bvh_extension.py` defines an `export_to_bvh()` method meant to be attached to `Actor`, and `advanced_bvh_rotation.py` implements the fuller IK-style rotation calculator (proper Euler decomposition via SciPy, quaternion window smoothing) with a note that the exporter can import it.
