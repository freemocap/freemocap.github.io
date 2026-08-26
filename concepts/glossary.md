---
title: Glossary
type: explanation
provenance: human-checked
history:
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21 detector defaults (mocap_task_config.py, camera_node_config.py, tracker_factory.py) and skellytracker main (yolox_person_detector.py, rtmpose_wholebody_detector.py, mediapipe_pose_detector.py), plus freemocap-docs backend-mocap.mdx and this site's linked pages"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
## Capture Volume
3-dimensional area (volume) with sufficient camera coverage to support 3D tracking.

## Calibration

Calibration is the process of measuring information about the cameras used for a recording.
We measure the camera "intrinsics", like the focal length and lens distortion, 
as well as "extrinsics", like where the cameras are in space and where they are pointed.
Having the cameras calibrated is necessary to triangulate the 2-dimensional data from each camera into 3-dimensional data. 

[Link to a section of the 'braindump' video discussing capture volume calibration](https://www.youtube.com/watch?v=GxKmyKdnTy0&t=1785s)

## ChArUco Board

A ChArUco board is a combination of a chessboard and ArUco markers, two common tools for calibrating cameras.
The ChArUco is a known object that is easily detected in images, 
and allows the software to figure out where the camera is in relation to the board 
and correct for distortions from the camera.

[Link to a section of the 'braindump' video discussing the ChArUco board](https://www.youtube.com/watch?v=GxKmyKdnTy0&t=1615s)

## MediaPipe

An open source framework for machine learning perception pipelines from Google. FreeMoCap supports MediaPipe's pose model (which also tracks hands and face) as one of its two skeleton detectors; RTMPose is the default.

[MediaPipe Documentation](https://developers.google.com/mediapipe)

## YOLOX

An open source object detection model family, originally developed by Megvii. FreeMoCap uses YOLOX to detect the person in each frame so the region around them can be cropped out before pose estimation, see [use YOLO cropping](/guides/yolo-cropping). The specific YOLOX checkpoints used are downloaded from OpenMMLab's MMPose ONNX SDK.

     
## Reprojection Error
"Reprojection error" is the distance (in pixels) between the originally measured point (i.e. the 2d skeleton) and the reconstructed 3d point reprojected back onto the image plane. 

The intuition is that if the 3d reconstruction and original 2d track are perfect, then reprojection error will be Zero. If it isn't, then there is some inaccuracy in either:

-  the original 2d tracks (i.e. bad skeleton detection in one or more cameras), 
-  in the 3d reconstruction (i.e. bad camera calibration), 
- a combination of the two

[Click here to follow a conversation about reprojection error on discord](https://discord.com/channels/760487252379041812/760489602917466133/989189718203838505)
