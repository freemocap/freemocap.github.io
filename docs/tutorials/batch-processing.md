---
title: Process many recordings at once
type: tutorial
sidebar_position: 42
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): mocap_router.py POST /recording/process (mounted under /freemocap/mocap); no batch code path found in the app. Trimmed the v1 history and roadmap speculation."
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21 clone: full router set in api/routers.py plus mocap/calibration/posthoc routers (single-directory requests only), FreemocapApplication.create_posthoc_mocap_pipeline taking one RecordingInfo, PosthocPipelineManager keeping independent pipelines in a dict (so looping the REST call works), sole CLI entry point freemocap.__main__:run_main with no argument parsing, no experimental/ directory in the tree (only stale .flake8 exclude and per-file-ignore lines still naming ./experimental/batch_process/batch_process.py), no batch flow in freemocap-ui, site-local docs/about/roadmap.md containing no batch entry, and all three internal links resolving"
  - date: "2026-08-25"
    against: "FreeMoCap source v2.0.0-alpha.21, no batch-processing code path found; GitHub issue #462 (closed, 2023), referencing a since-removed experimental/batch_process/batch_process.py script from the V1 era; no open issue, discussion, or roadmap item found requesting it for V2"
---

# Process many recordings at once

FreeMoCap can't process several recordings in one go yet. Process each one on its own. Open it in
the **Playback** tab, click **Continue to Mocap Setup**, then **Process Mocap**.

If you're comfortable with scripting, you can loop over your recordings yourself and send each one
to FreeMoCap's local server with the `POST /freemocap/mocap/recording/process` request, while the
app is open. See the [REST API reference](/reference/rest-api).

## Next steps

- [Process a recording after the fact](/guides/posthoc-mocap)
