---
title: SkellyPings
type: hub
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles
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

## Contents

- [Repository layout](/skellypings/repository-layout)
- [The telemetry client](/skellypings/telemetry-client)
- [The ingestion server](/skellypings/ingestion-server)
- [Security model](/skellypings/security-model)
- [Deployment](/skellypings/deployment)
- [Maintainer tools](/skellypings/maintainer-tools)
- [How other repos use it](/skellypings/polyrepo-integration)
