---
title: Install FreeMoCap
type: tutorial
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): GitHub release v2.0.0-alpha.25 asset list; PyPI freemocap JSON (latest 1.8.2, no 2.x); build-installers-pyinstaller.yml matrix, code-signing steps, and CUDA routing to Cloudflare R2 (alpha.25 CUDA assets confirmed live there); freemocap-docs src/components/download/downloads.ts; freemocap.org/download; freemocap-ui electron-builder.json (NSIS, dmg/zip arm64, notarize), update-handler.ts, AutoUpdateContext.tsx and menu-builder.ts (Help > Check for Updates, manual only); skellytracker model_registry.py (models downloaded on first use); README.md development-branch install steps; .python-version (3.12). Rewritten from the alpha.21 page, which still described a conda + pip install that only reaches v1."
  - date: "2026-08-25"
    against: "freemocap clone pinned at v2.0.0-alpha.21: pyproject.toml (requires-python >=3.11, cuda/cpu extras, [project.scripts], uv git sources), README.md quickstart/install-from-source, .python-version, build-installers-pyinstaller.yml build matrix and R2 routing, freemocap-ui/electron-builder.json targets, freemocap-docs src/components/download/downloads.ts asset names"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Download

Go to the [FreeMoCap download page](https://freemocap.org/download) and get the file for your
computer:

| Your computer | File |
|---|---|
| Mac with Apple Silicon (M1 or newer) | `.dmg` |
| Windows PC | `.exe`: the CUDA version if you have an NVIDIA graphics card, otherwise the CPU version |
| Linux PC | `.deb` for Ubuntu, Debian, Mint, and similar, otherwise `.AppImage`. CUDA version if you have an NVIDIA graphics card. |

If you're not sure whether you have an NVIDIA graphics card, get the CPU version.

## Install and open FreeMoCap

<Tabs>
<TabItem value="mac" label="Mac" default>

1. Open the `.dmg`.
2. Drag FreeMoCap into your **Applications** folder.
3. Open FreeMoCap from Applications.

If macOS blocks it, open **System Settings > Privacy & Security** and click **Open Anyway**.

</TabItem>
<TabItem value="windows" label="Windows">

1. Double-click the `.exe` and follow the installer.
2. Open FreeMoCap from the Start menu.

If you see a **Windows protected your PC** message, click **More info**, then **Run anyway**.

</TabItem>
<TabItem value="linux" label="Linux">

For the `.deb`, run:

```bash
sudo apt install ./freemocap_*.deb
```

Then open FreeMoCap from your app launcher.

For the `.AppImage`, run:

```bash
chmod +x freemocap_*.AppImage
./freemocap_*.AppImage
```

</TabItem>
</Tabs>

The first launch can take a minute. Stay online for your first recording, because FreeMoCap
downloads its tracking model then.

## Update

Choose **Help > Check for Updates…**. If there's a new version, FreeMoCap offers to install it.

## Uninstall

Uninstall FreeMoCap the way you'd uninstall any app. Your recordings stay in the
`freemocap_data` folder in your home folder.

## Run from source (for developers)

Install [`uv`](https://docs.astral.sh/uv/getting-started/installation/),
[Node.js](https://nodejs.org/), and `git`, then run:

```bash
git clone https://github.com/freemocap/freemocap.git
cd freemocap
uv sync
uv run python freemocap/__main__.py
```

On Windows or Linux without an NVIDIA graphics card, use
`uv sync --no-default-groups --group cpu` instead of `uv sync`.

In a second terminal, start the interface:

```bash
cd freemocap-ui
npm install
npm run dev
```

## Next

[Make your first recording](/start/first-recording). Stuck? See
[fix an installation problem](/guides/installation-troubleshooting) or ask in `#help-requests` on
[Discord](https://discord.gg/XpRQJnqZxf).
