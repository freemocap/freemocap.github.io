---
title: "Caveats for readers"
type: reference
sidebar_position: 9
provenance: ai-generated
draft: false
history:
  - date: "2026-08-26"
    against: "SkellyForge main re-read directly: full top-level and package trees, README.md, pyproject.toml, skellyforge/__init__.py, tracker_info YAML listing; text searches confirmed postprocess_GUI.py appears only inside README.md and tkinter appears nowhere"
  - date: "2026-08-24"
    against: "SkellyForge source read directly (full package tree, the pyproject config, README, tracker_info YAMLs); integration points verified in the FreeMoCap clone"
---

# Caveats for readers

- The repo README documents a `postprocess_GUI.py` tkinter tool aimed at FreeMoCap 1.0-era file layouts; no such file exists in the current tree, so treat the README as stale.
- `pyproject.toml` still carries template boilerplate (description "Basic template of a python repository").
