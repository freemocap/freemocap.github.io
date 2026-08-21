---
title: How FreeMoCap works
type: explanation
sidebar_position: 4
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# How FreeMoCap works

Every markerless motion capture pipeline, FreeMoCap included, turns 2D video into 3D
movement through the same four stages: calibration, synchronized recording, pose
estimation, and 3D reconstruction. This page walks through what each stage does and
why it's ordered the way it is; the pages linked throughout go deeper on each one.

## The four stages

A recording starts with cameras positioned and oriented around the subject, placement
shaped by what needs to stay visible and what might get occluded. From there:

1. **Calibration** estimates each camera's intrinsics (how it maps light onto its
   sensor) and extrinsics (where it sits and which way it's pointed), tying every
   camera to one shared 3D coordinate system. See
   [Why calibration matters](/concepts/calibration).
2. **Synchronized recording** captures temporally aligned video across all cameras at
   once. See [Cameras and synchronization](/concepts/cameras-and-sync).
3. **Pose estimation** runs on each camera's video independently, estimating the 2D
   pixel location of each joint (keypoint) in every frame. See
   [Image tracking and pose models](/concepts/tracking).
4. **3D reconstruction** combines the calibration data with every camera's 2D
   keypoints to triangulate each joint's 3D position, frame by frame. See
   [Triangulation and 3D reconstruction](/concepts/triangulation).

Calibration and recording can happen in either order in practice. What matters is that
both are done before pose estimation and reconstruction, since reconstruction needs
both the camera geometry and the per-camera 2D detections to solve for a 3D point.

## Three design requirements

FreeMoCap's design is evaluated against three requirements, and most of the choices
described on this page trace back to one of them:

1. **Biomechanical utility.** The data needs to be accurate enough, and capture
   biomechanically meaningful patterns, to actually be useful for movement analysis.
   See [Accuracy, validity, and limits](/concepts/accuracy-and-limits) for how that's
   been tested.
2. **Extensibility.** The system should support multiple pose estimation backends, and
   be modifiable when an out-of-the-box pipeline isn't enough for a given task or
   population. See [Image tracking and pose models](/concepts/tracking) and the
   [output data model](/concepts/data-model).
3. **Accessibility.** Financial, computational, and methodological barriers should
   stay low: low-cost hardware, minimal specialized software or hardware, and openly
   available workflows. See [Cameras and synchronization](/concepts/cameras-and-sync).

It's easy to assume accessibility has to come at the cost of accuracy. Across the rest
of `/concepts/`, the more specific pages make the case that, for FreeMoCap, that
tradeoff mostly doesn't hold: cheaper cameras enabled more of them, and more cameras
improved reconstruction accuracy directly.

## Next steps

- [Cameras and synchronization](/concepts/cameras-and-sync)
- [Why calibration matters](/concepts/calibration)
- [Image tracking and pose models](/concepts/tracking)
- [The FreeMoCap output data model](/concepts/data-model)
