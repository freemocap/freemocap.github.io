---
title: What is FreeMoCap?
type: explanation
sidebar_position: 2
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "polyrepo-clones pulled 2026-08-26 (freemocap pinned at v2.0.0-alpha.21): corrected the supported-pose-model parenthetical, ViTPose is not a built-in detector (skellytracker KEYPOINT_DETECTOR_REGISTRY/OBJECT_DETECTOR_REGISTRY register only mediapipe_pose/hand/face, rtmpose body/face/hand/wholebody, aruco, charuco, yolox_person; freemocap.spec lists skellytracker.trackers.vitpose_tracker under its legacy/unused excludes); confirmed MediaPipe and RTMPose as the two built-in skeleton models via freemocap core/tracking/tracker_factory.py and freemocap-docs backend-mocap.mdx; confirmed Blender export (freemocap.spec bundles freemocap_blender_addon plus run_blender_export.py, freemocap-docs guides/blender-export.mdx) and raw .npy output access; confirmed AGPLv3 via the LICENSE file and README badge; verified all three link targets resolve (/concepts/accuracy-and-limits, /start/install through the docs instance routeBasePath '/', /concepts/markerless-mocap, /concepts/how-it-works); Kinect history and the three-design-requirements framing trace to the Cherian dissertation and general history, neither cloned locally, left as written"
  - date: "2026-08-20"
    against: "none"
---

# What is FreeMoCap?

Marker-based motion capture, the systems that track reflective dots on a
suit using an array of infrared cameras, is the gold standard for measuring
how a body moves. It's also expensive, tied to a dedicated lab space, and
run by people trained to place markers on the right anatomical landmarks.
That combination has kept quantitative motion analysis mostly inside
well-funded research labs, out of reach for most clinicians, educators,
independent researchers, and creators.

FreeMoCap is an attempt to close that gap: a free, open-source, markerless
motion capture system that works with ordinary webcams. Point a few cameras
at someone moving, and FreeMoCap turns the video into a 3D skeleton, no
suit, no markers, no specialized room required.

## Why "markerless" matters

Something similar happened once before. In 2010, Microsoft released the
Kinect, a $150 gaming peripheral that could sense depth and track a body in
real time, technology that had previously cost tens of thousands of
dollars. Microsoft never intended it for research. Within six days of
release, an open-source bounty got the Kinect's drivers reverse-engineered,
and a community of hobbyists, artists, and eventually biomechanics
researchers started using it for things it was never designed to do. The
Kinect itself is long discontinued, but the pattern it demonstrated held:
pairing low-cost hardware with open software is what actually moves a
technology from a handful of labs into general use.

FreeMoCap follows the same pattern with modern computer vision. Deep
learning-based pose estimation (the kind of model that can find a wrist or
a knee in a 2D image without any physical marker) has advanced enough that
several cameras and some software are now sufficient to reconstruct
biomechanically meaningful 3D movement.

## What it does

FreeMoCap covers the complete pipeline from raw video to usable data:

- **Synchronized recording** across one or more webcams
- **Calibration**, so the system knows where each camera sits in space
- **Pose estimation**, detecting joint positions in each 2D video frame
- **3D reconstruction**, triangulating those 2D detections into a 3D skeleton over time

The architecture is modular by design: you can swap which pose estimation
model runs underneath (MediaPipe and RTMPose are built in, and the detector
registry is designed so further models can be integrated), export into
Blender for animation, or pull the raw coordinate data into Python for
analysis. It's released under the AGPL license, so the full pipeline is
inspectable and modifiable, not a black box.

## Who it's for

FreeMoCap was built around three requirements: the data it produces should
be usable for real biomechanical analysis, the system should be flexible
enough to extend when an out-of-the-box pose estimation model isn't enough
for a given task or body, and the barrier to entry should be a few
consumer webcams rather than a dedicated lab. In practice that's brought in
a mix of researchers, clinicians, animators, and hobbyists, everyone from
someone validating gait metrics against a marker-based reference to someone
recording a friend's dance moves to rig a character in Blender.

It is not a drop-in replacement for marker-based motion capture. For how
FreeMoCap's accuracy actually compares, and where it falls short, see
[Accuracy, validity, and limits](/concepts/accuracy-and-limits).

## Next steps

- [Install FreeMoCap](/start/install) and make your first recording
- [What is markerless motion capture?](/concepts/markerless-mocap), the broader technique FreeMoCap belongs to
- [How FreeMoCap works](/concepts/how-it-works), a closer look at the pipeline
