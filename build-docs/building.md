---
title: Building and packaging
type: how-to
sidebar_position: 11
provenance: ai-generated
inFlux: "This building and packaging page is a stand-in for the core freemocap repo's own developer docs, still being consolidated there; expect it to move once that lands."
history:
  - date: "2026-08-26"
    against: "freemocap.spec, freemocap/__init__.py, pyproject.toml ([tool.bumpver] and project scripts/extras), freemocap-ui/package.json, freemocap-ui/electron-builder.json, freemocap-ui/src/i18n/i18n.ts (locale count), and all four .github/workflows/*.yml trigger definitions in the v2.0.0-alpha.21 clone; runtime model cache paths checked in the skellytracker clone"
  - date: "2026-08-24"
    against: "FreeMoCap-docs/docs/development/building.mdx, cross-checked against FreeMoCap/__init__.py, the frontend's package.json, FreeMoCap.spec, and .github/workflows/ in the FreeMoCap clone (v2.0.0-alpha.21)"
draft: false
---

# Building and packaging

FreeMoCap ships to users as an Electron desktop app with a bundled, frozen
Python backend. The repository is also set up as an installable Python
package (its `pyproject.toml` defines a `freemocap` console script and
`cuda`/`cpu` extras for pip users), but the user-facing release artifacts
are these installers:

```
FreeMoCap_2.0.0-alpha.21_x64_installer.exe
│   (NSIS on Windows; .dmg and .zip on Apple Silicon macOS,
│    .AppImage and .deb on Linux)
├── FreeMoCap(.exe)     Electron launcher
└── resources/
    ├── app.asar        Electron + React frontend (dist/, dist-electron/)
    └── app.asar.unpacked/
        ├── freemocap_server/   PyInstaller onedir bundle: the
        │                       freemocap_server(.exe) launcher beside its
        │                       _internal/ tree of DLLs and data files
        └── freemocap-logo.png
```

Model weights are not in the installer. RTMPose and YOLOX ONNX models and
MediaPipe `.task` files are downloaded at first use and cached under the home
directory (`~/.cache/skellytracker/models` and
`~/.freemocap/skellytracker-models`, respectively).

## PyInstaller for the backend

The Python backend is frozen into a standalone executable via PyInstaller,
configured by `freemocap.spec` at the repo root:

```bash
pyinstaller freemocap.spec
```

The entry point is `freemocap/__main__.py`; the bundle carries OpenCV, SciPy,
pandas, MediaPipe, ONNX Runtime (both GPU and CPU execution providers), the
NVIDIA CUDA libraries it needs, and the other Skelly packages (SkellyCam,
SkellyTracker, SkellyForge) as real dependencies rather than expecting them
preinstalled. CUDA collection is gated on `FREEMOCAP_BUILD_VARIANT=cuda`
(the default); CPU-variant builds skip the NVIDIA packages entirely.
Development-only tooling (pytest, tkinter, IPython) and unused packages
(numba, scikit-learn, MediaPipe's own dev tools) are explicitly excluded to
keep the bundle smaller. Output is a onedir bundle named `freemocap_server`
(`freemocap_server.exe` on Windows, equivalent unsuffixed launchers on macOS
and Linux): a launcher executable beside an `_internal/` tree of DLLs and
data files, not a single self-contained file. The spec also adds
`run_blender_export.py` and the `freemocap_blender_addon` package source to
the bundle as loose data files, because Blender executes them with its own
Python interpreter, which cannot load them from PyInstaller's embedded
archive.

## Electron Builder for the frontend

The React frontend is packaged with `electron-builder`
(`freemocap-ui/electron-builder.json`):

```bash
cd freemocap-ui

npm run dev       # development: Vite + Electron together
npm run build     # production build
npm run preview   # preview the production build
```

Key packaged dependencies: React 19, Redux Toolkit, Three.js (via
`@react-three/fiber` and `@react-three/drei`), the Monaco editor, D3, and
i18next for the frontend's 41 locales.

## CI/CD

Build and deploy workflows live in `.github/workflows/`:

| Workflow | Purpose |
|---|---|
| `build-installers-pyinstaller.yml` | Builds the platform-specific installers (CPU and CUDA variants) on pushes to `development` and on `v*` tags, then assembles a draft GitHub Release on tag pushes |
| `deploy-docs.yml` | Builds and deploys the repository's own docs site (`freemocap-docs/`) to GitHub Pages, not the freemocap.github.io site this page belongs to |
| `test.yml` | Backend tests and a frontend typecheck on pull requests to `main` and `development` |
| `test-bucket.yml` | Manual smoke test that uploads a file to the Cloudflare R2 release bucket |

## Versioning

Both halves currently report the same version: `v2.0.0-alpha.21` in
`freemocap/__init__.py` (backend) and `2.0.0-alpha.21` in
`freemocap-ui/package.json` (frontend). There is one canonical version
string, `current_version` under `[tool.bumpver]` in `pyproject.toml`, and a
bump (e.g. `uv run poe bump-alpha`) rewrites the Python and Electron version
strings together in a single commit and tag, so the two move in lockstep
across releases; they can only diverge if someone edits one of the files by
hand. `electron-updater` handles auto-updates for installed releases.

[← Architecture overview](/build/architecture)
