---
title: What is markerless motion capture?
type: explanation
sidebar_position: 3
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# What is markerless motion capture?

No physical markers, no suit, no infrared cameras built for the purpose: markerless
motion capture extracts kinematic data straight from ordinary video, using a model
that estimates where the joints are in each frame. For how FreeMoCap specifically fits
into this picture, see
[What is FreeMoCap?](/concepts/what-is-freemocap); this page is about the wider
technique it belongs to.

## Older than the deep learning boom

The idea predates modern computer vision by decades. In 1983, David Hogg published one
of the first attempts to model a person from video: a walking figure represented as a
hierarchy of cylinders, fitted to the image. In 1996, Davis and Gavrila built on that
idea with one of the earliest multi-camera markerless systems, mapping an articulated
cylindrical model onto images of a real person.

Without a way to directly recognize anatomical features in an image, these early
systems had to work from indirect cues instead: the outline of a silhouette, optical
flow between frames, edge detection, or reconstructing a 3D visual hull from multiple
camera views. Real methods, but ones that demanded serious computer vision expertise
to build and tune.

## The shift to learned models

That changed with deep learning-based pose estimation. DeepPose, released in 2014, and
OpenPose, released in 2017, marked the transition: instead of hand-built geometric
models, a neural network learns to infer joint locations directly from an image. Deep
learning quickly became the dominant approach, and it's what every actively developed
markerless system, FreeMoCap included, is built on today.

## Three tradeoffs, rarely solved together

Modern markerless motion capture research and tooling tends to fall into one of three
categories:

- **Custom-built workflows**, developed by individual research groups for a specific
  study. Described in a paper's methods section, but the code is usually not shared,
  so other researchers rebuild it from scratch.
- **Open-source systems** meant for reuse, like OpenCap (kinematics from two or more
  iPhones), Pose2Sim, and PosePipe. These lower the barrier to entry but are often
  harder to adapt: swapping the underlying pose estimation model or changing the
  processing pipeline isn't always straightforward.
- **Commercial proprietary systems**, most notably Theia3D. Accurate and widely
  validated, but expensive and closed source, which limits transparency into how a
  number was actually calculated.

Across all three, the same pattern shows up: gains in accuracy, accessibility, or
adaptability tend to come at the expense of one of the other two. It's the gap
FreeMoCap was built to close, not by finding a clever workaround, but by treating
accessibility itself as a design constraint that can improve data quality rather than
compromise it. See [How FreeMoCap works](/concepts/how-it-works) for how that plays
out in practice.

## Next steps

- [What is FreeMoCap?](/concepts/what-is-freemocap)
- [How FreeMoCap works](/concepts/how-it-works)
- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
