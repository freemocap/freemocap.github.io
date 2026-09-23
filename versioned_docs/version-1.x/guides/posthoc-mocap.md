---
title: Process a recording after the fact
type: how-to
sidebar_position: 12
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: freemocap-docs guides/posthoc-mocap.mdx (v2.0.0-alpha.21, human-authored source, not yet re-checked against the running app)
draft: false
---

# Process a recording after the fact

Post-hoc processing takes synchronized videos you already recorded and
reconstructs a 3D skeleton from them, use it any time you want to
process, or reprocess, a session that's already on disk rather than
recording live.

:::note Alpha software
This workflow is still early. Expect some rough edges, including the two
specific bugs noted below.
:::

## Before you begin

You'll need a recording with synchronized videos from at least two
cameras, laid out roughly like this:

```
recording_folder/
├── synchronized_videos/
│   ├── camera_0.mp4
│   ├── camera_1.mp4
│   └── ...
└── ...
```

## Process an existing recording

1. **Select the recording.** Open the **Playback** tab, choose the
   recording, and click **Continue to Mocap Setup**.
2. **Confirm the processing directory.** Under **Processing Directory**,
   select the recording's top-level folder, the one containing
   `synchronized_videos/`. If you add or change files afterward, use the
   re-check button to refresh.
   > **Bug:** if the **Process Mocap** button stays disabled even after
   > you've selected a valid recording, press **Re-check Folder**.
3. **Select the calibration.** Under **Calibration**, confirm the right
   camera calibration is loaded, either an existing TOML from the
   recording folder, an imported TOML, or fresh calibration videos. A
   calibration is only valid while the cameras stay exactly where they
   were when it ran, see
   [get a calibration you can trust](/tutorials/better-calibration).
   > **Bug:** when selecting calibration videos, choose the outer
   > top-level recording folder, the one *containing*
   > `synchronized_videos/`, not that folder itself, or it won't find
   > the videos.
4. **Choose a detector.** MediaPipe or RTMPose, plus a model and
   confidence threshold, see
   [choose a tracking model](/tutorials/choose-a-tracker).
   RTMPose doesn't have a working Blender export yet, you'll still get
   3D data either way, but Blender export currently requires MediaPipe.
5. **Configure Blender export**, if you want it. Turn off **Export to
   Blender after mocap processing** if you only need the data files, or
   leave it on and optionally enable auto-opening the finished `.blend`
   file. See [open your recording in Blender](/tutorials/blender).
6. **Click Process Mocap.** The pipeline progress window shows the
   current stage. Keep FreeMoCap open until it reports completion.
   Processing time depends on recording length, camera count and
   resolution, the detector you chose, and your available CPU/GPU.

## Find and review the results

Results land inside the recording folder:

```
recording_folder/
├── synchronized_videos/
├── annotated_videos/
├── output_data/
│   ├── *.npy
│   ├── *.csv
│   ├── *.parquet
│   └── per_camera_weights.npy
├── tracker_schema.json
└── camera_calibration.toml
```

`annotated_videos/` has your camera footage with detected 2D keypoints
drawn on top, the fastest way to sanity-check tracking by eye.
`output_data/` has the reconstructed 3D data itself, see
[find and read your output](/tutorials/find-your-data) for what each
file is. Reload the recording in Playback afterward to inspect the
synchronized videos alongside the reconstructed skeleton.

## Reprocessing

You can reprocess a recording with a different detector or
configuration at any time. Earlier annotated videos may get renamed with
a `.prev` suffix when new ones are generated; other output files can be
overwritten outright. Copy anything you want to keep before reprocessing
a recording that matters.

## Current alpha limitation

The 3D reconstruction settings shown under **Point Gate**, **One Euro
Filter**, and **FABRIK** aren't wired into post-hoc processing yet,
changing them won't affect post-hoc output in this build. What *is*
passed through: the recording directory, the calibration, the detector
and its settings, and the Blender export settings.

## Troubleshooting

**Video frame counts don't match.** Check `synchronized_videos/` for
stray files left over from another session. Every video in that folder
should be from the same recording and have the same frame count.

**Calibration or camera-ID error.** The calibration has to have been
created with the exact same cameras used in the recording, camera IDs
in the recording must match camera IDs in the calibration TOML.

**Reconstructed skeleton looks distorted or misplaced.** Most likely a
camera moved after calibration, the wrong calibration was selected, the
calibration didn't cover the full capture volume, or a keypoint wasn't
visible in enough camera views. Check the annotated videos first: if the
2D detections look right but the 3D doesn't, redo the calibration and
reprocess.

**Processing fails or stops unexpectedly.** When reporting it, include
your FreeMoCap version, OS and GPU, the recording's camera count,
detector and model used, which pipeline stage it stopped at, and the
full error and log output.

## Next steps

- [Find and read your output](/tutorials/find-your-data)
- [Open your recording in Blender](/tutorials/blender)
- [Get a calibration you can trust](/tutorials/better-calibration)
