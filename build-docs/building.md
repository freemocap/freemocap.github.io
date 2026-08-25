---
title: Building and packaging
type: how-to
sidebar_position: 11
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: FreeMoCap-docs/docs/development/building.mdx, cross-checked against FreeMoCap/__init__.py, the frontend's package.json, FreeMoCap.spec, and .github/workflows/ in the FreeMoCap clone (v2.0.0-alpha.21)
draft: false
---

# Building and packaging

FreeMoCap ships as an Electron desktop app with a bundled, frozen Python
backend, not a Python package you `pip install` and a separate frontend you
run independently. A release looks like:

```
freemocap-setup.exe (or .dmg / .AppImage)
├── freemocap-ui/          Electron + React frontend
├── freemocap_server.exe   PyInstaller-frozen Python backend
└── resources/             ONNX models, ChArUco boards, other assets
```

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
preinstalled. Development-only tooling (pytest, tkinter, IPython) and unused
packages (numba, scikit-learn, MediaPipe's own dev tools) are explicitly
excluded to keep the bundle smaller. Output is `freemocap_server.exe` on
Windows, with equivalent unsuffixed binaries on macOS and Linux.

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
| `build-installers-pyinstaller.yml` | Builds platform-specific installers on push to `main` |
| `deploy-docs.yml` | Builds and deploys this documentation site to GitHub Pages |
| `test.yml` | Runs backend and frontend tests on pull requests |
| `test-bucket.yml` | An additional test workflow, not covered elsewhere in these docs; check its own definition for scope |

## Versioning

Both halves currently report the same version, confirmed directly rather
than from a docs snapshot: `v2.0.0-alpha.21` in `freemocap/__init__.py` (
backend, managed by `bumpver`) and `2.0.0-alpha.21` in
`freemocap-ui/package.json` (frontend). The two are bumped independently, so
they can and do drift apart between releases; don't assume they'll always
match. `electron-updater` handles auto-updates for installed releases.

[← Architecture overview](/build/architecture)
