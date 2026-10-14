---
title: Get a calibration you can trust
type: tutorial
sidebar_position: 30
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): calibration_result.py and run_anipose_calibration.py (reprojection_error_px written to the calibration TOML metadata), calibration_paths.py (file name), calibration-module.tsx (error not shown in the app)."
  - date: "2026-08-26"
    against: "re-read against the page's own linked pages (all 5 internal links confirmed to resolve); page is calibration-methodology advice with no separately checkable code claims"
  - date: "2026-08-20"
    against: "none"
draft: false
---

# Get a calibration you can trust

A calibration can finish without an error and still be poor. These habits make a good one more
likely.

## Move the board around a lot

Don't hold the board still or sweep it in one line. Show it near and far, tilted and turned, all
through the space where you'll record. The more variety the cameras see, the better the
calibration.

## Check the calibration error

Each calibration saves its error in pixels. Lower is better. To find it, open the calibration file
(`{recording name}_camera_calibration.toml` in the calibration recording's folder) in a text
editor and look for `reprojection_error_px`. If it's high compared with your earlier calibrations,
record a new one with more varied board views. See [why calibration matters](/concepts/calibration)
for what the number means.

## Recalibrate after any change

A calibration only fits the exact setup it was recorded with. Calibrate again whenever a camera
is moved, bumped, refocused, added, or removed. FreeMoCap can't tell that anything changed, and
keeps using your last calibration.

## Next steps

- [Fix a calibration problem](/guides/calibration-troubleshooting)
- [Set the ground plane](/tutorials/ground-plane)
