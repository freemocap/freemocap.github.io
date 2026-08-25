---
title: "Log files"
type: reference
sidebar_position: 6
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones
draft: false
---

# Log files

By default, `get_log_file_path()` (in `default_paths.py`) creates `~/skellylogs_data/logs/` if needed and returns a per-run filename of the form `log_<iso8601>_gmt±N.log` (`:` replaced with `_` so it is filesystem-friendly, milliseconds marked with `ms`). The base directory can be redirected wholesale via the `SKELLYLOGS_LOG_DIR` environment variable, used by tests and CI, or overridden per-call with `log_file_path`.
