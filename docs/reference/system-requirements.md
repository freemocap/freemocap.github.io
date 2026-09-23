---
title: System requirements
type: reference
sidebar_position: 18
provenance: ai-generated
draft: false
history:
  - date: "2026-08-25"
    against: "live polyrepo code: freemocap pyproject.toml requires-python (>=3.11) plus noxfile.py and test.yml matrix (3.11/3.12) and .python-version (3.12); skellytracker pyproject.toml extras and requires-python cap (<3.13); skellytracker GPU_SETUP_GUIDE.md provider/extras table; searched all clones for notebook/ipynb generation (none found) and freemocap.spec excluding notebook/IPython as unused; linked pages re-read (hardware.md, gpu-setup.md, camera-setup.md, calibration concept, faq.md)"
  - date: "2026-08-21"
    against: "this site's own hardware.md, gpu-setup.md, and camera-setup.md"
---

# System requirements

For the fuller explanation of why these matter, see
[choose and set up your cameras](/tutorials/hardware) and
[set up GPU acceleration](/guides/gpu-setup). This page is the terse
version.

## Minimum

| Requirement | Detail |
|---|---|
| Camera | One, even a laptop's built-in camera. Gives 2D tracking only, not reliable 3D. |
| Python | 3.11 or 3.12, inside a virtual environment manager (Anaconda recommended; source installs require uv) |
| OS | Windows, macOS, or Linux |
| GPU | None required, CPU inference works everywhere |

## For reliable 3D data

| Requirement | Detail |
|---|---|
| Cameras | 2 minimum, 3+ recommended, connected directly to USB ports (not through a hub) |
| Calibration board | A printed ChArUco board, see [why calibration matters](/concepts/calibration) |

## Optional

| Software | For |
|---|---|
| [Blender](https://www.blender.org) | Generating an animated 3D scene from your recording |
| VS Code or JupyterLab | Analyzing your recording's output data in Python (parquet and `.npy` files) |
| A supported GPU | Faster pose estimation, see [set up GPU acceleration](/guides/gpu-setup) for which install to use |

## GPU support by platform

| Platform | GPU | What you get |
|---|---|---|
| Windows / Linux | NVIDIA | CUDA, or TensorRT for the fastest option |
| Windows | AMD, Intel, or any DirectX 12 GPU | DirectML |
| macOS | Apple Silicon (M1 and newer) | CoreML, automatic |
| Any | None | CPU fallback, always available |

## Next steps

- [Choose and set up your cameras](/tutorials/hardware)
- [Connect and configure cameras](/guides/camera-setup)
- [Set up GPU acceleration](/guides/gpu-setup)
