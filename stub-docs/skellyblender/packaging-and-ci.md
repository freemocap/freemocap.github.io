---
title: "Packaging and CI"
type: reference
sidebar_position: 10
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "re-checked every packaging/CI claim against the freemocap_blender_addon clone (pyproject.toml flit_core and bumpver config, .github/workflows/flit_publish_to_pypi.yml, .github/workflows/create_addon_install_zip.yaml, freemocap_blender_addon/__init__.py)"
  - date: "2026-08-24"
    against: "freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)"
draft: false
---

# Packaging and CI

Builds use flit (`flit_core`). Two workflows fire on `v*` tags: `flit_publish_to_pypi.yml` publishes the package to PyPI, and `create_addon_install_zip.yaml` zips the package folder as `freemocap_blender_addon_<version>.zip` (the workflow takes the version from `__init__.py` and strips the leading `v`, so the attached asset is named for example `freemocap_blender_addon_2026.04.1041.zip`), generates release notes with click-through install steps, and publishes the GitHub Release users download the addon from. The zip workflow can also be triggered manually via `workflow_dispatch`. Version bumps flow through bumpver, which updates `__init__.py`, commits, tags, and pushes in one step.
