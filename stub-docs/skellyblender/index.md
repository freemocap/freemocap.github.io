---
title: SkellyBlender
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Re-read freemocap_blender_addon (ref main): pyproject.toml (bumpver pattern vYYYY.0M.BUILD[-TAG], current_version v2026.04.1041, dependencies=[], requires-python >=3.10), package __init__.py (bl_info author ajc27, addon version (1, 1, 7), minimum Blender (3, 0, 0)), README.md (ajc27-git credit, Zenodo DOI badge, AGPLv3), core_functions/main_controller.py load_data() stage order and outputs (empties, rig, rigid body meshes, Skelly mesh, center of mass mesh, video planes, capture cameras, checkerboard ground plane, FBX/BVH export, saved .blend), create_freemocap_empties.py, add_capture_cameras.py (reads the recording's .toml calibration), export_3d_model.py default formats ['fbx', 'bvh'], export_video.py composited render pipeline, blender_ui/operators/__init__.py operator registry, .github/workflows, and confirmed there is no test suite; pantheon tier confirmed against the site's data/repos.yml"
  - date: "2026-08-24"
    against: "freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)"
draft: false
---

# SkellyBlender

SkellyBlender is the Blender addon of the FreeMoCap polyrepo. On disk and on GitHub it is `freemocap_blender_addon` (`github.com/freemocap/freemocap_blender_addon`, Python package `freemocap_blender_addon`); the site calls it SkellyBlender. It sits in the pantheon tier and owns the last stage of the pipeline: it turns a processed FreeMoCap recording into an animated Blender scene, saving a `.blend` file and exporting FBX and BVH. The original addon was developed by ajc27 (`ajc27-git` on GitHub), who is still credited as the addon author in `bl_info`.

What a completed load produces: keyframed empties for every tracked point, an armature rig with a TPose rest pose (for easier retargeting), rigid body meshes, a skinned Skelly mesh, center of mass visualization, capture videos as image planes, cameras rebuilt from the recording's calibration file, a checkerboard ground plane, and a saved `.blend` next to the recording's data. A second pass exports the rigged animation as FBX or BVH, and a third renders composited videos from the scene.

Packaging facts, from `pyproject.toml` and `__init__.py`: the version is managed by bumpver on a `vYYYY.0M.BUILD` pattern (currently `v2026.04.1041`, while `bl_info` separately declares addon version `(1, 1, 7)`), the minimum Blender is `(3, 0, 0)`, and development requires Python >= 3.10. Runtime dependencies are declared as an empty list because the addon runs inside Blender's bundled interpreter. Licensed AGPLv3, with a Zenodo DOI badge in the README. There are no tests in the repository.

## Contents

- [How it runs](/skellyblender/how-it-runs)
- [The Load Data pipeline](/skellyblender/load-data-pipeline)
- [Exports](/skellyblender/exports)
- [Animation tools](/skellyblender/animation-tools)
- [In-viewport analysis tools](/skellyblender/analysis-tools)
- [The data handler and saved outputs](/skellyblender/data-handler)
- [Configuration](/skellyblender/configuration)
- [Utilities](/skellyblender/utilities)
- [Packaging and CI](/skellyblender/packaging-and-ci)
- [Caveats](/skellyblender/caveats)
