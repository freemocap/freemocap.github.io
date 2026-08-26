---
title: Accuracy, validity, and limits
type: explanation
sidebar_position: 11
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "current polyrepo code: freemocap v2.0.0-alpha.21 detector defaults (camera_node_config.py sets detector_type='rtmpose'; backend-mocap.mdx states RTMPose is the default skeleton detector for realtime and posthoc) and skellytracker's built-in detector registry (mediapipe, rtmpose, yolox, aruco, charuco; no ViTPose anywhere in the clone); link targets (choose-a-tracker, capture-environment, glossary, data-model, cite-freemocap) all resolve. Dissertation-sourced numbers (Qualisys reference, ICC values, mm/degree errors, ViTPose scaling bias, 30 Hz collection, DeepLabCut case, CTSIB-M first) are not verifiable locally and were left as written"
  - date: "2026-08-20"
    against: "none"
draft: false
---

# Accuracy, validity, and limits

The short answer: FreeMoCap's accuracy is not a single number. It depends
on which pose estimation backend is running, what movement is being
recorded, and how the cameras and lighting were set up. The rest of this
page is the longer, more useful answer, based on a formal validation study
that compared FreeMoCap against marker-based motion capture across gait,
balance, and prosthetic alignment.

> "The reported metrics of accuracy are not fixed properties of the
> software package or system. The reported metrics reflect what that
> system was able to achieve under the specific conditions that it was
> in."

That line, from the validation study itself, is worth internalizing before
reading the numbers below. A number like "30 mm joint trajectory error"
describes one system, one camera setup, one pose estimation backend, one
task. Change any of those and the number changes with it.

## What was validated

A six-camera FreeMoCap setup, built from six webcams costing about $20
each, was compared against a marker-based reference system (Qualisys)
across three domains: treadmill gait at increasing walking speeds, static
balance (the Modified Clinical Test of Sensory Interaction on Balance,
CTSIB-M), and gait changes from controlled alignment adjustments in a
transfemoral prosthesis user. Three pose estimation backends were compared
throughout: MediaPipe, RTMPose, and ViTPose, plus a custom-trained
DeepLabCut model for the prosthetics case.

## What the results show

**Gait.** Joint trajectory errors were generally under 30 mm and sagittal
joint angle errors under 5°, in line with ranges reported across other
markerless validation studies. The hip, usually one of the hardest joints
to track accurately, came in under 25 mm and under 4.5° of flexion/extension
error, better than the 30-50 mm and ~11° commonly reported elsewhere.
Spatiotemporal gait parameters (stride length, stride duration, and
similar) showed strong agreement with the reference; agreement was lowest
for swing-phase duration (ICC ≈ 0.90). Errors were largest during early
stance, the loading-response phase where the knee flexes quickly to absorb
impact, movement that's inherently harder for any video-based system to
track, and worth noting that even the marker-based reference isn't
perfectly clean here: soft tissue movement over bone introduces its own
error during high-impact phases.

**Balance.** This was, as far as the study's authors could determine, the
first markerless validation of the CTSIB-M. Using the MediaPipe backend,
center-of-mass path length tracked the marker-based reference closely
(ICC = 0.985) and preserved the expected progressive increase in sway
across harder balance conditions (removing visual or proprioceptive
feedback). RTMPose and ViTPose performed considerably worse on this task,
not because of a fundamental accuracy problem, but because both showed
higher frame-to-frame landmark jitter at rest, which MediaPipe's built-in
smoothing filter suppresses and the other two backends don't.

**Prosthetic alignment.** Standard, off-the-shelf pose estimation models,
trained mostly on able-bodied people, failed to reliably track a
transfemoral prosthesis user, whose limb doesn't look like what those
models were trained on. Training a custom DeepLabCut model on the
prosthetic limb substantially improved tracking, and the resulting system
correctly tracked the direction and rough magnitude of leg-length, knee and
ankle angle, and foot-progression-angle changes across alignment
adjustments, changes clinically relevant even at 5-10 mm. It did not
reliably track pelvic obliquity or minimum toe clearance. This case is the
clearest demonstration that markerless motion capture is not one fixed
accuracy level: swapping in a population-specific model changed the
outcome from "doesn't work for this person" to "works well enough to
detect real alignment changes."

## Backend choice changes the outcome

The three pose estimation backends have different failure modes, not just
different accuracy levels:

- **MediaPipe** (runs without a GPU; FreeMoCap's current V2 pipeline
  defaults to RTMPose instead) applies temporal
  smoothing that introduces slight lag during fast movements, visible as
  speed-dependent deviations in gait kinematics, but that same smoothing
  is what made it the only backend sensitive enough for the balance study.
- **RTMPose** was the most consistent backend across the gait study, with
  the lowest ankle-kinematics error, and showed none of MediaPipe's
  speed-dependent artifacts.
- **ViTPose** showed a small, systematic scaling bias (about 2-4% larger
  than the reference, concentrated in the vertical axis), plausibly a
  consequence of its vision-transformer architecture lacking the spatial
  assumptions built into MediaPipe's and RTMPose's CNN-based models,
  though that explanation hasn't been confirmed. It is also not one of
  SkellyTracker's built-in detectors (MediaPipe, RTMPose, YOLOX, ArUco,
  and ChArUco), so running it today means integrating it yourself.

None of these is strictly "more accurate" than the others. Which one to
use depends on the task; see
[choosing a tracking model](/tutorials/choose-a-tracker).

## Known limitations

- **Temporal resolution.** Validation data was collected at 30 Hz, which
  limits timing measurements to roughly 33 ms increments. Fine-grained
  timing differences may not be visible at this sampling rate.
- **Accuracy is downstream of pose estimation.** FreeMoCap's 3D
  reconstruction is only as good as the 2D keypoints it's given. Occlusion,
  unusual body shapes, or a pose estimation model that struggles with a
  particular population will degrade results no matter how good the
  camera setup is.
- **Validated conditions are specific.** These results come from treadmill
  gait, static (not dynamic) balance, and one prosthesis user. They don't
  guarantee the same accuracy for, say, overground sprinting, a sport-specific
  movement, or a different assistive device. Broader validation across
  more populations and movement types is ongoing work for the field, not
  something this system has already covered.
- **Capture conditions matter.** Camera count, placement, lighting, and
  occlusion all directly affect reconstruction quality. See
  [optimize your capture space](/tutorials/capture-environment) before
  assuming a result you got doesn't match what's described here.

## Where this leaves you

FreeMoCap is not a replacement for marker-based motion capture, which
remains the gold standard for precision. What the validation work shows is
that a low-cost, open-source, markerless system can get close enough to be
useful for real biomechanical questions, provided you understand which
backend you're using and what it's actually been validated on. Treat this
page as a starting point for what to expect, and the
[glossary](/concepts/glossary) and [data model](/concepts/data-model) pages
as where to go to understand exactly what numbers you're getting back.

---

Source: Cherian, A. *Open-Source Development and Validation of a Low-Cost
Markerless System for Quantitative Motion Analysis.* PhD dissertation,
Northeastern University, Department of Bioengineering, 2026. Citation
link pending publication in Northeastern's institutional repository; see
[cite FreeMoCap](/guides/cite-freemocap) for the software citation in the
meantime.
