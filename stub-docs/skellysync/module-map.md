---
title: "Module map"
type: reference
sidebar_position: 6
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "full recursive find across core_processes/, gui/, system/, utils/: every path in the table confirmed to exist exactly as listed, including core_processes/debugging/ and core_processes/video_functions/ subfolders and gui/widgets/run_button_widget.py; confirmed run_button_widget.py is not referenced anywhere else in the repo and pyproject.toml has no SkellyLogs dependency"
  - date: "2026-08-24"
    against: "SkellySync source read directly (package code, README, the pyproject config, CI workflows)"
draft: false
---

# Module map

| Path | Contents |
|---|---|
| `skelly_synchronize/__init__.py` | Exports the two sync functions plus the debug-plot helpers; configures logging at import time |
| `skelly_synchronize/__main__.py` | Entry point; launches the GUI |
| `skelly_synchronize.py` | The two orchestration functions |
| `core_processes/correlation_functions.py` | FFT cross-correlation, lag finding/normalization, brightness-change detection |
| `core_processes/audio_utilities.py` | Audio extraction/loading/trimming (librosa, soundfile) |
| `core_processes/normalize_framerates.py` | Lowest-common fps/sample-rate normalization via FFmpeg |
| `core_processes/video_functions/video_utilities.py` | Video info dicts, parallel trimming, audio remux |
| `core_processes/video_functions/ffmpeg_functions.py` | subprocess wrappers: probe duration/fps/sample rate, extract audio, trim, normalize, attach audio |
| `core_processes/video_functions/deffcode_functions.py` | Frame-list trimming through deffcode + OpenCV writer, including rotation-metadata transpose handling (`-noautorotate` + filter chain) |
| `core_processes/debugging/debug_output.py` | TOML serialization |
| `core_processes/debugging/debug_plots.py` | Matplotlib before/after plots |
| `utils/get_video_files.py` | Extension-globbing video discovery (upper/lowercase dedupe for Windows) |
| `utils/path_handling_utilities.py` | Directory creation, `synced_` name builder (also strips a leading `raw` prefix if present) |
| `system/` | Constants: folder/file names, `VideoExtension`/`AudioExtension` enums, default paths, logging configuration |
| `gui/` | PySide6 `MainWindow`; `widgets/run_button_widget.py` is a leftover demo widget not referenced anywhere else |
| `tests/` | pytest suite (below) |

Logging note: importing `skelly_synchronize` calls its own `configure_logging()` (console at INFO plus a timestamped file under `~/skelly_synchronize_data/logs_info_and_settings/logs/`). This is a self-contained stdlib-logging setup, not the polyrepo's shared SkellyLogs package, no SkellyLogs dependency exists here.
