---
title: Filter and fill your data
type: tutorial
sidebar_position: 33
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "skellyforge main (post_processing filters/interpolation incl. FilterConfig and InterpolationConfig defaults, butter.py, linear_interp.py) plus freemocap clone pinned to v2.0.0-alpha.21 (skeleton_from_mediapipe_observations.py, charuco_model_from_observations.py, posthoc_mocap_task.py, triangulator.py and TriangulationConfig)"
  - date: "2026-08-20"
    against: "none"
draft: false
---

# Filter and fill your data

By the time a recording reaches you as output, it's already been through
**SkellyForge**, FreeMoCap's post-processing package. This page explains
what it does, so you know what you're actually looking at when you inspect
your data. SkellyForge is architecturally separate from the reconstruction
step itself: a modular post-processing component, not something baked
into triangulation, which is what makes both of the following steps
possible.

## Filling Gaps

Not every frame produces a usable 3D point for every keypoint. If too few
cameras had a confident detection, [reconstruction](/concepts/triangulation)
leaves that point out rather than guessing. A point whose tested camera
subsets had too much reprojection error is a different case: the
outlier-rejection path returns a weighted average over those subsets rather
than dropping the point, so high error alone does not create a gap.
SkellyForge fills those gaps by interpolation. How many gaps you get in the
first place comes down to capture quality: more occlusion, more cameras
losing track of a keypoint, more gaps to fill. See
[optimize your capture space](/tutorials/capture-environment) to reduce
how often this happens.

## Smoothing Noise

After gaps are filled, SkellyForge applies a low-pass Butterworth filter
to the trajectories. In plain terms: real human movement changes
relatively smoothly from one frame to the next, while a lot of the noise
in raw triangulated data is fast, small, frame-to-frame jitter. A low-pass
filter reduces the fast jitter while leaving the slower, real movement
mostly intact.

That tradeoff runs in both directions. Filtering that's well-matched to
your movement makes for cleaner-looking, easier-to-analyze data.
Filtering that's too aggressive for a genuinely fast movement (a strike, a
jump, anything ballistic) can smooth away real signal along with the
noise. If your analysis depends on high-frequency detail, it's worth
knowing that this smoothing step happened, rather than assuming the
trajectories you're looking at are the raw triangulated output.

## Why This Matters for Your Analysis

Both steps happen automatically, which is usually what you want. But
"automatically" isn't the same as "invisibly": knowing that your data has
been gap-filled and filtered helps you interpret it correctly, especially
alongside the per-keypoint
[reprojection error](/concepts/data-model#the-thing-most-likely-to-trip-you-up)
that travels with your data as a separate quality signal. A keypoint with
a lot of interpolated frames and high reprojection error deserves more
scrutiny than one that was cleanly tracked throughout.

## Next steps

- [The FreeMoCap output data model](/concepts/data-model)
- [Triangulation and 3D reconstruction](/concepts/triangulation)
- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
