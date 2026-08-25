---
title: "Install extras and hardware"
type: reference
sidebar_position: 8
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone
draft: false
---

# Install extras and hardware

Base install (`pip install skellytracker`) covers the OpenCV detectors. Detector libraries and ONNX Runtime backends come via extras: `mediapipe`; `onnx`; and mutually exclusive session backends `onnx-cpu`, `onnx-cuda` (CUDA 12 + cuDNN 9 pip wheels, no system toolkit needed), `onnx-trt` (TensorRT, engines compiled on first run), `onnx-directml` (any GPU on Windows). Bundles: `recommended-cpu`, `recommended-cuda`, and `all-*` equivalents. See the repo README and `GPU_SETUP_GUIDE.md` for details.
