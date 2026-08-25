---
title: "The websocket log queue"
type: reference
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones
draft: false
---

# The websocket log queue

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
