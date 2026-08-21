---
title: Cameras and synchronization
type: explanation
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# Cameras and synchronization

For 3D reconstruction to work, every camera's frames need to correspond to the same
moment in time. Without that, a time lag between cameras shows up as inaccurate 3D
data: the triangulation math assumes it's looking at the same instant from multiple
angles, and a few milliseconds of drift breaks that assumption.

## SkellyCam

**SkellyCam** is FreeMoCap's synchronized video acquisition component, and its core
directive is to make high-quality synchronized recording work with low-cost,
consumer-grade hardware. The validation data behind
[Accuracy, validity, and limits](/concepts/accuracy-and-limits) was collected entirely
on six USB webcams, about $20 each, recording at 1280x720 and 30 FPS, for a total
camera cost of roughly $120.

That matters beyond the sticker price. A comparably sized OpenCap setup needs six iOS
devices, roughly $1,000 to $1,500 even with the cheapest available iPhones, and
Theia3D's dedicated hardware costs more still. Since the same architecture that keeps
SkellyCam's per-camera cost low also makes it cheap to add more cameras, and more
cameras generally means more accurate 3D reconstruction (see
[Triangulation and 3D reconstruction](/concepts/triangulation)), accessibility and
accuracy end up reinforcing each other here rather than trading off.

## Beyond USB webcams

$20 webcams aren't a requirement, they're what the validation study happened to use.
SkellyCam accommodates other hardware in two ways: light or audio-based
synchronization for external cameras like GoPros or smartphones, or direct import of
video that's already synchronized by some other means. A study that needs a higher
frame rate for athletic movement, or non-USB cameras for an outdoor recording, isn't
locked out of the pipeline.

## Single camera vs. multi-camera

FreeMoCap can reconstruct 3D data from a single camera, but monocular reconstruction
falls well short of what multiple cameras can provide. A second viewpoint adds real
information about where a joint sits in space, rather than requiring the system to
infer depth from one image, and it substantially reduces the impact of occlusion, a
major failure point for single-camera systems. Multi-camera setups are recommended for
anything beyond a quick test.

## Next steps

- [Get a multi-camera setup](/tutorials/multi-camera)
- [Optimize your capture space](/tutorials/capture-environment)
- [Why calibration matters](/concepts/calibration)
- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
