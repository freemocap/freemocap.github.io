---
title: "How synchronization works"
type: reference
sidebar_position: 4
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Re-read SkellySync main: skelly_synchronize.py, correlation_functions.py, audio_utilities.py, video_functions/video_utilities.py, video_functions/ffmpeg_functions.py, normalize_framerates.py, utils/get_video_files.py, system/paths_and_file_names.py"
  - date: "2026-08-24"
    against: "SkellySync source read directly (package code, README, the pyproject config, CI workflows)"
draft: false
---

# How synchronization works

## Audio cross correlation

1. Collect videos (`get_video_file_list`), build a video-info dict, and read fps and audio sample rate via ffprobe.
2. If framerates **or** sample rates differ across videos, re-encode copies into a `normalized_videos/` subfolder at the lowest fps and lowest sample rate found, and continue from those copies.
3. Extract each track to WAV into `audio_files/` and load it with librosa.
4. Cross-correlate every audio signal against the first file in the dictionary using `scipy.signal.correlate(mode="full", method="fft")`; the argmax lag, divided by the sample rate, gives that camera's offset in seconds.
5. Normalize the lag dict by subtracting every value from the maximum, the latest-starting camera gets lag 0, all others get positive offsets.
6. Trim: the shared length is `min(duration_i - lag_i)` across videos; each output starts at its own lag offset.
7. Trim each camera's audio the same way (written as 24-bit PCM WAV into `audio_files/trimmed_audio/`) and mux it back onto the trimmed video (`-c:v copy -c:a aac`), replacing the silent copy via a temp-file move.

## First brightness change

1. Same collection step; normalize framerates only if they differ.
2. For each video, compute the mean grayscale value of every frame (`find_brightness_across_frames`, cached beside the video as `<stem>_brightness.npy`).
3. Take the first and second differences of that array; their product is a combined "how sudden and how large" metric, and the first frame where it crosses `brightness_ratio_threshold` is that video's sync point. If nothing crosses the threshold, the code falls back to the frame with the fastest detected change.
4. Lags (frame index divided by fps) are passed to the trim step unnormalized, unlike the audio path, so each video is simply cut from its own sync-point frame onward. There is no audio handling in this mode.

In both modes a post-trim frame-count check requires all synchronized videos to come out the same length: the common count is logged, and unequal frame counts raise an exception instead.
