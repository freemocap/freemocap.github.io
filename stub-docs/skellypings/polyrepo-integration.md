---
title: "How other repos use it"
type: reference
sidebar_position: 8
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles
draft: false
---

# How other repos use it

## FreeMoCap

- Declares `skellypings` in `pyproject.toml` sourced from `git+https://github.com/freemocap/skellypings`; `uv.lock` pins commit `94b9e4b5`.
- `freemocap/system/telemetry/telemetry.py` is a thin wrapper around the client. `initialize_telemetry()` is called in the FastAPI lifespan startup in `app/app.py` (with `shutdown_telemetry()` at shutdown) and constructs the client with `app_name="freemocap"` and a `user_id_file` of `<freemocap base folder>/telemetry_uid`. It immediately tracks an `app_opened` event whose payload is anonymous system specs collected with `psutil`/`platform`: OS name/version/release, architecture, Python version, physical/logical CPU counts, total RAM in GB.
- Opt-in/opt-out lives entirely in `telemetry_config.json` (`{"telemetry_enabled": true}`, written by the Electron UI's Settings/Welcome toggle; defaults to enabled on first launch). If turned off, `initialize_telemetry()` never constructs a client, and `track_event()` becomes a no-op, callers don't need to re-check the preference.
- `api/http/telemetry/telemetry_router.py` exposes `POST /freemocap/telemetry/track` (the router is registered under the `/freemocap` prefix via `FREEMOCAP_ROUTERS`) so the frontend can forward UI-originated events (for example tour analytics, with a `eventType` camelCase alias); it forwards straight into `track_event`.
- Server coordinates come from `build_info.py`: `SKELLYPINGS_SERVER_URL` is hardcoded to the production service (`https://skellypings-401698866387.northamerica-northeast1.run.app`) and `SKELLYPINGS_SECRET` defaults to the placeholder `"not-configured"`. The installer build workflow (`.github/workflows/build-installers-pyinstaller.yml`) regenerates `build_info.py` during PyInstaller builds, injecting the real secret from the `SKELLYPINGS_SECRET` GitHub secret and printing a redacted diff.
- The startup "System info" banner in `app/app.py` reports the installed `skellypings` version alongside the other Skelly packages.

## SkellyCam

- Same pattern, independently: `skellypings` is a git-sourced dependency whose `uv.lock` currently pins a different commit (`4c5bffc9`) than FreeMoCap's.
- `skellycam/system/telemetry/telemetry.py` is a near-identical wrapper (`app_name="skellycam"`, user ID file under SkellyCam's base folder, same `app_opened` system-specs payload), initialized and shut down in the lifespan of `skellycam/app.py`. Unlike FreeMoCap it defines no HTTP tracking route, only the startup event flows through it.
- Its own `skellycam/system/telemetry/build_info.py` carries the same server URL and placeholder secret, overwritten by its installer build workflow from the shared org-level `SKELLYPINGS_SECRET` secret.

## Other repos

- **SkellyTracker**, **SkellyForge**, **SkellySync**, **SkellyDocs**, and the Blender addon contain no references to SkellyPings in their sources.
