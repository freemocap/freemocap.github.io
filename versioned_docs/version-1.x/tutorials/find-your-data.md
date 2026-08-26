---
title: Find and read your output
type: tutorial
sidebar_position: 21
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)
draft: false
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
    ├── annotated_videos/             # Videos with detection overlays
    ├── output_data/                  # 3D keypoints, center of mass, etc.
    │   ├── *.npy
    │   ├── *.csv
    │   └── *.parquet
    ├── logs/                         # Per-recording log files
    ├── {name}_camera_calibration.toml
    ├── {name}_recording_info.json
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
| All FreeMoCap data | `~/freemocap_data/` |
| All recordings | `~/freemocap_data/recordings/` |
| Bundled test recording | `~/freemocap_data/recordings/freemocap_test_data/` |
| Logs | `~/freemocap_data/logs_info_and_settings/logs/` |
| Your most recent calibration | `~/freemocap_data/calibrations/last_successful_camera_calibration.toml` |

## What's in each piece

- **`synchronized_videos/`** is your raw footage, one file per camera,
  already time-aligned. **`annotated_videos/`** is the same, with
  detected keypoints drawn on top, useful for checking tracking quality
  by eye.
- **`output_data/`** is where the actual mocap data lives: `.npy` arrays
  (see [array shapes and units](/reference/data-arrays) for exactly
  what's in each one), plus `.csv` and `.parquet` versions of the same
  data for tools that don't read `.npy` directly. See
  [the output data model](/concepts/data-model) for what these numbers
  actually mean and how they were produced.
- **`{name}_camera_calibration.toml`** is your calibration, in plain
  text. It's what [reconstruction](/concepts/triangulation) reads to
  know where each camera was.
- **`{name}_recording_info.json`** records how the recording was made:
  camera settings at record time, and whether it was tagged as a
  calibration or a mocap recording. It's what makes a recording
  reprocessable later with different settings, without having to
  remember your original setup.
- **`{name}.blend`** only shows up once you've exported to Blender; see
  [Open your recording in Blender](/tutorials/blender).

## Next steps

- [The FreeMoCap output data model](/concepts/data-model)
- [Array shapes and units](/reference/data-arrays)
- [Open your recording in Blender](/tutorials/blender)
- [Analyze your data in Python](/tutorials/analyze-in-python)
