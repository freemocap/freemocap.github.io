---
title: "The data handler and saved outputs"
type: reference
sidebar_position: 7
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# The data handler and saved outputs

`FreemocapDataHandler` wraps the loaded arrays (body, right hand, left hand, face, plus `other` components like center of mass) with name-indexed accessors, shape validation on every setter, processing-stage snapshots (`mark_processing_stage` keeps deep copies you can retrieve later), whole-dataset rotate/translate/scale transforms, and `extract_data_from_empties()`, which reads trajectories back out of the Blender scene frame by frame.

`FreemocapDataSaver` writes a `saved_data/` folder into the recording: `_FREEMOCAP_DATA_README.md` documenting the layout, `info/freemocap_data_handler.pkl` (a pickle of the whole handler), `info/metadata.json`, `info/trajectory_names.json`, an `npy/` folder of `(frame, name, xyz)` arrays including a concatenated `all_frame_name_xyz.npy`, and a `csv/` folder with per-component and combined trajectories. CSVs are written with `np.savetxt` specifically so this works inside Blender without pandas.
