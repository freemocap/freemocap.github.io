---
title: Find and read your output
type: tutorial
sidebar_position: 21
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21 code (system/default_paths.py, system/recording_structure/recording_structure.py, core/tasks/mocap/posthoc_mocap_task.py, core/pipeline/posthoc/video_node.py, api/http/playback/playback_router.py, core/blender/export_to_blender.py), skellycam RecordingInfo.save_to_file, skellyforge Actor save_out_* methods, skellylogs configure_logging and default_paths"
  - date: "2026-08-20"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# Find and read your output

Every recording, whether it's a calibration or a mocap session, lands in
its own folder under `~/freemocap_data/recordings/`. This page is a map
of what's actually in there.

## Where to look

```
~/freemocap_data/recordings/
└── {recording_name}/
    ├── synchronized_videos/          # Frame-synchronized camera videos
    │   └── timestamps/               # Capture-time frame timestamps
    ├── annotated_videos/             # Videos with detection overlays
    ├── output_data/                  # 3D keypoints, center of mass, etc.
    │   ├── *.npy
    │   ├── *.csv
    │   └── *.parquet
    ├── tracker_schema.json           # Keypoint names and connections used
    ├── {name}_camera_calibration.toml
    ├── {name}_info.json              # Camera settings at record time
    └── {name}.blend                  # If you've exported to Blender
```

A migration to a slightly different layout (`videos/synchronized/`,
`videos/annotated/`, and `output/` instead of the names above) is in
progress in the codebase; both layouts are recognized today, but the
names above are what you'll actually see on disk right now. If a future
version of FreeMoCap looks slightly different from this, that's why.

A few other defaults worth knowing:

| What | Where |
|---|---|
| All FreeMoCap data | `~/freemocap_data/` (override with the `FREEMOCAP_BASE_FOLDER` environment variable) |
| All recordings | `~/freemocap_data/recordings/` |
| Bundled test recording | `~/freemocap_data/recordings/freemocap_test_data/` |
| Application logs | `~/skellylogs_data/logs/` (logging goes through SkellyLogs; redirect with `SKELLYLOGS_LOG_DIR`) |
| Your most recent calibration | `~/freemocap_data/calibrations/last_successful_camera_calibration.toml` |

## What's in each piece

- **`synchronized_videos/`** is your raw footage, one file per camera,
  already time-aligned, with the capture-time frame timestamps alongside
  in `timestamps/`. **`annotated_videos/`** is the same footage, with
  detected keypoints drawn on top, useful for checking tracking quality
  by eye.
- **`output_data/`** is where the actual mocap data lives: `.npy` arrays
  (see [array shapes and units](/reference/data-arrays) for exactly
  what's in each one), plus `.csv` and `.parquet` versions of the same
  data for tools that don't read `.npy` directly, including one combined
  tidy file, `freemocap_data_by_frame.parquet`, with every keypoint of
  every frame in long format. See
  [the output data model](/concepts/data-model) for what these numbers
  actually mean and how they were produced.
- **`tracker_schema.json`** sits at the recording root once mocap
  processing has run, recording which keypoints and connections the
  tracker used.
- **`{name}_camera_calibration.toml`** is your calibration, in plain
  text. It's what [reconstruction](/concepts/triangulation) reads to
  know where each camera was. Calibrating a recording saves it under
  that recording's own name; if you instead process a recording using
  your most recent calibration, the copy dropped into the folder keeps
  that file's name, `last_successful_camera_calibration.toml`.
- **`{name}_info.json`** records how the recording was made: camera
  settings at record time (resolution, exposure, rotation and so on),
  plus the recording name, a UUID, and the start timestamp. It doesn't
  carry a calibration-or-mocap tag; it's the saved videos plus the
  calibration TOML that make a recording reprocessable later with
  different settings, without having to remember your original setup.
- **`{name}.blend`** only shows up once you've exported to Blender; see
  [Open your recording in Blender](/tutorials/blender). Blender export
  currently only supports recordings processed with MediaPipe.

## Next steps

- [The FreeMoCap output data model](/concepts/data-model)
- [Array shapes and units](/reference/data-arrays)
- [Open your recording in Blender](/tutorials/blender)
- [Analyze your data in Python](/tutorials/analyze-in-python)
