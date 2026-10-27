---
title: Recording folder structure
type: reference
sidebar_position: 10
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)
draft: false
---

# Recording folder structure

For the narrative version of this page, see
[find and read your output](/tutorials/find-your-data).

## Layout

```
~/freemocap_data/recordings/{recording_name}/
├── synchronized_videos/
│   └── camera_{n}.mp4
├── annotated_videos/
│   └── camera_{n}_annotated.mp4
├── output_data/
│   ├── *.npy
│   ├── *.csv
│   └── *.parquet
├── logs/
├── {recording_name}_camera_calibration.toml
├── {recording_name}_recording_info.json
└── {recording_name}.blend            # only if exported
```

A `videos/synchronized/`, `videos/annotated/`, `output/` layout is the
migration target in the codebase; both layouts validate today, but the
names above are what a current recording actually produces.

## Defaults

| Path | Purpose |
|---|---|
| `~/freemocap_data/` | Root for all FreeMoCap data |
| `~/freemocap_data/recordings/` | All recordings |
| `~/freemocap_data/recordings/freemocap_test_data/` | Bundled test recording |
| `~/freemocap_data/logs_info_and_settings/logs/` | Application logs |
| `~/freemocap_data/calibrations/last_successful_camera_calibration.toml` | Most recent calibration |

## File purposes

| File/folder | Contains |
|---|---|
| `synchronized_videos/` | Raw, time-aligned per-camera footage |
| `annotated_videos/` | Same footage with detected keypoints drawn on top |
| `output_data/*.npy` | Per-tracker, per-region 3D arrays, see [array shapes and units](/reference/data-arrays) |
| `output_data/*.parquet` | The same data in tidy long format, see [the output data model](/concepts/data-model) |
| `{name}_camera_calibration.toml` | Camera intrinsics/extrinsics used for this recording |
| `{name}_recording_info.json` | Camera settings at record time, and whether this was tagged calibration or mocap |
| `{name}.blend` | Blender scene, present only after export |
