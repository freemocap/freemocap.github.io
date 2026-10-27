---
title: SkellyLogs
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "GitHub API and raw files checked 2026-10-14 (repo metadata, releases, branch comparisons), PyPI/npm metadata, and freemocap uv.lock at v2.0.0-alpha.25 for pinned commits. Added the At a glance section (role in the app, links, pinned version, install note)."
  - date: "2026-08-26"
    against: "SkellyLogs source re-checked line-by-line (pyproject.toml, README.md, configure_logging.py, logger_builder.py, log_levels.py, default_paths.py, handlers/, formatters/, filters/); consumer git-dependency claims verified against freemocap and skellycam pyproject.toml files; all eight Contents link targets confirmed to exist and route at /skellylogs/ per docusaurus.config.ts stubRepos"
  - date: "2026-08-24"
    against: "SkellyLogs source and README read directly; consumer usage verified in FreeMoCap and SkellyCam clones"
draft: false
---

# SkellyLogs

SkellyLogs is the shared logging package for the FreeMoCap polyrepo. It is a small, opinionated wrapper around Python's stdlib `logging` module: one call to `configure_logging()` reconfigures the **root logger** so that every `logging.getLogger(...)` call in the process emits colorized console output, writes to a timestamped log file, and (optionally) pushes structured log records onto a `multiprocessing.Queue` that a websocket endpoint drains and relays to the frontend.

It has **zero runtime dependencies** (`dependencies = []` in `pyproject.toml`) and is consumed as a git dependency by `freemocap` and `skellycam`. Its self-description in `pyproject.toml`: `The logging module for freemocap (and skellycam)`. Part of the polyrepo's utility tier, infrastructure any of the pipeline repos can depend on.

## At a glance

**In the FreeMoCap app.** Writes FreeMoCap's log files and feeds the log panel at the bottom of the app. Logs go to `skellylogs_data/logs` in your home folder; attach the newest one when you [report a bug](/guides/report-a-bug).

| | |
|---|---|
| Code | [`freemocap/skellylogs`](https://github.com/freemocap/skellylogs) |
| Issues | [Open issues](https://github.com/freemocap/skellylogs/issues) |
| Version in FreeMoCap alpha.25 | [`9114990`](https://github.com/freemocap/skellylogs/commit/9114990350d7fb36747526286671c17abd7e523e) on `main` (0.1.0) |
| Install | Not on PyPI; use `uv add git+https://github.com/freemocap/skellylogs` |
| License | AGPL-3.0 |

These pages describe SkellyLogs' `main` branch, which is 11 commits ahead of the copy FreeMoCap alpha.25 uses. One difference you might notice: the `SKELLYLOGS_LOG_DIR` environment variable exists on `main` but not in FreeMoCap's copy, so the app's logs always go to `~/skellylogs_data/logs`.

## Contents

- [How it works](/skellylogs/how-it-works)
- [Custom log levels](/skellylogs/custom-log-levels)
- [`configure_logging` reference](/skellylogs/configure-logging)
- [The websocket log queue](/skellylogs/websocket-log-queue)
- [Log files](/skellylogs/log-files)
- [Output format](/skellylogs/output-format)
- [Module map](/skellylogs/module-map)
- [How the rest of the polyrepo uses it](/skellylogs/polyrepo-integration)
