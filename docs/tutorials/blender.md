---
title: Open your recording in Blender
type: tutorial
sidebar_position: 22
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): BlenderSection.tsx and mocap-blender-settings.tsx (Select Blender executable, Export to Blender after mocap processing, Auto-open .blend file, Process Recording with Blender, MediaPipe-only gating), blender_export_config.py (FBX/BVH into 3d_models, T-pose/A-pose, foot locking, hand range of motion), blender_router.py /export (detector now detected, so the alpha.21 manual-export bug is fixed; alpha.24 release notes agree), mocap_task_config.py defaults. Rewritten; not checked against a real export."
  - date: "2026-08-26"
    against: "freemocap-ui BlenderSection.tsx, blender-thunks.ts, server-urls.ts, and api/http/blender/blender_router.py + core/blender/export_to_blender.py at v2.0.0-alpha.21: found the manual export button's real label and a real bug (blenderExport always omits the required detector argument, confirmed against the endpoint's own signature)"
  - date: "2026-08-20"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
draft: false
---

import blender_export_options from './img/blender-export-options.webp';

# Open your recording in Blender

FreeMoCap can turn a processed recording into a Blender scene with an animated skeleton. It also
saves the animation as FBX and BVH files you can use in other 3D software.

:::note MediaPipe only, for now
Blender export only works with recordings processed with the **MediaPipe** tracker. Choose it under
**Mocap Settings > Detector** before you record or process.
:::

## Before you start

Install [Blender](https://www.blender.org). FreeMoCap finds it automatically. If it doesn't, click
**Select Blender executable** in the Blender settings and choose your Blender app.

## Export automatically

With **Export to Blender after mocap processing** turned on (it's on by default), FreeMoCap makes
the Blender scene every time it finishes processing a MediaPipe recording. With
**Auto-open .blend file in Blender when done** on, the scene opens in Blender straight away.

## Export a recording you already processed

Open the recording in the **Playback** tab and click **Continue to Mocap Setup**. In the Blender
settings, click **Process Recording with Blender**.

## Export options

In the Blender settings you can choose:

- The files to make (FBX, BVH, or both). They're saved in the recording's `3d_models` folder.
- The skeleton's rest pose: T-pose or A-pose.
- **Apply Foot Locking**, to stop feet sliding on the floor.
- **Limit Hand Markers Range of Motion**, to keep fingers from bending unnaturally.

<Screenshot src={blender_export_options} width={480} alt="The Blender settings in Mocap Settings, showing the Blender executable, the export and auto-open switches, FBX and BVH formats, the rest pose, foot locking and hand range options, and the Process Recording with Blender button" caption="The Blender settings in Mocap Settings." version="2.0.0-alpha.25" />

## Where the files go

The `.blend` file is saved in the recording's folder, named after the recording. See
[find and read your output](/tutorials/find-your-data).

## If something goes wrong

- **Blender isn't found:** install Blender, or click **Select Blender executable** and choose it.
- **The export option is greyed out:** the recording used RTMPose. Switch **Detector** to
  **MediaPipe** and process it again.
- **Export fails:** make sure the recording finished processing first.

## Next steps

- [Find and read your output](/tutorials/find-your-data)
- [Choose a tracking model](/tutorials/choose-a-tracker)
