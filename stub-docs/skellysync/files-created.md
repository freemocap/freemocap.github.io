---
title: "Files created"
type: reference
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellySync source read directly (package code, README, the pyproject config, CI workflows)
draft: false
---

# Files created

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
