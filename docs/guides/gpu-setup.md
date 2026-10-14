---
title: Set up GPU acceleration
type: how-to
sidebar_position: 10
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): release assets (CUDA builds for Windows/Linux, CPU for macOS), pyproject.toml tracker-default/cuda/cpu groups, skellytracker ort_session_utils.auto_detect_provider (coreml auto on macOS). Rewritten for installer users."
  - date: "2026-08-25"
    against: "install extras re-checked against skellytracker pyproject.toml (main); provider auto-detect order and execution provider names against ort_session_utils.py; TRT engine cache path and first-run compile time against ort_session_utils.py; OOM recovery against freemocap realtime_skeleton_inference_node.py (v2.0.0-alpha.21); startup provider logging against freemocap app/app.py; both cited sources re-read (skellytracker GPU_SETUP_GUIDE.md, freemocap-docs gpu-setup.mdx)"
  - date: "2026-08-21"
    against: "freemocap-docs guides/gpu-setup.mdx and skellytracker's GPU_SETUP_GUIDE.md (v2.0.0-alpha.21 / skellytracker main, not yet re-checked against the running app)"
draft: false
---

# Set up GPU acceleration

A graphics card (GPU) makes pose tracking faster, especially with several cameras. It's
optional: without one, FreeMoCap uses the processor.

## Mac

Nothing to do. On Apple Silicon Macs, FreeMoCap uses the built-in GPU automatically.

## Windows and Linux with an NVIDIA card

1. Install the **CUDA version** of FreeMoCap from the
   [download page](https://freemocap.org/download).
2. Make sure your NVIDIA driver is up to date. Get the latest from
   [nvidia.com/drivers](https://www.nvidia.com/drivers).

You don't need to install anything else from NVIDIA.

## Other graphics cards

FreeMoCap doesn't use AMD or Intel graphics cards yet. Use the CPU version.

## When running from source

`uv sync` installs GPU support automatically: CUDA on Windows and Linux, and Apple's GPU support
on Mac. To check which one is active, run:

```bash
uv run python -c "import onnxruntime as ort; print(ort.get_available_providers())"
```

`CUDAExecutionProvider` means NVIDIA is working, and `CoreMLExecutionProvider` means the Mac GPU
is working.

## Next steps

- [Choose a tracking model](/tutorials/choose-a-tracker)
