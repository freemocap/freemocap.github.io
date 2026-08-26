---
title: "How it runs"
type: reference
sidebar_position: 2
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Re-read freemocap_blender_addon (main): __init__.py register()/keymap code, utilities/install_dependencies.py, utilities/git_source_manager.py, blender_ui panel label and operator class names, core_functions/main_controller.py, core_functions/export_3d_model/export_3d_model.py, .github/workflows/create_addon_install_zip.yaml; re-checked FreeMoCap integration (v2.0.0-alpha.21): core/blender/export_to_blender.py, core/blender/helpers/run_blender_export.py, core/blender/helpers/install_blender_addon.py, api/http/blender/blender_router.py"
  - date: "2026-08-24"
    against: "freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)"
draft: false
---

# How it runs

There are two ways the addon executes, and they exercise different amounts of the pipeline.

## Automatically, from the FreeMoCap app

At the end of a recording session, FreeMoCap's `core/blender/export_to_blender.py` launches Blender headless:

```
blender --background --python run_blender_export.py -- <site-packages> <recording-folder> <blend-file>
```

`run_blender_export.py` (in the FreeMoCap repo, not the addon) injects the FreeMoCap virtualenv's `site-packages` into Blender's `sys.path`, so no addon installation is needed. It then evicts any preloaded `freemocap_blender_addon` modules from `sys.modules` and strips Blender's own addons paths, so a stale copy in the addons directory cannot hijack the import. Finally it calls `ajc27_run_as_main_function(recording_path, blend_file_path)` from the addon's `main.py`, which clears the scene and runs only the load stage of `MainController` (which builds the whole scene, exports the 3D model files into the recording folder, and saves the `.blend`).

This path is MediaPipe-only: `export_to_blender()` raises a `ValueError` explaining that the addon only supports MediaPipe output when handed a recording processed with any other detector. The FreeMoCap HTTP API wraps all of this with `/blender/detect`, `/blender/addon/install` (a CLI-based install that the endpoint documents as optional and not required for export), `/blender/export`, and `/blender/open`.

## Manually, inside the Blender UI

Install the zip from the latest GitHub release (CI builds it on each version tag) via `Edit > Preferences > Add-ons > Install`, then enable it. The UI appears in the 3D viewport sidebar under the FreeMoCap tab (press `N`; the tab label includes a skull emoji). Registering the addon runs `check_and_install_dependencies()` against Blender's bundled Python, though `OPTIONAL_DEPENDENCIES` is currently an empty list, so today that step only verifies pip is available. The README strongly recommends enabling the system console, since the addon reports progress almost entirely through `print()`.

One dead feature worth knowing about: `register()` contains code to bind `Shift+Alt+R` (load data) and `Shift+Alt+X` (clear scene) shortcuts, but it activates them by checking for class names `FREEMOCAP_load_data` and `FREEMOCAP_clear_scene`, while the actual operator classes are named `FREEMOCAP_OT_load_data` and `FREEMOCAP_OT_clear_scene`. Neither condition ever matches, so no shortcuts are bound. Use the buttons.
