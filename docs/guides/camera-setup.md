---
title: Connect and configure cameras
type: how-to
sidebar_position: 11
provenance: ai-generated
draft: false
history:
  - date: "2026-08-25"
    against: "freemocap-docs docs/guides/camera-setup.mdx plus live code: freemocap-ui camera config tree and calibration settings, skellycam camera_config.py and opencv_apply_config.py, skellytracker charuco_board_definition.py, freemocap shared/charuco"
  - date: "2026-08-21"
    against: "freemocap-docs guides/camera-setup.mdx (v2.0.0-alpha.21, not yet re-checked against the running app)"
---

# Connect and configure cameras

For the physical setup (lighting, placement, background), see
[optimize your capture space](/tutorials/capture-environment) and
[record with multiple cameras](/tutorials/multi-camera). This page is
about the cameras themselves and the settings that affect calibration
stability.

## Supported cameras

Any USB camera OpenCV's `VideoCapture` can open should work. Tested
configurations:

| Camera | Resolution | FPS | Notes |
|---|---|---|---|
| Logitech C920 | 1080p / 720p | 30 / 60 | Widely used, reliable |
| Logitech C922 | 1080p / 720p | 30 / 60 | Similar to C920, better low light |
| Logitech Brio | 4K / 1080p | 30 / 60 | Higher resolution, wider field of view |
| Elgato Cam Link | 1080p | 60 | HDMI capture, for use with a DSLR or mirrorless camera |
| Generic USB webcams | Variable | Variable | May work, quality varies |

## USB bandwidth

USB cameras use real bandwidth, and running out of it shows up as
dropped frames or disconnects, not a clear error message. A few things
that help:

- Use separate USB controllers when you can, not just separate ports on
  the same hub.
- USB 3.0 has more headroom than USB 2.0.
- Lower resolution means less bandwidth per camera, which means more
  cameras can share one controller.
- If cameras are dropping frames or disconnecting, that's the first
  thing to check, spread them across controllers before assuming
  something else is wrong.

## Configuration settings that matter

Set through the Camera Config Tree in the sidebar:

| Setting | Recommendation |
|---|---|
| Resolution | 720p is a good balance of quality and bandwidth |
| Exposure | Manual, fixed |

Two settings you may see recommended elsewhere are not currently in the
app. Framerate has no control in the config panel, and SkellyCam leaves
it at the camera's own default (applying a configured framerate is
disabled in its capture code), so choose cameras that hold the rate you
need rather than trying to set it here. Focus and white balance have no
controls either, so if your camera supports locking them, do it through
the camera's own driver or on-device menu before recording.

Fixed exposure matters more than it might seem to. If auto-exposure
changes mid-recording, the detected feature positions shift with the
brightness change, and your [calibration](/concepts/calibration) can
drift as a result. This is a common, non-obvious cause of a calibration
that looked fine and then didn't. One caveat: on Linux, SkellyCam
currently forces auto-exposure regardless of the mode you pick (because
of a cross-platform mismatch in exposure units), so the manual setting
is ignored there.

## Synchronization

Cameras aren't hardware-genlocked, synchronization is done in software.
SkellyCam's orchestrator runs a two-phase grab/retrieve cycle, where all
cameras latch each frame before any of them decodes it, so every camera
produces the same number of frames across a recording, and each frame
gets a high-resolution timestamp that's saved with the recording for
posthoc analysis. For the most reliable sync: use cameras that hold a
consistent framerate (not variable frame rate), and keep individual
recording sessions under about 30 minutes to limit how much drift can
accumulate.

## Calibration board

Calibration uses a printed [ChArUco board](/concepts/calibration). Print
it on something rigid so it stays flat, printable board files ship in
`shared/charuco/` in the freemocap repository. The board's physical
dimensions need to match whatever's configured in the calibration
settings (board preset and square length, in millimeters).

## Next steps

- [Why calibration matters](/concepts/calibration)
- [Get a calibration you can trust](/tutorials/better-calibration)
- [Record with multiple cameras](/tutorials/multi-camera)
