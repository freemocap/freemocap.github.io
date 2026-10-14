---
title: Frequently asked questions
type: reference
sidebar_position: 16
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): en-english.json tour text (realtime lightning toggle; recordings keep full frame rate), ImportVideosModal.tsx (Audio and Brightness flash sync), blender_export_config.py (FBX/BVH only), freemocap_blender_addon bl_info (Blender 3.0 minimum), alpha.23 release notes (Blender 5 compatible). Rewritten without the Discussions-era history; multi-person internals trimmed; accuracy figure carried over from /concepts/accuracy-and-limits."
  - date: "2026-08-25"
    against: "live polyrepo code: freemocap v2.0.0-alpha.21 realtime pipeline (realtime_aggregator_node.py, realtime_skeleton_inference_node.py, realtime_pipeline_config.py, camera_node_config.py), skellytracker MultiPersonTracker plus its 12-multi-person-tracking design doc, charuco_board_definition.py, freemocap_blender_addon __init__.py bl_info, skellysync README, absence of glTF/grayscale handling in cloned source, and this site's linked pages"
  - date: "2026-08-24"
    against: "research/github-discussions-qa-raw.md (FreeMoCap/FreeMoCap Discussions Q&A) cross-checked against FreeMoCap and SkellyTracker source, main branches"
draft: false
---

# Frequently asked questions

<!-- vale Google.FirstPerson = NO -->
<!-- Questions posed as "Can I..." are how a reader would actually ask them;
     this is the FAQ genre exception, same as docs/about/faq.md. -->

## Can FreeMoCap capture more than one person at a time?

Not yet. FreeMoCap tracks one person per recording. If you need two people today, you can mask each
person out in a video editor and process them as separate recordings.

## Does FreeMoCap work in realtime?

Yes. While cameras are streaming, FreeMoCap can track, triangulate, and display a 3D skeleton
live. Turn the live pipeline on with the lightning toggle. Recordings are always saved at the full
frame rate, even if the live view can't keep up, and you get the most accurate data by processing
the recording afterwards.

## How many cameras can I use? Do USB hubs work?

USB bandwidth is usually the limit. Plug cameras straight into the computer, spread them across
USB controllers, and lower the resolution if you need more of them. See
[connect and configure cameras](/guides/camera-setup).

## What size should I print the ChArUco board?

Any size works if the cameras can see it clearly. Bigger boards are easier to see from far away.
Mount it on something rigid, and enter the measured square length in the calibration settings.
See [calibrate your cameras](/tutorials/calibrate).

## Do black-and-white or infrared cameras work?

Untested. If the camera works with FreeMoCap, check the live tracking view early: if the skeleton
shows up reliably in every camera, you're fine.

## Can I export to glTF or GLB?

No. FreeMoCap exports FBX and BVH files. See [export to FBX and BVH](/guides/export-formats). To ask for glTF,
[request a feature](/guides/request-a-feature).

## Which Blender versions work?

Use a current version of [Blender](https://www.blender.org). Blender 5 is supported, and the
FreeMoCap add-on needs at least Blender 3.0.

## Can I use GoPros, phones, or other cameras that aren't connected to my computer?

Yes. Record with them however you like, then bring the videos in with **Playback > Import Videos**.
FreeMoCap can line them up using their audio, or a light flash that every camera saw. See
[process a recording after the fact](/guides/posthoc-mocap).

## My installation fails, or my recording is empty

See [fix an installation problem](/guides/installation-troubleshooting) or
[fix a calibration problem](/guides/calibration-troubleshooting). If neither helps,
[report a bug](/guides/report-a-bug) or ask on Discord.

## Is FreeMoCap accurate enough for research?

In FreeMoCap's validation against marker-based motion capture, joint position errors were
generally under 30 mm for walking. Accuracy depends on the tracker and your setup. See
[accuracy, validity, and limits](/concepts/accuracy-and-limits).
<!-- vale Google.FirstPerson = YES -->
