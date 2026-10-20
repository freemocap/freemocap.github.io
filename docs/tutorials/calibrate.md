---
title: Calibrate your cameras
type: tutorial
provenance: ai-generated
reviewed: 2026-08-19
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): freemocap-ui calibration-module.tsx (Calibrate dropdown: Record and Calibrate, Import Calibration videos, Import .toml file; Stop Recording & Calibrate; Calibrated state), calibration-settings.tsx (5 x 3 / 7 x 5 presets, Square length mm, Align to initial Charuco ground plane), calibration-slice.ts (default 5x3, 54 mm), calibration_task_config.py (Anipose default solver), shared/charuco (7x5 board image), ProcessMocapPanel.tsx and mocap-setup-modal.tsx (Continue to Mocap Setup, Process Mocap). Rewritten; not checked against a real calibration."
  - date: "2026-08-26"
    against: "polyrepo-clones pulled 2026-08-26: freemocap calibration_task_config.py, anipose_calibration helpers, shared groundplane_math.py, freemocap-ui calibration-module.tsx/calibration-settings.tsx/MocapTaskTreeItem.tsx, skellytracker charuco_board_definition.py, shared/charuco assets"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

To get 3D data from several cameras, FreeMoCap first needs to work out where each camera is. You
do this by recording a printed ChArUco board as you move it around in front of the cameras.

A single camera doesn't need calibration.

## 1. Print a ChArUco board

FreeMoCap works with two boards. Use the **5x3** board unless you have a reason not to. Its
squares print larger, so cameras can see it from farther away.

<!-- vale Google.Colons = NO -->
<!-- Raw HTML table below, not prose: "Download:<br/>PNG" reads as a
     colon immediately followed by a capitalized word to the rule, but
     it's a file-format label (PNG), not a sentence continuation. -->
<table>
    <tr>
        <th>5x3 board (5 squares wide, 3 tall)</th>
        <th>7x5 board (7 squares wide, 5 tall)</th>
    </tr>
    <tr>
        <td align="center">
            <img src="/img/v1/charuco_board_5x3_annotated.png" alt="5x3 ChArUco board" width="300"/>
            <br/>
            <b>Download:</b><br/>
            <a href="https://github.com/freemocap/freemocap/blob/d82c830b45ba894d8ae7683b1c9cb2fc22d9ae9f/freemocap/assets/charuco/charuco_board_5x3.png">PNG</a> |
            <a href="https://github.com/freemocap/freemocap/blob/b0a0531f159369d39f02405a52020d482b8a2444/freemocap/assets/charuco/charuco_board_5x3.svg">SVG</a>
        </td>
        <td align="center">
            <img src="/img/v1/charuco_board_7x5.png" alt="7x5 ChArUco board" width="300"/>
            <br/>
            <b>Download:</b><br/>
            <a href="https://github.com/freemocap/freemocap/blob/main/shared/charuco/charuco_board_image.png">PNG</a> |
            <a href="https://github.com/freemocap/freemocap/blob/main/shared/charuco/charuco_board_image.svg">SVG</a>
        </td>
    </tr>
</table>
<!-- vale Google.Colons = YES -->

Print it and glue or tape it to something stiff, like cardboard. The board must stay flat. For a
large space, print it bigger, for example as a poster.

Then **measure one black square in millimeters**. FreeMoCap needs the exact size to get your
measurements right.

## 2. Set up your cameras

Connect two or more cameras (three is better), each plugged straight into the computer. Place them
so they all see the area where you'll move, from different angles. See
[record with multiple cameras](/tutorials/multi-camera) and
[optimize your capture space](/tutorials/capture-environment).

Click **Connect Cameras**.

## 3. Enter your board's details

In the **Calibration** panel, open the board settings and set:

- The board preset: **5 x 3** or **7 x 5**, to match your printout.
- The square length: the size you measured, in millimeters.

To have FreeMoCap use the board to set which way is up and where the floor is, turn on
`Align to initial Charuco ground plane`, and start the recording with the board lying flat on
the floor. See [set the ground plane](/tutorials/ground-plane).

## 4. Record the calibration

1. Click **Calibrate**, then **Record and Calibrate**.
2. Hold up the board and move it slowly through the space. Tilt and turn it as you go. Make sure every
   camera sees the board at the same time as at least one other camera.
3. Click **Stop Recording & Calibrate**.

FreeMoCap calibrates as soon as you stop. When it finishes, the panel shows **Calibrated**.

If you already have calibration videos, use **Calibrate > Import Calibration videos** instead. To
reuse a calibration file from before, use **Calibrate > Import .toml file**.

## 5. Record your motion capture

Leave the cameras where they are. If you move one, calibrate again.

Click **Start Recording**, perform your movement, and click **Stop Recording**. FreeMoCap processes
the recording with your calibration.

To process a recording again, open it in the **Playback** tab, click **Continue to Mocap Setup**,
then **Process Mocap**.

## Next steps

- [Get a calibration you can trust](/tutorials/better-calibration)
- [Fix a calibration problem](/guides/calibration-troubleshooting)
