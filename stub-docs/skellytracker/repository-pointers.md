---
title: "Repository pointers"
type: reference
sidebar_position: 10
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyTracker source read directly (core package, README, CLAUDE.md, the pyproject config); FreeMoCap integration verified against FreeMoCap/core/tracking and FreeMoCap/core/pipeline in the FreeMoCap clone
draft: false
---

# Repository pointers

- Source layout follows the architecture preceding: `skellytracker/core/{tracker,detectors,sessions,temporal_processing,data_primitives,config,io,annotation}`.
- Tests: `pytest skellytracker/tests` (slow real-inference tests marked `video`; skip with `-m 'not video'`). Lint: `ruff check skellytracker/`.
- Extending: subclass `KeypointDetector` or `ObjectDetector`, register in the corresponding registry, and define the point-name/connection YAML.
