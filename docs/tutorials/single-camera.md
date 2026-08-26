---
title: Record with one camera
type: tutorial
provenance: human-checked
history:
  - date: "2026-08-26"
    against: "freemocap clone pinned at v2.0.0-alpha.21: pyproject.toml [project.scripts], freemocap-ui en-english.json labels plus WelcomeModal.tsx/CameraHeaderActions.tsx/CameraConfigTreeViewHeader.tsx, recording-slice.ts autoProcess default, mocap_task_config.py detector and Blender-export defaults, export_to_blender.py MediaPipe-only gate, posthoc_mocap_task.py single-camera calibration skip, skellycam camera_config.py exposure defaults and opencv_apply_config.py Linux force-auto-exposure; link targets /start/install and /tutorials/calibrate confirmed present"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
## Introduction
We recommend that everybody starts by creating a single-camera recording and reconstruction of their movement before moving on to more complex tasks like multi-camera calibration and reconstruction. 

## Installation 

Follow the [Installation Guide](/start/install) to install the [FreeMoCap](https://github.com/freemocap/freemocap) software

## Launching FreeMoCap
Launch FreeMoCap from the terminal by activating the relevant Python environment and typing `freemocap` into the terminal, then press Enter. At that point, the GUI should show up, which will look like this (the screenshot below is from an earlier release, so the current interface looks somewhat different):

![image](https://user-images.githubusercontent.com/15314521/239695690-90ef7e7b-48f3-4f46-8d4a-5b5bcc3254b3.png)

- Click the "Connect Cameras" button on the welcome screen. FreeMoCap detects the cameras plugged into your computer and starts streaming from them (you can also reach the same controls later from the camera panel in the sidebar, via "Connect Cameras").

## Camera Detection
If a camera doesn't show up on its own, use the detect (refresh) control in the camera panel to scan for plugged-in cameras again. Once cameras are connected, each one streams a live viewpoint into the GUI. Expand a camera's row to adjust its settings (resolution, rotation, exposure, and so on), then send them with the connect/apply control in the camera panel; when auto-apply is switched on, changes are sent as you make them. 

<details>
<summary>Tips: Exposure and Framing</summary>

> Prioritize proper exposure for the best video quality. Start by lowering your exposure setting (ideally below -6) to reduce blur and create a crisp image. This may initially make the image appear slightly darker than expected. While perfect framing isn't critical for a simple single-camera setup, ensure you're visible within the frame. Keeping good framing practices in mind will be beneficial for future, more complex recording scenarios.
>
> On Linux, FreeMoCap currently forces cameras into automatic exposure, so manual exposure values are ignored on that platform for now.

</details>

## Recording
Because you're doing a single camera recording, you don't need to do any calibration (single-camera recordings skip the calibration requirement entirely and reconstruct through a planar projection fallback). But when you do graduate to multi-camera recordings, this is where you would get out a ChArUco board and run a calibration first. We're all clear to record our motion capture for now though.

Click "Start Recording" and go into the field of view to perform some kind of movement. Then click "Stop Recording", and it should process automatically from there (auto-process is on by default). When processing finishes, the recording folder is populated with the output data files! If you processed with the MediaPipe tracker and Blender was detected on your system, the finished Blender scene opens up automatically. With the default RTMPose tracker you get the motion capture data files, but Blender export isn't supported for its output yet.

## 3D Data with Multiple Cameras
Now that you have gotten the process working with a single camera, it's time to try multiple cameras. You can start with our [Multi-Camera Calibration Guide](/tutorials/calibrate).
