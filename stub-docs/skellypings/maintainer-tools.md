---
title: "Maintainer tools"
type: reference
sidebar_position: 7
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles
draft: false
---

# Maintainer tools

Both live at the repo root and require `.env` values plus GCP app-default credentials for the telemetry project (`freemocap-user-pings`, per their docstrings):

- `test_ping.py`, round-trip smoke test: sends one signed `test_ping` event, then reads it back out of Firestore (choosing the verified or unverified collection based on the server's response) and asserts every field survived storage.
- `stats.py`, ad-hoc totals streamed from both collections: counts by app, event type, version, OS, unique users, and the 20 most recent pings.

These scripts import `google-cloud-firestore`, which the root `pyproject.toml` deliberately places in an `admin` dependency group rather than runtime dependencies, so `pip install skellypings` and downstream consumers stay lightweight.
