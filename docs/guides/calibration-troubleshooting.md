---
title: Fix a calibration problem
type: how-to
provenance: human-checked
history:
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
The software detecting the ChArUco is expecting the board to be perfectly flat. To calibrate properly, make sure your board is mounted to something rigid, like a piece of cardboard or poster board.

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

### `ValueError: not enough values to unpack (expected 2, got 0)`
```
freemocap_anipose.py", line 1810, in calibrate_rows
    objp, imgp = zip(*mixed)
    ^^^^^^^^^^
ValueError: not enough values to unpack (expected 2, got 0)
```
This issue comes up when one or more cameras do not have any shared views of the ChArUco with other cameras. This can due to the physical setup of your cameras. Make sure each camera can clearly see the ChArUco board at the same time as another camera. This issue can also happen if a camera is not properly detecting a ChArUco board due to an issue like a mirrored view, glare, or a ChArUco board that's too small in the cameras view.

The traceback preceding comes from older releases of FreeMoCap. Current versions raise clearer errors for the same underlying problems, for example `No valid calibration points for camera {N} (need >= 7)` when a camera has essentially no usable views of the board, or `Expected {N} pairs, got {M}. Graph may be disconnected!` when the shared views between cameras do not connect all of them into one group.

## ChArUco board definition

Print or display [this image](https://github.com/freemocap/freemocap/blob/main/shared/charuco/charuco_board_image.png) for the ChArUco board. There is also a [high definition version](https://github.com/freemocap/freemocap/blob/main/shared/charuco/charuco_board_image_highRes.png) for printing larger boards. FreeMoCap can't detect ChArUco boards that don't match this exact layout.

If you have a need to define the FreeMoCap ChArUco board programmatically, the definition is a single shared `CharucoBoardDefinition` model, defined in SkellyTracker at `skellytracker/core/detectors/keypoint_detectors/charuco/charuco_board_definition.py` and used by both the ChArUco detector and the calibration solver. The default board is the letter-size 5x3 layout (5 squares wide, 3 squares tall, with 54 mm squares). Its fields are:
```
    squares_x: int
    squares_y: int
    square_length_mm: float
    marker_length_ratio: float = 0.8
    aruco_dictionary_enum: int = cv2.aruco.DICT_4X4_250
```
