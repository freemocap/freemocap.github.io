---
title: Choose and set up your cameras
type: tutorial
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): recording_structure.py output layout (parquet data store); installer-based install. Software section rewritten to drop the pip/Anaconda route."
  - date: "2026-08-26"
    against: "polyrepo-clones pulled 2026-08-26: freemocap pinned at v2.0.0-alpha.21 (shared/charuco board assets, core/blender/export_to_blender.py output files, pyproject.toml, README quickstart), freemocap-docs intro.mdx and guides/camera-setup.mdx, freemocap-docs download page (src/components/download/downloads.ts), sibling pages /tutorials/calibrate, /tutorials/single-camera, /tutorials/capture-environment, /start/install, /guides/installation-troubleshooting"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

## 1. Cameras and equipment

You need a computer and at least one camera. A laptop's built-in camera is enough to try
FreeMoCap, but one camera only gives you 2D tracking. For 3D motion capture you need at least two
cameras, and three gives better results.

Plug each camera straight into its own USB port on the computer, not through a hub. Cameras use a
lot of USB bandwidth, and sharing a hub causes dropped frames.

For 3D, print a ChArUco board for calibration. See the [calibration tutorial](/tutorials/calibrate).

USB extension cables and tripods make it easier to place your cameras, but you don't have to have
them.

## 2. Software

[Install FreeMoCap](/start/install). It includes everything needed to record and process motion
capture.

To turn recordings into animated 3D scenes, also install [Blender](https://blender.org), which is
free.

FreeMoCap saves each recording's data as ordinary files you can open in Python or other analysis
tools. See [find your data](/tutorials/find-your-data) and
[analyze your data in Python](/tutorials/analyze-in-python).
