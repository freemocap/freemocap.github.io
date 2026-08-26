---
title: Coordinate conventions
type: reference
sidebar_position: 12
provenance: ai-generated
history:
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 source read directly (groundplane_math.py, groundplane_alignment.py, pyceres postprocessing.py, anipose_calibration_helpers.py, camera_extrinsics.py, calibration_result.py, calibration_task_config.py, skeleton_from_mediapipe_observations.py), CharucoBoardDefinition in skellytracker, SkellyForge human.py and bvh_exporter"
  - date: "2026-08-19"
    against: "none"
draft: false
---

FreeMoCap's 3D data is millimetres, right-handed, with **+Z up** once a recording has been through
ground-plane calibration. This matches the axis convention used across robotics tooling and most 3D
and biomechanics software, rather than the left-handed, Y-up convention common in some game engines.
For the reasoning behind these choices, see [Coordinate systems and units](/concepts/coordinate-systems).

| Property | Value |
|---|---|
| Units | millimetres (mm) |
| Handedness | right-handed, always |
| Up axis | +Z, after ground-plane calibration (see below) |
| Rotation encoding | camera orientations are held as quaternions, `w, x, y, z` (scalar-first), in memory; the saved calibration TOML stores them as Rodrigues rotation vectors |
| Identity rotation | `(1, 0, 0, 0)`, meaning no rotation (camera 0 sits here once pinned to the origin) |

## World origin and orientation

Where `(0, 0, 0)` sits, and which way is up, depends on how the recording was calibrated.

**Ground-plane calibration** (recommended). The origin is corner 0 of the ChArUco board, and +Z is
the board's own upward-facing normal, computed with the right-hand rule. The subject comes in
standing upright, feet at `Z = 0`. The board's placement on the floor sets the horizontal (X and Y)
orientation of the scene: FreeMoCap does not tie X or Y to the subject's facing direction, so two
recordings calibrated with the board turned 90° apart differ by a rotation about Z. See
[Set the ground plane](/tutorials/ground-plane) for exactly how the origin and axes are built from
the board.

**Default calibration** (no ground-plane board). The origin is the optical center of camera 0, and
the world axes are camera 0's own: +Z outward from the lens, +X right, +Y down the image. This is
right-handed, but it is not Z-up. Reconstructed subjects come in oriented to the camera rather than
to the room, typically lying on their side. When such a recording is run through the posthoc
pipeline, FreeMoCap makes a best-effort attempt to stand the skeleton up automatically (SkellyForge's
`put_skeleton_on_ground`, which builds an up direction from the feet to the neck at a still frame),
but that is inferred from the subject's own body, not a measured ground plane, and it currently keys
off MediaPipe-style foot marker names (`left_foot_index`, `right_foot_index`), so RTMPose recordings
skip it. Ground-plane calibration remains the reliable way to get a physically meaningful Z-up.

## Segment and rotation data

As of this version, FreeMoCap's skeleton output is positions, not orientations: each frame stores
3D millimetre coordinates for the tracked keypoints and virtual markers (see
[output arrays](/reference/data-arrays)), plus derived quantities such as center of mass. No
per-segment or per-joint rotation track (Euler or quaternion) is computed or saved by the pipeline,
so there is no anatomical segment frame to document here yet.

The quaternion convention in the table above therefore applies to cameras, not body segments.
Identity, `(1, 0, 0, 0)`, simply means no rotation.

If you need joint angles, SkellyForge contains a BVH exporter that derives Euler-angle rotations
(rotation order ZXY) from bone directions between parent and child joints, but nothing in the
FreeMoCap application calls it today, so a normal recording produces no BVH file.

## Exporting to other tools

Most 3D and game-engine tools do not share this convention. Unity is left-handed and Y-up. Unreal is
left-handed, Z-up, and scaled in centimetres rather than millimetres. Blender's default world is
Z-up, matching FreeMoCap's own up axis. Check the target application's convention before assuming an
export carries over unchanged.

## Further detail

This page states FreeMoCap's declared convention, not the full specification. In the core repo the
behavior described above is implemented in
`freemocap/core/tasks/calibration/shared/groundplane_math.py` (stable-window detection, the Kabsch
fit of the known board model, and the +Z-toward-the-cameras orientation),
`freemocap/core/tasks/calibration/shared/groundplane_alignment.py` (applying the transform to
camera extrinsics), and `pyceres_calibration/helpers/postprocessing.py` (pinning camera 0 to the
origin). For the design rationale behind these choices, see the
[`current-work-plans`](https://github.com/freemocap/freemocap/tree/aaba062914a7e3b97ca2ee4c2a71684f1cd85a56/current-work-plans)
directory in the core repo, particularly
[`00-foundation/conventions.md`](https://github.com/freemocap/freemocap/blob/aaba062914a7e3b97ca2ee4c2a71684f1cd85a56/current-work-plans/00-foundation/conventions.md).
