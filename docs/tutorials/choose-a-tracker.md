---
title: Choose a tracking model
type: tutorial
sidebar_position: 32
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): mocap_task_config.py and mocap-slice.ts (detector rtmpose default; rtmpose 'more accurate', mediapipe 'faster, CPU-friendly'), mocap-detector-settings.tsx (RTMPose/MediaPipe only; Default/High Res/Fast and Heavy/Full/Lite), BlenderSection.tsx (MediaPipe-only export). The old page said MediaPipe was the default and listed trackers the app doesn't offer. Validation findings carried over from /concepts/accuracy-and-limits."
  - date: "2026-08-26"
    against: "skellytracker/core/detectors/detector_base_classes.py (confirmed a real, current extensible detector interface exists) and skellyforge/pipelines/dlc_pipeline.py (confirmed dead code, broken imports, already tracked in CODE-BUGS-FOUND.md)"
  - date: "2026-08-20"
    against: "none"
draft: false
---

import detector_choice_mediapipe from './img/detector-choice-mediapipe.webp';
import detector_choice from './img/detector-choice.webp';

# Choose a tracking model

The tracker finds your body's joints in each video frame. FreeMoCap offers two. Choose one under
**Mocap Settings > Detector**.

| | RTMPose (default) | MediaPipe |
|---|---|---|
| Accuracy | Higher | Lower |
| Speed | Slower, much faster with a GPU | Faster, runs well on any processor |
| Blender export | Not yet | Yes |
| Options | **Default**, **High Res**, or **Fast** model | **Heavy**, **Full**, or **Lite** model |

**Use RTMPose** for the most accurate data, unless you need Blender.

**Use MediaPipe** if you want a Blender scene, or if processing is too slow on your computer.

<Screenshot src={detector_choice} width={480} alt="The Detector settings in Mocap Settings with RTMPose selected, showing the Default, High Res and Fast model options and a confidence threshold" caption="With RTMPose selected, choose a Default, High Res or Fast model." version="2.0.0-alpha.25" />

<Screenshot src={detector_choice_mediapipe} width={480} alt="The Detector settings in Mocap Settings with MediaPipe selected, showing the Heavy, Full and Lite pose model sizes and three confidence settings" caption="With MediaPipe selected, choose a Heavy, Full or Lite pose model." version="2.0.0-alpha.25" />

## Matching the tracker to your task

From FreeMoCap's validation studies (details in
[accuracy, validity, and limits](/concepts/accuracy-and-limits)):

- **Walking and gait:** RTMPose was the most consistent.
- **Balance and standing still:** MediaPipe's built-in smoothing made it better at picking up
  small amounts of sway.
- **Fast movements:** MediaPipe's smoothing can make it lag behind quick motion, so prefer RTMPose.

## When neither tracker works

Standard trackers can fail on bodies they weren't trained on, such as a person with a prosthetic
limb. A custom-trained model can work in these cases; see
[image tracking and pose models](/concepts/tracking).

## Next steps

- [Set up GPU acceleration](/guides/gpu-setup)
- [Image tracking and pose models](/concepts/tracking)
