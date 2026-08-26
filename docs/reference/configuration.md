---
title: Configuration options
type: reference
sidebar_position: 14
provenance: ai-generated
draft: false
history:
  - date: "2026-08-25"
    against: "FreeMoCap source v2.0.0-alpha.21 re-checked (system/default_paths.py, system/telemetry/telemetry_config.py, system/telemetry/telemetry.py, build_info.py, api/server_constants.py, __init__.py, app/app.py, __main__.py) plus Electron main/base-folder.ts, main/api.ts, main/ipc.ts, services/python-server.ts and the SkellyPings client/server"
  - date: "2026-08-24"
    against: "FreeMoCap source v2.0.0-alpha.21 (system/default_paths.py, system/telemetry/telemetry_config.py, system/telemetry/telemetry.py, build_info.py, server_constants.py, __init__.py) plus the Electron frontend's main/base-folder.ts and services/python-server.ts"
---

# Configuration options

FreeMoCap V2 has deliberately little configuration surface. There is no
settings framework (no `pydantic` `BaseSettings`, no `.env` loading, no
app-level TOML/YAML). Runtime configuration consists of one environment
variable and two small JSON files, described below. Everything else, ports,
hostnames, log levels, is hard-coded in source.

## Environment variable: `FREEMOCAP_BASE_FOLDER`

The single environment variable the Python backend reads is defined in
`freemocap/system/default_paths.py`:

| Name | Purpose | Default when unset |
|---|---|---|
| `FREEMOCAP_BASE_FOLDER` | Root folder for all FreeMoCap data (recordings, calibrations, logs, telemetry config) | `~/freemocap_data` |

This variable is the single point where the base folder is resolved; every other
path in the app derives from it (recordings go in `<base>/recordings`,
logs in `<base>/logs_info_and_settings/logs`, and so on).

Who sets it: the Electron shell passes the user-chosen data folder to the Python
server through this variable whenever it spawns the server as a subprocess. Who
reads it: `get_default_freemocap_base_folder_path()`, at call time. When the
server runs standalone (from source, in tests), the variable is unset and the
home-directory default applies.

## Configuration files

Two JSON files hold user preferences. They are normally managed through the
desktop UI's Settings page rather than edited by hand, but their schemas are
simple and stable.

| File | Location | Read/written by | Contents |
|---|---|---|---|
| `telemetry_config.json` | `<base folder>/telemetry_config.json` | Python backend reads; Electron UI writes | `{ "telemetry_enabled": true }` |
| `freemocap-config.json` | Electron per-app config directory (see below) | Electron only | `{ "baseDataFolder": "/chosen/path" }` |

Note the division of labor: the pointer to the base folder cannot be stored
*inside* the base folder (the folder is movable), so it lives in Electron's
OS-standard config directory, the only piece of FreeMoCap state kept outside
the data folder. The telemetry opt-out lives *inside* the data folder so both
processes agree on its location.

### `telemetry_config.json`

Managed by `freemocap/system/telemetry/telemetry_config.py`:

```json
{ "telemetry_enabled": true }
```

Resolution rules:

- If the file does not exist (first launch), the backend treats telemetry as
  enabled and immediately writes the file so the UI can read the value back.
- If the file exists, the `telemetry_enabled` boolean is honored.
- If the file exists but is unreadable or malformed JSON, the backend logs a
  warning and defaults to enabled.

The telemetry initializer (`initialize_telemetry()`, called during FastAPI app
startup) checks this file before sending anything; opting out makes it a no-op.
An anonymous installation identifier is stored alongside it as
`<base folder>/telemetry_uid`, written by the SkellyPings client.

### `freemocap-config.json`

Managed by the Electron main process (`electron/main/base-folder.ts`), stored in
the platform-standard per-app location:

| Platform | Path |
|---|---|
| Windows | `%APPDATA%/freemocap/freemocap-config.json` |
| macOS | `~/Library/Application Support/freemocap/freemocap-config.json` |
| Linux | `~/.config/freemocap/freemocap-config.json` |

Its schema:

```json
{ "baseDataFolder": "/Users/me/Documents/mocap-data" }
```

Setting the key relocates the data folder via `FREEMOCAP_BASE_FOLDER`: Electron
persists it, then restarts the Python server it owns so the change takes effect
immediately (when the server is running standalone and Electron does not own
it, the change applies at its next start instead). Removing the key reverts to
`~/freemocap_data`. An unreadable file falls back to the default with a logged
error rather than failing startup.

## Build-time constants (not user-configurable)

`freemocap/build_info.py` holds metadata injected at CI build time, just before
PyInstaller packaging:

- Build metadata: git SHA, build number, timestamp, tag.
- Telemetry endpoint: the SkellyPings server URL and HMAC secret.

In a from-source/dev build these keep placeholder defaults, and telemetry events
are sent unverified (the server accepts but segregates them). These values
cannot be changed at runtime; rebuilding with different CI inputs is the only
way to alter them.

## Values that are hard-coded

For completeness, the things people most often look for a setting for, and where
they actually live in source:

| Setting | Value | Defined in |
|---|---|---|
| Server protocol / hostname | `http` / `localhost` | `freemocap/api/server_constants.py` |
| Preferred port | `53117` | `freemocap/api/server_constants.py` |
| Port scan range | preferred port, +49 more | `freemocap/api/server_constants.py` |
| Log level | `TRACE` (via SkellyLogs `configure_logging`) | `freemocap/__init__.py` |

## Not configuration

Per-recording calibration TOML files (for example
`{recording_name}_camera_calibration.toml`) are pipeline *artifacts*, not
app settings, they capture camera intrinsics/extrinsics for a given
recording session. See [recording folder structure](/reference/recording-structure).
