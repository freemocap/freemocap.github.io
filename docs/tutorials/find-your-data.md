---
title: Find and read your output
type: tutorial
sidebar_position: 21
provenance: ai-generated
inFlux: "Where and how your V2 output data is laid out is a work in progress for version alpha. It's expected to stabilize by beta."
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): on-disk names actually written today (skellycam default_paths.py synchronized_videos/ and timestamps/, freemocap default_paths.py annotated_videos/, posthoc_mocap_task.py output_data/, skeleton save_out_* npy/csv/parquet, calibration_paths.py {name}_camera_calibration.toml and calibrations/last_successful_camera_calibration.toml, blender_export_config.py 3d_models/). recording_structure.py describes a newer target layout that nothing writes yet, so it was not used. Not checked against a real recording."
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21 code (system/default_paths.py, system/recording_structure/recording_structure.py, core/tasks/mocap/posthoc_mocap_task.py, core/pipeline/posthoc/video_node.py, api/http/playback/playback_router.py, core/blender/export_to_blender.py), skellycam RecordingInfo.save_to_file, skellyforge Actor save_out_* methods, skellylogs configure_logging and default_paths"
  - date: "2026-08-20"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# Find and read your output

Every recording, calibration or motion capture, gets its own folder in
`freemocap_data/recordings` in your home folder. To jump to a recording's folder, open it in the
**Playback** tab and click **Open folder in file explorer**.

## What's in a recording folder

```
freemocap_data/recordings/
└── {recording_name}/
    ├── synchronized_videos/          # Original videos, one per camera
    │   └── timestamps/               # When each frame was captured
    ├── annotated_videos/             # Videos with the tracked points drawn on
    ├── output_data/                  # The motion capture data
    │   ├── *.npy
    │   ├── *.csv
    │   └── freemocap_data_by_frame.parquet
    ├── 3d_models/                    # FBX and BVH files, after a Blender export
    ├── tracker_schema.json           # Which points were tracked and how they connect
    ├── {name}_camera_calibration.toml
    ├── {name}_info.json              # Camera settings used for the recording
    └── {name}.blend                  # The Blender scene, after a Blender export
```

- **`synchronized_videos/`** holds your original footage, lined up in time across cameras.
- **`annotated_videos/`** holds the same footage with the tracked points drawn on top. It's the
  quickest way to check tracking by eye.
- **`output_data/`** holds the motion capture data in three formats: `.npy` for Python,
  `.csv` for spreadsheets, and `freemocap_data_by_frame.parquet`, which has every point of every
  frame in one table. See [array shapes and units](/reference/data-arrays) for what each file
  holds.
- **`{name}_camera_calibration.toml`** is the calibration used for this recording.
- **`{name}.blend`** and **`3d_models/`** appear only after a [Blender export](/tutorials/blender).

## Other locations

| What | Where, in your home folder |
|---|---|
| All recordings | `freemocap_data/recordings/` |
| Your latest calibration | `freemocap_data/calibrations/last_successful_camera_calibration.toml` |
| Log files | `skellylogs_data/logs/` |

## Next steps

- [Analyze your data in Python](/tutorials/analyze-in-python)
- [The FreeMoCap output data model](/concepts/data-model)
- [Open your recording in Blender](/tutorials/blender)
