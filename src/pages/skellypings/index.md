---
title: SkellyPings
type: reference
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

## Repository layout

| Path | Contents |
|---|---|
| `skellypings/__init__.py` | Public API: `TelemetryClient`, `__version__` (0.1.0) |
| `skellypings/telemetry_client.py` | The entire client: buffering, signing, background flush thread |
| `server/main.py` | The entire server: `/events`, `/backup`, `/health`, rate limiter |
| `server/Dockerfile` | `python:3.12-slim` + `uv sync --frozen --no-dev`, runs uvicorn on port 8080 |
| `cloudbuild.yaml` | Build-push-deploy pipeline used by Cloud Build |
| `infra/main.tf` | Terraform alternative for provisioning the GCP resources |
| `stats.py`, `test_ping.py` | Maintainer-only scripts that read Firestore directly |

## The telemetry client

```python
from pathlib import Path
from skellypings import TelemetryClient

telemetry = TelemetryClient(
    server_url="https://your-cloud-run-url.run.app",
    secret="your-64-char-secret",
    app_name="my_app",
    app_version="1.0.0",
    user_id_file=Path.home() / "my_app_data" / "telemetry_uid",
)
telemetry.track("feature_used", payload={"feature": "export_csv"})
```

Constructor parameters:

| Parameter | Default | Behavior |
|---|---|---|
| `server_url` | required | Base URL of the Cloud Run service (trailing slash stripped) |
| `secret` | required | Shared HMAC secret; never sent over the wire, only used to sign request bodies |
| `app_name` | required | Stamped onto every event |
| `app_version` | required | Stamped onto every event |
| `user_id_file` | required | Path where a persistent anonymous ID (a random `uuid4().hex`) is stored; created on first run and reused afterwards |
| `flush_interval_seconds` | `60.0` | Maximum time buffered events wait before flushing |
| `flush_batch_size` | `50` | Flush immediately once this many events are buffered |

Behavior, all from `telemetry_client.py`:

- `track(event_type, payload=None)` builds an event containing `event_type`, `app_name`, `app_version`, `os_platform` (`platform.system() platform.release()`), `user_id`, `timestamp` (epoch float), `timestamp_iso8601`, and `payload`. Events accumulate under a lock; reaching the batch size triggers an immediate flush.
- Flushing happens on a daemon background thread named `telemetry-flush`, which sleeps for the interval (with exponential backoff on repeated failures, capped at 15 minutes) and POSTs to `{server_url}/events` with a 10-second timeout.
- Every request body is signed with HMAC-SHA256 and sent in the `X-Telemetry-Signature` header.
- Failures never crash the host app, they log warnings. Failed batches are returned to the front of the buffer for retry. If the buffer exceeds 500 events (`_MAX_BUFFER_SIZE`), the oldest are dropped.
- After 5 consecutive failures (`_MAX_CONSECUTIVE_FAILURES`), the client permanently disables itself and discards its buffer. Per the code, this cutoff applies to persistent auth errors (HTTP 401/403) and to generic exceptions (network failures); other HTTP error statuses keep retrying, bounded only by the 500-event buffer cap.
- `shutdown()` flushes remaining events, stops the thread, and joins it (5-second timeout). It is registered with `atexit` in the constructor automatically, so buffered events survive normal process exit even if the host forgets to call it.

## The ingestion server

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

## Security model

From the README and mirrored in both codebases:

- The endpoint is publicly reachable (Cloud Run allows unauthenticated invocation), but authenticity comes from an HMAC-SHA256 signature computed over the raw request body using a shared secret, compared with `hmac.compare_digest` on the server. The secret never crosses the wire, only the digest does, and a valid signature cannot be forged without it. Rotating means changing one environment variable on Cloud Run and the value baked into clients.
- The secret is stored as a Cloud Run environment variable, not in any repository.
- Consumers inject their copy at CI build time (see below); local development uses a placeholder that fails verification, so dev events simply land in the unverified collection rather than being rejected.

## Deployment

The README documents three interchangeable setup paths, gcloud CLI, GCP web console, and Terraform, all producing the same resources: a Cloud Run service (256 MiB, 1 CPU, min 0 / max 1 instances, unauthenticated invocations), a native-mode Firestore database, a Cloud Storage backup bucket, and a `Cloud Scheduler` job hitting `/backup` daily at 03:00 UTC with an OIDC token. Notable repo-specific details:

