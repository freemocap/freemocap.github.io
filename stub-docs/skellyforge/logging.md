---
title: "Logging"
type: reference
sidebar_position: 6
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone
draft: false
---

# Logging

SkellyForge does not depend on the SkellyLogs package. It carries its own vendored variant of the same design in `system/logging_configuration/`: importing `skellyforge` calls `configure_logging(LogLevels.TRACE)`, which registers custom levels (`LOOP` 3, `TRACE` 5, `SUCCESS` 22, `API` 25) plus their `logger.trace()`-style methods, quiets noisy third-party packages, and attaches handlers to the root logger: a colored console handler, a file handler always at TRACE (timestamped file under `~/skellyforge_data/logs_info_and_settings/logs/`), and a `QueueHandler`-based websocket handler fed by a size-capped multiprocessing queue created only in the main process (child processes skip configuration unless handed the queue). Configuration is skipped in non-main processes unless a queue is passed, mirroring SkellyLogs' multiprocessing story, though the record serialization is the plain stdlib `QueueHandler` form rather than SkellyLogs' custom payload.
