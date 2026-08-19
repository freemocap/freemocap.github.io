# 02 — Developer & Architecture Docs

The developer arm is a **separate branch** of the docs, not a footnote to the user docs. It serves people interested in the software itself: understanding the architecture, using a single component standalone, or contributing.

Two things live here:

1. **Project-level architecture docs** — the map of the whole polyrepo and how it fits together.
2. **Per-component docs** — each repo's own standalone documentation (call it an SDK-style arm if useful).

## The architecture, stated plainly

FreeMoCap is a **polyrepo**. The org (`github.com/freemocap`) holds many repositories; `freemocap/project` shows most (not all) of them.

- **Core / entry point:** `freemocap/freemocap` — the repo that builds the whole application. It's the **Voltron** that assembles the sub-Skellies into one app; the **Zeus** of the Skelly pantheon; the mothership. Its job is to **compose** the functionality each sub-repo exposes into the top-level FreeMoCap application.

- **The sub-Skelly pantheon** (the main robots): each aggressively split around one core responsibility, each usable as a standalone tool.

  | Repo | Responsibility | Input → Output |
  |---|---|---|
  | **SkellyCam** | Cameras & video | Connects to cameras/videos → produces **synchronized frame packages** |
  | **SkellyTracker** | Image tracking | Accepts images → runs analyses → produces **keypoint observations** |
  | **SkellyForge** | Kinematic modeling | Receives reconstructed points → builds **kinematic models** of skeletons and other objects |
  | **SkellyBlender** | Blender integration | Ports the results into **Blender** for animation |

  > The pipeline reads as a chain: **SkellyCam → SkellyTracker → (triangulation/reconstruction) → SkellyForge → SkellyBlender**, with FreeMoCap core orchestrating the whole thing. (Confirm exactly where triangulation/reconstruction lives — core vs. a component — in `99-open-questions.md`.)

- **The utility menagerie** (smaller ships): simpler, smaller-scope repos — **SkellyLogs, SkellyPings, SkellyDocs**, and friends. Documented, but lighter-weight than the pantheon.

- **SkellyDocs** is special: it's the **shared scaffolding**. Every repo's docs — core, pantheon, utilities — are generated from it so the whole map looks and behaves like one system.

## The standalone principle

Each repo documents itself **as if it were a standalone tool** with its own docs, architecture, and API. Someone should be able to land in SkellyCam's docs, use SkellyCam alone, and never need the rest of FreeMoCap.

The **core FreeMoCap docs do not duplicate** the sub-Skelly docs — they **compose** them: explain how the pieces connect, then link down into each component's own docs for depth.

## Per-repo docs: the standard shape

Every repo's docs (scaffolded by SkellyDocs) should carry the same sections, so a developer who's read one knows how to read all of them:

1. **What this is** — one-paragraph responsibility, in isolation.
2. **Where it sits in the map** — the "you are here" panel: its inputs, its outputs, its neighbors up/down the chain, a link to the global architecture map.
3. **Quick start (standalone)** — install and use this component by itself.
4. **Concepts / architecture** — how it works internally, its core data types (e.g. frame packages, keypoint observations, kinematic models).
5. **API / reference** — the public surface.
6. **Contributing** — how to develop *this* repo specifically.

The "where it sits in the map" panel is what makes bottom-up and inside-out navigation work (see `03`).

## Project-level architecture docs

A dedicated section in the core docs (or a top-level architecture home) that holds:

- **The global map** — one canonical diagram of the polyrepo: core, pantheon, utilities, and the data flow between them. Every repo links back to it.
- **The pipeline narrative** — follow one recording from camera to Blender, naming which repo owns each step and what data type crosses each boundary.
- **Data contracts** — the types that pass between components (synchronized frame packages → keypoint observations → reconstructed points → kinematic models). These boundaries *are* the architecture.
- **Repo directory** — the full list with one-line roles (extend the README's repo map).

## Contributing docs

- A **project-wide** contributing guide: philosophy, polyrepo workflow, how the repos relate, code of conduct, how to pick where a change belongs.
- **Per-repo** contributing notes for local dev setup, tests, and conventions specific to that repo.
- Keep the shared parts in one place (SkellyDocs-provided) and let repos add only what's specific to them — don't let 30 copies drift (the DeepLabCut lesson).

## Navigation requirements (developer side)

The developer docs must support all three reading directions:

- **Top-down:** start at FreeMoCap core → see the map → drill into a component.
- **Bottom-up:** start at a sub-Skelly (often via search) → the "where it sits" panel zooms them out to the whole.
- **Inside-out:** start at a concept or data type (e.g. "keypoint observations") → branch to whichever repos produce/consume it.

Full IA in `03`.
