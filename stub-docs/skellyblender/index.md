---
title: SkellyBlender
type: hub
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
