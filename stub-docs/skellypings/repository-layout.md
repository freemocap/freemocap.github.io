---
title: "Repository layout"
type: reference
sidebar_position: 2
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles
draft: false
---

# Repository layout

| Path | Contents |
|---|---|
| `skellypings/__init__.py` | Public API: `TelemetryClient`, `__version__` (0.1.0) |
| `skellypings/telemetry_client.py` | The entire client: buffering, signing, background flush thread |
| `server/main.py` | The entire server: `/events`, `/backup`, `/health`, rate limiter |
| `server/Dockerfile` | `python:3.12-slim` + `uv sync --frozen --no-dev`, runs uvicorn on port 8080 |
| `cloudbuild.yaml` | Build-push-deploy pipeline used by Cloud Build |
| `infra/main.tf` | Terraform alternative for provisioning the GCP resources |
| `stats.py`, `test_ping.py` | Maintainer-only scripts that read Firestore directly |
