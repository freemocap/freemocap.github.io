---
title: Tutorials
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-09-21"
    against: "prose cleanup, replaced a mid-paragraph colon with two sentences per explicit instruction; heading colons (Tier 1: the basics, etc.) left as-is, that's the same title-colon-subtitle pattern as the sidebar's own tier labels, not the sentence-level tic being corrected"
  - date: "2026-09-21"
    against: "src/data/sitePages.ts's tutorialTiers; Tier 3's two entries point to real pages (/tutorials/specialization-tracks, /tutorials/skelly-university) rather than the homepage's `/#advanced` anchor, which was explicitly rejected in favor of standalone explainer pages"
  - date: "2026-09-20"
    against: "src/data/sitePages.ts's tutorialTiers, added back a non-tutorial Tier 3: Advanced pointing at the homepage's Advanced section (src/pages/index.tsx) and Skelly University; specialization track descriptions cross-checked against that section's Technology/Science/Art PathGroups"
  - date: "2026-09-19"
    against: "src/data/sitePages.ts's tutorialTiers, merged to two tiers to match the homepage Intermediate tile grid (src/pages/index.tsx); page list, order, and titles cross-checked against that array"
  - date: "2026-08-26"
    against: "Cross-checked the three tiers against tutorialTiers in src/data/sitePages.ts (navbar flyout and footer) and sidebars/sharedDocsTree.ts (sidebar TOC); verified all 14 child pages exist under docs/tutorials/ with titles matching their link text and no slug overrides; confirmed the /tutorials/ and /concepts/ routes resolve via docusaurus.config.ts routeBasePath settings"
  - date: "2026-08-21"
    against: "none"
draft: false
---

# Tutorials

Three tiers, roughly in order. Tier 1 gets you from nothing to a working
multi-camera recording. Tier 2 is everything past that. It covers a
trustworthy calibration, choosing a tracker, cleaning your data, and
going further with the data or the pipeline itself. Tier 3 isn't more
tutorials. It's where they stop and FreeMoCap splits into three
specialization tracks.

## Tier 1: the basics

1. [Choose and set up your cameras](/tutorials/hardware)
2. [Record with one camera](/tutorials/single-camera)
3. [Calibrate your cameras](/tutorials/calibrate)
4. [Record with multiple cameras](/tutorials/multi-camera)
5. [Find and read your output](/tutorials/find-your-data)
6. [Open your recording in Blender](/tutorials/blender)

## Tier 2: past the basics

- [Get a calibration you can trust](/tutorials/better-calibration)
- [Set the ground plane](/tutorials/ground-plane)
- [Choose a tracking model](/tutorials/choose-a-tracker)
- [Filter and fill your data](/tutorials/post-processing)
- [Optimize your capture space](/tutorials/capture-environment)
- [Analyze your data in Python](/tutorials/analyze-in-python)
- [Build a custom pipeline](/tutorials/custom-pipeline)
- [Process many recordings at once](/tutorials/batch-processing)

## Tier 3: advanced

- [Specialization tracks](/tutorials/specialization-tracks)
- [Skelly University](/tutorials/skelly-university)

If you want to go past tutorials and tracks into the codebase itself,
see the [Developer Docs](/developers).

If you'd rather understand *why* any of this works the way it does, that's
what [concepts](/concepts/) is for.
