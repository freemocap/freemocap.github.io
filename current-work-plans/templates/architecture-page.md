---
title: FreeMoCap architecture — <the whole map | the pipeline | data contracts>
type: architecture
audience: developers, contributors, curious advanced users
---

<!--
The canonical map. This is the single source of truth every repo links back to.
Support all three reading directions: top-down, bottom-up, inside-out.
-->

# <Architecture page title>

**You are here:** Docs › Build it › Architecture › this page
**In one sentence:** FreeMoCap is a **polyrepo** — a core app (Voltron) that composes standalone "Skelly" components.

## The map
<!-- One canonical diagram. Every node links to that repo's docs home. -->

```
                        ┌─────────────── FreeMoCap (core / Voltron) ───────────────┐
                        │  composes the components below into one application       │
                        └───────────────────────────────────────────────────────────┘
   SkellyCam ─→ SkellyTracker ─→ (reconstruction) ─→ SkellyForge ─→ SkellyBlender
   cameras/     image tracking     3D points          kinematic       into Blender
   video →      → keypoint                            models
   frame        observations
   packages
```

Utilities: SkellyLogs · SkellyPings · SkellyDocs (shared docs scaffolding) · …

## Follow one recording (the pipeline narrative)
1. **SkellyCam** connects to cameras/videos → **synchronized frame packages**.
2. **SkellyTracker** takes images → runs analyses → **keypoint observations**.
3. **Reconstruction** turns 2D observations across cameras into **3D reconstructed points**. *(confirm which repo owns this)*
4. **SkellyForge** turns reconstructed points into **kinematic models** of skeletons/objects.
5. **SkellyBlender** ports the results into **Blender** for animation.
FreeMoCap core orchestrates all of it.

## Data contracts (the boundaries ARE the architecture)
| Boundary | Data type | Produced by | Consumed by |
|---|---|---|---|
| 1 | synchronized frame packages | SkellyCam | SkellyTracker |
| 2 | keypoint observations | SkellyTracker | reconstruction |
| 3 | reconstructed 3D points | reconstruction | SkellyForge |
| 4 | kinematic models | SkellyForge | SkellyBlender |

## Navigate from here
- **Top-down:** drill into any node above.
- **Bottom-up:** each repo's docs link back to this map.
- **Inside-out:** pick a data type → jump to the repos that produce/consume it.
- **Repo directory:** [full list of repos](<link>)
