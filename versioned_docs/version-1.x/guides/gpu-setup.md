---
title: Set up GPU acceleration
type: how-to
sidebar_position: 10
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: freemocap-docs guides/gpu-setup.mdx and skellytracker's GPU_SETUP_GUIDE.md (v2.0.0-alpha.21 / skellytracker main, not yet re-checked against the running app)
draft: false
---

# Set up GPU acceleration

GPU acceleration speeds up pose detection significantly, especially with
several cameras running RTMPose at once. It's optional: FreeMoCap falls
back to CPU automatically if no supported GPU is found, but the
difference in throughput on a multi-camera realtime recording is real.

## Which install to use

| Your GPU | Your OS | Install | Provider |
|---|---|---|---|
| NVIDIA | Windows or Linux | `pip install skellytracker[all-cuda]` | CUDA (auto-detected) |
| NVIDIA, fastest option | Windows or Linux | `pip install skellytracker[all-trt]` | TensorRT (auto-detected) |
| Apple Silicon (M1/M2/M3/M4) | macOS | `pip install skellytracker[all-cpu]` | CoreML (auto-detected) |
| AMD, Intel, or any GPU | Windows | `pip install skellytracker[all-directml]` | DirectML (**must be set explicitly**, not auto-detected) |
| No dedicated GPU | Any | `pip install skellytracker[all-cpu]` | CPU |

For CUDA and TensorRT, the pip package bundles the CUDA and cuDNN
runtime libraries. **You don't need to separately install the CUDA
Toolkit.** You do need a recent NVIDIA driver, check it with
`nvidia-smi`.

If you're running the bundled release rather than installing from
source, this is already handled for you, GPU setup is only something you
need to think about for a development install.

## Verify it worked

```python
import onnxruntime as ort
print(ort.get_available_providers())
```

Look for `CUDAExecutionProvider`, `TensorrtExecutionProvider`,
`CoreMLExecutionProvider`, or `DmlExecutionProvider` depending on which
you installed. FreeMoCap also logs which provider it picked at startup,
worth checking if inference seems slower than expected.

## TensorRT's first run is slow, and that's normal

TensorRT compiles and caches engine files the first time you run
inference, 1 to 5 minutes depending on the model and GPU. Every run
after that loads the cached engine and starts fast. If it seems to hang
indefinitely rather than just taking a few minutes, that's the actual
problem, not the normal first-run compile. Engines are cached in
`~/.cache/skellytracker/trt_engines/`, delete that directory to force a
recompile after a hardware change.

## Troubleshooting

**`nvidia-smi` isn't found.** Install or update your NVIDIA driver,
[nvidia.com/drivers](https://www.nvidia.com/download/index.aspx) on
Windows, `sudo apt install nvidia-driver-560` (or the current version)
on Ubuntu.

**`CUDAExecutionProvider` doesn't show up.** Check the CUDA version
`nvidia-smi` reports in the top-right corner. Below 12.x means an
outdated driver, no toolkit install needed since the runtime is bundled.

**Conflicting `onnxruntime` packages.** The CPU, CUDA, and DirectML
builds all use the same import name and can't coexist. If you're
switching install extras, uninstall the old one first:

```bash
pip uninstall onnxruntime onnxruntime-gpu onnxruntime-directml
pip install skellytracker[all-cuda]  # or whichever extra you actually want
```

**GPU out-of-memory with many cameras.** Reduce resolution, or use fewer
cameras per GPU, or fall back to CPU for that setup. FreeMoCap recovers
from a GPU out-of-memory error on its own (it rebuilds the session and
skips the affected frame) but that's a symptom to fix, not something to
just let happen repeatedly.

## Next steps

- [Choose a tracking model](/tutorials/choose-a-tracker)
- [Image tracking and pose models](/concepts/tracking)
