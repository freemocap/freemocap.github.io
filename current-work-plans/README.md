# FreeMoCap Docs Refactor — Current Work Plans

Working plans for the FreeMoCap **v1 → v2** documentation rebuild. v2 is a near-total rewrite of the software, so the docs are being planned from scratch rather than migrated.

These are living planning documents, not finished docs. They capture intent, structure, and templates so the actual writing can start from a shared map.

## Files in this folder

| File | What it covers |
|---|---|
| [`00-vision-and-principles.md`](./00-vision-and-principles.md) | Why the docs exist, the "boundary object" goal, the audiences, and the principles that govern every decision below. |
| [`01-user-and-education-docs.md`](./01-user-and-education-docs.md) | Tutorials (first-touch → advanced), the how-to library, the data model, and the education / Skelly University micro-credential track. |
| [`02-developer-and-architecture-docs.md`](./02-developer-and-architecture-docs.md) | The polyrepo map, the sub-Skelly pantheon, per-repo standalone docs, and contributing guides. |
| [`03-information-architecture.md`](./03-information-architecture.md) | Entry points, funnels, routing, and how someone navigates the map top-down, bottom-up, and inside-out. |
| [`templates/`](./templates/) | Copy-paste starting points: tutorial page, how-to, repo docs home, architecture page, concept page. |
| [`99-open-questions.md`](./99-open-questions.md) | Decisions still to make. Park disagreements and TODOs here. |

## Ground truth (as of this planning pass)

- Docs site repo: `freemocap/freemocap.github.io` (this repo). Currently a placeholder README pointing at the legacy `docs.freemocap.org`.
- Shared docs tooling: **SkellyDocs** (Docusaurus theme + CLI) scaffolds every repo's docs so they look and behave like one system.
- Core app repo: `freemocap/freemocap` — the "Voltron" that assembles the sub-Skellies into the FreeMoCap application.
- Sub-Skelly pantheon: **SkellyCam, SkellyTracker, SkellyForge, SkellyBlender**.
- Utility menagerie: **SkellyLogs, SkellyPings, SkellyDocs**, etc.

## How to use these docs

Skim [the vision & principles](./00-vision-and-principles.md) for the frame, then dip into whichever plan is relevant. Nothing here is locked — mark up, disagree in-line, and move settled items into real docs work.
