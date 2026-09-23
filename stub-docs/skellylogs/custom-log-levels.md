---
title: "Custom log levels"
type: reference
sidebar_position: 3
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "skellylogs/log_levels.py (LogLevels enum) read directly, every value in the table (LOOP 3, TRACE 5, DEBUG 10, INFO 20, SUCCESS 22, API 25, WARNING 30, ERROR 40) confirmed exact; log_test_messages.py confirmed to exist"
  - date: "2026-08-24"
    against: "SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones"
draft: false
---

# Custom log levels

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
