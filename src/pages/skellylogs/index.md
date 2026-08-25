---
title: SkellyLogs
type: reference
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones
draft: false
---

# SkellyLogs

SkellyLogs is the shared logging package for the FreeMoCap polyrepo. It is a small, opinionated wrapper around Python's stdlib `logging` module: one call to `configure_logging()` reconfigures the **root logger** so that every `logging.getLogger(...)` call in the process emits colorized console output, writes to a timestamped log file, and (optionally) pushes structured log records onto a `multiprocessing.Queue` that a websocket endpoint drains and relays to the frontend.

It has **zero runtime dependencies** (`dependencies = []` in `pyproject.toml`) and is consumed as a git dependency by `freemocap` and `skellycam`. Its self-description in `pyproject.toml`: "The logging module for FreeMoCap (and skellycams)." Part of the polyrepo's utility tier, infrastructure any of the pipeline repos can depend on.

## How it works

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

## Custom log levels

Defined in `log_levels.py` as the `LogLevels` enum and registered globally by `configure_logging()`:

| Method | Value | Use case (from source comments) |
|---|---|---|
| `logger.loop()` | 3 | Logs inside hot loops; debugging only |
| `logger.trace()` | 5 | Low-level tracing for deep debugging |
| `logger.debug()` | 10 | Detailed information for devs |
| `logger.info()` | 20 | General program information |
| `logger.success()` | 22 | Something worked |
| `logger.api()` | 25 | API call/response logging |
| `logger.warning()` | 30 | Unexpected but not necessarily an error |
| `logger.error()` | 40 | Something went wrong |

There is no CRITICAL entry in the enum. The `ALL` member maps to `NOTSET` (0) for third-party library noise.

A `log_test_messages(logger)` helper in `log_test_messages.py` emits one message at every level plus timed loop/trace pairs, for eyeballing the formatter output.

## `configure_logging` reference

```python
def configure_logging(
    level: LogLevels,
    ws_queue: multiprocessing.Queue | None = None,
    log_file_path: str | None = None,
    suppress_packages: dict[str, int] | None = None,
    use_websocket: bool = True,
) -> None:
```

| Parameter | Default | Behavior |
|---|---|---|
| `level` | required | Minimum level for the console and websocket handlers. The file handler always logs at `TRACE` regardless. |
| `ws_queue` | `None` | Queue for websocket distribution. If `None` **and** running in the main process, a new queue is created and an `atexit` cleanup hook is registered. If `None` in a **child** process, `configure_logging` returns without configuring anything. The child should instead receive the parent's queue and pass it here. |
| `log_file_path` | `None` | Log file location. `None` means the default path (below). |
| `suppress_packages` | `DEFAULT_NOISY_PACKAGES` | Map of `{logger_name: level}` applied via `setLevel`. Pass `{}` to suppress nothing. |
| `use_websocket` | `True` | When `False`, skip the websocket queue and handler entirely (console + file only). Present in the source; not yet reflected in the README. |

Typical setup, as done at import time in the consuming packages:

```python
import logging
from skellylogs import configure_logging, LogLevels

LOG_LEVEL = LogLevels.TRACE
configure_logging(LOG_LEVEL)

logger = logging.getLogger(__name__)
logger.success("Logging is configured")
```

## The websocket log queue

This is the piece the rest of the polyrepo actually builds on.

**Creation and access** (`handlers/websocket_log_queue_handler.py`):

- A single module-global `WEBSOCKET_LOG_QUEUE` singleton, created lazily by `create_websocket_log_queue()` with `maxsize=1000` (`MAX_WEBSOCKET_LOG_QUEUE_SIZE`).
- `get_websocket_log_queue()` returns it, raising `ValueError` if it was never created. Both are re-exported from the package root.
- When the queue was auto-created by `configure_logging` in the main process, an `atexit` handler closes the queue and joins its feeder thread so the process exits cleanly.

**Production side**, `WebSocketQueueHandler.emit()`:

- Hard floor of `MIN_LOG_LEVEL_FOR_WEBSOCKET = LogLevels.TRACE.value` (5): nothing below TRACE ever reaches the websocket, even if the configured level is lower. Consumers may apply a stricter gate on top (and do, see below).
- Uses **non-blocking** `put_nowait()`; if the 1000-entry queue is full the record is silently dropped. The code comment explains why: blocking the calling thread, possibly a camera frame-grab loop, to wait for the websocket relay to drain is never acceptable.
- Builds the payload from explicit field extraction rather than splatting `record.__dict__`, specifically to avoid pickling failures from unpicklable args (`cv2.VideoCapture`, camera configs), unknown fields (`taskName` on Python 3.12+), and traceback frame locals. `args` are emptied because interpolation already happened during formatting.

**Payload shape**, `LogRecordModel`, a plain dataclass re-exported from the package root. It mirrors the stdlib `LogRecord` fields (`levelname`, `pathname`, `lineno`, `funcName`, `threadName`, and more) plus SkellyLogs additions: `delta_t`, `formatted_message` (the fully rendered line), and `message_type: "log_record"` (how the frontend recognizes log frames on the wire). `model_dump()` returns the dict form; `model_dump_json()` wraps it in `json.dumps`.

**Consumption side**, a websocket relay task drains the queue and forwards records to connected clients:

```python
from skellylogs import LogRecordModel, get_websocket_log_queue

queue = get_websocket_log_queue()
while True:
    record = LogRecordModel(**queue.get_nowait())
    if record.levelno < some_minimum:
        continue
    await websocket.send_json(record.model_dump())
```

