---
title: SkellyPings
type: hub
sidebar_position: 1
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "GitHub API and raw files checked 2026-10-14 (repo metadata, releases, branch comparisons), PyPI/npm metadata, and freemocap uv.lock at v2.0.0-alpha.25 for pinned commits. Added the At a glance section (role in the app, links, pinned version, install note)."
  - date: "2026-08-26"
    against: "SkellyPings source on current main re-read (root pyproject.toml, server/pyproject.toml, skellypings/__init__.py, skellypings/telemetry_client.py, server/main.py, README.md, infra/); consumer git-dependency integration re-confirmed in freemocap and skellycam pyprojects and uv.locks; all seven Contents links confirmed to existing stub-docs/skellypings files"
  - date: "2026-08-24"
    against: "SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles"
draft: false
---

# SkellyPings

SkellyPings is the anonymous telemetry system for the FreeMoCap polyrepo's desktop applications. It is two separate Python projects in one repository:

- **`skellypings/`**, a small client library that a desktop app embeds. It buffers events in memory and flushes them in batches to a telemetry server over HTTPS. Its only third-party import is `requests` (declared dependencies: `requests`, `python-dotenv`; Python >= 3.11).
- **`server/`**, the receiving end: a FastAPI service deployed to Google Cloud Run that stores events in Firestore and exports them daily as JSONL files to Cloud Storage (Python >= 3.12; FastAPI, uvicorn, `google-cloud-firestore`, `google-cloud-storage`, Pydantic, python-dotenv).

Data flow, from the repo README:

```
Desktop App (Python backend)
  -> TelemetryClient (batched, async HTTP POST)
    -> Cloud Run service (FastAPI)
      -> Firestore (primary event storage)
      -> Cloud Storage (daily JSONL backups)

Cloud Scheduler
  -> POST /backup daily at 3 AM UTC
```

Part of the polyrepo's utility tier, infrastructure any of the pipeline repos can depend on. Consumed as a git dependency by `freemocap` and `skellycam`.

## At a glance

**In the FreeMoCap app.** Sends FreeMoCap's anonymous usage pings, when they're turned on. What's collected and how to turn it off is on the [privacy page](/about/privacy).

| | |
|---|---|
| Code | [`freemocap/skellypings`](https://github.com/freemocap/skellypings) |
| Issues | [Open issues](https://github.com/freemocap/skellypings/issues) |
| Version in FreeMoCap alpha.25 | [`2fedf21`](https://github.com/freemocap/skellypings/commit/2fedf21356758569ccab069967f127a804f5241d) on `main` (0.1.0) |
| Install | Not on PyPI; use `uv add git+https://github.com/freemocap/skellypings` |
| License | AGPL-3.0 |

## Contents

- [Repository layout](/skellypings/repository-layout)
- [The telemetry client](/skellypings/telemetry-client)
- [The ingestion server](/skellypings/ingestion-server)
- [Security model](/skellypings/security-model)
- [Deployment](/skellypings/deployment)
- [Maintainer tools](/skellypings/maintainer-tools)
- [How other repos use it](/skellypings/polyrepo-integration)
