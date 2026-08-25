---
title: "Post-processing"
type: reference
sidebar_position: 3
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone
draft: false
---

# Post-processing

Two small, deliberately pluggable stages in `post_processing/`. Each is driven by a Pydantic config, dispatched through a registry keyed by a method enum, applied marker-by-marker with a progress bar, and returns a new `Trajectory3d` carrying the original reprojection-error arrays through untouched.

**Interpolation** (`interpolation/`) fills gaps in the triangulated array. `InterpolationConfig` offers exactly one method today, `linear`: the marker's `(frames, dims)` slice goes through `pandas.DataFrame.interpolate(method='linear', axis=0)`. Afterward `fill_in_nans()` replaces any surviving non-finite values (leading/trailing NaNs linear interpolation cannot reach) with the column mean.

**Filtering** (`filters/`) smooths the interpolated signal. `FilterConfig` defaults define the pipeline's standard treatment: a `butter_low_pass` zero-phase Butterworth (SciPy `butter` + `filtfilt`) with cutoff 6 Hz, sampling rate 30 Hz, order 4, applied independently to each marker coordinate column.
