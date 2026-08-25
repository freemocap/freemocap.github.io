---
title: "Exports"
type: reference
sidebar_position: 4
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# Exports

## .blend

Always written by the automatic pipeline and by a manual Load Data run, saved as `<recording_name>.blend` in the recording folder, the same convention as an app-driven session.

## FBX and BVH

The **Export 3D Model** panel exposes: destination folder, format (`fbx` or `bvh` only), bones naming convention (`default`, `metahuman`, `daz_g8.1`), rest pose type (same three choices), restore-defaults-after-export (default on), and an FBX subsection (leaf bones, off by default, plus primary/secondary bone axis enums).

The export sequence in `export_3d_model.py` is deliberately reversible. It optionally renames the armature object to `root` (the manual operator passes `rename_root_bone=True`; the automatic pipeline does not), swaps in the selected rest pose and renames bones per the naming-convention mapping tables, then poses the armature by markers at frame 0 before exporting. A code comment explains why: the FBX exporter treats whatever pose the armature holds at export time as its rest pose, so frame 0 is forced to the expected rest configuration first. FBX export selects the armature and its child meshes and calls `export_scene.fbx` with all-bones baked animation; BVH export calls `export_anim.bvh` across the scene frame range. With restore enabled it then undoes everything: inverse bone renaming, original rest pose, mesh realignment, removal of the temporary DAZ correction constraints and forearm twist bones, recreation of the Metahuman `thumb.carpal` bones, and restoration of the original armature name.

## glTF is not available

A `gltf` branch exists inside `export_3d_model()`, but it sits directly under a `TODO - Fix glTF export of animations - output appears broken` comment, the default format list is `['fbx', 'bvh']` with `'gltf'` commented out, and the UI format enum offers only FBX and BVH. Treat glTF output as not implemented.

## Video rendering

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
