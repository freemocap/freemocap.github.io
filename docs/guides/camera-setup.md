---
title: Connect and configure cameras
type: how-to
sidebar_position: 11
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): CameraSettingsModal.tsx (Rotate, Resolution, Exposure; no framerate, focus or white balance controls), SettingsModal.tsx and menu-builder.ts (File > Settings, Include virtual cameras when detecting devices; alpha.24 release notes), skellycam opencv_apply_config.py (Linux forced auto-exposure). Rewritten; fixed garbled text from an earlier automated style pass. Camera table carried over, not re-tested."
  - date: "2026-08-25"
    against: "freemocap-docs docs/guides/camera-setup.mdx plus live code: freemocap-ui camera config tree and calibration settings, skellycam camera_config.py and opencv_apply_config.py, skellytracker charuco_board_definition.py, freemocap shared/charuco"
  - date: "2026-08-21"
    against: "freemocap-docs guides/camera-setup.mdx (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# Connect and configure cameras

For placement, lighting and background, see
[optimize your capture space](/tutorials/capture-environment) and
[record with multiple cameras](/tutorials/multi-camera).

## Which cameras work

Most USB webcams work. These are commonly used:

| Camera | Resolution | FPS | Notes |
|---|---|---|---|
| Logitech C920 | 1080p / 720p | 30 / 60 | Widely used, reliable |
| Logitech C922 | 1080p / 720p | 30 / 60 | Like the C920, better in low light |
| Logitech Brio | 4K / 1080p | 30 / 60 | Higher resolution, wider view |
| Elgato Cam Link | 1080p | 60 | Connects a DSLR or mirrorless camera over HDMI |

FreeMoCap doesn't look for virtual cameras (like OBS Virtual Camera) by default. To use one, turn on
**Include virtual cameras when detecting devices** under **File > Settings > Cameras**.

## USB bandwidth

Each camera uses a lot of USB bandwidth. When there isn't enough, you get dropped frames or
cameras disconnecting, with no clear error.

- Plug cameras straight into the computer, not into a hub.
- Spread cameras across different USB controllers if you can.
- Use USB 3 ports where possible.
- Lower the resolution to fit more cameras.

## Camera settings

Expand a camera's row in the camera panel to change:

| Setting | Recommendation |
|---|---|
| Rotate | Match how the camera is mounted |
| Resolution | 720p is a good balance of quality and bandwidth |
| Exposure | Manual, kept fixed. See [setting exposure](/tutorials/capture-environment#setting-exposure) |

Keep exposure fixed. If it changes during a recording, tracking and calibration can drift.
Cameras on Linux always use automatic exposure.

FreeMoCap has no settings for frame rate, focus, or white balance. Cameras run at their own
default frame rate. If your camera can lock focus and white balance, do it with the camera's own
software before recording.

## Synchronization

FreeMoCap keeps the cameras in step in software. Every camera captures the same number of frames,
and each frame gets a timestamp. For the best sync, use cameras with a steady frame rate and keep
recordings under about 30 minutes.

## Next steps

- [Calibrate your cameras](/tutorials/calibrate)
- [Get a calibration you can trust](/tutorials/better-calibration)
