---
title: Analyze your data in Python
type: tutorial
sidebar_position: 40
provenance: ai-generated
inFlux: "The V2 output column names and array shapes described here are a work in progress for version alpha. They will stabilize upon beta release."
history:
  - date: "2026-08-26"
    against: "skellyforge/skellymodels/models/trajectory.py (as_array, as_dataframe docstrings) and managers/actor.py (create_summary_dataframe, save_out_numpy_data), confirming parquet columns, .npy shape, and the mediapipe_body_3d_xyz example filename all match current source verbatim"
  - date: "2026-08-20"
    against: "none"
draft: false
---

# Analyze your data in Python

Your recording's output includes a parquet file (see
[Find and read your output](/tutorials/find-your-data)) in tidy long
format: one row per keypoint per frame, with `frame`, `keypoint`, `x`,
`y`, `z`, `model`, `trajectory`, and `reprojection_error` columns. See
[the output data model](/concepts/data-model) for what each of those
means; this page is about actually working with it.

## Loading your data

```python
import pandas as pd

df = pd.read_parquet("path/to/your_recording_data.parquet")
df.head()
```

Because the format is tidy (one row per keypoint per frame) rather than
wide, it plays well with pandas' own filtering and grouping instead of
requiring custom indexing logic.

## Pulling out a single joint

```python
right_wrist = df[df["keypoint"] == "right_wrist"]
right_wrist = right_wrist.sort_values("frame")
```

That gives you every frame's `x`, `y`, `z` for one keypoint, in order,
ready to plot or feed into further calculations.

## Filtering by tracking quality

`reprojection_error` travels with every row, not just as a diagnostic
afterthought. Before trusting a frame's position, it's worth checking it:

```python
# a lower threshold is stricter; there's no single universal cutoff,
# it depends on your camera setup and task
clean = right_wrist[right_wrist["reprojection_error"] < right_wrist["reprojection_error"].quantile(0.95)]
```

## A quick trajectory plot

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot(right_wrist["frame"], right_wrist["z"])
ax.set_xlabel("Frame")
ax.set_ylabel("Z position (mm)")
plt.show()
```

Remember [the coordinate system](/concepts/coordinate-systems): data is
in millimetres, with +Z as up, if your ground-plane calibration set a
Z-up frame in the first place.

## If you need array-shaped data instead

The tidy parquet is usually the easier starting point, but the same data
is also available as `.npy` arrays shaped `(num_frames, num_markers, 3)`
per tracker and body region, if that's a better fit for your existing
tooling:

```python
import numpy as np

body_3d = np.load("path/to/mediapipe_body_3d_xyz.npy")
print(body_3d.shape)  # (num_frames, num_markers, 3)
```

See [array shapes and units](/reference/data-arrays) and
[skeleton models and keypoints](/reference/skeleton-models) for exactly
which index maps to which keypoint, that mapping is tracker-specific.

## Next steps

- [The FreeMoCap output data model](/concepts/data-model)
- [Array shapes and units](/reference/data-arrays)
- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
