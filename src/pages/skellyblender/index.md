---
title: SkellyBlender
type: reference
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# SkellyBlender

SkellyBlender is the Blender addon of the FreeMoCap polyrepo. On disk and on GitHub it is `freemocap_blender_addon` (`github.com/freemocap/freemocap_blender_addon`, Python package `freemocap_blender_addon`); the site calls it SkellyBlender. It sits in the pantheon tier and owns the last stage of the pipeline: it turns a processed FreeMoCap recording into an animated Blender scene, saving a `.blend` file and exporting FBX and BVH. The original addon was developed by ajc27 (`ajc27-git` on GitHub), who is still credited as the addon author in `bl_info`.

What a completed load produces: keyframed empties for every tracked point, an armature rig with a TPose rest pose (for easier retargeting), rigid body meshes, a skinned Skelly mesh, center of mass visualization, capture videos as image planes, cameras rebuilt from the recording's calibration file, a checkerboard ground plane, and a saved `.blend` next to the recording's data. A second pass exports the rigged animation as FBX or BVH, and a third renders composited videos from the scene.

Packaging facts, from `pyproject.toml` and `__init__.py`: the version is managed by bumpver on a `vYYYY.0M.BUILD` pattern (currently `v2026.04.1041`, while `bl_info` separately declares addon version `(1, 1, 7)`), the minimum Blender is `(3, 0, 0)`, and development requires Python >= 3.10. Runtime dependencies are declared as an empty list because the addon runs inside Blender's bundled interpreter. Licensed AGPLv3, with a Zenodo DOI badge in the README. There are no tests in the repository.

## How it runs

There are two ways the addon executes, and they exercise different amounts of the pipeline.

### Automatically, from the FreeMoCap app

At the end of a recording session, FreeMoCap's `core/blender/export_to_blender.py` launches Blender headless:

```
blender --background --python run_blender_export.py -- <site-packages> <recording-folder> <blend-file>
```

`run_blender_export.py` (in the FreeMoCap repo, not the addon) injects the FreeMoCap virtualenv's `site-packages` into Blender's `sys.path`, so no addon installation is needed. It then evicts any preloaded `freemocap_blender_addon` modules from `sys.modules` and strips Blender's own addons paths, so a stale copy in the addons directory cannot hijack the import. Finally it calls `ajc27_run_as_main_function(recording_path, blend_file_path)` from the addon's `main.py`, which clears the scene and runs only the load stage of `MainController` (the scene build, not the exports).

This path is MediaPipe-only: `export_to_blender()` raises a `ValueError` explaining that the addon only supports MediaPipe output when handed a recording processed with any other detector. The FreeMoCap HTTP API wraps all of this with `/blender/detect`, `/blender/addon/install` (a CLI-based install that the endpoint documents as optional and not required for export), `/blender/export`, and `/blender/open`.

### Manually, inside the Blender UI

Install the zip from the latest GitHub release (CI builds it, see Packaging below) via `Edit > Preferences > Add-ons > Install`, then enable it. The UI appears in the 3D viewport sidebar under the FreeMoCap tab (press `N`; the tab label includes a skull emoji). Registering the addon runs `check_and_install_dependencies()` against Blender's bundled Python, though `OPTIONAL_DEPENDENCIES` is currently an empty list, so today that step only verifies pip is available. The README strongly recommends enabling the system console, since the addon reports progress almost entirely through `print()`.

One dead feature worth knowing about: `register()` contains code to bind `Shift+Alt+R` (load data) and `Shift+Alt+X` (clear scene) shortcuts, but it activates them by checking for class names `FREEMOCAP_load_data` and `FREEMOCAP_clear_scene`, while the actual operator classes are named `FREEMOCAP_OT_load_data` and `FREEMOCAP_OT_clear_scene`. Neither condition ever matches, so no shortcuts are bound. Use the buttons.

## The Load Data pipeline

The **Load FreeMoCap Data** panel has three controls: **Clear Scene**, a recording path, and **Load Data**. After loading, a **Scope Data Parent** dropdown appears; multiple recordings can be loaded into one scene and later operators act on whichever data parent is scoped.

The path property self-populates: `get_test_recording_path()` returns `~/freemocap_data/recordings/freemocap_test_data` or `.../freemocap_sample_data` if either exists. Otherwise point it at a processed recording folder containing an `output_data/` directory.

### Input files

