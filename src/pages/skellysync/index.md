---
title: SkellySync
type: reference
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellySync source read directly (package code, README, the pyproject config, CI workflows)
draft: false
---

# SkellySync

SkellySync (`skelly_synchronize`) synchronizes videos of the same event *after recording*, without needing camera timestamps. Given a folder of videos that overlap in time, it computes the temporal offset between each video and the others, trims every video to the earliest moment all cameras were recording simultaneously, and writes the results out with matching frame counts. Two synchronization methods are available: **audio cross correlation** and **first brightness change** detection. Part of the FreeMoCap polyrepo's utility tier, standalone infrastructure any of the pipeline repos can depend on (though none currently reference it in their sources).

## Install and run

```bash
pip install skelly_synchronize
python -m skelly_synchronize
```

There is also a console-script entry point (`skelly_synchronize = "skelly_synchronize.__main__:run"`). The `argparse` setup in `__main__.py` currently defines no options; launching it opens the PySide6 GUI. The README warns that the window may appear frozen while work is happening, progress is reported on the terminal instead.

SkellySync shells out to **FFmpeg** (`ffmpeg` and `ffprobe`) for probing, audio extraction, trimming, framerate normalization, and audio remuxing; `check_for_ffmpeg()` raises `FileNotFoundError` if either binary is missing from `PATH`, so install FFmpeg separately if you don't have it. Supported input containers are `mp4`, `mkv`, `avi`, `mpeg`, and `mov` (matched case-insensitively). Requires `Python >=3.9,<3.13`.

### GUI workflow

The `MainWindow` (in `gui/skelly_synchronize_gui.py`) offers three controls:

1. **Load folder of raw videos**, a directory picker; both sync buttons enable once a folder is chosen.
2. **Synchronize videos with Audio Cross Correlation**, calls `synchronize_videos_from_audio()`.
3. **Synchronize videos with First Brightness Change**, calls `synchronize_videos_from_brightness()` with the value of a **Brightness ratio threshold** text field (default `1000`, validated to accept numbers >= 1).

Videos must overlap in time to be synchronizable. For audio sync, every video needs an audio track, extraction fails loudly otherwise (`FileNotFoundError` if the extracted audio file never appears). Distinct sounds like a clap improve results. For brightness sync, all cameras need to see a quick brightness increase near the start (a flash or a light switching on works better than curtains opening), and you may need to retry with different thresholds.

## Python API

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

## How synchronization works

### Audio cross correlation

1. Collect videos (`get_video_file_list`), build a video-info dict, and read fps and audio sample rate via ffprobe.
2. If framerates **or** sample rates differ across videos, re-encode copies into a `normalized_videos/` subfolder at the lowest fps and lowest sample rate found, and continue from those copies.
3. Extract each track to WAV into `audio_files/` and load it with librosa.
4. Cross-correlate every audio signal against the first file in the dictionary using `scipy.signal.correlate(mode="full", method="fft")`; the argmax lag, divided by the sample rate, gives that camera's offset in seconds.
5. Normalize the lag dict by subtracting every value from the maximum, the latest-starting camera gets lag 0, all others get positive offsets.
6. Trim: the shared length is `min(duration_i - lag_i)` across videos; each output starts at its own lag offset.
7. Trim each camera's audio the same way (written as 24-bit PCM WAV into `audio_files/trimmed_audio/`) and mux it back onto the trimmed video (`-c:v copy -c:a aac`), replacing the silent copy via a temp-file move.

### First brightness change

1. Same collection step; normalize framerates only if they differ.
2. For each video, compute the mean grayscale value of every frame (`find_brightness_across_frames`, cached beside the video as `<stem>_brightness.npy`).
3. Take the first and second differences of that array; their product is a combined "how sudden and how large" metric, and the first frame where it crosses `brightness_ratio_threshold` is that video's sync point. If nothing crosses the threshold, the code falls back to the frame with the fastest detected change.
4. Lags (frame index divided by fps) feed the same normalize-trim-write pipeline as preceding. There is no audio handling in this mode.

In both modes a post-trim frame-count check logs whether all synchronized videos came out the same length.

## Files created

Given a raw folder, SkellySync produces (names defined in `system/paths_and_file_names.py`):

| Path | When | Contents |
|---|---|---|
| `<raw parent>/synchronized_videos/` | always | Trimmed videos named `synced_<original stem>.mp4` |
| `synchronized_videos/audio_files/` | audio method | Per-camera extracted WAVs |
| `synchronized_videos/audio_files/trimmed_audio/` | audio method | Lag-shifted, length-matched WAVs |
| `<raw>/normalized_videos/` | mixed framerates or sample rates | Re-encoded uniform-fps copies |
| `<video>-adjacent/<stem>_brightness.npy` | brightness method | Cached per-frame brightness arrays |
| `synchronized_videos/synchronization_debug.toml` | always | Debug info (below) |
| `synchronized_videos/debug_plot.png` | always (`create_debug_plots_bool=True`) | Before/after visualization |

The debug TOML carries up to four sections: `Raw_video_information`, `Synchronized_video_information`, `Audio_information` (audio method only, with the bulky audio arrays stripped before saving), and `Lag_dictionary`, the offsets in seconds between each raw video's start and the first moment all cameras recorded. The debug plot overlays the raw vs. synchronized signals (audio waveforms or brightness curves, per method) in two stacked subplots.

One quirk worth knowing if you modify the brightness path: `skelly_synchronize.py` guards the plot-input folder with `if Path(...).exists:`, the bound method rather than a call, so the condition is always true and `create_brightness_debug_plots` always looks for brightness `.npy` files in `normalized_videos/` whether or not that folder exists.

## Module map

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

## Testing and CI

`tests/conftest.py` downloads a sample multi-camera dataset from Figshare to `~/skelly_synchronize_sample_data` on session start, then runs a **full end-to-end audio synchronization** before any test executes. The tests assert that the synchronized folder and its expected artifacts exist (`debug_plot.png`, `synchronization_debug.toml`, `audio_files/`, `trimmed_audio/`), that the video count is preserved, that all outputs share one frame count, plus unit tests for lag-dict normalization and deffcode trimming. Because of the conftest hook, any pytest invocation downloads data and processes video, expect slow first runs.

CI (`.github/workflows/`):

- `python-testing.yml`, on pull requests to `main` (and manual dispatch): Python 3.10 on Ubuntu, `pip install -e .`, apt-get FFmpeg, then `pytest skelly_synchronize/tests`.
- `lint-with-black.yml`, Black on every pull request.
- `publish_to_pypi_when_new_tag_is_pushed_to_main.yml`, publishes on new tags; versions follow bumpver's `vYYYY.0M.BUILD` pattern (current: `v2025.04.1037`).

License is AGPLv3+. One packaging caveat: `pyproject.toml` metadata still carries template boilerplate (description "Basic template of a python repository," generic keywords), and `soundfile` is imported directly by `audio_utilities.py` though only arrives transitively rather than being declared.

[← Back to Developer Docs](/developers)
