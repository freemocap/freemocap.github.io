---
title: Choose a tracking model
type: tutorial
sidebar_position: 32
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# Choose a tracking model

FreeMoCap can run on several different pose estimation backends without
changing anything else in your pipeline (see
[SkellyTracker](/concepts/tracking) for how that swapping works). This
page is about which one to actually reach for.

## If You're Not Sure, Start With MediaPipe

MediaPipe is the default for a reason: it's free, runs on a CPU with no
GPU required, and is simple to install and call from Python. Unless you
have a specific reason to switch, it's the right starting point.

## Match the Backend to Your Task

The full comparative results are in
[Accuracy, validity, and limits](/concepts/accuracy-and-limits); the short
version, by task:

- **Gait.** RTMPose was the most consistent backend in FreeMoCap's
  validation study, with the lowest ankle-kinematics error and none of
  MediaPipe's speed-dependent lag.
- **Balance, or anything close to static.** MediaPipe's built-in temporal
  smoothing, a liability for fast movement, is what made it the only
  backend sensitive enough to detect the expected changes in postural
  sway. RTMPose and ViTPose showed more frame-to-frame jitter at rest.
- **Fast or ballistic movement.** Be aware of MediaPipe's smoothing-driven
  lag and ViTPose's small systematic scaling bias (2 to 4 percent,
  concentrated in the vertical axis) before relying on either for
  precise timing.
- **A population or body type standard models weren't trained on.**
  General-purpose backends can fail outright, as they did tracking a
  transfemoral prosthesis in FreeMoCap's own validation work. A
  custom-trained model may be the only option that works; see below.

## When the Built-In Options Aren't Enough

If none of the standard backends track your subject reliably, SkellyTracker's
standardized interface means a custom-trained model (DeepLabCut, for
example) can be integrated without rewriting the rest of the pipeline.
That's exactly what FreeMoCap's prosthetics validation case required:
off-the-shelf models, trained mostly on able-bodied people, didn't
generalize to a prosthetic limb, and a custom-trained model did. See
[Image tracking and pose models](/concepts/tracking) for how that
integration works.

## Next steps

- [Image tracking and pose models](/concepts/tracking)
- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
- [The FreeMoCap output data model](/concepts/data-model)
