---
title: Export to Blender
type: how-to
sidebar_position: 13
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: freemocap-docs guides/blender-export.mdx (v2.0.0-alpha.21, not yet re-checked against the running app)
draft: false
---

# Export to Blender

Quick reference for Blender export. For the full walkthrough, see
[open your recording in Blender](/tutorials/blender).

:::note MediaPipe only, for now
RTMPose 3D data doesn't have a working Blender export yet.
:::

## What gets exported

| Element | Source |
|---|---|
| Skeleton mesh | Body keypoints |
| Hand meshes | Left and right hand keypoints |
| Face mesh | Face keypoints |
| Center of mass | Whole-body center of mass trajectory |
| Camera frustums | Your calibration |
| Ground plane | Your calibration's ground-plane alignment (`Z = 0`) |
| Lighting | Default three-point setup |

## Troubleshooting

**Blender not detected.** Install from
[blender.org](https://www.blender.org), or set the path manually.

**Export fails, missing files.** The recording isn't fully processed,
not every required `.npy` file exists yet. Run mocap processing first,
see [process a recording after the fact](/guides/posthoc-mocap).

**Addon fails to load.** The addon is injected at export time, not
installed into Blender's own preferences, so this usually means
`freemocap_blender_addon` isn't available in your Python environment
rather than a Blender-side issue.

## Next steps

- [Open your recording in Blender](/tutorials/blender)
- [Process a recording after the fact](/guides/posthoc-mocap)
- [Find and read your output](/tutorials/find-your-data)
