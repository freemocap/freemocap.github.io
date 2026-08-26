---
title: "Built-in detectors"
type: reference
sidebar_position: 4
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "yolox_person_detector.py (score_threshold=0.7, nms_threshold=0.45, max_detections=1, all exact) and rtmpose_wholebody_detector.py (confidence_threshold=0.004, exact). This page's own body/right-hand/left-hand/face permutation claim is the missing precision on the already-tracked RTMPose ordering bug in CODE-BUGS-FOUND.md: SkellyTracker does permute from native COCO-wholebody order to this schema order, it's specifically that post-permutation order skellyforge's YAML fails to account for, not a raw pass-through"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# Built-in detectors

| Registry key | Class | backend | Output |
|---|---|---|---|
| `aruco` | `ArucoDetector` | OpenCV, CPU | 4 corners per configured marker ID |
| `charuco` | `CharucoDetector` | OpenCV, CPU | all ChArUco corners + board ArUco marker corners |
| `mediapipe_pose` | `MediapipePoseKeypointDetector` | MediaPipe | 33 body landmarks |
| `mediapipe_hand` | `MediapipeHandKeypointDetector` | MediaPipe | 42 hand points (21 per hand, `right_hand_`/`left_hand_` prefixed) |
| `mediapipe_face` | `MediapipeFaceKeypointDetector` | MediaPipe | face contour subset of the 478-point mesh, named `face_NNNN` |
| `rtmpose_body` | `RTMPoseBodyDetector` | ONNX Runtime | 23 body keypoints (COCO17 + feet) |
| `rtmpose` | `RTMPoseKeypointDetector` | ONNX Runtime | 133 whole-body keypoints |
| `yolox_person` | `YoloxPersonDetector` | ONNX Runtime | person bounding boxes |

## ArUco and ChArUco

`ArucoDetector` detects standalone ArUco markers (default IDs `(0, 1, 2, 3)`, `DICT_4X4_50`) and returns four named corners per configured ID. `CharucoDetector` detects a full ChArUco board via `cv2.aruco.CharucoDetector.detectBoard`, returning every possible internal corner (`CharucoCorner-{id}`) followed by the board markers' corners (`ArucoMarkerCorner-{id}-{j}`), NaN where undetected.

Board geometry lives in `CharucoBoardDefinition`, squares X/Y, square length in mm, marker-length ratio, dictionary, described as the "single source of truth" used by both the detector and calibration solvers. It derives corner count (`(squares_x-1) × (squares_y-1)`) and board-frame corner positions; presets include `create_letter_size_5x3()` (54 mm squares, 8 corners) and `create_test_data_7x5()`. The `charuco` subpackage also provides `compute_board_pose()` (solvePnP board pose; needs at least 6 detected corners), `transform_to_camera_coordinates()`, and Anipose-format row export, see the ChArUco README in-repo for the multi-camera calibration walkthrough.

These detectors exist for camera calibration, not pose estimation. FreeMoCap's calibration tasks consume their observations directly (below).

## MediaPipe

Three landmarkers (Pose, Hand, Face) share one `MediaPipeSession`, each wrapping the MediaPipe Tasks API in VIDEO or IMAGE running mode. Pose model size is selectable (`MediapipePoseModelComplexity`: LITE/FULL/HEAVY, downloaded on demand). Hands return 42 named points; the face detector extracts the contour subset (names like `face_0033`) from the 478-point FaceLandmarker mesh. Because MediaPipe tracks across frames internally, the reset policy matters here: a stuck VIDEO-mode landmarker silently returning empty results is recovered by `reset_temporal_state()` after `max_consecutive_misses` misses, with exponential backoff while the subject stays out of frame.

## RTMPose + YOLOX

The top-down pairing: `YoloxPersonDetector` proposes person boxes, `RTMPoseKeypointDetector` estimates keypoints inside each crop. Both run through `OnnxSession`.

- YOLOX variants: `yolox-m` (640×640) and `yolox-tiny` (416×416); score threshold 0.7, NMS 0.45, `max_detections` default 1. The downloaded graph gets dynamic-batch surgery applied at load time.
- RTMPose whole-body variants: `rtmw-x-l_256x192` (default), `rtmw-x-l_384x288` (higher resolution), `rtmw-l-m_256x192`; SIMCC outputs decoded through letterbox metadata; confidence threshold 0.004 by default (below-threshold points become NaN with visibility 0). The RTMW models natively emit COCO-wholebody order (body, face, left hand, right hand); the detector permutes them to the schema order (body, right hand, left hand, face) defined in `rtmpose_wholebody.yaml`. A lighter `rtmpose_body` variant (`rtmpose-s/m`, 23 keypoints) also exists.
