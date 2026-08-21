---
title: Record with multiple cameras
type: tutorial
sidebar_position: 20
provenance: ai-generated
reviewed: 2026-08-20
reviewed_against: none
draft: false
---

# Record with multiple cameras

A single camera can produce a recording, but [multiple cameras produce
better ones](/concepts/cameras-and-sync): more viewpoints mean more
information about where a joint actually sits in 3D, and a lot less
vulnerability to one camera's view getting blocked. This page covers how
many cameras to use and where to put them; for the physical setup itself
(cables, lighting, background), see
[Optimize your capture space](/tutorials/capture-environment), and for
linking your cameras into one coordinate system, see
[Calibrate your cameras](/tutorials/calibrate).

## How Many Cameras Do You Need

There's no universal answer, and published guidance disagrees: Theia3D
requires a minimum of six cameras and suggests at least eight, while
OpenCap studies have found only minimal accuracy benefit moving from two
cameras to five, and other OpenPose-based systems have found substantial
improvement from adding cameras. FreeMoCap's own validation work used six
cameras (mostly because that's how many USB ports were available on the
lab computer), but got accurate overground gait results with just three.

As a starting point: **use at least three cameras**, and add more if your
task involves a lot of self-occlusion (one body part blocking another) or
covers a wide physical area. The right number is task-dependent, not a
fixed rule.

## Positioning for a Fixed Space

If your subject stays roughly in one place (a treadmill, a chair, a small
capture volume), surround them with cameras rather than lining them up on
one side. A few things worth knowing:

- Purely front-on or purely side-on (sagittal) views tend to invite more
  occlusion and give the reconstruction less to work with; oblique angles
  between cameras generally do better.
- That said, this isn't an absolute rule. Equipment that occludes a
  front-on view (like a rowing machine) can make a purely sagittal setup
  the *better* choice for that specific task. Treat positioning guidance
  as a starting point to adjust from, not a law.
- Whatever the layout, make sure each camera shares an overlapping view
  with at least one other camera, both for reconstruction and because
  [calibration](/tutorials/calibrate) depends on cameras seeing the
  ChArUco board together.

## Positioning for a Moving Subject

Overground walking or any recording where the subject covers real
distance needs a different strategy: instead of framing the subject
tightly, cover the space they'll move through. One effective pattern uses
two cameras in portrait orientation at opposite ends of the walkway,
angled to look down its length, plus several cameras in landscape
orientation along the side for lateral coverage. Mixing portrait and
landscape orientations like this maximizes ground coverage in a way that
an all-landscape layout doesn't. The goal, wherever the subject ends up
along the path, is at least two cameras seeing them at once.

## When the "Rules" Don't Apply

Camera positioning is genuinely task-dependent, and the guidance above
comes from validated setups (treadmill gait, overground gait, a stationary
rowing machine), not from an underlying formula. Expect to iterate: record
a test clip, check whether reconstruction quality holds up across the
movement you actually care about, and adjust from there.

## Next steps

- [Optimize your capture space](/tutorials/capture-environment)
- [Calibrate your cameras](/tutorials/calibrate)
- [Get a calibration you can trust](/tutorials/better-calibration)
- [Cameras and synchronization](/concepts/cameras-and-sync)
