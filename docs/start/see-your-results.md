---
title: See what you made
type: tutorial
sidebar_position: 4
provenance: ai-generated
draft: false
history:
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 polyrepo clone (system/default_paths.py, core/pipeline/posthoc/video_node.py, core/blender/export_to_blender.py, core/tasks/mocap/posthoc_mocap_task.py, core/tasks/mocap/mocap_task_config.py, freemocap-ui BlenderSection.tsx), plus site link targets"
  - date: "2026-08-21"
    against: "this site's own find-your-data.md and blender.md"
---

# See what you made

Right after a recording finishes, two questions matter: did it actually
track your movement, and where did everything go.

## The fastest check: did Blender open

If Blender was detected on your system, FreeMoCap opens a scene
automatically when processing finishes: a skeleton moving through the
motion you just recorded. Look for the obvious stuff first, does it move
the way you moved, are all your limbs where they should be, is anything
flying off into space or frozen in place. That's enough to tell you
whether the whole pipeline worked, before you look at any actual data.

If Blender wasn't detected, or didn't open automatically, see
[open your recording in Blender](/tutorials/blender).

## If you want to check without Blender

Every recording also gets an annotated video: your original footage
with the detected keypoints drawn directly on top. It's in the
recording's `annotated_videos/` folder (see
[find and read your output](/tutorials/find-your-data) for the full
layout), and it's the fastest way to sanity-check 2D tracking by eye
without needing Blender at all.

## What "worked" looks like, and what didn't

**Good signs:** keypoints in the annotated video sit on the actual
joints and move smoothly frame to frame. In Blender, the skeleton's
proportions look roughly human and its motion matches what you did.

**Signs something's off:**

- Keypoints jumping around or disappearing in the annotated video
  usually means a lighting or contrast problem, not a software bug. See
  [optimize your capture space](/tutorials/capture-environment).
- A skeleton that's lying down, mirrored, or wildly out of scale in
  Blender (multi-camera recordings only) usually points to the
  calibration, not the recording itself. See
  [get a calibration you can trust](/tutorials/better-calibration).

A single-camera recording won't give you reliable 3D positions no
matter how clean the tracking looks, that's expected, see
[cameras and synchronization](/concepts/cameras-and-sync) for why. If
2D tracking looked clean and you're ready for real 3D data, that's the
cue to move on to multiple cameras.

## Next steps

- [Where to go next](/start/where-next)
- [Find and read your output](/tutorials/find-your-data)
- [Record with multiple cameras](/tutorials/multi-camera)
