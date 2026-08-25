---
title: Command line interface
type: reference
sidebar_position: 17
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: FreeMoCap source v2.0.0-alpha.21 (the pyproject config, __main__.py, server_constants.py, core/kinematics/segment_lengths.py, utilities/update_1_4_path_names.py, the Electron frontend's services)
draft: false
---

# Command line interface

FreeMoCap V2 ships exactly one installed command and one runnable diagnostic
module. There is no general-purpose argument parser: the main entry point takes
no options at all, because the desktop (Electron) app is the intended
user interface and the command exists to start the backend server.

## The `freemocap` command

`pyproject.toml` declares a single console script:

```toml
[project.scripts]
freemocap = "freemocap.__main__:run_main"
```

After installing the package (or running `uv sync` in a clone), the `freemocap`
command starts the FreeMoCap backend server. It accepts **no arguments or
flags**: `run_main()` calls `main()` with its default parameters, and none of
those parameters are exposed on the command line.

What starting it does, in order:

1. Repairs `sys.stdout`/`sys.stderr` if they are `None` (a PyInstaller frozen
   subprocess quirk that breaks libraries writing to stderr).
2. Binds to the preferred port, `53117`, killing whatever process currently
   occupies it. (The alternative, scanning upward through 50 candidate ports,
   exists in `find_available_port()` but is only reachable as a function
   parameter, not from the command line.)
3. Prints a port sentinel line to stdout: `FREEMOCAP_PORT=<port>`.
4. Creates the FastAPI app and serves it with uvicorn on `localhost`.

### The port sentinel contract

The sentinel line exists so the Electron shell can discover which port the
Python server actually bound to. The Electron `PythonServer.start()` launches
the executable as a subprocess, reads its stdout until a line beginning with
`FREEMOCAP_PORT=` appears (timing out after 30 seconds), and uses that port for
all subsequent HTTP and websocket traffic. If no sentinel arrives, the UI falls
back to the same default, `53117`.

The relevant constants live in `freemocap/api/server_constants.py` and are not
configurable:

| Constant | Value |
|---|---|
| `PROTOCOL` | `http` |
| `HOSTNAME` | `localhost` |
| `PREFERRED_PORT` | `53117` |
| `MAX_PORT_ATTEMPTS` | `50` |
| `PORT_SENTINEL` | `FREEMOCAP_PORT` |

### Shutdown behavior

The process registers handlers for `SIGINT` and `SIGTERM`; either signal sets a
global shutdown flag, asks uvicorn to exit, shuts down all registered worker
processes, and flushes telemetry. On Windows, `multiprocessing.freeze_support()`
is invoked before startup, as required for PyInstaller executables that spawn
child processes.

## Running without installing

The FreeMoCap-UI README documents launching the server from a source checkout
with:

```bash
python -m freemocap
```

This runs the same `__main__.py` module and behaves identically to the
installed command. When started this way (outside Electron), the
`FREEMOCAP_BASE_FOLDER` environment variable is typically unset and the data
folder falls back to `~/freemocap_data`, see
[configuration](/reference/configuration).

## Diagnostic CLI: segment-length report

A second, genuinely interactive command-line tool lives in the kinematics
module:

```bash
python -m freemocap.core.kinematics.segment_lengths [PATH]
```

It measures limb-segment lengths from a processed recording and assesses whether
the result is *human-shaped*: segments in anthropometric proportion (relative to
SkellyForge's canonical body model), rigid over time, and left/right symmetric.

`PATH` is a single optional positional argument accepting any of:

- a recording folder,
- an `output_data` folder,
- a `*_body_3d_xyz.csv` file directly.

When resolving a folder, the tool prefers `mediapipe_body_3d_xyz.csv` and falls
back to the first matching `*body_3d_xyz.csv`. Both wide CSV layouts
(`{name}_x/_y/_z` columns) and long layouts (`frame, keypoint, x, y, z`) are
supported. Omitting the path defaults to the bundled test recording at
`~/freemocap_data/recordings/freemocap_test_data` (adjusted if
`FREEMOCAP_BASE_FOLDER` is set).

Output is an ASCII statistics table (per-segment mean/median/std/CV/min/max and
implied standing height, plus aggregate symmetry and coverage figures) followed
by a verdict.

Exit codes:

| Code | Meaning |
|---|---|
| `0` | Human-shaped (pass) |
| `1` | Not human-shaped (fail; violations are listed) |
| `2` | No usable data found at the given path |

## Legacy migration script (not a supported command)

`freemocap/utilities/update_1_4_path_names.py` reads an optional path from
`sys.argv` and renames pre-1.5 data files (for example
`mediapipe2dData_numCams...npy` to `mediapipe_2dData_numCams...npy`). It is a
migration utility for old recordings, not part of the supported interface, and
note that on this branch it imports from
`freemocap.system.paths_and_filenames`, a package that no longer exists in the
tree, so it does not run unmodified.

## What does not exist

To set expectations for scripting:

- No `click`, `typer`, or `argparse` handling on the main entry point, no
  `--help`, `--version`, `--port`, or similar flags.
- No subcommands (no `freemocap calibrate`, `freemocap export`, and so on).
- No headless record/process pipeline driven purely from the command line;
  recording and processing are driven through the REST/websocket API that the
  desktop UI consumes (see [REST API](/reference/rest-api) and
  [websocket API](/reference/websocket-api)).
