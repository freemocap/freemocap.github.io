---
title: "Python API"
type: reference
sidebar_position: 3
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellySync source read directly (package code, README, the pyproject config, CI workflows)
draft: false
---

# Python API

Both entry points live in `skelly_synchronize/skelly_synchronize.py` and are exported from the package root:

```python
synchronize_videos_from_audio(
    raw_video_folder_path: Path,
    synchronized_video_folder_path: Optional[Path] = None,   # default: <raw parent>/synchronized_videos
    video_handler: str = "deffcode",                         # or "ffmpeg"
    create_debug_plots_bool: bool = True,
) -> Path

synchronize_videos_from_brightness(
    raw_video_folder_path: Path,
    synchronized_video_folder_path: Optional[Path] = None,
    video_handler: str = "deffcode",
    brightness_ratio_threshold: float = 1000,
    create_debug_plots_bool: bool = True,
) -> Path
```

Both return the synchronized-video folder path. The `video_handler` argument selects only the **trimming backend** (`deffcode` decodes and re-writes selected frames through OpenCV; `ffmpeg` cuts with `-ss`/`-t`; anything else raises `ValueError`), video metadata probing always goes through ffprobe regardless. Trimming runs across a `multiprocessing.Pool` capped at `min(num_videos, cpu_count - 1)`.
