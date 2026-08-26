---
title: Recording folder structure
type: reference
sidebar_position: 10
provenance: ai-generated
inFlux: "V2's output data model is still being finalized during alpha; the folder and file layout on this page is expected to change before the stable release."
draft: false
history:
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 source (system/default_paths.py, system/recording_structure/recording_structure.py, api/http/mocap/mocap_router.py, core/tasks/mocap/posthoc_mocap_task.py, core/pipeline/posthoc/video_group_helper.py, core/tasks/calibration/shared/calibration_save.py), skellycam RecordingInfo and parse_video_filename, skellyforge Actor.save_out_all_data_parquet"
  - date: "2026-08-21"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# Recording folder structure

For the narrative version of this page, see
[find and read your output](/tutorials/find-your-data).

## Layout

```
~/freemocap_data/recordings/{recording_name}/
├── synchronized_videos/
│   ├── {recording_name}.id-{camera_id}.idx-{camera_index}.mp4
│   └── timestamps/
├── annotated_videos/
│   └── {video_name}_annotated.mp4
├── output_data/
│   ├── *.npy
│   ├── *.csv
│   └── *.parquet
├── tracker_schema.json
├── {recording_name}_camera_calibration.toml
├── {recording_name}_info.json
└── {recording_name}.blend            # only if exported
```

Videos recorded by FreeMoCap itself follow the `{name}.id-{camera_id}.idx-{camera_index}`
pattern above; imported footage with other names (for example `camera_0.mp4`) is
assigned cameras by filename heuristics instead.

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

Note that the base folder can be overridden with the `FREEMOCAP_BASE_FOLDER`
environment variable, which the desktop shell sets when you pick a different
data location.

## File purposes

| File/folder | Contains |
|---|---|
| `synchronized_videos/` | Raw, time-aligned per-camera footage, plus capture-time timestamp CSVs under `timestamps/` |
| `annotated_videos/` | Same footage with detected keypoints drawn on top, one `{video_name}_annotated.mp4` per camera |
| `output_data/*.npy` | Per-tracker, per-region 3D arrays, see [array shapes and units](/reference/data-arrays) |
| `output_data/*.parquet` | All trajectories combined into one tidy long-format file, `freemocap_data_by_frame.parquet`, see [the output data model](/concepts/data-model) |
| `tracker_schema.json` | Keypoint names and connections for the tracker that produced the data |
| `{name}_camera_calibration.toml` | Camera intrinsics/extrinsics used for this recording |
| `{name}_info.json` | Camera settings at record time (resolution, exposure, framerate, rotation), plus the recording name, a UUID, and the start timestamp |
| `{name}.blend` | Blender scene, present only after export |
