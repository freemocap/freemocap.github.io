---
title: Fix an installation problem
type: how-to
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): release assets and freemocap.org/download; freemocap-ui python-server startup; skellylogs default_paths (log folder). Rewritten for the desktop installer; pip/Qt entries removed as v1-only."
  - date: "2026-08-25"
    against: "freemocap clone pinned at v2.0.0-alpha.21: pyproject.toml requires-python and [project.scripts], .python-version, noxfile.py and .github/workflows/test.yml Python versions, Electron/FastAPI GUI per freemocap-docs intro.mdx, Qt absence sweep across all polyrepo clones, internal link to /start/install"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

# Fix an installation problem

If FreeMoCap won't install or open, try these in order. If nothing works, ask in
`#help-requests` on [Discord](https://discord.gg/XpRQJnqZxf) or
[report a bug](/guides/report-a-bug).

## Get the latest version

New versions fix a lot of bugs. Download the latest installer from the
[FreeMoCap download page](https://freemocap.org/download) and install it over your current one.

## Mac: "FreeMoCap can't be opened"

Open **System Settings > Privacy & Security**, scroll down, and click **Open Anyway** next to
the FreeMoCap message.

## Windows: "Windows protected your PC"

Click **More info**, then **Run anyway**.

## Linux: the AppImage doesn't open

Make sure the file is allowed to run:

```bash
chmod +x freemocap_*.AppImage
```

On Ubuntu 22.04 and newer, AppImages also need FUSE. Install it with
`sudo apt install libfuse2` (on Ubuntu 24.04, `sudo apt install libfuse2t64`), or use the `.deb`
instead.

## The window opens but stays stuck loading

FreeMoCap starts its processing engine in the background when it opens, and the first launch can
take a minute or two. If it never finishes, quit FreeMoCap completely and open it again.

## Processing is very slow

On Windows or Linux with an NVIDIA graphics card, install the CUDA version of FreeMoCap from the
[download page](https://freemocap.org/download). See
[set up GPU acceleration](/guides/gpu-setup).

## Sending logs with a bug report

FreeMoCap writes log files to the `skellylogs_data/logs` folder in your home folder. Attach the
newest one when you ask for help.
