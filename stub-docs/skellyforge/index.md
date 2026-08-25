---
title: SkellyForge
type: hub
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone
draft: false
---

# SkellyForge

SkellyForge is the posthoc processing and kinematic modeling package for FreeMoCap. It takes triangulated 3D marker data and turns it into an analyzed, annotated, exportable skeleton: gap interpolation, Butterworth smoothing, anatomical model construction, center of mass and rigid-bone calculations, and NumPy/CSV/parquet/BVH output. Part of the polyrepo's pantheon tier, alongside SkellyCam, SkellyTracker, and FreeMoCap itself.

Its largest subpackage, `skellymodels`, doubles as the polyrepo's shared skeletal data model: the tracker-output layouts (MediaPipe, RTMPose, ChArUco boards), the tracker-agnostic canonical body and hand models, and the `Actor`/`Aspect`/`Trajectory` object graph built on top of them.

Package facts, from `pyproject.toml` and `__init__.py`: pure Python (>=3.10), AGPLv3+, runtime deps NumPy, SciPy, pandas, `toml`, `pyyaml`, and `pyarrow` (code also imports `tqdm` without declaring it), version `v2024.12.1009` via bumpver. The declared console script `skellyforge = skellyforge.__main__:run` is a placeholder, `__main__.py` contains a single comment, so there is no runnable CLI today.

## Contents

- [Data models](/skellyforge/data-models)
- [Post-processing](/skellyforge/post-processing)
- [The skeletal data model](/skellyforge/skeletal-data-model)
- [Pipelines](/skellyforge/pipelines)
- [Logging](/skellyforge/logging)
- [Utilities](/skellyforge/utilities)
- [How FreeMoCap uses SkellyForge](/skellyforge/freemocap-integration)
- [Caveats for readers](/skellyforge/caveats)
