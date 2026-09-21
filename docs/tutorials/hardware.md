---
title: Choose and set up your cameras
type: tutorial
provenance: human-checked
history:
  - date: "2026-08-26"
    against: "polyrepo-clones pulled 2026-08-26: freemocap pinned at v2.0.0-alpha.21 (shared/charuco board assets, core/blender/export_to_blender.py output files, pyproject.toml, README quickstart), freemocap-docs intro.mdx and guides/camera-setup.mdx, freemocap-docs download page (src/components/download/downloads.ts), sibling pages /tutorials/calibrate, /tutorials/single-camera, /tutorials/capture-environment, /start/install, /guides/installation-troubleshooting"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
## 1. Required equipment

The absolute minimum required equipment is a computer with a single camera on it. Even a simple laptop with a built-in camera can be used to create a single-camera recording. However, single-camera recordings don't produce reliable 3D estimates, only solid two-dimensional tracking, suitable for 2D animators. A viable multi-camera recording that produces reliable estimates of 3D movement needs at least two cameras (one of which could be the laptop camera); three cameras is recommended for better results.

These cameras should be connected directly to the computer's USB ports. Each camera consumes significant USB bandwidth, so multi-camera setups work most reliably when the cameras are plugged straight into separate ports on the computer itself rather than routed through a single USB hub. For 3D reconstructions, print out a ChArUco board for the calibration process, described in greater detail in the [calibration tutorial](/tutorials/calibrate).

USB extension cables and tripods can help set up webcams in a way that gets a good recording, but these are not necessary, just convenient.

## 2. Necessary software

The FreeMoCap software includes all of the packages needed for reconstructing movement data, with the exception of Blender, free software available at [https://blender.org](https://blender.org). Blender is used at the end of the reconstruction process to create a Blender scene. If you want to look more closely at the data a recording produces, you don't need any extra software: each recording is written out as plain data files (NumPy `.npy` arrays and CSV tables) that you can explore in any Python environment or analysis tool you like. See [find your data](/tutorials/find-your-data) and [analyzing your data in Python](/tutorials/analyze-in-python).

FreeMoCap can be installed two ways: with `pip` from a terminal, or by downloading a desktop installer that bundles everything FreeMoCap needs and manages the installation for you. For the `pip` route, create a Python virtual environment first, using an environment manager like Anaconda or Miniconda. Either route gives you the same features. See the [Installation Guide](/start/install) for step-by-step instructions for both, and the [installation troubleshooting](/guides/installation-troubleshooting) page if something goes wrong.
