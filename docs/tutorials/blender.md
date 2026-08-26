---
title: Open your recording in Blender
type: tutorial
sidebar_position: 22
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "freemocap-ui BlenderSection.tsx, blender-thunks.ts, server-urls.ts, and api/http/blender/blender_router.py + core/blender/export_to_blender.py at v2.0.0-alpha.21: found the manual export button's real label and a real bug (blenderExport always omits the required detector argument, confirmed against the endpoint's own signature)"
  - date: "2026-08-20"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
draft: false
---

# Open your recording in Blender

FreeMoCap can export a processed recording straight into Blender: a full
3D scene with a skeleton mesh, the camera positions from your
calibration, and lighting already set up.

:::note MediaPipe only, for now
Blender export currently works with MediaPipe mocap data only. RTMPose 3D
data doesn't have a working Blender export yet.
:::

## Before you start

You'll need:

- **Blender** installed. FreeMoCap detects it automatically, or you can
  point it at your Blender install manually.
- **A processed recording**, meaning the mocap pipeline has already run
  and produced the required `.npy` files in that recording's
  `output_data/` folder (see
  [Find and read your output](/tutorials/find-your-data)). You can't
  export a recording that hasn't been processed yet.

Nothing else to install: the Blender addon that builds the scene is
handled automatically. It's injected into Blender at export time rather
than installed into Blender's own preferences, so there's no separate
addon-install step to do yourself.

## Exporting

From the recording you want to export, click **Process Recording with
Blender**. FreeMoCap detects your Blender install, runs the export, and
writes a `.blend` file into that recording's folder. You can have it open
automatically in Blender's GUI when it's done, or open the `.blend` file
yourself later.

:::note Currently broken in the pinned version
This specific manual export button (as opposed to the "Export to Blender
after mocap processing" toggle that runs automatically during processing)
calls an endpoint that's currently missing a required argument
(`detector`) at `v2.0.0-alpha.21`, and fails with an error every time it's
used. The automatic in-pipeline export path is unaffected. This is a real
bug in the app, not something wrong with your setup.
:::

## What actually ends up in the scene

| Element | Comes from |
|---|---|
| Skeleton mesh | Body keypoints, connected into a skeleton |
| Hand meshes | Left and right hand keypoints |
| Face mesh | Face keypoints |
| Center of mass | The whole-body center of mass trajectory |
| Camera frustums | Your calibration, showing where each camera actually was |
| Ground plane | Your calibration's ground-plane alignment (`Z = 0`) |
| Lighting | A default three-point lighting setup |

## If something goes wrong

**"Blender not detected."** Install Blender from
[blender.org](https://www.blender.org), or set the path to your install
manually.

**Export fails, citing missing files.** The recording hasn't been fully
processed yet, not every required `.npy` file exists. Run the mocap
processing pipeline on it first.

**The addon fails to load.** It's injected at export time rather than
installed into Blender's preferences, so this usually means the
`freemocap_blender_addon` package itself isn't available in your Python
environment, not a Blender-side problem.

## Next steps

- [Find and read your output](/tutorials/find-your-data)
- [The FreeMoCap output data model](/concepts/data-model)
- [Choose a tracking model](/tutorials/choose-a-tracker)
