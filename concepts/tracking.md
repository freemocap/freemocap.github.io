---
title: Image tracking and pose models
type: explanation
sidebar_position: 6
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# Image tracking and pose models

Pose estimation is a computer vision task: given an image, find meaningful keypoints
in it, joint centers, in the case of a human body. Run across a recording, it produces
2D pixel locations for each keypoint, in every camera view, on every frame. Those
per-camera 2D detections are what [3D reconstruction](/concepts/triangulation)
triangulates into a 3D skeleton.

## Two challenges

Bringing pose estimation into a motion capture pipeline runs into two problems.

The first is accuracy. Errors in 2D keypoint localization propagate directly into the
final 3D result, and accuracy varies across algorithms. Many general-purpose pose
estimation models are trained on datasets that don't represent every population well:
[the prosthetics case in the validation study](/concepts/accuracy-and-limits) is a
direct example, off-the-shelf models struggled to track a transfemoral prosthesis user
because none of them had seen a limb shaped like that during training.

The second is integration. Even when a better-suited model exists, plugging it into a
motion capture pipeline is often harder than it should be, because most systems are
built tightly around one specific backend. Theia3D, for instance, uses a proprietary
pose estimation algorithm that can't be swapped out at all.

## SkellyTracker

**SkellyTracker** is FreeMoCap's answer to the integration problem: a standardized
interface that decouples pose estimation from the rest of the pipeline. Any tracker
that implements the interface can be used interchangeably, without changing anything
downstream. The default backend is MediaPipe, a free, CNN-based model (BlazePose)
chosen specifically for practicality: it's lightweight enough to run on a CPU, with no
GPU required, and simple to install and call from Python.

Because backends are swappable without touching the rest of the pipeline, different
pose estimation algorithms can be compared directly, using the same cameras,
calibration, and reconstruction settings. That's exactly what the validation study
did: MediaPipe, RTMPose, and ViTPose were all run through the identical pipeline, and
a custom-trained DeepLabCut model was added for the prosthetics case where none of the
general-purpose options worked.

## Why backend choice matters

There's no single "most accurate" backend. MediaPipe, RTMPose, and ViTPose each have
different failure modes, not just different error rates, and which one is right
depends on the task: see
[Accuracy, validity, and limits](/concepts/accuracy-and-limits) for what the
validation study found across gait, balance, and prosthetic alignment, and
[choosing a tracking model](/tutorials/choose-a-tracker) for picking one.

## Next steps

- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
- [Choosing a tracking model](/tutorials/choose-a-tracker)
- [How FreeMoCap works](/concepts/how-it-works)