- `cloudbuild.yaml` builds `server/Dockerfile` and deploys a Cloud Run service named `skellypings` in region `northamerica-northeast1`, setting `SKELLYPINGS_SECRET`, `BACKUP_BUCKET`, and `FIRESTORE_COLLECTION=telemetry_events` from substitutions. (The Terraform config and the README's CLI walkthrough instead name the service `telemetry`.)
- `infra/main.tf` provisions the Firestore database, a backup bucket with a lifecycle rule deleting objects after 365 days, the Cloud Run service definition with a placeholder image (the real container is deployed afterward via Cloud Build's GitHub integration or `gcloud run deploy`), the scheduler service account, and the daily job. The scheduler's `X-Telemetry-Signature` header cannot be computed at plan time. It must be set manually after deploy, as spelled out in the README's Option C steps and the `scheduler_signature_command` output.
- Billing guidance in the README: the design targets $0/month within GCP free tiers; capping Cloud Run at one instance bounds compute cost, but Google bills rather than hard-stops past free limits, so budget alerts are recommended.

## Maintainer tools

Both live at the repo root and require `.env` values plus GCP app-default credentials for the telemetry project (`freemocap-user-pings`, per their docstrings):

- `test_ping.py`, round-trip smoke test: sends one signed `test_ping` event, then reads it back out of Firestore (choosing the verified or unverified collection based on the server's response) and asserts every field survived storage.
- `stats.py`, ad-hoc totals streamed from both collections: counts by app, event type, version, OS, unique users, and the 20 most recent pings.

These scripts import `google-cloud-firestore`, which the root `pyproject.toml` deliberately places in an `admin` dependency group rather than runtime dependencies, so `pip install skellypings` and downstream consumers stay lightweight.

## How other repos use it

### FreeMoCap

- Declares `skellypings` in `pyproject.toml` sourced from `git+https://github.com/freemocap/skellypings`; `uv.lock` pins commit `94b9e4b5`.
- `freemocap/system/telemetry/telemetry.py` is a thin wrapper around the client. `initialize_telemetry()` is called in the FastAPI lifespan startup in `app/app.py` (with `shutdown_telemetry()` at shutdown) and constructs the client with `app_name="freemocap"` and a `user_id_file` of `<freemocap base folder>/telemetry_uid`. It immediately tracks an `app_opened` event whose payload is anonymous system specs collected with `psutil`/`platform`: OS name/version/release, architecture, Python version, physical/logical CPU counts, total RAM in GB.
- Opt-in/opt-out lives entirely in `telemetry_config.json` (`{"telemetry_enabled": true}`, written by the Electron UI's Settings/Welcome toggle; defaults to enabled on first launch). If turned off, `initialize_telemetry()` never constructs a client, and `track_event()` becomes a no-op, callers don't need to re-check the preference.
- `api/http/telemetry/telemetry_router.py` exposes `POST /freemocap/telemetry/track` (the router is registered under the `/freemocap` prefix via `FREEMOCAP_ROUTERS`) so the frontend can forward UI-originated events (for example tour analytics, with a `eventType` camelCase alias); it forwards straight into `track_event`.
- Server coordinates come from `build_info.py`: `SKELLYPINGS_SERVER_URL` is hardcoded to the production service (`https://skellypings-401698866387.northamerica-northeast1.run.app`) and `SKELLYPINGS_SECRET` defaults to the placeholder `"not-configured"`. The installer build workflow (`.github/workflows/build-installers-pyinstaller.yml`) regenerates `build_info.py` during PyInstaller builds, injecting the real secret from the `SKELLYPINGS_SECRET` GitHub secret and printing a redacted diff.
- The startup "System info" banner in `app/app.py` reports the installed `skellypings` version alongside the other Skelly packages.

### SkellyCam

- Same pattern, independently: `skellypings` is a git-sourced dependency whose `uv.lock` currently pins a different commit (`4c5bffc9`) than FreeMoCap's.
- `skellycam/system/telemetry/telemetry.py` is a near-identical wrapper (`app_name="skellycam"`, user ID file under SkellyCam's base folder, same `app_opened` system-specs payload), initialized and shut down in the lifespan of `skellycam/app.py`. Unlike FreeMoCap it defines no HTTP tracking route, only the startup event flows through it.
- Its own `skellycam/system/telemetry/build_info.py` carries the same server URL and placeholder secret, overwritten by its installer build workflow from the shared org-level `SKELLYPINGS_SECRET` secret.

### Other repos

- **SkellyTracker**, **SkellyForge**, **SkellySync**, **SkellyDocs**, and the Blender addon contain no references to SkellyPings in their sources.

[← Back to Developer Docs](/developers)
