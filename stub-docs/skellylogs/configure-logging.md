---
title: "`configure_logging` reference"
type: reference
sidebar_position: 4
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones
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
