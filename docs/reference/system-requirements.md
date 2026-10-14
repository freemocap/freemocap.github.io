---
title: System requirements
type: reference
sidebar_position: 18
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): release asset matrix (macOS arm64, Windows x64, Linux x64; CPU and CUDA variants), freemocap-ui electron-builder.json targets, skellytracker ort_session_utils.auto_detect_provider (trt, cuda, coreml on macOS, cpu). Python/Anaconda row removed: the installer bundles Python."
  - date: "2026-08-25"
    against: "live polyrepo code: freemocap pyproject.toml requires-python (>=3.11) plus noxfile.py and test.yml matrix (3.11/3.12) and .python-version (3.12); skellytracker pyproject.toml extras and requires-python cap (<3.13); skellytracker GPU_SETUP_GUIDE.md provider/extras table; searched all clones for notebook/ipynb generation (none found) and freemocap.spec excluding notebook/IPython as unused; linked pages re-read (hardware.md, gpu-setup.md, camera-setup.md, calibration concept, faq.md)"
  - date: "2026-08-21"
    against: "this site's own hardware.md, gpu-setup.md, and camera-setup.md"
---

# System requirements

## Computer

| | Supported |
|---|---|
| Mac | Apple Silicon (M1 or newer) |
| Windows | 64-bit (x64) PC |
| Linux | 64-bit (x64) PC |

## Cameras

| Goal | Cameras |
|---|---|
| Try it out, 2D tracking | One, such as a laptop's built-in camera |
| 3D motion capture | Two or more, three recommended, plugged straight into the computer, not through a hub |

For 3D you also need a printed ChArUco calibration board. See
[calibrate your cameras](/tutorials/calibrate).

## Graphics card

Not required. FreeMoCap runs on any supported computer, and a graphics card makes tracking
faster:

| Computer | Speed-up |
|---|---|
| Mac with Apple Silicon | Used automatically |
| Windows or Linux with an NVIDIA card | Install the CUDA version of FreeMoCap |
| Anything else | None, tracking runs on the processor |

## Optional software

- [Blender](https://www.blender.org), to turn your recording into an animated 3D scene.

## Next steps

- [Install FreeMoCap](/start/install)
- [Choose and set up your cameras](/tutorials/hardware)
