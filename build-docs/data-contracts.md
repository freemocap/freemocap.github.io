---
title: Data contracts between components
type: reference
sidebar_position: 5
provenance: ai-generated
inFlux: "Data contracts section for FreeMoCap core is a work in progress for version alpha. It will stabilize upon beta release."
history:
  - date: "2026-08-26"
    against: "data/repos.yml consumes/produces fields cross-checked against source: freemocap core/tasks/mocap/posthoc_mocap_task.py, core/blender/export_to_blender.py, pubsub/pubsub_topics.py, core/pipeline/realtime/realtime_aggregator_node.py, system/telemetry/telemetry.py; skellytracker core/data_primitives/observation.py; skellycam core/ipc/shared_memory/camera_shared_memory_ring_buffer.py; skellyforge package layout; freemocap_blender_addon freemocap_data_handler loader and saver; DataContractsTable component and repos-data-plugin"
  - date: "2026-08-24"
    against: "generated live from data/repos.yml's consumes/produces fields, not hand-written"
draft: false
---

import DataContractsTable from '@site/src/components/DataContractsTable';

# Data contracts between components

The reference table for what [the polyrepo map](/build/the-map) draws as a
diagram: every repo that produces or consumes a named data artifact, what
that artifact is called, and (computed, not hand-entered) which repo
actually consumes each thing that gets produced.

<DataContractsTable />

An artifact name here is a contract in the loosest sense: a shared name both
sides agree on, not a versioned schema either side can validate against
independently. If a producer changes an artifact's shape without the
consumer changing to match, nothing in this table would catch it, it's a
map of *who depends on whom*, not a type checker. This table, like
[the polyrepo map](/build/the-map), is generated live from `data/repos.yml`
at page-load time; edit that file, not this page.

Cross-checking the table's names against actual source (freemocap pinned to
tag v2.0.0-alpha.21, sibling repos at their current main), several of them
are aspirational labels rather than identifiers that appear anywhere in code,
and FreeMoCap's own row understates things. Specifically:

- `synchronized_frame_packages` does not exist as an identifier in any cloned
  repo. The real handoff out of SkellyCam is shared memory: pipeline nodes
  read frames from each camera's `CameraSharedMemoryRingBuffer`, plus the
  recorded video files SkellyCam writes to disk. The direction of the arrow
  (SkellyCam feeding SkellyTracker) is right even where the name is not.
- What actually crosses the SkellyTracker boundary is its `Observation`
  dataclass (`skellytracker/core/data_primitives/observation.py`). FreeMoCap's
  posthoc mocap task takes a per-frame list of `{camera_id: Observation}` and
  accumulates each camera's observations in an `ObservationBuffer` before
  triangulation.
- `reconstructed_points` and `kinematic_models` have no counterparts under
  those names either. In the current code SkellyForge is less a pipeline stage
  that consumes keypoints and more a library FreeMoCap pulls from: canonical
  skeleton models (`AnatomicalStructure` and the `tracking_model_info`
  definitions), the `Point3d` and `Trajectory3d` trajectory types used
  throughout `core/`, posthoc filtering and interpolation, and the
  `enforce_rigid_bones` rigidification step.
- SkellyBlender's contract with FreeMoCap is file-based rather than
  object-based: Blender export runs against the recording folder on disk
  (and currently supports MediaPipe-processed recordings only, enforced in
  `core/blender/export_to_blender.py`), producing a `.blend` file written
  next to the recording.
- FreeMoCap's empty row hides that it is the biggest producer and consumer of
  all: its task signatures import SkellyTracker's `Observation` and SkellyCam's
  `RecordingInfo` directly, and it emits the recording outputs other tools
  load, including the `.blend` file above and the saved output arrays named by
  the constants in `core/blender/export_to_blender.py`
  (`skeleton_3d.npy`, `rigid_bones_3d.npy`, and friends).

The utility-tier rows do check out as genuinely artifact-free in this sense:
the backend imports `configure_logging` and `get_websocket_log_queue` from
SkellyLogs and a `TelemetryClient` from SkellyPings, and has no SkellySync
imports at all, so none of them passes a named data artifact to another repo.

[← Architecture overview](/build/architecture)
