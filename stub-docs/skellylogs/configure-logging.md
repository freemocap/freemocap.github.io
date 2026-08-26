---
title: "`configure_logging` reference"
type: reference
sidebar_position: 4
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Re-checked against SkellyLogs main: configure_logging.py, logger_builder.py, default_paths.py, package_log_quieters.py, log_levels.py, and tests/test_configure_logging.py read directly; consumer call sites re-verified in freemocap/freemocap/__init__.py (v2.0.0-alpha.21) and skellycam __init__.py plus managed_worker.py"
  - date: "2026-08-24"
    against: "SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones"
draft: false
---

# `configure_logging` reference

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
| `level` | required | Minimum level for the console and websocket handlers. The file handler is configured at `TRACE`, but records must also pass the root logger (which is set to `level`), so in practice nothing below `level` reaches the file either. The `TRACE` file-handler setting only differs from `level` when `level` itself is below `TRACE` (e.g. `LogLevels.ALL`). |
| `ws_queue` | `None` | Queue for websocket distribution. If `None` **and** running in the main process, a new queue is created and an `atexit` cleanup hook is registered. If `None` in a **child** process, `configure_logging` returns before configuring any handlers (package suppression and custom level registration still run). The child should instead receive the parent's queue and pass it here. |
| `log_file_path` | `None` | Log file location. `None` means the default path, `~/skellylogs_data/logs/<iso8601 timestamp>.log` (redirectable via the `SKELLYLOGS_LOG_DIR` environment variable). |
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