Read from `output_data/`: `mediapipe_body_3d_xyz.npy`, `mediapipe_right_hand_3d_xyz.npy`, `mediapipe_left_hand_3d_xyz.npy` (each hand file falls back to an older `mediapipe_*_hand_right_hand.npy`-style name), `mediapipe_face_3d_xyz.npy`, and `mediapipe_body_total_body_center_of_mass.npy`. A `*calibration.toml` at the recording root is picked up by glob and is optional. All coordinates arrive in millimeters and are divided by 1000 to meters on load. If the calibration metadata carries a groundplane flag, the later gravity-alignment stage is skipped. Trajectory names come from `MediapipeTrajectoryNames`; constructing the data model with any other `data_source` raises `NotImplementedError`, matching the app-side guard.

### Stages

`MainController.load_data()` runs the stages in a fixed order and times each one. The first group is pure Python (there is a TODO noting it probably belongs in SkellyForge):

| Stage | Effect |
|---|---|
| `load_freemocar_data` (method name aside, spelled `load_freemocap_data`) | Loads the npy files preceding, marks the `original_from_file` processing stage, sets scene start/end frames, and sets scene framerate |
| `calculate_virtual_trajectories` | Adds derived joint-center trajectories to the body component |
| `put_data_in_inertial_reference_frame` | Runs `put_skeleton_on_ground`; skipped entirely when the calibration already recorded an applied groundplane |
| `enforce_rigid_bones` | Enforces rigid body constraints on the trajectory data |
| `fix_hand_data` | Hand-specific cleanup pass |
| `calculate_joint_angles` | Writes `output_data/joint_angles.csv` using the shared `joint_angles_definitions` |
| `save_data_to_disk` | Writes the `saved_data/` tree (see below) |

The Blender phase then builds the scene:

| Stage | Effect |
|---|---|
| `create_empties` | Creates a keyframed empty per tracked point under an `empties_parent` |
| `add_rig` | Builds the armature (see below) and bakes its animation with `nla.bake` |
| `save_bone_and_joint_data_from_rig` | Writes `saved_data/<recording>_bone_and_joint_data.csv` from the finished rig |
| `attach_rigid_body_mesh_to_rig` | Per-bone rigid meshes under `rigid_body_meshes_parent` |
| `attach_skelly_mesh_to_rig` | Attaches the Skelly mesh, fitted to body dimensions stored in handler metadata |
| `create_center_of_mass_mesh` | Center of mass sphere driven by its empty (a companion trails helper exists in the same module but is not called by the pipeline) |
| `add_videos` | Loads the recording's videos as image planes under `videos_parent` |
| `add_capture_cameras` | Rebuilds each calibrated camera (see below) |
| `setup_scene` | Material-preview shading, hides plumbing empties, deletes the default cube, adds the ground plane |
| `export_3d_model` | FBX and BVH into a `3d_models/` subfolder of the recording |
| `save_blender_file` | Saves `<recording>.blend` into the recording folder |

Finally the new data parent empty is registered into the addon's UI collection (so it becomes scopeable) and a per-stage timing summary is printed.

### Deriving the framerate

`utilities/recording_framerate.py` sets the scene rate instead of guessing. It globs `synchronized_videos/timestamps/*_timestamps.csv`, takes the median of a frame-duration column across at least 10 samples, converts to fps, and rejects results outside a plausible 1 to 1000 fps band. When nothing usable is found it returns `None` (its docstring explains that silently substituting a plausible-looking number caused the original bug) and the caller falls back to the configured 30 fps, setting `config.reduce_shakiness.recording_fps` and printing an explicit warning that exported timing and velocity smoothing may be wrong.

### Rig construction

`create_rig()` uses the `BY_BONE` method: bone geometry comes from handler metadata `bone_data`, bone constraints come from declarative definitions in `data_models/bones/`, and finger tracking constraints are added by default. The rest pose is a TPose, per the addon's own header comment, specifically to make retargeting easier. Symmetry preservation and limit-rotation constraints are config-gated and off by default.

### Capture cameras

`add_capture_cameras` parses the recording's calibration TOML, detecting camera entries structurally (they must carry `matrix`, `size`, and world transform fields) rather than by key-name prefixes. For each camera it places a Blender camera at the calibrated world position, applies orientation plus a 180 degree X flip, converts the pixel-space focal length to millimeters against a fixed 36 mm sensor width, and parents everything under `capture_cameras_parent`. Scene render resolution is set from the first camera. Each camera gets its matching `synchronized_videos` clip as a background movie clip, matched by sorted index. The stage exits early with a message when there is no calibration file or the groundplane was never applied.

