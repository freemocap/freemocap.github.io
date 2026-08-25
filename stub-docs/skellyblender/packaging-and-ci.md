---
title: "Packaging and CI"
type: reference
sidebar_position: 10
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# Packaging and CI

Builds use flit (`flit_core`). Two workflows fire on `v*` tags: `flit_publish_to_pypi.yml` publishes the package to PyPI, and `create_addon_install_zip.yaml` zips the package folder as `freemocap_blender_addon_<version>.zip`, generates release notes with click-through install steps, and publishes the GitHub Release users download the addon from. The zip workflow can also be triggered manually via `workflow_dispatch`. Version bumps flow through bumpver, which updates `__init__.py`, commits, tags, and pushes in one step.
