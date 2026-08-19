# 99 — Open Questions & Decisions to Make

Park unresolved decisions here so the plan docs stay clean. Move items out as they're settled.

## Structure / hosting
- One site vs. per-repo subdomains? (Current: `docs.freemocap.org/<repo>/`.) How do SkellyDocs-scaffolded sites stitch into one shell?
- Where does the **canonical global architecture map** physically live, and how is it embedded across repos without drift?
- Tooling: staying on Docusaurus (SkellyDocs) for everything? The docs-site repo here is currently MyST — reconcile.

## Architecture accuracy (confirm before writing repo docs)
- Exactly where does **triangulation / 3D reconstruction** happen — FreeMoCap core, SkellyTracker, SkellyForge, or a dedicated repo?
- Confirm the precise data contracts crossing each boundary (frame packages → keypoint observations → reconstructed points → kinematic models). Names and shapes.
- Full, current list of pantheon vs. utility repos (README lists core + 4 pantheon + SkellyDocs; brain dump adds SkellyLogs, SkellyPings). Get the authoritative list from `freemocap/project`.
- Is there an "SDK" framing we want to commit to for the per-component docs, or just "component docs"?

## User & education
- Tier boundaries: what exactly is "intermediate" vs "advanced"? Draft, then user-test.
- Education track: how much lives in the docs vs. in **Skelly University**? Single source of truth?
- Micro-credentials: what counts as earning one, how is progress tracked, how lightweight can it stay?

## Migration
- How much v1 content is worth porting vs. rewriting? Where does the (dated, clearly-labeled) migration note live?
- Legacy `docs.freemocap.org` — keep, redirect, or archive once v2 docs land?

## Process
- Who owns which arm of the docs? Contribution workflow for docs themselves.
- Screenshot standard (Blender-style UI shots) — tooling and update cadence so they don't go stale.
