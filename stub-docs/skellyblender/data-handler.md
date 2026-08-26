---
title: "The data handler and saved outputs"
type: reference
sidebar_position: 7
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "freemocap_blender_addon source read directly (package v2026.04.1041): freemocap_data_handler/handler.py, helpers/saver.py, helpers/transformer.py, data_models/freemocap_data/helpers/freemocap_component_data.py, core_functions/main_controller.py, blender_ui/operators/_save_out_data.py, core_functions/setup_scene/set_start_end_frame.py"
  - date: "2026-08-24"
    against: "freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)"
---

# The data handler and saved outputs

`FreemocapDataHandler` wraps the loaded arrays (body, right hand, left hand, face, plus `other` components like center of mass) with name-indexed accessors, shape validation on every setter, processing-stage snapshots (`mark_processing_stage` keeps deep copies you can retrieve later), whole-dataset rotate/translate/scale transforms, and `extract_data_from_empties()`, which reads trajectories back out of the Blender scene frame by frame. Two known quirks in the current code: applying `scale()` to the whole dataset (the default, with no component name) reaches an `other`-component branch in `FreemocapDataTransformer` that multiplies the component object itself instead of its `.data` array and raises, and the `other` branch of `extract_data_from_empties()` constructs an `np.ndarray` from a Blender location object instead of using `np.array`, which raises and aborts the whole extraction whenever an `other` group is present in the empties mapping (body, hand, and face components extract correctly).

`FreemocapDataSaver` writes a `saved_data/` folder into the recording: `_FREEMOCAP_DATA_README.md` documenting the layout, `info/freemocap_data_handler.pkl` (a pickle of the whole handler), `info/metadata.json`, `info/trajectory_names.json`, an `npy/` folder of `(frame, name, xyz)` arrays including a concatenated `all_frame_name_xyz.npy`, a `csv/` folder with per-component trajectories, and a combined `all_trajectories.csv` written directly into `saved_data/` rather than inside the `csv/` folder. CSVs are written with `np.savetxt` specifically so this works inside Blender without pandas.
