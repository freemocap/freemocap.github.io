---
title: The FreeMoCap output data model
type: explanation
sidebar_position: 10
provenance: ai-generated
inFlux: "V2's output data model is still being finalized during alpha; specifics on this page are expected to change before the stable release."
draft: false
history:
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21 pipeline source (skeleton_from_mediapipe_observations.py, triangulator.py, outlier_rejection.py, triangulation_config.py, recording_structure.py, playback_router.py) and SkellyForge skellymodels (actor.py, aspect.py, trajectory.py, error.py, anatomical_structure.py, tracking_model_info.py, anatomical_calculations.py, tracker_info YAMLs), read directly; cross-checked against docs/reference/data-arrays.md"
  - date: "2026-08-20"
    against: "none"
---

# The FreeMoCap output data model

This page explains what shape your data is in after a recording finishes,
and why it's built that way. For the precise, generated list of array
shapes, dtypes, and file names, see
[array shapes and units](/reference/data-arrays), it's built directly from
the code so it stays exact; this page is the conceptual companion to it.

## The problem this solves

Every pose estimation model has its own opinions about what a "keypoint" is.
MediaPipe, RTMPose, ViTPose, and a custom DeepLabCut model each return a
different number of landmarks, in a different order, with different names.
Without something to standardize that, every downstream analysis (joint
angles, center of mass, exporting to Blender) would need a separate
version per tracker, and comparing results across trackers would mean
comparing apples to oranges.

FreeMoCap solves this with **SkellyModels**, a skeletal representation
layer that sits between "whatever the tracker produced" and "the data you
actually work with." Each supported tracker is described by a structured
YAML configuration: keypoint names, their ordering, and anatomical
metadata like segment connections and the anthropometric parameters needed
to calculate center of mass. Because that biomechanical knowledge lives in
a config file rather than being hard-coded into analysis scripts, adding
support for a new tracker is a matter of writing a new YAML file, not
rewriting the pipeline. It's also what makes it possible to plug in a
custom-trained model with entirely non-standard keypoints (the
[prosthetics validation case](/concepts/accuracy-and-limits) tracked
landmarks no off-the-shelf tracker knows about, through the same pipeline
used for MediaPipe).

## How the data gets there

Briefly, since it explains why some of the shapes below look the way they
do: 2D keypoints from each camera view are triangulated into 3D using
direct linear transformation. Because any individual camera can produce a
bad detection (occlusion, clutter, an unusual pose), triangulation first
tries all available cameras, checks the reprojection error, and falls back
to testing camera subsets if that error is too high, blending the subsets
that reconstruct best into an exponentially-weighted average. The
resulting 3D trajectories then go through a separate post-processing step
(gap interpolation for frames where no triangulation solution was found,
then Butterworth filtering to reduce noise) before they reach you as
output. Reprojection error drives those rejection decisions, and the
per-camera confidence weights it produces are saved alongside your data
as `per_camera_weights.npy`; how much of it reaches the output files
themselves is covered below.

## The shape of the data

- The canonical array shape is **`(num_frames, num_markers, 3)`**, checked
  at construction. The last dimension is always exactly 3 (x, y, z).
- The primary data store is a single parquet file in **tidy long format**
  rather than a wide array: one row per keypoint per trajectory per frame,
  with columns `frame`, `keypoint`, `x`, `y`, `z`, `model`, `trajectory`,
  and `reprojection_error`. A finished recording writes it as
  `output_data/freemocap_data_by_frame.parquet`; the recording-layout code
  declares `{recording_name}_data.parquet` at the recording root as its
  eventual location, and consumers accept either name. It's
  self-describing, it embeds its own model metadata, so it can round-trip
  back into the same in-memory structure without a separate schema file.
- Individual `.npy` arrays follow a `{tracker}_{aspect}_{trajectory}.npy`
  naming pattern, for example `mediapipe_body_3d_xyz.npy`: which tracker
  produced it, which body part or aspect, and which trajectory variant.

## The thing most likely to trip you up

**Virtual markers are not tracked points.** Things like a "mid-hip" or
"center of mass" marker are weighted combinations of real tracked
keypoints, computed after tracking and appended to the array. That means
`num_markers` in your data is larger than the raw number of keypoints the
underlying tracker actually detected. If you're indexing into the array by
position rather than by name, this is the detail that will silently
produce a confusing result.

**The parquet's `reprojection_error` column is reserved, not populated
(yet).** The column is designed to be per-frame, per-keypoint, and low
error would be a reasonable proxy for "this point was probably tracked
well in this frame" (consistently high error on a specific joint is a
sign to check camera coverage for that body region). In the current
pipeline, however, nothing attaches reprojection error to the skeleton
before saving, so the column comes out all NaN in practice. What survives
today is the per-camera confidence weighting in `per_camera_weights.npy`
and the error-driven choices the pipeline already made for you. Treat the
column as a placeholder until the pipeline wires it up.

**Multiple trajectory variants exist**: `3d_xyz` (the raw triangulated
result) and `rigid_3d_xyz` (the same data with bone lengths enforced to
stay constant) are the two position variants you'll usually choose
between; the body aspect additionally carries center-of-mass trajectories
(`total_body_center_of_mass` and `segment_center_of_mass`). Which position
variant is the right one to use, and to cite, for a given analysis is
still an open question the FreeMoCap project hasn't formally settled;
check [the reference page](/reference/data-arrays) for the current
guidance before publishing numbers based on either one.

## Why it's built this way

The whole pipeline, including the outlier-rejection logic used during
triangulation, is open source under the AGPL license, so nothing about how
your data was produced is hidden behind a proprietary algorithm. That
matters more than it might sound: one of the standing critiques of
commercial markerless systems is that you can't fully audit how a number
was calculated. With FreeMoCap, the same modularity that lets you swap
pose estimation backends also means you can read, and if needed change,
exactly how your 3D data was reconstructed.

## Next steps

- [Array shapes and units](/reference/data-arrays), the generated, precise reference
- [Skeleton models and keypoints](/reference/skeleton-models), keypoint names and indices per tracker
- [Analyze it in Python](/tutorials/analyze-in-python)
- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
