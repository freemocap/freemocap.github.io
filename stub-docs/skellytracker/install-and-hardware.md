---
title: "Install extras and hardware"
type: reference
sidebar_position: 8
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "PyPI skellytracker (2025.10.1024) vs freemocap uv.lock (git main at 6310005), 2026-10-14. Pointed the base install at GitHub."
  - date: "2026-08-26"
    against: "pyproject.toml's [project.optional-dependencies] section, re-read directly: mediapipe, onnx, onnx-cpu (with its Apple Silicon CoreML EP comment) extras confirmed exactly as described"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# Install extras and hardware

Base install covers the OpenCV detectors. Install from GitHub (`uv add git+https://github.com/freemocap/skellytracker`) to get the code FreeMoCap uses; `pip install skellytracker` installs an older PyPI release. Detector libraries and ONNX Runtime backends come via extras: `mediapipe`; `onnx`; and mutually exclusive session backends `onnx-cpu`, `onnx-cuda` (CUDA 12 + cuDNN 9 pip wheels, no system toolkit needed), `onnx-trt` (TensorRT, engines compiled on first run), `onnx-directml` (any GPU on Windows). Bundles: `recommended-cpu`, `recommended-cuda`, and `all-*` equivalents. See the repo README and `GPU_SETUP_GUIDE.md` for details.
