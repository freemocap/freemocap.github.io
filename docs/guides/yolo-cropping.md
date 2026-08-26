---
title: Use YOLO cropping
type: how-to
provenance: human-checked
history:
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 (tracker_factory.py, core/tasks/mocap/mocap_task_config.py, core/pipeline/realtime/camera_node_config.py) and skellytracker main (yolox_person_detector.py, rtmpose_wholebody_detector.py, tracker/detection_stage.py, temporal_processing_config.py)"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
YOLO cropping is a processing option for recording situations where the subject is relatively small inside the image. It passes each video frame through the YOLOX object detection model to find the most likely area of the person in the frame, and then passes this cropped region of interest to the pose estimation model. This can help reduce false positives during pose estimation and aid tracking subjects that are relatively small in the cameras field of view. This increases processing time, and may reduce processing quality for standard recordings. It should only be used when cameras need to be placed far from a subject.

In FreeMoCap V1 this was a per-recording option you could turn on and off in the "Process Data" tab with the checkbox "Use YOLO Crop Method", off by default:

![Detail of YOLO Crop Checkbox](/img/v1/YOLO_crop_detail.png)

The screenshot above is from the V1 interface. In the current V2 alpha there is no such checkbox: when the RTMPose detector is selected, YOLOX person cropping is always enabled, it is built into how RTMPose tracking is configured, and when the MediaPipe detector is selected no person cropping happens at all. The guidance below about when cropping helps is what should drive your choice of detector.

## How it Works
The pose estimation models FreeMoCap uses are all set up to process a certain size of image. While you can pass any size of video into FreeMoCap, each frame (or crop) gets letterbox-resized to a fixed size before going into the model, preserving aspect ratio rather than stretching, currently 256x192 pixels for the default RTMPose whole-body model (384x288 for its higher-resolution variant) and 640x640 pixels for the YOLOX person detector itself. If the subject doesn't take up most of the image, most of those input pixels are background, which can have a negative effect on the model's processing.

Person cropping is a preprocessing stage that runs before the pose estimation. Instead of sending the entire video frame into the pose estimation model, it first runs an object detection model that looks for people. Unlike a pose estimation model that tracks joint locations, the output of the object detection model is a bounding box that shows where the person in the image is. We then crop the image based on the bounding box and send the cropped image into the pose estimation model. This means we start the downsampling with the most relevant information, and are able to keep as much information as possible when running the pose estimation.

In the current V2 implementation the YOLOX detector does not run on every frame. It runs on the first frame, then on a redetection cadence (about every 5 seconds with the default settings), and sooner if a fitness check fires, for example when too many of the detected keypoints fall outside the current crop. Between detections the crop follows the person using the previous frames' keypoints instead.

Cropping is beneficial in most recording situations, but may increase jitter in some cases as the final reconstruction inherits noise from both the YOLOX crop and the keypoint detector. It will be most helpful when the subject is small in a camera's field of view, or in situations where the pose estimation is returning a lot of false positives (your annotated videos will have skeletons drawn not on a person). You may choose to skip person cropping when processing time is more important than tracking quality, or when the subject already fills most of the camera views. Cropping adds a second full inference pass (person detection) to the 2D Tracking stage of the pipeline, so it makes that stage slower.
