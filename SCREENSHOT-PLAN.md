# Screenshot plan

Shot list for the V2 UI screenshots. Not published: this file sits outside the folders the docs site builds from. The image script, `<Screenshot>` component and zoom plugin are in place (see the README's Screenshots section).

## Status

Captured and in the docs (10): `welcome-screen`, `calibrate-import-menu`, `import-videos`, `sync-options`, `detector-choice` (plus a MediaPipe version, `detector-choice-mediapipe`), `filter-settings`, `blender-export-options`, `blender-scene`, `recording-folder`. Raw originals are in `~/Documents/FMC/App Captures and Tutorials/raw/`.

Source recording: the official `skellysamples` sample data, converted to H.264 (see ENGINEER-CALLOUTS 23 and 25) and processed with MediaPipe. Held back until the 3D viewport shows the skeleton (callout 26): `playback-skeleton`, `open-in-playback`, `ground-plane-axes`, `default-calibration-axes`.

Written against FreeMoCap v2.0.0-alpha.25. Each shot comes from what a page tells the reader to click.

## Capture standards

- One window size, one theme, one OS per batch. Record all three in the manifest.
- No real faces from third parties, no personal folder paths, no error banners, no debug strip. Use a stand-in subject or the official sample data.
- Crop to the part the reader needs. One full-window shot lives on the overview page. Everything else is a cropped panel.
- Output: WebP, 1600 px wide at most, about 80 quality, stored next to the page in `img/`, named by the shot ID below. Originals stay out of the repo.
- Every image gets descriptive alt text that says what the reader should see, not "image" or "screenshot".

## Needs key

| Tag | Means |
|---|---|
| A | Works with one camera |
| B | Needs three cameras |
| C | Needs a printed ChArUco board in view |
| D | Needs a recording that has been processed |
| X | Needs a different OS or app, not capturable on this Mac |

## Phase 1: first recording

| ID | Page | Show | Crop | Needs |
|---|---|---|---|---|
| `app-overview` | start/first-recording | Whole window while streaming, with all cameras and the 3D view | Full window | B |
| `welcome-screen` | start/install | The welcome screen on first launch | Full window | A |
| `connect-cameras` | tutorials/single-camera | The **Connect Cameras** control before connecting | Left panel | A |
| `camera-connected` | tutorials/single-camera | **Connected** status and the camera card with resolution and fps | Left panel top | A |
| `detector-choice` | tutorials/choose-a-tracker | **Mocap Settings > Detector** with MediaPipe and RTMPose options | Settings panel | A |
| `record-controls` | tutorials/single-camera | **Start Recording**, Delay Start, **Auto Process Mocap**, **Mocap Settings** | Left panel bottom | A |
| `recording-in-progress` | tutorials/single-camera | The **Stop Recording** state while recording | Left panel + preview | A |
| `open-in-playback` | tutorials/single-camera | The **Open in Playback** prompt after processing | Whole window | A, D |
| `playback-skeleton` | start/see-your-results | The **Playback** tab with the skeleton visible | Whole window | A, D |
| `recording-folder` | tutorials/find-your-data | The recording folder open in Finder: `synchronized_videos`, `output_data`, `annotated_videos`, `3d_models` | Finder window | D |
| `open-folder-button` | start/see-your-results | **Open folder in file explorer** | Playback panel | D |

## Phase 2: calibration and cameras

| ID | Page | Show | Crop | Needs |
|---|---|---|---|---|
| `calibration-panel` | tutorials/calibrate | Charuco board (5x3, 54 mm) settings and the **Calibrate** button | Left panel middle | A |
| `calibrate-import-menu` | tutorials/calibrate | **Calibrate > Import .toml file** and **Import Calibration videos** | Menu | A |
| `record-and-calibrate` | tutorials/calibrate | The **Record and Calibrate** and **Stop Recording & Calibrate** states | Left panel | B, C |
| `board-in-all-cameras` | tutorials/calibrate | Board visible and detected in each camera view | Preview grid | B, C |
| `calibrated-state` | tutorials/calibrate | The **Calibrated** confirmation and **Continue to Mocap Setup** | Left panel | B, C |
| `ground-plane-toggle` | tutorials/ground-plane | **Align to initial Charuco ground plane** toggle | Left panel | A |
| `ground-plane-axes` | tutorials/ground-plane | 3D view with axes aligned to the board (replaces `charuco_as_groundplane`) | 3D viewport | B, C, D |
| `default-calibration-axes` | tutorials/ground-plane | 3D view with Camera 0 as origin (replaces `cam0_as_origin_v2`) | 3D viewport | B, C, D |
| `camera-settings` | guides/camera-setup | Per-camera settings: exposure, resolution, rotation | Settings panel | A |
| `exposure-setting` | tutorials/capture-environment | The exposure control for one camera | Settings panel | A |

## Phase 3: processing and export

| ID | Page | Show | Crop | Needs |
|---|---|---|---|---|
| `mocap-settings` | tutorials/post-processing | **Mocap Settings** with the filter options | Settings panel | A |
| `filter-settings` | tutorials/post-processing | **Butterworth Low-Pass Filter** and gap-filling options | Settings panel | A |
| `tracker-model-options` | tutorials/choose-a-tracker | Model complexity options (Lite/Full/Heavy, Fast/Default/High Res) | Settings panel | A |
| `blender-export-options` | tutorials/blender | **Export to Blender after mocap processing**, **Select Blender executable**, auto-open, foot locking, hand range | Settings panel | A |
| `process-with-blender` | tutorials/blender | **Process Recording with Blender** in Playback | Playback panel | A, D |
| `blender-scene` | tutorials/blender | The exported scene open in Blender | Blender window | D, X |
| `import-videos` | guides/posthoc-mocap | **Import Videos** with **Choose Video Files** and the synchronize option | Dialog | A |
| `sync-options` | guides/posthoc-mocap | Audio and brightness-flash synchronization options and **Sampling Rate** | Dialog | A |
| `process-mocap-button` | guides/posthoc-mocap | **Continue to Mocap Setup** and **Process Mocap** | Left panel | A, D |

## Not capturable here

- Windows SmartScreen ("Windows protected your PC") on `start/install`: needs Windows.
- Linux AppImage failure on `guides/installation-troubleshooting`: needs Linux.
- CUDA install on `guides/gpu-setup`: needs an NVIDIA machine.
- macOS "can't be opened" and **Open Anyway** on `start/install`: needs a fresh install to trigger.
- Error states such as "Frame counts differ": hard to trigger on purpose, so leave as text.

## Reuse, don't retake

`static/img/v1/charuco_board_5x3.png` and `charuco_board_7x5.png` are the boards themselves, not UI. They stay.

## Open decisions

1. Window size and theme for the batch.
2. Stand-in subject: sample data, a video, or a camera on a plain background.
3. Which shots to do first. My suggestion is everything tagged A in Phase 1 (nine shots on one camera), then the three-camera session for the rest.
