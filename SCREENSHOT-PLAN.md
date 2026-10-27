# Screenshot plan

Remaining UI screenshots, written against FreeMoCap v2.0.0-alpha.25. Not published.
How to process and embed a capture is in the README. Raw originals live in
`~/Documents/FMC/App Captures and Tutorials/raw/`.

## Standards

- One window size, theme and OS per batch; record all three in the manifest.
- No third-party faces, personal paths, error banners or debug strip. Use a stand-in
  subject or the official `skellysamples` data (re-encoded to H.264, see
  ENGINEER-CALLOUTS 23 and 25).
- Crop to the part the reader needs. Only the overview page gets a full window.
- Alt text says what the reader should see.

## Remaining shots

Needs: **A** one camera, **B** three cameras, **C** printed ChArUco board in view,
**D** a processed recording, **X** another OS or app.

| ID | Page | Show | Crop | Needs |
|---|---|---|---|---|
| `app-overview` | start/first-recording | Whole window streaming, all cameras and the 3D view | Full window | B |
| `connect-cameras` | tutorials/single-camera | **Connect Cameras** before connecting | Left panel | A |
| `camera-connected` | tutorials/single-camera | **Connected** status, camera card with resolution and fps | Left panel top | A |
| `record-controls` | tutorials/single-camera | **Start Recording**, Delay Start, **Auto Process Mocap**, **Mocap Settings** | Left panel bottom | A |
| `recording-in-progress` | tutorials/single-camera | **Stop Recording** state | Left panel + preview | A |
| `open-folder-button` | start/see-your-results | **Open folder in file explorer** | Playback panel | D |
| `calibration-panel` | tutorials/calibrate | ChArUco board (5x3, 54 mm) settings and **Calibrate** | Left panel middle | A |
| `record-and-calibrate` | tutorials/calibrate | **Record and Calibrate** and **Stop Recording & Calibrate** | Left panel | B, C |
| `board-in-all-cameras` | tutorials/calibrate | Board detected in each camera view | Preview grid | B, C |
| `calibrated-state` | tutorials/calibrate | **Calibrated** and **Continue to Mocap Setup** | Left panel | B, C |
| `ground-plane-toggle` | tutorials/ground-plane | **Align to initial Charuco ground plane** | Left panel | A |
| `camera-settings` | guides/camera-setup | Exposure, resolution, rotation | Settings panel | A |
| `exposure-setting` | tutorials/capture-environment | Exposure control for one camera | Settings panel | A |
| `mocap-settings` | tutorials/post-processing | **Mocap Settings** with the filter options | Settings panel | A |
| `tracker-model-options` | tutorials/choose-a-tracker | Model complexity (Lite/Full/Heavy, Fast/Default/High Res) | Settings panel | A |
| `process-with-blender` | tutorials/blender | **Process Recording with Blender** in Playback | Playback panel | A, D |
| `process-mocap-button` | guides/posthoc-mocap | **Continue to Mocap Setup** and **Process Mocap** | Left panel | A, D |

Held until the 3D viewport shows the skeleton (ENGINEER-CALLOUTS 26):

| ID | Page | Show | Needs |
|---|---|---|---|
| `open-in-playback` | tutorials/single-camera | **Open in Playback** prompt after processing | A, D |
| `playback-skeleton` | start/see-your-results | **Playback** tab with the skeleton visible | A, D |
| `ground-plane-axes` | tutorials/ground-plane | 3D axes aligned to the board | B, C, D |
| `default-calibration-axes` | tutorials/ground-plane | 3D axes with Camera 0 as origin | B, C, D |

Not capturable on this Mac, so leave as text: Windows SmartScreen, the Linux AppImage
failure, CUDA install, macOS **Open Anyway**, and hard-to-trigger errors such as
"Frame counts differ".
