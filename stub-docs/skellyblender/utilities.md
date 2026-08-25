---
title: "Utilities"
type: reference
sidebar_position: 9
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: freemocap_blender_addon source read directly (package v2026.04.1041); integration verified against the FreeMoCap clone (the core Blender export module)
draft: false
---

# Utilities

Three small modules under `utilities/` are generally useful for anyone embedding Python tooling in Blender:

- `git_source_manager.py`: `resolve_git_sources()` clones or fast-forward-updates git repositories into `~/.cache/freemocap/git_sources/` (override with `FREEMOCAP_GIT_SOURCES_DIR` or `XDG_CACHE_HOME`), records last-seen commits in `.source_lock.json`, stashes local changes before pulling, and degrades gracefully to the cached copy when offline. It's stdlib-only, so it works in Blender's bundled Python. The addon imports it at startup but does not currently call it for anything.
- `install_dependencies.py`: ensures pip exists in Blender's interpreter, checks imports locally with zero subprocesses, and installs anything missing from pip, git URL, or local-path specs. Presently a no-op beyond the pip check, given the empty dependency list.
- `recording_framerate.py`: the timestamps-based framerate derivation described preceding.
