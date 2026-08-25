---
title: "Output arrays: shapes, dtypes, units"
type: reference
sidebar_position: 11
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: FreeMoCap core pipeline and SkellyForge skellymodels source, read directly
draft: false
---

# Output arrays: shapes, dtypes, units

This page documents what a finished recording actually contains, as read
directly from the current source (FreeMoCap's posthoc mocap pipeline and
SkellyForge's skellymodels package). It confirms most of
[the output data model](/concepts/data-model), corrects one thing (the
primary parquet's location is mid-migration), and adds detail that page
intentionally leaves out. Read that page first for the why; this page is
the what.

## Where the files are written

The posthoc mocap task writes everything into `output_data/` inside the
recording folder (`posthoc_mocap_task.py` builds `output_folder =
{recording}/output_data` and passes it down). A completed mocap recording
contains:

| File | Contents |
|---|---|
| `output_data/freemocap_data_by_frame.parquet` | Primary tidy-format data store (see below) |
| `output_data/freemocap_data_by_frame.csv` | Same rows as the parquet, as CSV |
| `output_data/{tracker}_{aspect}_{trajectory}.npy` | One array per trajectory per region |
| `output_data/{tracker}_{aspect}_{trajectory}.csv` | Same data as per-file CSVs |
| `output_data/{tracker}_skeleton_3d.npy` | All regions' xyz concatenated along the marker axis |
| `output_data/per_camera_weights.npy` | Per-camera weights from triangulation outlier rejection |
| `tracker_schema.json` | keypoint names and connections, at the recording root (see [skeleton models](/reference/skeleton-models)) |

Calibration-quality board reconstructions (from
`charuco_model_from_observations`) write their own
`charuco_board_*` npy/csv/parquet files into the same folder using the
same conventions.

### A note on the parquet's location

The repo is mid-rename here, and the sources disagree in a way worth
stating plainly:

- `RecordingStructure` (the module that declares itself authoritative for
  recording layout) defines the canonical store as
  `{recording}/{recording_name}_data.parquet` at the recording *root*,
  and treats `output_data/freemocap_data_by_frame.parquet` as a *legacy*
  marker.
- The pipeline code that actually writes parquet today
  (`Actor.save_out_all_data_parquet`) still writes
  `freemocap_data_by_frame.parquet` into `output_data/`, and nothing in
  the FreeMoCap repo writes the new `{name}_data.parquet`.
- Consumers bridge the gap: the playback router's parquet lookup tries
  `{name}_data.parquet` first, falls back to
  `output_data/freemocap_data_by_frame.parquet`, then to any `.parquet`
  in the recording. The layout validator accepts either.

So: if you find `{name}_data.parquet` on disk someday, it is the same
kind of file moved to a new address. Today,
`output_data/freemocap_data_by_frame.parquet` is what a recording
actually produces. See also
[recording folder structure](/reference/recording-structure).

## Array convention

Every 3D array in a recording is `(num_frames, num_markers, 3)` float64,
xyz in millimetres ([coordinate conventions](/reference/coordinate-conventions)).
`Trajectory` validates this at construction: the second dimension must
equal the number of supplied marker names, and the last dimension must be
exactly 3. Marker order is fixed by the tracker's model config; index
into arrays by name wherever possible, because appended markers (below)
shift positions, and see the RTMPose caveat on
[skeleton models](/reference/skeleton-models).

2D detector output, before triangulation, is pixel-space
`(frames, keypoints, xy)` per camera and is not saved as an output file.

## The parquet: columns and metadata

`freemocap_data_by_frame.parquet` is tidy long format, one row per
marker per trajectory per frame:

| Column | Meaning |
|---|---|
| `frame` | Frame index |
| `keypoint` | Marker name, for example `left_wrist`, `head_center`, `face_0033` |
| `x`, `y`, `z` | Position in millimetres |
| `model` | Producing region, formatted `{tracker}.{aspect}`, for example `mediapipe.body` |
| `trajectory` | One of `3d_xyz`, `rigid_3d_xyz`, `total_body_center_of_mass`, `segment_center_of_mass` |
| `reprojection_error` | Per-frame, per-marker error; see the caveat below |

Rows are sorted by `frame`, then `model`, then `trajectory`. Which
trajectories appear depends on the region: the body aspect gets all four
(triangulated, rigid-bones-enforced, total-body CoM, per-segment CoM),
while hands and face get `3d_xyz` only, because their configs define no
joint hierarchy or center-of-mass parameters.

The parquet embeds its own schema in pandas attributes: `model_info`
(the full parsed tracker config, including ordered marker names),
`metadata.created_at`, and `metadata.created_with` (`skelly_models`).
`Actor.from_parquet()` reads those attributes to rebuild the in-memory
structure without being told the tracker; loading a file that lacks them
requires passing a `ModelInfo` explicitly.

**Caveat on `reprojection_error`:** the column exists and is populated
whenever the in-memory aspect carries error data, but in the current
posthoc pipeline nothing attaches reprojection error to the skeleton
before saving, so the column is all NaN in practice. The real error data
survives elsewhere: `Triangulator.triangulate` returns a
`(num_cameras, num_frames, num_points)` array, its mean over cameras
feeds the interpolation/filtering stages, and `per_camera_weights.npy`
records the camera weighting. Treat the parquet column as reserved, not
populated, until the pipeline wires it up.

## The .npy files

Per-region files follow `{tracker}_{aspect}_{trajectory}.npy`, for
example `rtmpose_body_rigid_3d_xyz.npy`. Each is a
`(num_frames, num_markers, 3)` float64 array whose columns are ordered by
that region's marker list. Markers include appended computed points:

- Body `3d_xyz`: the tracker's raw body points plus four virtual markers
  (`head_center`, `neck_center`, `trunk_center`, `hips_center`)
  appended after them, 37 columns for MediaPipe (33 tracked + 4
  computed) and 27 for RTMPose (23 tracked + 4 computed).
- `total_body_center_of_mass.npy`: a single-column
  `(num_frames, 1, 3)` array.
- `segment_center_of_mass.npy`: one column per segment with a
  center-of-mass definition, 14 columns for MediaPipe (its definitions
  include the hands), 12 for RTMPose.
- `{tracker}_skeleton_3d.npy`: every region's xyz concatenated along the
  marker axis in the config's aspect order, so one array holds the whole
  skeleton.

The Blender exporter's pre-flight check requires this exact set, with
the producing detector prefixed into each filename:

```
{detector}_body_3d_xyz.npy
{detector}_right_hand_3d_xyz.npy
{detector}_left_hand_3d_xyz.npy
{detector}_face_3d_xyz.npy
{detector}_body_total_body_center_of_mass.npy
{detector}_body_segment_center_of_mass.npy
```

Older recordings may carry `*_right_hand_right_hand.npy`-style names;
the readiness check accepts those as equivalents. Recordings processed
before multi-detector support used flat `mediapipe_*` names regardless
of detector.

For what point names sit behind each column index, and a known
body/hand/face ordering hazard in RTMPose recordings, see
[skeleton models](/reference/skeleton-models).

## Relation to the concepts page

[The FreeMoCap output data model](/concepts/data-model) versus this
page, point by point:

- **Confirmed:** the `(num_frames, num_markers, 3)` shape and its
  construction-time validation; the tidy long parquet with exactly the
  seven columns listed preceding; self-describing parquet that round-trips
  through the embedded `model_info`; the
  `{tracker}_{aspect}_{trajectory}` naming pattern; virtual markers
  appended after tracked points, making `num_markers` exceed the
  tracker's raw keypoint count; the existence of `3d_xyz` and
  `rigid_3d_xyz` variants.
- **Superseded:** the concepts page calls
  `freemocap_data_by_frame.parquet` (in the recording's output folder)
  the primary data store. The declared target is
  `{recording_name}_data.parquet` at the recording root; today's writers
  still produce the former. Both names resolve for readers.
- **More nuance than the concepts page implies:** "reprojection error
  travels with your data" is aspirational for the parquet column (all
  NaN today) and literal only for the intermediate arrays and
  `per_camera_weights.npy`. And there are four trajectory variants, not
  two, once center-of-mass trajectories are counted.
