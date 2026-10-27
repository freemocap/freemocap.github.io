---
title: System requirements
type: reference
sidebar_position: 18
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: this site's own hardware.md, gpu-setup.md, and camera-setup.md
draft: false
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
| Python | A recent Python, installed via a virtual environment manager (Anaconda recommended) |
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
| VS Code or JupyterLab | Working with the Jupyter notebooks generated per recording |
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
