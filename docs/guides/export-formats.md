---
title: Export to FBX and BVH
type: how-to
sidebar_position: 14
provenance: ai-generated
history:
  - date: "2026-08-25"
    against: "freemocap_blender_addon main (export_3d_model.py, export_3d_model_properties.py, export_3d_model_panel.py, bone_naming_mapping.py) and the freemocap v2.0.0-alpha.21 blender export path"
  - date: "2026-08-21"
    against: "freemocap_blender_addon source (main, not yet re-checked against the running app)"
draft: false
---

# Export to FBX and BVH

Both FBX and BVH export happen through the same Blender export step as
the `.blend` scene itself, see
[open your recording in Blender](/tutorials/blender) for the
prerequisites and the export flow. This page is about the format-specific
options.

:::note glTF isn't available yet
Despite what you may see referenced elsewhere, glTF export isn't
implemented in the current build, only FBX and BVH are. If you need
glTF specifically, that's worth raising with the project rather than
assuming it's just undocumented.
:::

## Choosing a format

- **FBX** carries the mesh, the armature, and animation together, and is
  the more broadly supported format across 3D and game engine software
  (Unreal, Unity, Maya, and others).
- **BVH** carries just the skeletal animation (joint hierarchy and
  rotations over time), no mesh. It's the more common choice if you're
  retargeting the motion onto a character you already have rigged
  elsewhere, rather than bringing in FreeMoCap's own mesh.

## Format options

Set alongside the rest of the Blender export configuration:

| Option | What it does |
|---|---|
| Bone naming convention | `Default`, `Metahuman`, or `DAZ G8.1`, match whichever rig you're retargeting onto |
| Rest pose type | Same three options, controls the pose bones are considered "neutral" in |
| Restore defaults after export | Restores original bone names and rest pose once the export finishes, on by default |

FBX has two additional options: **primary/secondary bone axis** (which
local axes the exported bones use, matters for matching a specific
target rig's conventions) and **add leaf bones** (adds terminal bones at
the end of chains like fingers, which some rigs expect and others
don't).

## Next steps

- [Open your recording in Blender](/tutorials/blender)
- [Find and read your output](/tutorials/find-your-data)