In multiprocessing applications, pass the queue handle into child processes and hand it back to `configure_logging(ws_queue=...)` there, child log records then flow through the same queue to the same websocket.

## Log files

By default, `get_log_file_path()` (in `default_paths.py`) creates `~/skellylogs_data/logs/` if needed and returns a per-run filename of the form `log_<iso8601>_gmt±N.log` (`:` replaced with `_` so it is filesystem-friendly, milliseconds marked with `ms`). The base directory can be redirected wholesale via the `SKELLYLOGS_LOG_DIR` environment variable, used by tests and CI, or overridden per-call with `log_file_path`.

## Output format

Both the file and websocket formatters use `LOG_FORMAT_STRING`; the console variant additionally wraps PID and TID in hashed ANSI colors:

```
└>> %(message)s | %(levelname)s | %(delta_t)s | %(name)s.%(funcName)s():%(lineno)s | %(asctime)s | PID:%(process)d:%(processName)s | TID:%(thread)d:%(threadName)s
```

Example lines from the README:

```
└>> Starting camera capture | INFO | 12.450ms | myapp.camera.start():42 | 2025-02-20T14:30:01.123 | PID:12345:MainProcess | TID:67890:MainThread
└>> Frame grabbed in 16ms | TRACE | 0.320ms | myapp.camera.grab():87 | 2025-02-20T14:30:01.139 | PID:12345:MainProcess | TID:67891:FrameThread
```

Timestamps are millisecond-truncated ISO-8601 (`CustomFormatter.formatTime`). Level colors come from `LOG_COLOR_CODES` (for example DEBUG blue, SUCCESS magenta, ERROR red-background); PID/TID colors are derived deterministically from `hash(process)`/`hash(thread)` by `logging_color_helpers.get_hashed_color`, constrained to be bright enough to read, never grey, and never red (red reads as an error).

## Module map

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

## How the rest of the polyrepo uses it

### FreeMoCap

- Declares `skellylogs` as a dependency in `pyproject.toml`, sourced from `git+https://github.com/freemocap/skellylogs`; both `freemocap` and `skellycam` lockfiles pin the same commit (`9114990`).
- `freemocap/__init__.py` and `freemocap/core/__init__.py` both run `configure_logging(LogLevels.TRACE)` at import time, making `TRACE` the effective global verbosity for the whole app.
- `core/pipeline/abcs/pipeline_ipc.py`: every realtime pipeline's `PipelineIPC` dataclass carries a `ws_queue` field set to `get_websocket_log_queue()`, so all pipeline child processes inherit the shared log queue and their records reach the frontend alongside the main process's.
- `api/websocket/websocket_server.py`: the server's `_logs_relay` asyncio task is the consumer described preceding, it drains the queue with `get_nowait()`, drops records below `MIN_LOG_LEVEL_FOR_WEBSOCKET` (its default `ws_log_level`), tolerates `EOFError`/`OSError` from partial pickles left by dying child processes, and sends each dict to the client as JSON. App code leans on the custom levels throughout (`logger.api(...)` for route registration and lifecycle events, `logger.trace(...)` for per-frame backpressure chatter, `logger.success(...)` on startup/shutdown).
- `app/app.py` reports the installed `skellylogs` version in the startup "System info" log banner next to the other Skelly packages.

### SkellyCam

- Also declares the git-sourced dependency in `pyproject.toml`.
- `skellycam/__init__.py` configures at `LogLevels.TRACE` but overrides the file destination with its own `get_log_file_path()` (under SkellyCam's data folder), the log-file location is a per-app decision, which is exactly why `configure_logging` takes `log_file_path`.
- `core/ipc/process_management/managed_worker.py`: `ManagedProcess` threads the queue through process spawning. The child-side entry point calls `configure_logging(LOG_LEVEL, ws_queue=log_queue)` when a queue was provided (this is the intended way for children to join the log stream, per the child-process guard preceding) and calls `cancel_join_thread()` on exit so the queue feeder doesn't block shutdown.
- `core/ipc/pubsub/pubsub_topics.py`: defines a `LogsTopic` whose message type *is* `LogRecordModel` and whose publication queue defaults to `get_websocket_log_queue()`, the log stream plugs directly into SkellyCam's pubsub layer.
- `api/websocket/websocket_server.py`: mirrors FreeMoCap's `_logs_relay`, reconstructing `LogRecordModel(**logs_queue.get_nowait())` and forwarding to clients; the SkellyCam UI renders these records in its log terminal panel (documented further in the [SkellyCam websocket protocol](https://github.com/freemocap/skellycam/blob/main/skellycam-docs/docs/technical/websocket-protocol.mdx) and [logging](https://github.com/freemocap/skellycam/blob/main/skellycam-docs/docs/technical/logging.mdx) pages).

### Other repos

- **SkellyForge** does not depend on SkellyLogs. It carries its own vendored copy of the same design under `skellyforge/system/logging_configuration/` (matching `configure_logging`, `LogLevels`, `DeltaTimeFilter`, color helpers, and a simpler `QueueHandler`-based websocket handler), and its `pyproject.toml` lists neither `skellylogs` nor a git source for it.
- **SkellyTracker**, **SkellySync**, **SkellyPings**, and the Blender addon contain no references to SkellyLogs in their sources.

[← Back to Developer Docs](/developers)
