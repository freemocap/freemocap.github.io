---
title: Keypoint names and indices by model
type: reference
sidebar_position: 13
provenance: ai-generated
draft: false
history:
  - date: "2026-08-25"
    against: "Re-checked FreeMoCap tracker_definitions.py, tracker_schema_message.py, websocket_server.py, posthoc_mocap_task.py, playback_router.py, pyproject.toml, and skeleton_from_mediapipe_observations.py plus SkellyTracker rtmpose_wholebody.yaml, mediapipe body/hand/face-contour YAMLs, rtmpose_wholebody_detector.py and tracker_mapping.py plus SkellyForge mediapipe/rtmpose/canonical_body/canonical_hand YAMLs, tracking_model_info.py, human.py and actor.py, all read directly"
  - date: "2026-08-24"
    against: "FreeMoCap tracker_definitions.py, SkellyTracker core detector YAMLs, and SkellyForge skellymodels source, read directly"
---

# Keypoint names and indices by model

There are two keypoint-schema systems in this codebase, and both are
live. They serve different purposes:

1. **`TrackerDefinition` objects** (FreeMoCap's `core/tracking/tracker_definitions.py`)
   describe what a tracker emits: ordered point names plus connections,
   loaded from SkellyTracker's per-detector YAML files. This is the
   schema the frontend sees, delivered over the websocket handshake at
   connect time and saved into each recording as `tracker_schema.json`.
2. **SkellyForge skellymodels** (`tracker_info/*.yaml` parsed into `ModelInfo`
   objects) describe how raw tracker output becomes named, sliced,
   biomechanically annotated output data. This is what names the columns
   of your output arrays and parquet.

They use the same body point names but are not interchangeable: the
RTMPose aspect orders differ between them, and the two MediaPipe face
representations carry the same count with different point identities.
Those mismatches are flagged in detail below. The old plan that this
page would be generated purely from
`skellyforge/skellymodels/tracker_info/*.yaml` was half right: that is
the source for output-file columns, not for the frontend schema.

## System 1: TrackerDefinition (the frontend schema)

A `TrackerDefinition` is deliberately small: `name`, `tracked_points`
(ordered tuple of names), `connections` (tuple of name pairs). Three are
built at import time:

- **`rtmpose_wholebody`** loads directly from
  `skellytracker/core/detectors/keypoint_detectors/rtmpose/wholebody/rtmpose_wholebody.yaml`.
- **`mediapipe_wholebody`** has no single YAML; FreeMoCap composes it in
  code from three SkellyTracker files (body, hand, face contour),
  prefixing hand points with `right_hand_` / `left_hand_`.
- **`mediapipe_body`** loads directly from
  `skellytracker/core/detectors/keypoint_detectors/mediapipe/body/mediapipe_body.yaml`.
  It is defined but not used anywhere else in FreeMoCap; the two
  schemas below are the ones the rest of this page covers.

The websocket server sends all active schemas in one
`TrackerSchemasMessage` when a client connects; it also includes
canonical body/hand schemas derived from skellymodels (see system 2).
After a recording finishes, a schema lands on disk as
`{recording}/tracker_schema.json`, which the playback router serves so
the frontend can draw the skeleton without hardcoding anything. Note
that the saved file currently always contains the RTMPose wholebody
definition regardless of which detector processed the recording, because
the save call hardcodes it.

### rtmpose_wholebody: 133 points

COCO-wholebody layout, flattened with side prefixes applied. Index ranges:

| Range | Region | Points |
|---|---|---|
| 0-22 | body | 23 |
| 23-43 | right hand | 21, prefixed `right_hand_` |
| 44-64 | left hand | 21, prefixed `left_hand_` |
| 65-132 | face | 68, numbered `face_0000`-`face_0067` |

Body points, in index order 0-22: `nose`, `left_eye`, `right_eye`,
`left_ear`, `right_ear`, `left_shoulder`, `right_shoulder`,
`left_elbow`, `right_elbow`, `left_wrist`, `right_wrist`, `left_hip`,
`right_hip`, `left_knee`, `right_knee`, `left_ankle`, `right_ankle`,
`left_big_toe`, `left_small_toe`, `left_heel`, `right_big_toe`,
`right_small_toe`, `right_heel`.

Hand points follow MediaPipe's hand naming under the prefix:
`root`, `thumb1`-`thumb4`, `forefinger1`-`forefinger4`,
`middle_finger1`-`middle_finger4`, `ring_finger1`-`ring_finger4`,
`pinky_finger1`-`pinky_finger4`. Face points carry iBUG 300-W indices as
zero-padded numbers.

One implementation detail worth knowing: the underlying RTMW model
natively outputs body, face, left hand, right hand (face at indices
23-90); the detector permutes its output to match this schema's order,
so consumers of the detector never see the native order.

### mediapipe_wholebody: 211 points

Composed from three detectors that run in one stage, concatenated in
this order:

| Range | Source | Points |
|---|---|---|
| 0-32 | MediaPipe Pose | 33, unprefixed (`nose`, `mouth_left`, `left_heel`, and more) |
| 33-53 | right hand | 21, `right_hand_wrist`, `right_hand_thumb_cmc`, and more |
| 54-74 | left hand | 21, same names with `left_hand_` |
| 75-210 | face contour | 136, sparse `face_NNNN` mesh indices |

MediaPipe body names differ from COCO's: eyes split into inner/outer
(`left_eye_inner`, `left_eye`, `left_eye_outer`), mouth corners are
`mouth_left`/`mouth_right`, finger tips are `left_pinky`, `left_index`,
`left_thumb`, and foot points are `left_heel` and `left_foot_index`.
Hand landmark names use full anatomical names (`wrist`, `thumb_cmc`,
`index_finger_mcp`) unlike RTMPose's numbered fingers. The face contour
is 136 points sampled from FaceLandmarker's 478-point mesh (468 mesh
plus 10 iris), keeping their original mesh numbers, hence the gaps
(`face_0000`, `face_0007`, through `face_0477`).

