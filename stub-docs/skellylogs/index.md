---
title: SkellyLogs
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "SkellyLogs source re-checked line-by-line (pyproject.toml, README.md, configure_logging.py, logger_builder.py, log_levels.py, default_paths.py, handlers/, formatters/, filters/); consumer git-dependency claims verified against freemocap and skellycam pyproject.toml files; all eight Contents link targets confirmed to exist and route at /skellylogs/ per docusaurus.config.ts stubRepos"
  - date: "2026-08-24"
    against: "SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones"
draft: false
---

# SkellyLogs

SkellyLogs is the shared logging package for the FreeMoCap polyrepo. It is a small, opinionated wrapper around Python's stdlib `logging` module: one call to `configure_logging()` reconfigures the **root logger** so that every `logging.getLogger(...)` call in the process emits colorized console output, writes to a timestamped log file, and (optionally) pushes structured log records onto a `multiprocessing.Queue` that a websocket endpoint drains and relays to the frontend.

It has **zero runtime dependencies** (`dependencies = []` in `pyproject.toml`) and is consumed as a git dependency by `freemocap` and `skellycam`. Its self-description in `pyproject.toml`: "The logging module for freemocap (and skellycam)". Part of the polyrepo's utility tier, infrastructure any of the pipeline repos can depend on.

## Contents

- [How it works](/skellylogs/how-it-works)
- [Custom log levels](/skellylogs/custom-log-levels)
- [`configure_logging` reference](/skellylogs/configure-logging)
- [The websocket log queue](/skellylogs/websocket-log-queue)
- [Log files](/skellylogs/log-files)
- [Output format](/skellylogs/output-format)
- [Module map](/skellylogs/module-map)
- [How the rest of the polyrepo uses it](/skellylogs/polyrepo-integration)
