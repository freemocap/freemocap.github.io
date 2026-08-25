---
title: "How it works"
type: reference
sidebar_position: 2
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones
draft: false
---

# How it works

`configure_logging()` is the single entry point. In order, it:

1. Applies the package-suppression map (`suppress_noisy_package_logs`) so chatty third-party loggers (`matplotlib`, `httpx`, `uvicorn`, `asyncio`, and more) are quieted to sane levels. Defaults come from `DEFAULT_NOISY_PACKAGES`; pass your own dict or `{}` to change this.
2. Registers four custom levels and their `logger.<name>()` methods on `logging.Logger`.
3. Resolves the websocket queue (auto-created in the main process; see below).
4. Delegates to `LoggerBuilder`, which wipes any pre-existing root-logger handlers ("last writer wins") and attaches the full handler set.

The resulting root logger looks like this:

| Component | Class | Level | Purpose |
|---|---|---|---|
| Filter | `StringifyTracebackFilter` | n/a | Formats live `exc_info` tracebacks to strings *before* any handler sees the record, then clears `exc_info`, traceback objects can't be deep-copied or pickled, which would break the color formatter's record copy and the queue transport |
| Handler | `ColoredConsoleHandler` | configured level | ANSI-colored stdout output; per-level colors plus hash-stable PID/TID colors |
| Handler | `logging.FileHandler` | always `TRACE` | Plain-text log file using `LOG_FORMAT_STRING` |
| Handler | `WebSocketQueueHandler` | configured level | Serializes each record into a `LogRecordModel` dict and `put_nowait()`s it onto the queue |
| Filter | `DeltaTimeFilter` (on all three handlers) | n/a | Adds `record.delta_t`, milliseconds since that handler's previous record, useful for spotting slow sections |

Each handler owns its own `DeltaTimeFilter` instance, so the three outputs track deltas independently per destination.
