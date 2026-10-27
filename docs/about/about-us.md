---
title: About FreeMoCap
type: explanation
provenance: ai-generated
reviewed: 2026-08-19
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): ImportVideosModal.tsx (sync on import, so imported videos no longer need to be pre-synchronized). Replaced a v1-style video tag that can't play a YouTube URL with a link (video confirmed via YouTube oEmbed). Rest unchanged."
  - date: "2026-08-25"
    against: "re-checked against polyrepo-clones/freemocap (v2.0.0-alpha.21): output formats (skeleton_from_mediapipe_observations.py, recording_structure.py, export_to_blender.py), single-camera and imported-video paths (posthoc_mocap_task.py, project_single_camera.py, mocap_router.py, ImportVideosModal.tsx), Discord link in README.md"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

<!-- vale Google.We = NO -->
<!-- This is the project's mission statement, a genre that naturally speaks
     as "we," the foundation and its community addressing the reader. -->

**The Free Motion Capture Project (FreeMoCap) aims to provide research-grade markerless motion capture software to everyone for free.**

We're building a user-friendly framework that connects an array of [bleeding edge](https://en.wikipedia.org/wiki/Emerging_technologies#In_the_media) open source tools from the computer vision and machine learning communities to accurately record full-body 3D movement of humans, animals, robots, and other objects.

We want to make the newly emerging, mind-boggling, future-shaping technologies that drive FreeMoCap's core capabilities accessible to communities of people who stand to benefit from them.

We follow a “Universal Design” development philosophy, with the goal of creating a system that serves the needs of a professional research scientist while remaining intuitive to a 13-year-old with no technical training and no outside assistance.

A high-quality, minimal-cost motion capture system would be a transformative tool for a wide range of communities - including 3D animators, game designers, athletes, coaches, performers, scientists, engineers, clinicians, and doctors. We hope to create a system that brings new technological capacity to these groups while also building bridges between them.

**Everyone has a reason to record human movement**

**We want to help them do it**
<!-- vale Google.We = YES -->

✨💀✨

Watch the video [*This is FreeMoCap*](https://youtu.be/WW_WpMcbzns).

This project is managed by the [FreeMoCap Foundation](https://freemocapfoundation.org)

## Software overview

FreeMoCap (free motion capture) is a [free open source ](https://www.gnu.org/philosophy/open-source-misses-the-point.en.html) markerless motion capture system designed to provide research-quality motion capture data using free software and generic, minimal-cost webcams. The data it provides can be useful for any project that would benefit from high quality 3D measurements of human movement, including scientific research, 3D animation, sports biomechanics, and more.

## Features and capabilities

FreeMoCap features a complete GUI-based interface that can create high-quality kinematic data from single cameras, multiple cameras, or imported videos. It also produces data outputs in the form of NumPy arrays, CSVs, parquet files (the primary mocap data store), and a Blender output scene. The software is designed to work with minimal-cost, low-quality USB webcams. You can also import videos recorded on other cameras, like GoPros or phones, and FreeMoCap can synchronize them for you.

## Community involvement and support

FreeMoCap has a vibrant and growing community of users and developers, including research and clinical scientists, 3D animators, video game designers, and open source software developers. Most of the community is centered around a [Discord server](https://discord.gg/nxv5dNTfKT).

Here, people can ask questions and receive support from the developers and other members of the community. Feature requests and bug reports should be submitted to the GitHub issues space.
