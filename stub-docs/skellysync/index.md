---
title: SkellySync
type: hub
sidebar_position: 1
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellySync source read directly (package code, README, the pyproject config, CI workflows)
draft: false
---

# SkellySync

SkellySync (`skelly_synchronize`) synchronizes videos of the same event *after recording*, without needing camera timestamps. Given a folder of videos that overlap in time, it computes the temporal offset between each video and the others, trims every video to the earliest moment all cameras were recording simultaneously, and writes the results out with matching frame counts. Two synchronization methods are available: **audio cross correlation** and **first brightness change** detection. Part of the FreeMoCap polyrepo's utility tier, standalone infrastructure any of the pipeline repos can depend on (though none currently reference it in their sources).

## Contents

- [Install and run](/skellysync/install-and-run)
- [Python API](/skellysync/python-api)
- [How synchronization works](/skellysync/how-it-works)
- [Files created](/skellysync/files-created)
- [Module map](/skellysync/module-map)
- [Testing and CI](/skellysync/testing-and-ci)
