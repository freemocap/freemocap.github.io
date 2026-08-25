---
title: Process many recordings at once
type: tutorial
sidebar_position: 42
provenance: ai-generated
reviewed: 2026-08-25
reviewed_against: "FreeMoCap source v2.0.0-alpha.21, no batch-processing code path found; GitHub issue #462 (closed, 2023), referencing a since-removed experimental/batch_process/batch_process.py script from the V1 era; no open issue, discussion, or roadmap item found requesting it for V2"
draft: false
---

# Process many recordings at once

:::info Not implemented yet
FreeMoCap V2 has no way to process more than one recording in a single run
today: no CLI flag, no API endpoint, no code path for it anywhere in the
current app. Each recording goes through calibration and mocap processing
on its own.

This is anticipated, not confirmed: there's no open issue, discussion, or
roadmap item committing to building it, so read "upcoming" here as "a
reasonable feature nobody has built yet," not "scheduled." Check
[the roadmap](/about/roadmap) for the current state before assuming this is
in progress.
:::

## Why this page exists anyway

Processing recordings one at a time gets tedious as a project grows, and
it's been wanted before: a 2023-era V1 script,
`experimental/batch_process/batch_process.py`, did exactly this, looping a
folder of session folders through processing headlessly. It lived under an
`experimental/` path, never a supported or documented feature, and it
didn't carry forward into the V2 rewrite; nothing under that name exists in
the current codebase.

## What to do in the meantime

Two real options exist today with the current app:

- **Script it yourself against the API.** Starting a posthoc mocap run is
  one REST call (see [REST API](/reference/rest-api)); looping that call
  over a folder of recordings from your own script works today, it's just
  not built into FreeMoCap's own UI or CLI.
- **Process each recording through the UI** as usual; see
  [Post-hoc motion capture](/guides/posthoc-mocap) for the normal
  single-recording flow.

[← Tutorials](/tutorials/)
