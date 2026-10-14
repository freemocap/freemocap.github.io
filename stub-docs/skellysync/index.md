---
title: SkellySync
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "GitHub API and raw files checked 2026-10-14 (repo metadata, releases, branch comparisons), PyPI/npm metadata, and freemocap uv.lock at v2.0.0-alpha.25 for pinned commits; freemocap sync_job.py and pyproject.toml (skellysync from branch philip/rewrite), philip/rewrite README and file tree. Added At a glance and a note that FreeMoCap runs the rewrite branch; fixed the 'nothing references it' claim."
  - date: "2026-08-26"
    against: "skelly_synchronize.py's two entry-point signatures and pyproject.toml, re-confirmed directly; no other polyrepo repo's pyproject/package.json references skellysync"
  - date: "2026-08-24"
    against: "SkellySync source read directly (package code, README, the pyproject config, CI workflows)"
draft: false
---

# SkellySync

SkellySync (`skelly_synchronize`) synchronizes videos of the same event *after recording*, without needing camera timestamps. Given a folder of videos that overlap in time, it computes the temporal offset between each video and the others, trims every video to the earliest moment all cameras were recording simultaneously, and writes the results out with matching frame counts. Two synchronization methods are available: **audio cross correlation** and **first brightness change** detection. Part of the FreeMoCap polyrepo's utility tier. Since FreeMoCap v2.0.0-alpha.23, the app uses it to synchronize imported videos.

## At a glance

**In the FreeMoCap app.** Lines up videos that weren't recorded in sync. When you bring in videos with **Playback > Import Videos** and turn on synchronization, FreeMoCap uses SkellySync to align them by their audio or by a light flash. See [process a recording after the fact](/guides/posthoc-mocap).

| | |
|---|---|
| Code | [`freemocap/skellysync`](https://github.com/freemocap/skellysync) |
| Issues | [Open issues](https://github.com/freemocap/skellysync/issues) |
| Version in FreeMoCap alpha.25 | [`0231c41`](https://github.com/freemocap/skellysync/commit/0231c41a3bcb967e231163943a39dd40b50278f1) on `philip/rewrite` |
| Install | FreeMoCap installs it from GitHub. The [PyPI package](https://pypi.org/project/skelly-synchronize/) is the older `main`-branch version |
| Needs | [FFmpeg](https://ffmpeg.org/download.html), installed separately |
| License | AGPL-3.0 |

FreeMoCap uses a rewrite that lives on the [`philip/rewrite` branch](https://github.com/freemocap/skellysync/tree/philip/rewrite), which reorganizes the package into `core/`, a CLI, and an optional FastAPI server and web UI. The other pages in this section were written from the older `main` branch, so module names and entry points there may not match what FreeMoCap runs.

## Contents

- [Install and run](/skellysync/install-and-run)
- [Python API](/skellysync/python-api)
- [How synchronization works](/skellysync/how-it-works)
- [Files created](/skellysync/files-created)
- [Module map](/skellysync/module-map)
- [Testing and CI](/skellysync/testing-and-ci)
