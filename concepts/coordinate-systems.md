---
title: Coordinate systems and units
type: explanation
sidebar_position: 9
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21 source read directly (posthoc_mocap_task.py, skeleton_from_mediapipe_observations.py, groundplane_math.py, anipose_calibration_helpers.py, run_anipose_calibration.py, calibration_result.py, calibration_task_config.py, core/kinematics package), skellyforge human.py, actor.py, biomechanics calculations, and bvh_exporter"
  - date: "2026-08-19"
    against: "none"
---

Every camera in a FreeMoCap recording sees the world from its own point of view, with its own
private sense of up, forward, and how far. [Triangulation](/concepts/triangulation) turns those
per-camera views into a single set of 3D points, but that only works if every point lands in one
shared frame. Coordinate conventions are the rules that make that frame meaningful: what a unit of
distance means, which way is up, and which way counts as positive rotation.

## Units: millimetres

FreeMoCap's 3D data is in millimetres. A value of `1000` on any axis is one metre from the origin.
This holds throughout the pipeline: the raw triangulated points, the reconstructed skeleton, and
whatever you export are all in the same scale.

## Up is +Z, and the basis is right-handed

FreeMoCap uses a right-handed coordinate system with +Z as up. This is the convention used across
robotics tooling and much of 3D and biomechanics software, and it is also Blender's own default
world orientation. It is deliberately not the left-handed, +Y-up convention that some game engines
default to.

Right-handed means the three axes follow the right-hand rule: point your right hand's fingers along
+X and curl them toward +Y, and your thumb points along +Z. That relationship between the axes is
fixed, independent of which way the scene happens to be facing.

"Up" being meaningful at all is not automatic, though. A camera has no idea which way gravity
points. FreeMoCap has to be told, and that happens at calibration.

## How the frame gets set: calibration

A camera's own coordinate frame is centered on its lens, with depth as one axis. That is not a
frame you want to read data in when you are trying to compute a joint angle or how high someone
jumped. Calibration replaces it with a frame tied to the physical world instead of to a camera's
perspective. There are two paths:

**Ground-plane calibration** builds the world frame from a ChArUco board laid flat on the floor at
the start of a recording. The board's own upward-facing normal becomes +Z, so the reconstructed
subject stands upright with their feet at `Z = 0`. Walk through it in
[Set the ground plane](/tutorials/ground-plane).

**Default calibration** skips the board and pins the world frame to camera 0's own view: depth as
one axis, image-right and image-down as the other two. It is still right-handed, but it is not
Z-up, and nothing in it knows which way gravity points. Reconstructed subjects typically come in
lying on their side rather than standing. (When such a recording runs through the posthoc
pipeline, FreeMoCap does make a best-effort attempt to stand the skeleton up afterward, but that
is inferred from the subject's own body, not a measured ground plane.)

Both are legitimate calibration paths. The difference is whether up, in your data, means anything
outside a single camera's point of view.

## Rotations: none, for now

FreeMoCap's skeleton output is positions, not orientations. Each frame stores 3D millimetre
coordinates for the tracked keypoints, the virtual markers appended to them, and derived
quantities such as center of mass. No per-segment or per-joint rotation track is computed or
saved by the pipeline today, so there is no anatomical segment frame to document here yet.

The rotations FreeMoCap does carry belong to the cameras, not to body segments: camera
orientations are held as quaternions in memory (scalar-first `w, x, y, z`) and stored as Rodrigues
rotation vectors in the saved calibration TOML. If you need joint angles, SkellyForge contains a
BVH exporter that derives Euler-angle rotations from bone directions between parent and child
joints, but nothing in the FreeMoCap application calls it, so a normal recording produces no BVH
file. [Coordinate conventions](/reference/coordinate-conventions) has the terse version of all of
this.

## See also

- [Coordinate conventions](/reference/coordinate-conventions) for the terse, citable spec.
- [Set the ground plane](/tutorials/ground-plane) for how to get a Z-up recording.
- [Triangulation and 3D reconstruction](/concepts/triangulation) for how 2D camera views become 3D points at all.
- [Glossary](/concepts/glossary) for terms like ChArUco board and reprojection error.
