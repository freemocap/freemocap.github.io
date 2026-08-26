---
title: SkellyTracker
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "skellytracker/core/ package structure and __init__.py's beartype_this_package() call, confirmed directly; the Tracker/Session/DetectionStage architecture claims cross-checked against tracker/tracker.py"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# SkellyTracker

SkellyTracker is the single-camera image tracking backend for FreeMoCap: it turns raw images into named 2D keypoints and bounding boxes. It wraps several independent computer-vision tools behind one consistent API built around a **Tracker → Session → Detector** pipeline, implemented in the `skellytracker/core/` package. Part of the FreeMoCap polyrepo's pantheon tier.

It serves two distinct jobs for the pipeline:

- **Human pose estimation**, MediaPipe (pose/hands/face) or RTMPose + YOLOX produce whole-body keypoints per frame.
- **Calibration marker detection**, ArUco and ChArUco board detection produce the corner observations FreeMoCap's multi-camera calibration solves against.

Everything operates on single images or batches of images. SkellyTracker knows nothing about cameras, synchronization, recording, or 3D math. SkellyCam supplies frames, and FreeMoCap triangulates the output. Package-wide runtime type checking is enabled via `beartype_this_package()` in `skellytracker/__init__.py`.

## Contents

- [Architecture](/skellytracker/architecture)
- [Data model](/skellytracker/data-model)
- [Built-in detectors](/skellytracker/built-in-detectors)
- [Temporal processing](/skellytracker/temporal-processing)
- [Multi-person tracking](/skellytracker/multi-person-tracking)
- [Video IO, annotation, and demos](/skellytracker/video-io-and-demos)
- [Install extras and hardware](/skellytracker/install-and-hardware)
- [How FreeMoCap uses SkellyTracker](/skellytracker/freemocap-integration)
- [Repository pointers](/skellytracker/repository-pointers)