## System 2: skellymodels (the output-data schema)

Each supported tracker has a YAML in
`skellyforge/skellymodels/tracker_info/` describing its aspects
(regions), tracked-point names and order, virtual markers, segment
connections, center-of-mass parameters, and joint hierarchy. The posthoc
mocap pipeline builds a `Human` from one of these after triangulation;
its slicing defines the marker order inside every output `.npy`, CSV,
and parquet row (see [output arrays](/reference/data-arrays)).

### `mediapipe_model_info.yaml`

Aspect order: `body`, `right_hand`, `left_hand`, `face`.

- Body: 33 tracked points (same names as the pose detector preceding), plus
  four appended virtual markers computed from them: `head_center`
  (mean of ears), `neck_center` (mean of shoulders), `trunk_center`
  (quarter-weighted mean of shoulders and hips), `hips_center` (mean of
  hips). Segment connections cover 23 segments; Winter center-of-mass
  parameters are defined for 14 segments including the hands.
- Hands: 21 points each using anatomical names (`wrist`, `thumb_cmc`
  through `pinky_tip`), palm cross-connections defined, and no COM or hierarchy.
- Face: 136 generated points named `face_0000` through `face_0135`.

This aspect order happens to match the live detector's emission order,
so MediaPipe recordings slice cleanly: body, right hand, left hand,
then face.

### `rtmpose_model_info.yaml`

Aspect order: `body`, `face`, `left_hand`, `right_hand`.

- Body: 23 tracked points (COCO names matching the wholebody schema)
  plus the same four virtual markers, 23 segment connections, and COM
  parameters for 12 of them.
- Face: 68 generated points, `face_0000`-`face_0067`.
- Hands: 21 points each named `hand_root`, `thumb1` through `pinky_finger4`
  (no side prefix inside the aspect; the aspect itself carries the side).

Two things to know before indexing RTMPose output beyond the body:

1. The aspect order here (body, face, left, right) does not match the
   detector/frontend order (body, right, left, face), and nothing in
   either repo reorders the points between detection and slicing. Only
   the body block lands correctly; the face slice picks up the hand
   points, and the hand slices pick up face points. Per-aspect `.npy`
   files therefore do not contain what their filenames claim for hands
   and face in RTMPose recordings, and neither do concatenated arrays
   like `{tracker}_skeleton_3d.npy` or the parquet. Verify against a
   recording you trust rather than trusting the labels.
2. Face point counts agree with the frontend schema for RTMPose (68 =
   68), but MediaPipe's do not line up in identity: the model-info config
   generates a contiguous `face_0000`-`face_0135` while the detector
   emits 136 sparse mesh indices (`face_0000`, `face_0007`,
   `face_0477`, and more). Same width, different meaning per column.

### Canonical models and tracker-to-canonical mappings

Two further YAMLs define a tracker-agnostic body and hand:
`canonical_body.yaml` (27 landmarks: the 23 COCO body points plus the
four computed centers as first-class points, with segments, Winter COM
table, FABRIK bone-length seeds, and a joint tree) and `canonical_hand.yaml`
(21 landmarks, 20 bones, hand bone-length ratios). Per-tracker mapping
YAMLs shipped with SkellyTracker translate raw tracker keypoints into
these names; entries are a string (passthrough), a list (unweighted
mean), or a dict (weighted sum), so "virtual marker" stops being a
separate concept here.

This pair drives the realtime pipeline: center-of-mass calculation and
the skeleton rigidifier load canonical anatomy once, then map whichever
detector's keypoints arrive each frame via
`TrackerMapping.from_yaml(...)` selected by detector type. The websocket
handshake also derives its `canonical_body` and `canonical_hand` schemas
from these models.

## Which system should you read

| What you want | Read |
|---|---|
| Point names/connections for drawing or streaming | `TrackerDefinition` (system 1): `tracker_schema.json` in any recording, or the YAMLs under SkellyTracker's `keypoint_detectors/` |
| Column order of output `.npy`/parquet, virtual markers, segment anatomy | skellymodels `ModelInfo` (system 2): the tracker's `*_model_info.yaml` |
| realtime canonical skeleton, CoM, rigid bodies | canonical YAMLs plus SkellyTracker's mapping YAMLs |

Both systems are active dependencies of the app. FreeMoCap's pyproject
lists `skellyforge` (which bundles skellymodels) while the old separate
`skellymodels` package entry stays commented out; nothing imports a
top-level `skellymodels`. If a future refactor retires one of these two
systems, this page and [the concepts page](/concepts/data-model) both
need updating together, since they each document a different half.
