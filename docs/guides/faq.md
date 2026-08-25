---
title: Frequently asked questions
type: reference
sidebar_position: 16
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: research/github-discussions-qa-raw.md (FreeMoCap/FreeMoCap Discussions Q&A) cross-checked against FreeMoCap and SkellyTracker source, main branches
draft: false
---

# Frequently asked questions

These answers started from real questions and answers in the
FreeMoCap/FreeMoCap GitHub Discussions Q&A category, a stand-in for the
Discord `#help-requests` export that hasn't happened yet. Answers that
described the old pre-alpha release were checked against the current
source and corrected or dropped where they were stale.

## Can FreeMoCap capture more than one person at a time?

Not end to end, not yet. The reconstruction pipeline is single-person:
it triangulates one skeleton across all cameras.

There is real multi-person machinery in [SkellyTracker](/concepts/tracking):
a `MultiPersonTracker` assigns stable track IDs to multiple people in a
single camera's stream using IoU and keypoint-distance association. But its
own design docs list the remaining gaps, and they're the ones that matter
for full capture: no combination of multi-person tracking with
multi-camera batched inference yet, no cross-camera person correspondence
(matching person A in camera 0 to person A in camera 1, which
triangulation needs), and no re-identification when someone leaves frame
and comes back. MediaPipe's frame-to-frame tracking also doesn't behave
correctly per-track yet, RTMPose is the intended backend for multi-person
mode.

The old Discussions-era workaround, masking off each person in a video
editor and processing them as separate recordings, still works if you need
two people today.

## Does FreeMoCap run in realtime?

Yes, in the current build. Older answers here (and elsewhere) said no, and
they were true of the pre-alpha release, but V2 has a realtime pipeline:
per-camera nodes run pose estimation as each synchronized frame arrives,
an aggregation node triangulates and filters every frame, and an optional
centralized GPU inference node serves all cameras with batched ONNX
inference. Calibration reloads live from disk, so a fresh calibration is
picked up without restarting. See
[process a recording after the fact](/guides/posthoc-mocap) for the
non-realtime path, which remains useful for reprocessing.

It's still alpha software: expect rough edges, especially around
throughput with many cameras.

## How many cameras can I plug in? Do USB hubs work?

See [connect and configure cameras](/guides/camera-setup), which covers
this properly. The short version: USB bandwidth, not software, is usually
the limit. Plug cameras into separate controllers rather than one hub,
prefer USB 3.0, and drop resolution per camera if you need more of them.
Mixed results with hubs were reported even back in the Discussions era,
which matches the current guidance to connect directly where possible.

For what a setup needs at minimum, see
[system requirements](/reference/system-requirements).

## What size should I print the ChArUco board?

Any physical size works as long as the board shows up clearly in your
cameras' views. People have succeeded with plain letter-size prints;
bigger boards are easier to detect at distance, smaller boards mean
holding them closer to the cameras during calibration. Whatever you print,
mount it on something rigid, see
[fix a calibration problem](/guides/calibration-troubleshooting).

The part that does have to be exact is the geometry the software expects.
The default board definition in the current source is 5 squares wide by 3
tall, with 54 mm squares and ArUco markers sized at 0.8 of a square, using
the `DICT_4X4_250` dictionary, and it's configurable if your printed board
differs. If you print at a nonstandard size, make the configured square
length match your measured square width in millimetres, that measurement
is what puts your reconstructed data into correct real-world units (see
[coordinate systems and units](/concepts/coordinate-systems)).

## Do black-and-white or infrared cameras work?

Untested, and there's nothing in the current source that handles or blocks
them explicitly. Frames flow through OpenCV as ordinary images, so a
monochrome camera that OpenCV can open technically records. The open
question is whether the pose estimation models track well on
grayscale-looking input, and nobody has published a verified answer for
this project. If you try it, check the live tracking view early: if your
skeleton appears reliably in every camera, you're fine.

## Can I export to glTF or GLB?

Not currently. Despite references elsewhere, glTF isn't implemented in the
current build, only FBX and BVH, see
[export to FBX and BVH](/guides/export-formats). If you need glTF
specifically, that's worth raising as a feature request rather than
assuming it's undocumented, see [request a feature](/guides/request-a-feature).

## Which Blender versions are supported?

The Blender addon repository doesn't pin a minimum Blender version
anywhere we could find, so there's no authoritative compatibility list to
quote. Install a current Blender from
[`blender.org`](https://www.blender.org); if the addon fails to load or run
on an old version, updating Blender is the first thing to try. For what
the export step produces and common failures, see
[export to Blender](/guides/blender-export).

## Can I use cameras that aren't connected to the same computer, like GoPros or phones?

Yes, through post-hoc processing: record however you like, synchronize the
videos yourself (audio sync works well when every camera records sound, or
a camera flash at the start gives you a visual sync point), then place
them in a recording folder's `synchronized_videos/` directory and process
after the fact. The workflow is covered step by step in
[process a recording after the fact](/guides/posthoc-mocap), and the
synchronization options are explained in
[cameras and synchronization](/concepts/cameras-and-sync).

## My installation fails / my recording is empty

Start with [fix an installation problem](/guides/installation-troubleshooting).
Some old Discussion threads recommend fixes tied to files and dependencies
that don't exist in V2 (editing long-gone scripts, downgrading protobuf),
don't follow those on a current install. If the problem is calibration
rather than installation, see
[fix a calibration problem](/guides/calibration-troubleshooting). When
neither page helps, [report a bug](/guides/report-a-bug) or ask in the
project Discord.

## Is FreeMoCap accurate enough for real research?

That deserves more than an FAQ answer, see
[accuracy, validity, and limits](/concepts/accuracy-and-limits), which
summarizes a formal validation study against marker-based motion capture.
The honest headline: joint trajectory errors were generally under 30 mm
for gait in the validated conditions, accuracy depends heavily on the pose
estimation backend and your capture conditions, and the validated
conditions don't cover everything.
