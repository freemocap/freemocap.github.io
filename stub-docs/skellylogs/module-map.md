---
title: "Module map"
type: reference
sidebar_position: 8
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones
draft: false
---

# Module map

| Path | Contents |
|---|---|
| `skellylogs/__init__.py` | Public API: `configure_logging`, `LogLevels`, `LogRecordModel`, `get_websocket_log_queue`, `create_websocket_log_queue` |
| `configure_logging.py` | Entry point; level registration; child-process guard; atexit cleanup |
| `logger_builder.py` | `LoggerBuilder`, attaches/clears root handlers, applies `dictConfig(version=1, disable_existing_loggers=False)` |
| `log_levels.py` | `LogLevels` enum |
| `log_format_string.py` | `LOG_FORMAT_STRING`, `COLOR_LOG_FORMAT_STRING`, the `└>>` pointer |
| `default_paths.py` | Default log directory/filename, `SKELLYLOGS_LOG_DIR` env var |
| `package_log_quieters.py` | `DEFAULT_NOISY_PACKAGES` map and `suppress_noisy_package_logs()` |
| `logging_color_helpers.py` | Hashed-color generation for PIDs/TIDs |
| `log_test_messages.py` | Demo emitter covering every level |
| `filters/delta_time.py` | `DeltaTimeFilter` |
| `filters/stringify_traceback.py` | `StringifyTracebackFilter` |
| `formatters/custom_formatter.py` | `CustomFormatter` (base, ms timestamps) |
| `formatters/color_formatter.py` | `ColorFormatter` (level/PID/TID/message coloring) |
| `handlers/colored_console.py` | `ColoredConsoleHandler` (stdout) |
| `handlers/websocket_log_queue_handler.py` | `WebSocketQueueHandler`, `LogRecordModel`, queue creation/access, `MIN_LOG_LEVEL_FOR_WEBSOCKET` |

Tests live under `tests/` (pytest, no test runner configured in `pyproject.toml` beyond the `test` dependency group); a shared fixture resets root-logger state and the queue singleton between tests.