### Ground plane

The ground plane is sized to double the x/y extent of the center of mass trajectory, with a 10 meter floor. It gets a dark navy checkerboard material. Note that the code constant is `square_size_meters = 0.50` even though both the docstring and a print statement in the same function still claim 20 cm squares; trust the constant.

## Exports

### .blend

Always written by the automatic pipeline and by a manual Load Data run, saved as `<recording_name>.blend` in the recording folder, the same convention as an app-driven session.

### FBX and BVH

The **Export 3D Model** panel exposes: destination folder, format (`fbx` or `bvh` only), bones naming convention (`default`, `metahuman`, `daz_g8.1`), rest pose type (same three choices), restore-defaults-after-export (default on), and an FBX subsection (leaf bones, off by default, plus primary/secondary bone axis enums).

The export sequence in `export_3d_model.py` is deliberately reversible. It optionally renames the armature object to `root` (the manual operator passes `rename_root_bone=True`; the automatic pipeline does not), swaps in the selected rest pose and renames bones per the naming-convention mapping tables, then poses the armature by markers at frame 0 before exporting. A code comment explains why: the FBX exporter treats whatever pose the armature holds at export time as its rest pose, so frame 0 is forced to the expected rest configuration first. FBX export selects the armature and its child meshes and calls `export_scene.fbx` with all-bones baked animation; BVH export calls `export_anim.bvh` across the scene frame range. With restore enabled it then undoes everything: inverse bone renaming, original rest pose, mesh realignment, removal of the temporary DAZ correction constraints and forearm twist bones, recreation of the Metahuman `thumb.carpal` bones, and restoration of the original armature name.

### glTF is not available

A `gltf` branch exists inside `export_3d_model()`, but it sits directly under a `TODO - Fix glTF export of animations - output appears broken` comment, the default format list is `['fbx', 'bvh']` with `'gltf'` commented out, and the UI format enum offers only FBX and BVH. Treat glTF output as not implemented.

### Video rendering

The **Export Video** panel renders composited videos straight from the scene. Profiles live in `video_config.py`:

| Profile | Resolution | Cameras | Rendered elements |
|---|---|---|---|
| `debug` | 1920x1080 | Front | center of mass, rigid body meshes, videos, Skelly mesh |
| `showcase` | 540x960 portrait | Front | videos, Skelly mesh |
| `scientific` | 1920x1080 | Front plus right and top inset views | center of mass, rigid body meshes, videos |
| `multiview` | 1920x1080 | Four quadrant views (front, right, top, left), 960x540 each | center of mass, rigid body meshes |
| `custom` | user-set | any of front/left/right/top, each with its own size and normalized position | chosen implicitly by scene visibility |

Each profile also carries an output name suffix (`_debug`, `_showcase`, and more) and a logo overlay placement. The custom profile is assembled from the panel's UI properties before rendering: overall resolution, per-camera enable/size/position, and an optional FreeMoCap logo with adjustable scale and position.

Rendering uses EEVEE Next with MPEG4/H.264 output through Blender's FFmpeg settings, transparent film, and a bundled background image; the pipeline places cameras and lights, rearranges background videos, prerenders each camera scene, composites the result into the recording folder, and resets scene defaults afterward. Before running, the operator clears leftover compositor nodes, movie clips, and previous `Render_Camera` scenes so repeated exports do not accumulate garbage.

## Animation tools

The **Animation** panel groups the retargeting and cleanup operators:

- **Retarget**: pick source and target armatures, root bones, per-axis conventions for each, and the target's rotation mixmode and owner/target spaces. **Detect Bone Mapping** fills a pair list by matching each source bone to a target bone via `find_matching_bone_in_target_list`; pairs are individually editable through a Blender UI list before **Retarget Animation** runs.
- **Limit Markers Range of Motion**: independent toggles for palm, proximal, intermediate, and distal phalanx markers, a range-of-motion scale, and the two hand track-marker assignments.
- **Foot Locking**: choose a locking method, tune the foot-group-movement parameters (target foot, z threshold, ground level, negative height limit, frame window size, attenuation count, xy radius, moving-average window, knee/hip compensation coefficients, upper-body compensation), and apply.
- **Set Bone Rotation Limits**: the operator is registered, but its entire UI section in the panel is commented out, so it is currently unreachable from the interface.

## In-viewport analysis tools

