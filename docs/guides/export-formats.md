---
title: Export to FBX and BVH
type: how-to
sidebar_position: 14
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): blender_export_config.py (FBX/BVH, 3d_models, T/A pose in the app), freemocap_blender_addon export_3d_model_properties.py and main_view3d_panel.py (bone naming, rest pose type, restore defaults, FBX bone axes and leaf bones live in Blender's FreeMoCap sidebar tab, not the app; glTF commented out). Rewritten."
  - date: "2026-08-25"
    against: "freemocap_blender_addon main (export_3d_model.py, export_3d_model_properties.py, export_3d_model_panel.py, bone_naming_mapping.py) and the freemocap v2.0.0-alpha.21 blender export path"
  - date: "2026-08-21"
    against: "freemocap_blender_addon source (main, not yet re-checked against the running app)"
draft: false
---

# Export to FBX and BVH

FreeMoCap saves FBX and BVH animation files as part of its Blender export. See
[open your recording in Blender](/tutorials/blender) for how to run it. The files go in the
recording's `3d_models` folder.

## Choosing a format

- **FBX** holds the skeleton, mesh, and animation together. Most 3D and game software opens it,
  including Unreal, Unity, and Maya.
- **BVH** holds only the skeleton's motion. Use it to put the motion onto a character you've
  already rigged elsewhere.

## Options in FreeMoCap

In FreeMoCap's Blender settings, choose which formats to make and the rest pose (T-pose or
A-pose).

## More options in Blender

For more control, open the `.blend` file in Blender, press **N** to show the sidebar, and open
the **FreeMoCap** tab. From there you can export again with these options:

| Option | What it does |
|---|---|
| Bone naming convention | `Default`, `Metahuman`, or `DAZ G8.1`, to match the rig you're moving the motion onto |
| Rest pose type | The pose the skeleton counts as neutral |
| Restore defaults after export | Puts the original bone names and rest pose back after exporting. On by default. |
| Primary and secondary bone axis (FBX) | Which way the bones point, to match your target rig |
| Add leaf bones (FBX) | Adds end bones to chains like fingers, which some rigs expect |

## Next steps

- [Open your recording in Blender](/tutorials/blender)
- [Find and read your output](/tutorials/find-your-data)
