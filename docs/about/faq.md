---
title: Frequently asked questions
type: explanation
provenance: human-checked
history:
  - date: "2026-08-25"
    against: "polyrepo-clones/freemocap (v2.0.0-alpha.21): LICENSE (AGPLv3), README.md (Discord invite, realtime pipeline), freemocap/core/pipeline/realtime/ and api/http/realtime/realtime_router.py (realtime pipeline exists), core/pipeline/realtime/camera_node_config.py (single-person cap), freemocap-docs/docs/architecture/backend-pipeline-architecture.mdx; polyrepo-clones/skellytracker main (multi_person_tracker.py, detector registry); polyrepo-clones/skellyforge main (pipelines/dlc_pipeline.py)"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
## How is FreeMoCap free?

FreeMoCap is completely free to use, but its also free in the sense of "freedom". You have the freedom to use FreeMoCap how you like, including copying, modifying, and redistributing the code. 

For more information on free software, see this article from the GNU Operating System, [What is Free Software?](https://www.gnu.org/philosophy/free-sw.en.html)

And this classic essay - [Why Open Source Misses the Point of Free Software](https://www.gnu.org/philosophy/open-source-misses-the-point.en.html)

FreeMoCap is funded through external grants, and donations from users like you. If you would like to donate to FreeMoCap,
please visit our [donations page](https://freemocap.org/about-us.html#donate).

## What license does FreeMoCap use?
FreeMoCap is licensed with the [GNU Affero General Public License (v3)](https://www.gnu.org/licenses/agpl-3.0.en.html), the most aggressively open source license available. 

If you wish to work with FreeMoCap in a way not supported by the AGPLv3, please reach out to us at `info` AT `freemocap` DOT `org`, and we can discuss alternative licensing options.

## How can I contribute to FreeMoCap?

We accept contributions of all kinds and sizes!

For contributions related to code or documentation, see our [contributing page](/build/contributing).

We also greatly appreciate anyone who helps answer questions on our [Discord](https://discord.gg/nxv5dNTfKT).

We also greatly appreciate financial contributions of any size, although the software is and will remain entirely free. You can donate through various platforms on our [donations page](https://freemocap.org/about-us.html#donate).

## Does FreeMoCap work in realtime?

Yes, in the current V2 build! FreeMoCap runs a realtime pipeline: per-camera nodes run pose detection as each synchronized frame arrives, and an aggregation node triangulates and filters every frame live, streaming results to the GUI over WebSocket. An optional centralized GPU inference node serves all cameras with batched ONNX inference. FreeMoCap also keeps a non-realtime (posthoc) path, which processes recordings after the fact and remains useful for reprocessing.

## Can FreeMoCap track multiple people at once?

Not yet! FreeMoCap currently only tracks one person at a time, but we are working on adding multi-person tracking functionality.

## Can I track things that are not humans?

Not yet! FreeMoCap currently only tracks humans. We have done some proof-of-concept projects using [DeepLabCut](https://deeplabcut.org) and are currently working towards making this part of our standard pipeline.
