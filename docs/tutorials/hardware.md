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
## 1. Required Equipment

The absolute minimum required equipment is a computer with a single camera on it. Even a simple laptop with a built-in camera can be used to create a single-camera recording. However, single-camera recordings will not produce reliable 3D estimates but will produce solid two-dimensional tracking, suitable for 2D animators. To get a viable multi-camera recording that will produce reliable estimates of 3D movement, users will need at least two cameras (one of which could be the laptop camera), however we recommend using three cameras for better results.

These cameras should be connected directly to the computer's USB ports. Each camera consumes significant USB bandwidth, so multi-camera setups work most reliably when the cameras are plugged straight into separate ports on the computer itself rather than routed through a single USB hub. For 3D reconstructions, users will also need to print out a ChArUco board for the calibration process, which will be described in greater detail in the [calibration tutorial](/tutorials/calibrate).

You might find it helpful to have USB extension cables and tripods to set up their webcams in a way that will allow them to get a good recording, but these are not necessary, just convenient.

## 2. Necessary Software

All of the packages needed for reconstructing movement data are included in the FreeMoCap software, with the exception of Blender, which is a free software that we recommend downloading from [https://blender.org](https://blender.org). Blender will be used at the end of the reconstruction process to create a Blender scene. If you want to look more closely at the data a recording produces, you don't need any extra software: each recording is written out as plain data files (NumPy `.npy` arrays and CSV tables) that you can explore in any Python environment or analysis tool you like. See [find your data](/tutorials/find-your-data) and [analyzing your data in Python](/tutorials/analyze-in-python).

FreeMoCap can be installed two ways: with `pip` from a terminal, or by downloading a desktop installer that bundles everything FreeMoCap needs and manages the installation for you. For the `pip` route, we recommend creating a Python virtual environment first, using an environment manager like Anaconda or Miniconda. Either route gives you the same features. See the [Installation Guide](/start/install) for step-by-step instructions for both, and the [installation troubleshooting](/guides/installation-troubleshooting) page if something goes wrong.
