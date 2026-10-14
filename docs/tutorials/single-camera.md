---
title: Record with one camera
type: tutorial
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2), plus the installed alpha.25 app opened on macOS (welcome screen, Connected status, Connect Cameras, Start Recording, Auto Process Mocap; no camera attached, so no recording was made). Source: freemocap-ui en-english.json tour text, RecordingControlPanel.tsx, RecordingCompleteDialog.tsx (Open in Playback), mocap-slice.ts (detectorType rtmpose default), BlenderSection.tsx (MediaPipe-only export), skellycam opencv_apply_config.py (Linux forced auto-exposure)."
  - date: "2026-08-26"
    against: "freemocap clone pinned at v2.0.0-alpha.21: pyproject.toml [project.scripts], freemocap-ui en-english.json labels plus WelcomeModal.tsx/CameraHeaderActions.tsx/CameraConfigTreeViewHeader.tsx, recording-slice.ts autoProcess default, mocap_task_config.py detector and Blender-export defaults, export_to_blender.py MediaPipe-only gate, posthoc_mocap_task.py single-camera calibration skip, skellycam camera_config.py exposure defaults and opencv_apply_config.py Linux force-auto-exposure; link targets /start/install and /tutorials/calibrate confirmed present"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

Start with one camera. It's the quickest way to check that FreeMoCap works on your computer
before you set up several cameras. One camera gives you 2D tracking, not reliable 3D.

## 1. Open FreeMoCap

Open FreeMoCap. The first launch can take a minute while it starts up. When the top-left corner
says **Connected**, it's ready.

## 2. Connect your camera

Plug in a webcam (or use your laptop's built-in camera) and click **Connect Cameras**. Your
camera's live view appears in the middle of the window.

If your camera doesn't show up, click the refresh button in the camera panel to scan again.

To change a camera's settings, such as resolution or exposure, expand its row in the camera panel.
For sharp tracking, use a low exposure setting in a bright room. Cameras on Linux always use automatic
exposure.

## 3. Choose a tracker (optional)

FreeMoCap uses the **RTMPose** tracker by default. If you want to open your recording in Blender
afterwards, click **Mocap Settings** and change **Detector** to **MediaPipe**, because Blender
export only works with MediaPipe for now.

## 4. Record

1. Click **Start Recording**.
2. Step into view and move around.
3. Click **Stop Recording**.

You don't need to calibrate for a single camera.

**Auto Process Mocap** is on by default, so FreeMoCap processes the recording as soon as you
stop. The first time, it downloads the tracking model, so stay online.

## 5. See your results

When you stop recording, a summary window appears. Click **Open in Playback** to review the
recording. More on this in [see what you made](/start/see-your-results).

## Next

Ready for 3D? [Calibrate your cameras](/tutorials/calibrate), then
[record with multiple cameras](/tutorials/multi-camera).
