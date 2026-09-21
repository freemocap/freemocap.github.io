---
title: Install FreeMoCap
type: tutorial
provenance: human-checked
history:
  - date: "2026-08-25"
    against: "freemocap clone pinned at v2.0.0-alpha.21: pyproject.toml (requires-python >=3.11, cuda/cpu extras, [project.scripts], uv git sources), README.md quickstart/install-from-source, .python-version, build-installers-pyinstaller.yml build matrix and R2 routing, freemocap-ui/electron-builder.json targets, freemocap-docs src/components/download/downloads.ts asset names"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> If you're already familiar with Python environments and package installation, you can get started with FreeMoCap by
> simply:
>
>    **1. Create a Python environment (`python3.12` recommended)**
>
>    **2. Enter command: `pip install freemocap[cuda]` (Windows/Linux with an NVIDIA GPU), or `pip install freemocap[cpu]`**
>
>    **3. Enter command: `freemocap`**
>
>    And you're off to the races.

FreeMoCap offers two easy ways to install: through `pip`, Python's package manager,
or through the dedicated installers, which bundle everything FreeMoCap needs and manage the installation for you,
acting like a dedicated executable or app. Both ways of installing FreeMoCap give you the same features,
so choose whichever is easiest for you. The source code is always directly available on
[GitHub](https://github.com/freemocap/freemocap).

## Detailed pip installation instructions

<details>
<summary>Step 0 - Install Anaconda or Miniconda</summary>

If you haven't already, you need to install [Anaconda](https://www.anaconda.com/download)
or [Miniconda](https://docs.conda.io/en/latest/miniconda.html) on your system. These tools make managing Python projects
and environments easier.

:::note
`conda` is the most beginner-friendly way to create a virtual environment.
Any other method for creating a virtual environment (`venv`, `poetry`, etc) should work just as well.
:::

> For those not familiar with Python environments, it's recommended to use `conda`. If you'd like more information, here
> is a helpful [guide from Real Python](https://realpython.com/python-virtual-environments-a-primer/) about Python
> virtual
> environments.

</details>

<details>
<summary>Step 1 -  Open a terminal window</summary>

<Tabs>
<TabItem value="windows" label="Windows" default>

Press the `Windows key`, type "Anaconda Prompt," and press Enter.

</TabItem>
<TabItem value="mac" label="Mac">

Press `command + spacebar` and type "terminal" and press Enter.

</TabItem>
<TabItem value="linux" label="Linux">

Press `ctrl + alt + t` to open a terminal window.

</TabItem>
</Tabs>

</details>

<details>
<summary>Step 2 -  Create a new Python environment</summary>

To create a new Python environment with the recommended version 3.12, type the following text into the terminal
and push `Enter`:

```Bash
conda create -n freemocap-env python=3.12 -y
```

> This is a `conda` command `create`s a `-n`ew isolated `python` (version `=3.12`) environment named `freemocap-env`.
> `-y` option automatically confirms the prompt to proceed with the environment setup.

After creating the environment, activate it using:

```Bash
conda activate freemocap-env
```

Now your terminal is set to operate within the `freemocap-env` environment.

</details>

<details>
<summary>Step 3 - Install FreeMoCap software</summary>

<Tabs>
<TabItem value="install-from-pip" label="Install from pip" default>

:::note
Recommended for beginners and non-programmers
:::

Type the text below into the Terminal and press `Enter`:

```Bash
# Windows/Linux with an NVIDIA GPU:
pip install freemocap[cuda]

# macOS, or Windows/Linux without a supported NVIDIA GPU:
pip install freemocap[cpu]
```

A bunch of text should stream by for while, and when it is done, enter the command: 

```Bash
freemocap
```
 
With any luck, the GUI window should pop up.

Keep an eye on the Terminal window, it provides useful information as the software runs.

> These commands download a pre-compiled copy of `freemocap` hosted on [PyPi](https://pypi.org/project/freemocap/).
> You must pick one of the two extras: `[cuda]` adds GPU-accelerated pose tracking (via `skellytracker`) for Windows and
> Linux machines with an NVIDIA GPU, while `[cpu]` adds the CPU-only version of that tracker for everyone else.
> A plain `pip install freemocap` succeeds, but installs without its tracker, so always use one of the two
> preceding commands.
> 
> The pip package manager automatically fetches the latest stable binary distribution, which is often in the Wheel format (.whl). A "Wheel" is a built-package format that can speed up the installation process, as it does not require compiling the software from source.

</TabItem>
<TabItem value="install-from-source-code" label="Install from Source Code">

:::note
Recommended for developers
:::

To install FreeMoCap from the source code for development purposes, clone the repository from GitHub and install its dependencies with [`uv`](https://github.com/astral-sh/uv), since they are pulled directly from other GitHub repositories. Here is the step-by-step procedure to do so:

1. Open a Terminal.
2. Clone the FreeMoCap repository using git:
```Bash
git clone https://github.com/freemocap/freemocap.git
```
3. Navigate to the cloned repository directory:
```Bash
cd freemocap
```
4. Create a virtual environment and install the dependencies (this automatically picks the GPU-accelerated tracker on Windows/Linux, or the CPU-only one on macOS):
```Bash
uv venv
uv sync
```

5. Start the Python backend by entering the command: 

```Bash
uv run python freemocap/__main__.py
```

Then, in a second terminal, start the Electron GUI:

```Bash
cd freemocap-ui
npm install
npm run dev
```

> FreeMoCap pulls its sub-repos (`skellytracker`, `skellycam`, etc.) directly from GitHub via `uv`, so the older recipe
> of creating a `conda` environment and running `pip install -e .` does not work here, use `uv` instead.
> Running from source this way means changes you make to the source code immediately affect the running app
> without needing a re-installation. This is especially useful for developers who are modifying the code and testing
> their changes frequently.

</TabItem>
</Tabs>

</details>

## Detailed desktop installer instructions

:::note
The installer filenames below follow the current release naming, which is still settling down during the alpha. If a specific link doesn't resolve, just grab the matching file straight from the [Releases page](https://github.com/freemocap/freemocap/releases).
:::

<details>
<summary>Step 0 - Download the Release</summary>

To begin, download the latest release from the [Releases page](https://github.com/freemocap/freemocap/releases)

You'll find more than one file for each major operating system. Pick your architecture first, then choose between the GPU (CUDA) and CPU-only variants:

- **Windows**: an `.exe` installer for Intel/AMD (x64) machines, in both GPU (CUDA) and CPU-only versions.
- **Mac**: a `.dmg` installer (or a portable `.zip`) for Apple Silicon Macs only. There is no Intel Mac build yet.
- **Linux**: an `.AppImage` (or `.deb`) for x64 machines, in both GPU (CUDA) and CPU-only versions.

The Linux GPU (CUDA) build is too large to host on GitHub, so it downloads from a content-delivery network instead of appearing directly on the Releases page. If you do not have an NVIDIA GPU, choose the CPU-only variant.

</details>

<details>
<summary>Step 1 - Unzip and Move App</summary>

Unzip the app using your chosen method and drag the Skelly icon to where you want FreeMoCap to live, 
for example your Desktop or Applications folder.

</details>

<details>
<summary>Step 2 - Run (and Wait!)</summary>

:::note
This step requires an **internet connection** the first time you run it, and takes up a few gigabytes of disk space.
It also takes a while, so be patient and let the installer do its thing.

Don't worry, once you've run FreeMoCap through the installer successfully once, subsequent launches are much faster.
:::

Now, just double-click the installer to run it, and wait for the window to open. The first time you open the installer,
it sets up FreeMoCap on your machine. Be patient, as this can take several minutes depending on your machine.

If the installation does get interrupted or corrupted, you can delete the installed copy and run the installer again.

As an app/executable downloaded from the internet, FreeMoCap may be flagged by your system's security settings.
You may need to approve FreeMoCap through your system settings to run it for the first time.

*On a Mac*, the first time you open the app, it may tell you it is from an unidentified developer and ask if you would like to move it to the trash. 
Close out of that window, right-click the app, click Open, and choose to open the file. 
Once you have done this once, you can open the app as normal in the future. 
For more information, see the [official Apple documentation](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac).

</details>

<details>
<summary>Step 3 - OPTIONAL: updating or Removing the App</summary>

The installed app keeps itself up to date: when a new release goes out, FreeMoCap notices and offers to update itself, no manual commands required.

<br/>

To remove FreeMoCap, uninstall it with your operating system's usual mechanism (Add/Remove Programs on Windows, drag the app to the Trash on Mac, or remove the `.AppImage`/`.deb` package on Linux).

This deletes the app itself (but not your `freemocap_data` folder, which holds your recordings).

</details>

If all goes well, a GUI Window with Skelly's face should pop up, looking something like this:

![FreeMoCap-gui-welcome-screen.png](/img/v1/freemocap-gui-welcome-screen.png)

## Congrats, you're in

After following these steps, you should have FreeMoCap installed and ready to use.

You're ready to get [Your first recording.](/start/first-recording)

:::note
**Installation problem?**

First thing - Did you make a [Python environment](#detailed-pip-installation-instructions)?

That is the root of most installation problems, so double check that part first.

If that didn't help,  check here for solutions to common problems: [installation Troubleshooting](/guides/installation-troubleshooting)
:::
