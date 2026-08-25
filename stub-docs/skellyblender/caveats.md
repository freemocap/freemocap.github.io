---
title: "Caveats"
type: reference
sidebar_position: 11
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# Caveats

- The README states plainly that this is a work in progress with significant refactors planned: naming conventions and armature configuration may change between versions without notice, though old recordings can always be reprocessed with new software.
- MediaPipe output is the only supported input, enforced independently on both the FreeMoCap side and inside the addon's data model.
- The keyboard shortcuts described in `register()` do not actually bind (class-name mismatch, noted preceding).
- glTF export is present in code but explicitly marked broken and unreachable from the UI.
- A few comments lag the code they annotate (the checkerboard square size, the ground-plane minimum size), so prefer constants over comments when the two disagree.
