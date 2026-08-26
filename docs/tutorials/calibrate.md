---
title: Calibrate your cameras
type: tutorial
provenance: human-checked
reviewed: 2026-08-19
history:
  - date: "2026-08-26"
    against: "polyrepo-clones pulled 2026-08-26: freemocap calibration_task_config.py, anipose_calibration helpers, shared groundplane_math.py, freemocap-ui calibration-module.tsx/calibration-settings.tsx/MocapTaskTreeItem.tsx, skellytracker charuco_board_definition.py, shared/charuco assets"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
> This calibration process describes an anipose-based calibration method. We will soon be updating our method to use a more flexible and interactive interface.

<details>
<summary>Video Guidance</summary>

[Check out this video for more information and directed guidance in the calibration process](https://youtu.be/GxKmyKdnTy0?t=1615)

</details>

## Preparing the ChArUco Board
To perform a multi-camera calibration, you'll need to print out a [ChArUco board image](https://github.com/freemocap/freemocap/blob/main/shared/charuco/charuco_board_image.png). FreeMoCap's default board is the letter-size 5x3 layout (5 squares wide, 3 squares tall, with 54 mm squares).

For smaller spaces, a simple printout from a standard printer should work just fine. Make sure to mount the printout on something rigid like cardboard - the calibration process requires a *flat* ChArUco board.

For larger spaces, you might need to print this on a larger poster board so that it can be seen well by the cameras.

If you do not have access to a poster printer, you can print the [vector version of the board image](https://github.com/freemocap/freemocap/blob/main/shared/charuco/charuco_board_image.svg) at whatever size your printer can handle, tiling or scaling it as needed (just be sure to be accurate when cutting and assembling the pieces!).

### ChArUco Board Types
We support two configurations of ChArUco board, based on the number of rows and columns of squares on the board.

We generally recommend using the 5x3 board for most applications. It has fewer squares so it will print larger for a given paper size, so it will be trackable from farther distances, which allows calibration of larger spaces.

<table>
    <tr>
        <th>5x3 ChArUco Board (5 squares wide, 3 squares tall)</th>
        <th>7x5 ChArUco Board (7 squares wide, 5 squares tall)</th>
    </tr>
    <tr>
        <td align="center">
            <img src="/img/v1/charuco_board_5x3_annotated.png" alt="5x3 ChArUco board" width="300"/>
            <br/>
            <b>Download:</b><br/>
            <a href="https://github.com/freemocap/freemocap/blob/d82c830b45ba894d8ae7683b1c9cb2fc22d9ae9f/freemocap/assets/charuco/charuco_board_5x3.png">PNG</a> | 
            <a href="https://github.com/freemocap/freemocap/blob/b0a0531f159369d39f02405a52020d482b8a2444/freemocap/assets/charuco/charuco_board_5x3.svg">SVG</a> | 
            <a href="https://github.com/freemocap/freemocap/blob/b0a0531f159369d39f02405a52020d482b8a2444/freemocap/assets/charuco/charuco_board_5x3_annotated.png">Annotated</a>
        </td>
        <td align="center">
            <img src="/img/v1/charuco_board_7x5.png" alt="7x5 ChArUco board" width="300"/>
            <br/>
            <b>Download:</b><br/>
            <a href="https://github.com/freemocap/freemocap/blob/b0a0531f159369d39f02405a52020d482b8a2444/freemocap/assets/charuco/charuco_board_7x5.png">PNG</a> | 
            <a href="https://github.com/freemocap/freemocap/blob/b0a0531f159369d39f02405a52020d482b8a2444/freemocap/assets/charuco/charuco_board_7x5.svg">SVG</a> 
        </td>
    </tr>
</table>

## Setting up Cameras
To get a multiple camera recording, you'll need multiple cameras set up and connected to your computer. There's detailed instructions on multiple camera setups in [Optimize your capture space](/tutorials/capture-environment), but for now it will suffice to have two or more (three or more is best) cameras connected directly to your camera. We don't recommend using a USB hub to connect cameras. The cameras should be set up so they all see the subject at the same time, and have a 40-60 degree angle between each camera from the subject's viewpoint.

## Using the ChArUco board to set the recording origin
By enabling the `Align to initial ChArUco ground plane` option in the calibration panel, you can use the ChArUco board to define the axes of the 3D world, so that the reconstructed data comes in with the person oriented 'up' and standing on the ground.
See [the ground plane calibration page](/tutorials/ground-plane) for more information.

## Recording Calibration Videos
In the calibration panel of the GUI, select `Record and Calibrate` from the `Calibrate` dropdown menu:

![image](/img/v1/freemocap_calibration_window_w_text_overlay.png)

Begin the recording, and then move until your ChArUco board can be seen in the overlapping fields of view of at least two cameras at a time. Move the ChArUco board up and down so that you are "painting" each camera's view with images of the board. Make sure that every camera has shared views of the board with at least one other camera. We will be using the corresponding views of the board with the other cameras to help localize the camera positions relative to each other, which is necessary for the 3D triangulation step later.

When you're done, click `Stop Recording & Calibrate`. The calibration process will run automatically once the recording stops.

For more information about how to use the board to get a high quality calibration, [see this video](https://www.youtube.com/watch?v=GxKmyKdnTy0&t=1786s) (it uses a different version of this software, but the same principles apply).

## Processing the Calibration
The calibration process begins automatically when you stop the calibration recording.

> Be sure to keep an eye on the terminal that launched the GUI for helpful output, as not all of the solver output appears in the GUI itself.

## Recording Motion Capture Videos

Once you have completed the calibration process, you are ready to record motion capture videos!

Open the `Motion Capture` section of the sidebar and click `Start Mocap Recording`, then perform your movement, then click `Stop Recording`. The software will automatically process the videos when the recording stops.

To manually process/re-process the videos, select the recording and use the `Process Selected Recording` button in the `Motion Capture` section of the sidebar.
