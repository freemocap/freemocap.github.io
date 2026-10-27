---
title: Use YOLO cropping
type: how-to
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): tracker_factory.py (RTMPose always paired with YOLOX yolox-m; redetect every 5 s), mocap-detector-settings.tsx (no crop toggle). Intro rewritten; v1 checkbox screenshot and v1 description removed; How it works unchanged."
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 (tracker_factory.py, core/tasks/mocap/mocap_task_config.py, core/pipeline/realtime/camera_node_config.py) and skellytracker main (yolox_person_detector.py, rtmpose_wholebody_detector.py, tracker/detection_stage.py, temporal_processing_config.py)"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

When you use the **RTMPose** tracker, FreeMoCap first finds the person in each video with a
person detector (YOLOX), crops the image around them, and then tracks their joints in that crop.
This is always on with RTMPose. MediaPipe doesn't crop.

Cropping helps most when the person is small in the camera's view, for example when cameras are
far away. It also cuts down on skeletons drawn on things that aren't people. It makes processing
slower, and can add a little jitter. If the person already fills most of each camera's view and
speed matters more, MediaPipe skips this step. See [choose a tracking model](/tutorials/choose-a-tracker).

## How it works
The pose estimation models FreeMoCap uses are all set up to process a certain size of image. While you can pass any size of video into FreeMoCap, each frame (or crop) gets letterbox-resized to a fixed size before going into the model, preserving aspect ratio rather than stretching, currently 256x192 pixels for the default RTMPose whole-body model (384x288 for its higher-resolution variant) and 640x640 pixels for the YOLOX person detector itself. If the subject doesn't take up most of the image, most of those input pixels are background, which can have a negative effect on the model's processing.

Person cropping is a preprocessing stage that runs before the pose estimation. Instead of sending the entire video frame into the pose estimation model, it first runs an object detection model that looks for people. Unlike a pose estimation model that tracks joint locations, the output of the object detection model is a bounding box that shows where the person in the image is. The image is then cropped based on the bounding box and sent into the pose estimation model. This means the downsampling starts with the most relevant information, keeping as much information as possible when running the pose estimation.

The person detector doesn't run on every frame. It runs on the first frame, then on a redetection cadence (about every 5 seconds with the default settings), and sooner if a fitness check fires, for example when too many of the detected keypoints fall outside the current crop. Between detections the crop follows the person using the previous frames' keypoints instead.

Cropping is beneficial in most recording situations, but may increase jitter in some cases as the final reconstruction inherits noise from both the YOLOX crop and the keypoint detector. It's most helpful when the subject is small in a camera's field of view, or in situations where the pose estimation is returning a lot of false positives (your annotated videos have skeletons drawn not on a person). You may choose to skip person cropping when processing time is more important than tracking quality, or when the subject already fills most of the camera views. Cropping adds a second full inference pass (person detection) to the 2D Tracking stage of the pipeline, so it makes that stage slower.
