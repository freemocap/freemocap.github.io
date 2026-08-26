---
title: "The Load Data pipeline"
type: reference
sidebar_position: 3
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "polyrepo-clones/freemocap_blender_addon (package v2026.04.1041, ref main) re-read end to end: main_controller.py, load_data/freemocap_data_paths/handler, recording_framerate.py, create_rig, add_capture_cameras, ground plane and empties/meshes code, panel and property definitions; claimed freemocap-core data_source guard searched for and not found"
  - date: "2026-08-24"
    against: "freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)"
---

# The Load Data pipeline

The **Load FreeMoCap Data** panel has three controls: **Clear Scene**, a recording path, and **Load Data**. After loading, a **Scope Data Parent** dropdown appears; multiple recordings can be loaded into one scene and later operators act on whichever data parent is scoped.

The path property self-populates: `get_test_recording_path()` returns `~/freemocap_data/recordings/freemocap_test_data` or `.../freemocap_sample_data` if either exists. Otherwise point it at a processed recording folder containing an `output_data/` directory.

## Input files

Read from `output_data/`: `mediapipe_body_3d_xyz.npy`, `mediapipe_right_hand_3d_xyz.npy`, `mediapipe_left_hand_3d_xyz.npy` (each hand file falls back to an older-style name, `mediapipe_right_hand_right_hand.npy` and `mediapipe_left_hand_left_hand.npy` respectively), `mediapipe_face_3d_xyz.npy`, and `mediapipe_body_total_body_center_of_mass.npy`. A `*calibration.toml` at the recording root is picked up by glob and is optional. All coordinates arrive in millimeters and are divided by 1000 to meters on load. If the calibration metadata carries a groundplane flag, the later gravity-alignment stage is skipped. Trajectory names come from `MediapipeTrajectoryNames`; constructing the data model with any other `data_source` raises `NotImplementedError`.

## Stages

`MainController.load_data()` runs the stages in a fixed order and times each one. The first group is pure Python (there is a TODO noting it probably belongs in SkellyForge):

| Stage | Effect |
|---|---|
| `load_freemocap_data` | Loads the npy files preceding, marks the `original_from_file` processing stage, sets scene start/end frames, and sets scene framerate |
| `calculate_virtual_trajectories` | Adds derived joint-center trajectories to the body component |
| `put_data_in_inertial_reference_frame` | Runs `put_skeleton_on_ground`; skipped entirely when the calibration already recorded an applied groundplane |
| `enforce_rigid_bones` | Enforces rigid body constraints on the trajectory data |
| `fix_hand_data` | Hand-specific cleanup pass |
| `calculate_joint_angles` | Writes `output_data/joint_angles.csv` using the shared `joint_angles_definitions` |
| `save_data_to_disk` | Writes the `saved_data/` tree (see below) |

The Blender phase then builds the scene:

| Stage | Effect |
|---|---|
| `create_empties` | Creates a keyframed empty per body and hand trajectory (face trajectories get none) under an `empties_parent` |
| `add_rig` | Builds the armature (see below) and bakes its animation with `nla.bake` |
| `save_bone_and_joint_data_from_rig` | Writes `saved_data/<recording>_bone_and_joint_data.csv` from the finished rig |
| `attach_rigid_body_mesh_to_rig` | Per-bone rigid meshes under `rigid_body_meshes_parent` |
| `attach_skelly_mesh_to_rig` | Attaches the Skelly mesh, fitted to body dimensions stored in handler metadata |
| `create_center_of_mass_mesh` | Center of mass sphere driven by its empty (a companion trails helper exists alongside it but is not called by the pipeline) |
| `add_videos` | Loads the recording's videos (`annotated_videos/` preferred, falling back to `synchronized_videos/`) as image planes under `videos_parent` |
| `add_capture_cameras` | Rebuilds each calibrated camera (see below) |
| `setup_scene` | Material-preview shading, hides plumbing empties, deletes the default cube, adds the ground plane |
| `export_3d_model` | FBX and BVH into a `3d_models/` subfolder of the recording |
| `save_blender_file` | Saves `<recording>.blend` into the recording folder |

Finally the new data parent empty is registered into the addon's UI collection (so it becomes scopeable), the `.blend` file is saved, and a per-stage timing summary is printed.

## Deriving the framerate

`utilities/recording_framerate.py` sets the scene rate instead of guessing. It looks for `*_timestamps.csv` files under `synchronized_videos/timestamps/`, takes the median of a frame-duration column across at least 10 samples, converts to fps, and rejects results outside a plausible 1 to 1000 fps band. When nothing usable is found it returns `None` (its docstring explains that silently substituting a plausible-looking number caused the original bug). When a rate is found, the caller sets the scene framerate and stores it in `config.reduce_shakiness.recording_fps`; when it is `None`, the configured 30 fps default stays in place and an explicit warning is printed that exported timing and velocity-based smoothing may be incorrect.

## Rig construction

`create_rig()` uses the `BY_BONE` method: bone geometry comes from handler metadata `bone_data`, bone constraints come from declarative definitions in `data_models/bones/`, and finger tracking constraints are added by default. The rest pose is a TPose, per the addon's own header comment, specifically to make retargeting easier. Symmetry preservation and limit-rotation constraints are config-gated and off by default.

## Capture cameras

`add_capture_cameras` parses the recording's calibration TOML, detecting camera entries structurally (they must carry `matrix`, `size`, and world transform fields) rather than by key-name prefixes. For each camera it places a Blender camera at the calibrated world position, applies orientation plus a 180 degree X flip, converts the pixel-space focal length to millimeters against a fixed 36 mm sensor width, and parents everything under `capture_cameras_parent`. Scene render resolution is set from the first camera. Each camera gets its matching `synchronized_videos` clip as a background movie clip, matched by sorted index. The stage exits early with a message when there is no calibration file or the groundplane was never applied.

## Ground plane

The ground plane is sized to double the x/y extent of the center of mass trajectory, with a 10 meter floor. It gets a dark navy checkerboard material. Note that the code constant is `square_size_meters = 0.50` even though both the docstring and a print statement in the same function still claim 20 cm squares; trust the constant.
