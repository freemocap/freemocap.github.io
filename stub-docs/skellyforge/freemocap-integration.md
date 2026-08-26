---
title: "How FreeMoCap uses SkellyForge"
type: reference
sidebar_position: 8
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "spot-checked the most load-bearing claims directly: Point3d (skellyforge/data_models/trajectory_3d.py), RealtimeSkeletonRigidifier's docstring (freemocap/core/tasks/mocap/rigid_body/skeleton_rigidifier.py, confirms the enforce_rigid_bones streaming-counterpart claim near-verbatim), CanonicalBodyModelInfo/CanonicalHandModelInfo (skellymodels/models/tracking_model_info.py), interpolate_trajectory/filter_trajectory (post_processing/), and MocapTaskConfig.filter_config: FilterConfig (mocap_task_config.py); all confirmed accurate"
  - date: "2026-08-24"
    against: "SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone"
draft: false
---

# How FreeMoCap uses SkellyForge

`freemocap/pyproject.toml` depends on SkellyForge from GitHub main. The split between direct calls and reimplemented mirrors matters:

**Direct calls, the posthoc pipeline.** FreeMoCap's mocap helpers do their own triangulation, then hand the result to SkellyForge: wrap the points in a `Trajectory3d`, run `interpolate_trajectory` then `filter_trajectory`, build a `Human` from `MediapipeModelInfo()` or `RTMPoseModelInfo()`, call `put_skeleton_on_ground()` when the calibration is not ground-plane aligned and `fix_hands_to_wrist()`, run `calculate()`, and write all five save-out formats. The same shape produces the `Board` model from triangulated ChArUco corners. `MocapTaskConfig` takes its filter settings as SkellyForge's own `FilterConfig`.

**Canonical models and mirrored math, the realtime pipeline.** For latency reasons the realtime aggregator does not call SkellyForge's batch functions; instead it loads SkellyForge's canonical models once (`CanonicalBodyModelInfo` and `CanonicalHandModelInfo` through `AnatomicalStructure.from_model_info`, giving the joint hierarchies, `bone_length_ratios` seeds, and Winter COM table), maps raw detector keypoints onto canonical names using SkellyTracker's per-tracker mapping YAMLs, and reimplements the same algorithms per frame. Its `RealtimeSkeletonRigidifier` docstring states this plainly: the streaming counterpart of SkellyForge's posthoc `enforce_rigid_bones`, same median-length plus forward-pass method applied online. Likewise the realtime `center_of_mass` module follows "the same Winter-table math as SkellyForge" adapted to single-frame inputs.

**Shared plumbing.** `Point3d` from `skellyforge.data_models.trajectory_3d` is the wire type for skeleton points across FreeMoCap's pubsub topics, frontend payloads, and streaming kinematics. The websocket server derives the `canonical_body` and `canonical_hand` schemas it sends to the UI from SkellyForge's `AnatomicalStructure` (landmarks plus segment connections), so the frontend renders 3D skeleton connections without hardcoding them. The startup banner reports the installed SkellyForge version alongside the other Skelly packages.
