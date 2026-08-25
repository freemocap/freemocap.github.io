---
title: "Animation tools"
type: reference
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# Animation tools

The **Animation** panel groups the retargeting and cleanup operators:

- **Retarget**: pick source and target armatures, root bones, per-axis conventions for each, and the target's rotation mixmode and owner/target spaces. **Detect Bone Mapping** fills a pair list by matching each source bone to a target bone via `find_matching_bone_in_target_list`; pairs are individually editable through a Blender UI list before **Retarget Animation** runs.
- **Limit Markers Range of Motion**: independent toggles for palm, proximal, intermediate, and distal phalanx markers, a range-of-motion scale, and the two hand track-marker assignments.
- **Foot Locking**: choose a locking method, tune the foot-group-movement parameters (target foot, z threshold, ground level, negative height limit, frame window size, attenuation count, xy radius, moving-average window, knee/hip compensation coefficients, upper-body compensation), and apply.
- **Set Bone Rotation Limits**: the operator is registered, but its entire UI section in the panel is commented out, so it is currently unreachable from the interface.
