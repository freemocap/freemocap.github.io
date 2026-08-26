---
title: "Repository pointers"
type: reference
sidebar_position: 10
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "core/ directory listing (annotation, config, data_primitives, detectors, io, sessions, temporal_processing, tracker, exact match) and pyproject.toml's pytest markers (\"video\" confirmed to exist)"
  - date: "2026-08-24"
    against: "SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone"
draft: false
---

# Repository pointers

- Source layout follows the architecture preceding: `skellytracker/core/{tracker,detectors,sessions,temporal_processing,data_primitives,config,io,annotation}`.
- Tests: `pytest skellytracker/tests` (slow real-inference tests marked `video`; skip with `-m 'not video'`). Lint: `ruff check skellytracker/`.
- Extending: subclass `KeypointDetector` or `ObjectDetector`, register in the corresponding registry, and define the point-name/connection YAML.
