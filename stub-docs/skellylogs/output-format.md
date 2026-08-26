---
title: "Output format"
type: reference
sidebar_position: 7
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "skellylogs/log_format_string.py (LOG_FORMAT_STRING, COLOR_LOG_FORMAT_STRING) and logging_color_helpers.py (get_hashed_color) read directly, format string structure and hashed-color behavior both confirmed"
  - date: "2026-08-24"
    against: "SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones"
draft: false
---

# Output format

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
