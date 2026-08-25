---
title: "In-viewport analysis tools"
type: reference
sidebar_position: 6
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# In-viewport analysis tools

The **Data View Settings** panel operates on the scoped recording:

- Visibility toggles for armature, Skelly mesh, tracked points, rigid bodies, center of mass, capture videos, COM vertical projection, joint angles, and base of support, driven by regular expression patterns over the scene graph.
- Motion paths along any tracked element (center of mass or a named joint), with line thickness, separate past/future colors and ranges, frame stepping, and optional frame-number and keyframe display. Add per element, or clear one/all.
- COM vertical projection coloring: neutral, inside base of support, outside base of support.
- Base of support rendering with a z threshold, contact-point radius, and color.
- Joint angle arcs with configurable angle selection, radius, arc and text colors, text size, orientation, and local offsets.
- Data overlays drawn in the viewport at a configurable position and size: a time-series plot (parameter, window size, line and background styling) and a range-of-motion gauge, plus a clear-all.
