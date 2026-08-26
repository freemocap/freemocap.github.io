---
title: Build a custom pipeline
type: tutorial
sidebar_position: 41
provenance: ai-generated
history:
  - date: "2026-08-26"
    against: "freemocap/core/pipeline/ directory structure at v2.0.0-alpha.21: confirmed shared abcs/ (source_node_abc.py, aggregator_node_abc.py, base_node_abc.py) with realtime/ (camera_node.py, realtime_aggregator_node.py) and posthoc/ (video_node.py, posthoc_aggregation_node.py) matching the described source-to-aggregator shape for both pipelines"
  - date: "2026-08-20"
    against: "freemocap-docs architecture docs (v2.0.0-alpha.21, not yet re-checked against the running app)"
draft: false
---

# Build a custom pipeline

FreeMoCap's backend runs on two different pipelines, and understanding
the difference is the useful starting point before you go looking for
where to extend either one.

## Realtime vs. posthoc

| | Realtime | Posthoc |
|---|---|---|
| Source | Live camera feeds | Video files already on disk |
| Priority | Low latency: the latest frame, dropping stale ones if it falls behind | Accuracy: every frame, in order, nothing dropped |
| Runs for | As long as the cameras are active | Until the video ends, then stops |
| Sees | Only the current frame | The whole recording at once |
| Output | Streamed to the frontend live | Written to disk, for playback afterward |

Both pipelines process data through the same basic shape (a source feeds
one or more per-camera nodes, which feed an aggregator node that
triangulates and filters), the realtime version is just built for speed
under an ongoing camera feed, and the posthoc version is built for
completeness against a fixed set of video files. Neither is "better,"
they're solving different problems: recording live versus reprocessing
something you already captured.

## If you want to go further

The pipeline internals (individual node types, inter-process
communication, the filtering chain) aren't documented yet at a level
meant for extending them from outside the core `freemocap` repository.
If you want to work at that level, the
[`freemocap` repository's own architecture docs](https://github.com/freemocap/freemocap/tree/main/freemocap-docs/docs/architecture)
are the current source of truth, ahead of anything ported to this site.
[Image tracking and pose models](/concepts/tracking) and
[the output data model](/concepts/data-model) cover the parts of the
pipeline that are stable, documented, and safe to build against today.

## Next steps

- [Image tracking and pose models](/concepts/tracking)
- [The FreeMoCap output data model](/concepts/data-model)
- [Find and read your output](/tutorials/find-your-data)
