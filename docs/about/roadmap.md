---
title: Roadmap
type: explanation
sidebar_position: 10
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: FreeMoCap org project boards 32 and 34, counts snapshotted 2026-08-24 as provided; the FreeMoCap, SkellyCam, and SkellyTracker doc sources, and the SkellyDocs source, read for how roadmap pages work
draft: false
---

# Roadmap

FreeMoCap does not publish a fixed, written roadmap document. Planning happens
on two public GitHub Projects boards owned by the [FreeMoCap
organization](https://github.com/freemocap), and those boards are the real,
current source for what is being worked on. This page points you at them and
gives one snapshot of their contents so you know roughly what scale of activity
to expect. It deliberately does not summarize plans into prose, because any
such summary would go stale immediately and would risk inventing priorities the
boards do not actually state.

## The two planning boards

Both boards are linked from the organization's GitHub profile README under the
heading "Project planning and roadmaps."

**[FreeMoCap Development](https://github.com/orgs/freemocap/projects/32/views/2)**
is an org-level Kanban board tracking development work. Its specific scope is
not documented anywhere beyond the board itself; note that the SkellyTracker
docs site points its roadmap view at this board, though the source config
carries an unresolved comment asking whether that pointer is correct.

**[FreeMoCap Planning & Operations](https://github.com/orgs/freemocap/projects/34/views/2)**
is the second org-level board. The SkellyCam documentation describes it as the
main roadmap for the FreeMoCap project and all its sub-projects, and the
FreeMoCap docs site uses it as its project board link.

Each sub-project's own docs site also generates a roadmap-style page from that
repository's GitHub issues labeled `roadmap`, plus issues pinned through the
site's feature cards, with a link out to the relevant board. The desktop app
links to a roadmap page under `docs.freemocap.org` as well.

## A snapshot, already stale

The counts below were captured on **2026-08-24**, while this page was being
written. They don't match what you see when you read this. Treat them as a
rough indication of scale only, and treat the live boards as the actual answer.

FreeMoCap Development ([view](https://github.com/orgs/freemocap/projects/32/views/2)):

| Column     | Items |
| ---------- | ----- |
| Backlog    | 19    |
| TODO       | 2     |
| In Progress | 1    |
| Blocked    | 0     |
| In Review  | 0     |
| Done       | 38    |

FreeMoCap Planning & Operations ([view](https://github.com/orgs/freemocap/projects/34/views/2)):

| Column      | Items |
| ----------- | ----- |
| Backlog     | 26    |
| TODO        | 4     |
| In Progress | 8     |
| Blocked     | 1     |
| Done        | 25    |

If you want to know what the team is doing next, open a board, filter to the
columns that interest you, and click into individual cards. Every card is a
real tracked item with its own discussion.

## Older planning material

An earlier planning sketch, dated 2024-07-31, exists in the separate
`freemocap_foundation` repository at `docs/notes/2024-07-31-FMC-Roadmap.md`.
It predates the current structure and is superseded: it names planned
repositories such as SkellyViewer, SkellyCalibrate, and SkellyMetrics, none of
which appear in today's set of repositories (FreeMoCap, SkellyCam,
SkellyTracker, SkellyForge, freemocap_blender_addon, SkellyLogs, SkellyPings,
SkellyDocs, and SkellySync). Treat it as historical context only. The live
boards preceding are the current plan of record.
