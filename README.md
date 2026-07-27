# FreeMoCap Docs

Free, open-source, research-grade markerless motion capture from ordinary webcams.

**This page is a placeholder.** The full docs refactor is in progress. Until it lands, this is a map of where everything currently lives.

## Main docs

Complete user documentation (install, first recording, calibration, troubleshooting) is still on the legacy site:

**[docs.freemocap.org/documentation](https://docs.freemocap.org/documentation/index_md.html)**

Fastest path from zero to a recording:

1. [Software & hardware prerequisites](https://docs.freemocap.org/documentation/software-hardware-prerequisites.html)
2. [Installation](https://docs.freemocap.org/documentation/installation.html) (Python 3.10 to 3.12, then `pip install freemocap`, then run `freemocap`)
3. [Single-camera recording](https://docs.freemocap.org/documentation/single-camera-recording.html)
4. [Multi-camera calibration](https://docs.freemocap.org/documentation/multi-camera-calibration.html)

Support: [FAQ](https://docs.freemocap.org/documentation/frequently-asked-questions-faq.html) · [Installation troubleshooting](https://docs.freemocap.org/documentation/installation-troubleshooting.html) · [Calibration troubleshooting](https://docs.freemocap.org/documentation/calibration-troubleshooting.html) · [Discord `#help-requests`](https://discord.gg/XpRQJnqZxf)

## Docs sites currently live

| Site | What it covers |
|---|---|
| [Main documentation](https://docs.freemocap.org/documentation/index_md.html) | Installing and using FreeMoCap. Start here. |
| [SkellyCam](https://docs.freemocap.org/skellycam/) | Synchronized multi-camera capture: quick start, tutorials, architecture, API. |
| [SkellyDocs](https://docs.freemocap.org/skellydocs/) | The shared docs theme itself. Only relevant if you build FreeMoCap docs. |

Everything else is documented in its repo README for now.

## Repo map

FreeMoCap is one application built on a set of "skelly" libraries, each usable on its own.

| Repo | Role |
|---|---|
| [freemocap](https://github.com/freemocap/freemocap) | The main application and GUI. Record, calibrate, triangulate, export. |
| [skellycam](https://github.com/freemocap/skellycam) | Camera backend. Frame-perfect sync across cheap USB webcams. |
| [skellytracker](https://github.com/freemocap/skellytracker) | Tracking backend. MediaPipe, RTMPose, YOLOX, Aruco, Charuco behind one API. |
| [skellyforge](https://github.com/freemocap/skellyforge) | Post-processing: interpolation and filtering of 3D data. |
| [freemocap_blender_addon](https://github.com/freemocap/freemocap_blender_addon) | Loads a processed recording into Blender as a rigged skeleton. Runs automatically at the end of a normal session; install it separately to re-run it by hand. |
| [skellydocs](https://github.com/freemocap/skellydocs) | Docusaurus theme and CLI shared by all FreeMoCap docs sites. |
| [All repos](https://github.com/freemocap/) | The full org. |

## Community and support

- [Discord](https://discord.gg/XpRQJnqZxf), the best place to ask questions and show off recordings
- [freemocap.org](https://freemocap.org), project home and [donations](https://freemocap.org/about-us.html#donate)
- [Software issues](https://github.com/freemocap/freemocap/issues)
- [Code of conduct](https://docs.freemocap.org/documentation/code-of-conduct.html) and [contributing guide](https://docs.freemocap.org/documentation/contributing-index.html)

Cite FreeMoCap via [Zenodo](https://doi.org/10.5281/zenodo.7233714). Licensed AGPL-3.0.

💀✨
