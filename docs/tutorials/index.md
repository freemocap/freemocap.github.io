---
title: Tutorials
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Cross-checked the three tiers against tutorialTiers in src/data/sitePages.ts (navbar flyout and footer) and sidebars/sharedDocsTree.ts (sidebar TOC); verified all 14 child pages exist under docs/tutorials/ with titles matching their link text and no slug overrides; confirmed the /tutorials/ and /concepts/ routes resolve via docusaurus.config.ts routeBasePath settings"
  - date: "2026-08-21"
    against: "none"
draft: false
---

# Tutorials

Three tiers, roughly in order. Tier 1 gets you from nothing to a working
multi-camera recording. Tier 2 makes that recording trustworthy. Tier 3
is for once you're comfortable and want to go further with the data or
the pipeline itself.

## Tier 1: the basics

1. [Choose and set up your cameras](/tutorials/hardware)
2. [Record with one camera](/tutorials/single-camera)
3. [Calibrate your cameras](/tutorials/calibrate)
4. [Record with multiple cameras](/tutorials/multi-camera)
5. [Find and read your output](/tutorials/find-your-data)
6. [Open your recording in Blender](/tutorials/blender)

## Tier 2: getting good results

- [Get a calibration you can trust](/tutorials/better-calibration)
- [Set the ground plane](/tutorials/ground-plane)
- [Choose a tracking model](/tutorials/choose-a-tracker)
- [Filter and fill your data](/tutorials/post-processing)
- [Optimize your capture space](/tutorials/capture-environment)

## Tier 3: going further

- [Analyze your data in Python](/tutorials/analyze-in-python)
- [Build a custom pipeline](/tutorials/custom-pipeline)
- [Process many recordings at once](/tutorials/batch-processing)

If you'd rather understand *why* any of this works the way it does, that's
what [concepts](/concepts/) is for.