The **Data View Settings** panel operates on the scoped recording:

- Visibility toggles for armature, Skelly mesh, tracked points, rigid bodies, center of mass, capture videos, COM vertical projection, joint angles, and base of support, driven by regular expression patterns over the scene graph.
- Motion paths along any tracked element (center of mass or a named joint), with line thickness, separate past/future colors and ranges, frame stepping, and optional frame-number and keyframe display. Add per element, or clear one/all.
- COM vertical projection coloring: neutral, inside base of support, outside base of support.
- Base of support rendering with a z threshold, contact-point radius, and color.
- Joint angle arcs with configurable angle selection, radius, arc and text colors, text size, orientation, and local offsets.
- Data overlays drawn in the viewport at a configurable position and size: a time-series plot (parameter, window size, line and background styling) and a range-of-motion gauge, plus a clear-all.

## The data handler and saved outputs

`FreemocapDataHandler` wraps the loaded arrays (body, right hand, left hand, face, plus `other` components like center of mass) with name-indexed accessors, shape validation on every setter, processing-stage snapshots (`mark_processing_stage` keeps deep copies you can retrieve later), whole-dataset rotate/translate/scale transforms, and `extract_data_from_empties()`, which reads trajectories back out of the Blender scene frame by frame.

`FreemocapDataSaver` writes a `saved_data/` folder into the recording: `_FREEMOCAP_DATA_README.md` documenting the layout, `info/freemocap_data_handler.pkl` (a pickle of the whole handler), `info/metadata.json`, `info/trajectory_names.json`, an `npy/` folder of `(frame, name, xyz)` arrays including a concatenated `all_frame_name_xyz.npy`, and a `csv/` folder with per-component and combined trajectories. CSVs are written with `np.savetxt` specifically so this works inside Blender without pandas.

## Configuration

`Config` (dataclasses in `parameter_models.py`) is constructed from hardcoded defaults by `load_default_parameters_config()`, which can alternatively read a JSON file. Defaults include `reduce_shakiness.recording_fps = 30.0` (overridden whenever the timestamps CSV yields a real framerate), `add_rig.keep_symmetry = False`, `add_rig.add_fingers_constraints = True`, `add_rig.use_limit_rotation = False`, and alignment reference points (`left_knee`, `left_foot_index`) in `AdjustEmpties`. Only the `reduce_shakiness` and `add_rig` sections are consulted by the current `MainController` pipeline; the other sections are carried but unused there.

## Utilities

Three small modules under `utilities/` are generally useful for anyone embedding Python tooling in Blender:

- `git_source_manager.py`: `resolve_git_sources()` clones or fast-forward-updates git repositories into `~/.cache/freemocap/git_sources/` (override with `FREEMOCAP_GIT_SOURCES_DIR` or `XDG_CACHE_HOME`), records last-seen commits in `.source_lock.json`, stashes local changes before pulling, and degrades gracefully to the cached copy when offline. It's stdlib-only, so it works in Blender's bundled Python. The addon imports it at startup but does not currently call it for anything.
- `install_dependencies.py`: ensures pip exists in Blender's interpreter, checks imports locally with zero subprocesses, and installs anything missing from pip, git URL, or local-path specs. Presently a no-op beyond the pip check, given the empty dependency list.
- `recording_framerate.py`: the timestamps-based framerate derivation described preceding.

## Packaging and CI

Builds use flit (`flit_core`). Two workflows fire on `v*` tags: `flit_publish_to_pypi.yml` publishes the package to PyPI, and `create_addon_install_zip.yaml` zips the package folder as `freemocap_blender_addon_<version>.zip`, generates release notes with click-through install steps, and publishes the GitHub Release users download the addon from. The zip workflow can also be triggered manually via `workflow_dispatch`. Version bumps flow through bumpver, which updates `__init__.py`, commits, tags, and pushes in one step.

## Caveats

- The README states plainly that this is a work in progress with significant refactors planned: naming conventions and armature configuration may change between versions without notice, though old recordings can always be reprocessed with new software.
- MediaPipe output is the only supported input, enforced independently on both the FreeMoCap side and inside the addon's data model.
- The keyboard shortcuts described in `register()` do not actually bind (class-name mismatch, noted preceding).
- glTF export is present in code but explicitly marked broken and unreachable from the UI.
- A few comments lag the code they annotate (the checkerboard square size, the ground-plane minimum size), so prefer constants over comments when the two disagree.

[← Back to Developer Docs](/developers)
