---
title: Export to Blender
type: how-to
sidebar_position: 13
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): BlenderSection.tsx labels, MediaPipe-only gating. Troubleshooting updated for installer users; scene element table unchanged and not re-checked."
  - date: "2026-08-25"
    against: "polyrepo-clones/freemocap (v2.0.0-alpha.21): freemocap/core/blender/export_to_blender.py, helpers/run_blender_export.py, system/recording_status/recording_status.py, api/http/blender/blender_router.py, plus polyrepo-clones/freemocap_blender_addon main_controller.py, create_freemocap_empties.py, add_capture_cameras.py, create_lights.py"
  - date: "2026-08-21"
    against: "freemocap-docs guides/blender-export.mdx (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# Export to Blender

Quick reference for Blender export. For the full walkthrough, see
[open your recording in Blender](/tutorials/blender).

:::note MediaPipe only, for now
Blender export only works with recordings processed with the MediaPipe tracker.
:::

## What gets exported

| Element | Source |
|---|---|
| Skeleton mesh | Body keypoints |
| Hand meshes | Left and right hand keypoints |
| Face keypoints | Loaded from `mediapipe_face_3d_xyz.npy` (one of the required input files), but not visualized in the scene |
| Center of mass | Whole-body center of mass trajectory |
| Camera frustums | Your calibration |
| Video planes | Your `synchronized_videos/`, loaded into the scene as video planes |
| Ground plane | A checkerboard plane at `Z = 0`; if your calibration didn't include groundplane alignment, the addon rotates and translates the skeleton onto the ground first |
| Lighting | None, the export adds no light objects (it sets the viewport shading to Material Preview) |

## Troubleshooting

**Blender not detected.** Install it from
[Blender.org](https://www.blender.org), or click **Select Blender executable** and choose it.

**Export fails, missing files.** The recording hasn't finished processing. Process it first;
see [process a recording after the fact](/guides/posthoc-mocap).

## Next steps

- [Open your recording in Blender](/tutorials/blender)
- [Process a recording after the fact](/guides/posthoc-mocap)
- [Find and read your output](/tutorials/find-your-data)
