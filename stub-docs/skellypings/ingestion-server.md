---
title: "The ingestion server"
type: reference
sidebar_position: 4
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles
draft: false
---

# The ingestion server

Environment variables (read at startup in `server/main.py`):

| Variable | Required / Default | Purpose |
|---|---|---|
| `SKELLYPINGS_SECRET` | required | Shared HMAC secret for signature verification |
| `BACKUP_BUCKET` | required | Cloud Storage bucket for JSONL backups |
| `FIRESTORE_COLLECTION` | `telemetry_events` | Collection for signature-valid ("verified") events |
| `FIRESTORE_COLLECTION_UNVERIFIED` | `telemetry_events_unverified` | Collection for events with missing/invalid signatures |
| `RATE_LIMIT_MAX_REQUESTS` | `60` | Requests allowed per IP per window |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | Sliding-window length in seconds |
| `MAX_EVENTS_PER_REQUEST` | `100` | Reject larger batches with 413 |
| `MAX_BODY_BYTES` | `262144` (256 KiB) | Reject larger bodies with 413 |

Routes:

| Route | Auth | Behavior |
|---|---|---|
| `POST /events` | Optional signature | Validates the batch against the `TelemetryBatch` Pydantic model, writes each event to Firestore (batched writes) with added `ingested_at` and `verified` fields. Valid signatures go to the verified collection; missing or invalid ones go to the unverified collection, this captures telemetry from from-source/dev builds that lack the production secret. Responds `{"stored": N, "verified": bool}`. |
| `POST /backup` | Signature required over the literal bytes `"backup"` | Queries both collections for documents with `ingested_at` newer than the last run (tracked in a `_meta/last_backup` document), writes them to `backups/{timestamp}_{collection}.jsonl` in Cloud Storage (one JSON object per line, plus `_firestore_id`), and updates the checkpoint. Intended to be triggered by `Cloud Scheduler` daily at 03:00 UTC. |
| `GET /health` | none | Returns `{"status": "ok"}` |

Abuse and cost protection, from the same file:

- An HTTP middleware runs a thread-safe sliding-window per-IP rate limiter (keyed from `X-Forwarded-For`) *before* any route logic, returning 429 without reading the body or touching Firestore. Over-limit IPs are recorded and drained by a background thread every 30 seconds into the verified collection as synthetic `rate_limited` events shaped like `TelemetryEvent`s, so they flow through the same backup pipeline instead of generating one Firestore write per blocked request.
- Oversized uploads are rejected early: a `Content-Length` pre-check in the middleware, and a body-size check inside `/events`.
- In-memory rate-limit state is safe here because the service runs a single container (`max_instances=1`); a container restart resets the counters, which is acceptable since a restart also interrupts any ongoing flood.
