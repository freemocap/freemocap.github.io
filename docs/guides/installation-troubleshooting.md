---
title: Fix an installation problem
type: how-to
provenance: human-checked
history:
  - date: "2026-08-25"
    against: "freemocap clone pinned at v2.0.0-alpha.21: pyproject.toml requires-python and [project.scripts], .python-version, noxfile.py and .github/workflows/test.yml Python versions, Electron/FastAPI GUI per freemocap-docs intro.mdx, Qt absence sweep across all polyrepo clones, internal link to /start/install"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
We have instructions on installing FreeMoCap in our [Installation Guide](/start/install), but sometimes things don't go as smoothly as planned. This guide will help you work through common problems encountered while installing the software, and hopefully get FreeMoCap running in no time. At the bottom of the page is a list of common error messages you may see during installation, along with common solutions.

If you're still having problems installing FreeMoCap after troubleshooting with the tips below, reach out to us on our [Discord](https://discord.gg/j76UGWfEeA) to ask for more help.

## Use a New Environment
Different python projects have different dependencies, and often those dependencies can clash with each other. If you have any installation problem, our first advice is to try installing and running FreeMoCap in a new, dedicated environment. 
There's many options for creating and managing environments in Python - we recommend Poetry and Conda.

## Check your Python Version
Currently, FreeMoCap requires Python 3.11 or newer. Our development and release builds are pinned to Python 3.12, and we recommend using the most recent compatible version of Python. If installing FreeMoCap in a 3.12 environment doesn't work for you, then try it with a different python version and see if that helps.

## Check your FreeMoCap Version
FreeMoCap is under active development, and we try to address bugs as quickly as we can. It is always best to install the latest version of the software. If a prior installation isn't working, you can update versions by running `pip install freemocap --upgrade`. 

When pip begins installing the software, it will print which version it is installing. You can compare that to the most recent version [listed on PyPi](https://pypi.org/project/freemocap/) to make sure it is up to date.

## Common Error Messages

### `Command "freemocap" not recognized`
- On some python installations, you may need to type `python -m freemocap` instead of just `freemocap` to launch the gui.

### `qt.qta.plugin: Could not load the Qt platform plugin "xcb"`
- This error comes from applications built on the Qt graphical toolkit. Older (v1) releases of FreeMoCap had a Qt based graphical interface, but the current v2 application uses an Electron based interface instead and does not depend on Qt, so this error is unlikely to come from a current installation. If you are seeing it, you are probably running an old v1 install.
- On linux, some common distributions do not come with all of the libraries that are required to run Qt. Most users have been able to fix this by running:

`sudo apt-get install '^libxcb.*-dev' libx11-xcb-dev libglu1-mesa-dev libxrender-dev libxi-dev libxkbcommon-dev libxkbcommon-x11-dev`

If you use a different package manager, you may need to look up equivalent commands for your package manager.
