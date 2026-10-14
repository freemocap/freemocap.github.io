---
title: "Install and run"
type: reference
sidebar_position: 2
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "philip/rewrite README checked 2026-10-14. Added a note that this page covers main and FreeMoCap uses the rewrite."
  - date: "2026-08-26"
    against: "SkellySync main: __main__.py, gui/skelly_synchronize_gui.py, skelly_synchronize.py, core_processes (ffmpeg_functions.py, correlation_functions.py, audio_utilities.py, video_utilities.py), system/file_extensions.py, utils/get_video_files.py, pyproject.toml, README.md, CI workflows"
  - date: "2026-08-24"
    against: "SkellySync source read directly (package code, README, the pyproject config, CI workflows)"
---

# Install and run

:::note This page describes the `main` branch
FreeMoCap uses the rewrite on the [`philip/rewrite` branch](https://github.com/freemocap/skellysync/tree/philip/rewrite), which replaces the PySide6 GUI with a CLI, a FastAPI server (`skelly-sync-api`, installed with `pip install -e ".[api]"`) and a React web UI. See that branch's README for its install steps.
:::

```bash
pip install skelly_synchronize
python -m skelly_synchronize
```

There is also a console-script entry point (`skelly_synchronize = "skelly_synchronize.__main__:run"`). The `argparse` setup in `__main__.py` currently defines no options; launching it opens the PySide6 GUI. The README warns that the window may appear frozen while work is happening, progress is reported on the terminal instead.

SkellySync shells out to **FFmpeg** (`ffmpeg` and `ffprobe`) for probing, audio extraction, trimming, framerate normalization, and audio remuxing; `check_for_ffmpeg()` and `check_for_ffprobe()` raise `FileNotFoundError` if the corresponding binary is missing from `PATH`, so install FFmpeg separately if you don't have it. Supported input containers are `mp4`, `mkv`, `avi`, `mpeg`, and `mov` (matched case-insensitively). Requires `Python >=3.9,<3.13`.

## GUI workflow

The `MainWindow` (in `gui/skelly_synchronize_gui.py`) offers three controls:

1. **Load folder of raw videos**, a directory picker; both sync buttons enable once a folder is chosen.
2. **Synchronize videos with Audio Cross Correlation**, calls `synchronize_videos_from_audio()`.
3. **Synchronize videos with First Brightness Change**, calls `synchronize_videos_from_brightness()` with the value of a **Brightness ratio threshold** text field (default `1000`, validated to accept numbers >= 1).

Videos must overlap in time to be synchronizable. For audio sync, every video needs an audio track, extraction fails loudly otherwise (`FileNotFoundError` if the extracted audio file never appears). Distinct sounds like a clap improve results. For brightness sync, all cameras need to see a quick brightness increase near the start (a flash or a light switching on works better than curtains opening), and you may need to retry with different thresholds.
