---
title: Why calibration matters
type: explanation
sidebar_position: 7
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# Why calibration matters

A camera only knows where something is relative to itself: two feet in front of it, a
bit to the right. A second camera, looking at the same point, describes it just as
validly, but in its own language, a different distance, a different direction, because
it's sitting somewhere else. Before those two descriptions can be combined into one 3D
point, every camera needs to be translated into a single shared frame of reference.
That translation is calibration.

## Intrinsics and extrinsics

Calibration solves for two things about each camera:

- **Extrinsics**: where the camera is, and which way it's pointed, relative to a
  shared world origin.
- **Intrinsics**: how the camera itself sees, its focal length, principal point, and
  lens distortion, which together describe how a 3D point in front of the lens lands
  on a 2D pixel grid.

Together, intrinsics and extrinsics answer both directions of the same question: given
a 3D point, where does it land in this camera's image, and, run in reverse, given a 2D
pixel, what does it tell us about where the point could be in 3D. Calibration is what
makes the reverse direction solvable at all.

## The ChArUco board

FreeMoCap calibrates using a ChArUco board: a checkerboard overlaid with uniquely
identifiable ArUco markers, printable on ordinary paper and mounted to something
rigid. (Matte material is worth it; glare on a glossy board introduces detection
errors.) Every corner on the board has a known position relative to every other
corner, so it functions as a known 3D object with an easy-to-detect 2D projection in
each camera's image: exactly the known 3D positions and matching 2D pixels that
calibration needs in order to solve for the unknown camera parameters.

Waving the board through the capture volume, tilting and moving it so different pairs
of cameras see it together, gradually links every camera into one shared coordinate
system. If camera 1 and camera 2 both see the board at the same moment, their
positions relative to each other become computable, and enough overlapping views link
every camera in the rig together, even ones that never directly share a view of each
other.

## Two ways to set the world frame

Where that shared coordinate system's origin and orientation actually land depends on
how calibration is run:

**Ground-plane calibration** places the board flat on the floor, in view of every
camera, at the start of a recording. The board's own upward-facing normal becomes the
world's +Z axis, so reconstructed data comes out already standing upright, with the
floor at `Z = 0`. Walk through it in
[Set the ground plane](/tutorials/ground-plane).

**Default calibration** skips the board-on-floor step and pins the world frame to
camera 0's own point of view instead. It's still a valid, internally consistent
coordinate system, but it has no relationship to gravity: reconstructed subjects
typically come out lying on their side rather than standing. See
[Coordinate systems and units](/concepts/coordinate-systems) for what that means for
the data you get back.

## The math, if you want it

Formally, calibration solves `x = PX`: recovering the camera matrix `P` (built from
intrinsics and extrinsics together) that explains a set of known 3D points `X` and
their detected 2D pixel locations `x`. The ChArUco board supplies both sides of that
equation at once. Its corners are the known `X`, and detecting them in each image
gives the matching `x`, so with enough views the system has far more equations than
unknowns and can solve for `P` directly. The same reprojection error this optimization
minimizes shows up again during reconstruction; see
[Triangulation and 3D reconstruction](/concepts/triangulation) for that half of the
math.

## Next steps

- [Calibrate your cameras](/tutorials/calibrate)
- [Set the ground plane](/tutorials/ground-plane)
- [Get a calibration you can trust](/tutorials/better-calibration)
- [Coordinate systems and units](/concepts/coordinate-systems)
