---
title: "How the rest of the polyrepo uses it"
type: reference
sidebar_position: 9
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "SkellyLogs source re-read on current main (configure_logging.py, handlers/websocket_log_queue_handler.py, log_levels.py, default_paths.py, logger_builder.py); consumer claims re-verified in freemocap v2.0.0-alpha.21, skellycam main, skellyforge main, and skellytracker/skellysync/skellypings/freemocap_blender_addon sources"
  - date: "2026-08-24"
    against: "SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones"
---

# How the rest of the polyrepo uses it

## FreeMoCap

- Declares `skellylogs` as a dependency in `pyproject.toml`, sourced from `git+https://github.com/freemocap/skellylogs`; both `freemocap` and `skellycam` lockfiles pin the same commit (`9114990350d7fb36747526286671c17abd7e523e`).
- `freemocap/__init__.py` and `freemocap/core/__init__.py` both run `configure_logging(LogLevels.TRACE)` at import time, making `TRACE` the effective global verbosity for the whole app.
- `core/pipeline/abcs/pipeline_ipc.py`: every realtime pipeline's `PipelineIPC.create()` sets the dataclass's `ws_queue` field to `get_websocket_log_queue()`, so all pipeline child processes inherit the shared log queue and their records reach the frontend alongside the main process's.
- `api/websocket/websocket_server.py`: the server's `_logs_relay` asyncio task is the consumer described preceding, it drains the queue with `get_nowait()`, drops records below `MIN_LOG_LEVEL_FOR_WEBSOCKET` (its default `ws_log_level`), tolerates `EOFError`/`OSError` from partial pickles left by dying child processes, and sends each dict to the client as JSON via its reusable msgspec encoder. App code leans on the custom levels throughout (`logger.api(...)` for route registration and lifecycle events, `logger.trace(...)` for per-frame backpressure chatter, `logger.success(...)` on startup/shutdown).
- `app/app.py` reports the installed `skellylogs` version in the startup "System info" log banner next to the other Skelly packages.

## SkellyCam

- Also declares the git-sourced dependency in `pyproject.toml`.
- `skellycam/__init__.py` configures at `LogLevels.TRACE` but overrides the file destination with its own `get_log_file_path()` (under SkellyCam's data folder), the log-file location is a per-app decision, which is exactly why `configure_logging` takes `log_file_path`.
- `core/ipc/process_management/managed_worker.py`: `ManagedProcess` threads the queue through process spawning. The child-side entry point calls `configure_logging(LOG_LEVEL, ws_queue=log_queue)` when a queue was provided (this is the intended way for children to join the log stream, per the child-process guard preceding) and calls `cancel_join_thread()` on exit so the queue feeder doesn't block shutdown.
- `core/ipc/pubsub/pubsub_topics.py`: defines a `LogsTopic` whose message type *is* `LogRecordModel` and whose publication queue defaults to `get_websocket_log_queue()`, the log stream plugs directly into SkellyCam's pubsub layer.
- `api/websocket/websocket_server.py`: mirrors FreeMoCap's `_logs_relay`, reconstructing `LogRecordModel(**logs_queue.get_nowait())` and forwarding to clients; the SkellyCam UI renders these records in its log terminal panel (documented further in the [SkellyCam websocket protocol](https://github.com/freemocap/skellycam/blob/main/skellycam-docs/docs/technical/websocket-protocol.mdx) and [logging](https://github.com/freemocap/skellycam/blob/main/skellycam-docs/docs/technical/logging.mdx) pages).

## Other repos

- **SkellyForge** does not depend on SkellyLogs. It carries its own vendored copy of the same design under `skellyforge/system/logging_configuration/` (matching `configure_logging`, `LogLevels`, `DeltaTimeFilter`, color helpers, and a simpler `QueueHandler`-based websocket handler), and its `pyproject.toml` lists neither `skellylogs` nor a git source for it.
- **SkellyTracker**, **SkellySync**, and **SkellyPings** contain no references to SkellyLogs in their sources.
- **freemocap_blender_addon** has no import or dependency on SkellyLogs either, but its `utilities/git_source_manager.py` (a generic git-source dependency cache, imported by the addon's `__init__.py`) names the SkellyLogs repo in its module docstring example and its `__main__` self-test block as a sample entry.
