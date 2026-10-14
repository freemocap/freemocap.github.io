---
title: Fix a calibration problem
type: how-to
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): bundle_adjust.py and freemocap_anipose.py error messages, calibration-settings.tsx presets. Error section rewritten to current messages only; v1 traceback and programmatic board definition removed; tips unchanged."
  - date: "2026-08-25"
    against: "polyrepo-clones pulled 2026-08-25: freemocap anipose calibration solver (bundle_adjust.py, freemocap_anipose.py, charuco_board_ops.py), skellytracker CharucoBoardDefinition, and shared/charuco board images"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

Camera calibration is a smooth process once you get the hang of it, but it can take some trial and error to get your set up right. The following tips help smooth out the road bumps, and at the bottom is a list of common error messages you may see in the logging console, along with common solutions. 

If this guide isn't enough to get you calibrating your cameras successfully, reach out on [Discord](https://discord.gg/j76UGWfEeA) to ask for more help.

## ChArUco board size
Using a bigger ChArUco board can make it easier for your cameras to detect the board, especially in difficult lighting. Printing the board on a standard sheet of printer paper can work, but often bigger is better. Larger ChArUco boards can be printed directly on large poster board, or made by pasting together smaller partial printouts into a complete board.

You can help make a small ChArUco board work by holding it closer to the cameras while recording, but make sure the board is still visible from multiple cameras at a time.

## Rigid ChArUco board
The software detecting the ChArUco is expecting the board to be perfectly flat. To calibrate properly, make sure your board is mounted to something rigid, such as cardboard or foam board.

## Recording length
Taking time to record a longer calibration can help reduce your chances of a failed calibration. Spend 5-10 seconds displaying the board to each pair of cameras. 

At 30fps, that should result in about 200 shared views of the board for each camera pair.

## Glare
Glare from the sun or a bright light can obscure the ChArUco pattern and prevent the software from recognizing the ChArUco board. It can be helpful to tilt the board up and down while showing it to the cameras to ensure each camera has views of the board without glare.

## Missing shared views
Each camera must not only see the ChArUco board during calibration, but must share a view of the ChArUco board with another camera. It's best to avoid overly wide angles between cameras. As long as each camera is connected to each other camera by some combination of shared views with other cameras, the calibration can work.

## Reversed images
Reversed or mirrored images, like those recorded from some front-facing cameras on mobile phones, can prevent the software from recognizing the ChArUco board. 

Some phones allow you to turn off image mirroring in the settings, but if not you may have to switch to using the rear camera.

## Common error messages

Calibration errors appear in the app and in the log files in `skellylogs_data/logs` in your home
folder.

### `No valid calibration points for camera N (need >= 7)`
A camera barely saw the board. Check that it can see the board clearly: try a bigger board, less
glare, or bringing the board closer.

### `Expected N pairs, got M. Graph may be disconnected!`
Some cameras never saw the board at the same time as the others. Make sure each camera shares
views of the board with at least one other camera, so all the cameras link up into one group.

## Board layout

FreeMoCap only detects its own ChArUco boards: the 5x3 and 7x5 boards from
[calibrate your cameras](/tutorials/calibrate). Make sure the board preset and square length in
the calibration settings match your printed board.
