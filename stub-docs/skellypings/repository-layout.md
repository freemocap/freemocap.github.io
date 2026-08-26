---
title: "Repository layout"
type: reference
sidebar_position: 2
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "Re-checked every row against SkellyPings on pinned ref main: skellypings/__init__.py (public API and version), telemetry_client.py (buffering, signing, flush thread), server/main.py (routes /events /backup /health, rate limiter), server/Dockerfile (base image, uv sync flags, port 8080), cloudbuild.yaml (build-push-deploy steps), infra/main.tf (provisioned resources), stats.py and test_ping.py (direct Firestore reads), plus README and root pyproject"
  - date: "2026-08-24"
    against: "SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles"
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
