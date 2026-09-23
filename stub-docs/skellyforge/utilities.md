---
title: "Utilities"
type: reference
sidebar_position: 7
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "SkellyForge utilities re-read line-by-line on current main (get_files_from_folder.py glob patterns for .mp4 and *snapshot*.csv, get_unique_list dedupe and sort, package __init__), tree-wide search confirming the module is imported only by pipelines/dlc_pipeline.py, pyproject.toml packaging check, and a search of the pinned FreeMoCap clone showing no import of this module"
  - date: "2026-08-24"
    against: "SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone"
draft: false
---

# Utilities

`utilities/get_files_from_folder.py` globs synchronized-video folders for `.mp4` files and DeepLabCut export folders for `*snapshot*.csv` files, with dedupe and sorting.
