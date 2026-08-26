---
title: "Logging"
type: reference
sidebar_position: 6
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "SkellyForge main clone re-read end to end (__init__.py, system/logging_configuration/ including configure_logging.py, log_levels.py, logger_builder.py, handlers/, filters/, formatters/, package_log_quieters.py) plus pyproject.toml and README; no-skellylogs-dependency claim checked via full-clone search; multiprocessing-skip and serialization claims cross-checked against the skellylogs clone"
  - date: "2026-08-24"
    against: "SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone"
---

# Logging

SkellyForge does not depend on the SkellyLogs package. It carries its own vendored variant of the same design in `system/logging_configuration/`: importing `skellyforge` calls `configure_logging(LogLevels.TRACE)`, which registers custom levels (`LOOP` 3, `TRACE` 5, `SUCCESS` 22, `API` 25) plus their `logger.trace()`-style methods, quiets noisy third-party packages, and attaches handlers to the root logger: a colored console handler, a file handler always at TRACE (timestamped file under `~/skellyforge_data/logs_info_and_settings/logs/`), and a `QueueHandler`-based websocket handler fed by a size-capped multiprocessing queue created only in the main process (child processes skip configuration unless handed the queue). Configuration is skipped in non-main processes unless a queue is passed, mirroring SkellyLogs' multiprocessing story, though the record serialization is the plain stdlib `QueueHandler` form rather than SkellyLogs' custom payload.
