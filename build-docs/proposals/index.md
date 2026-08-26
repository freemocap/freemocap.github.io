---
title: Design proposals
type: hub
sidebar_position: 20
provenance: ai-generated
inFlux: "Design proposals section for FreeMoCap core is a work in progress for version alpha. It will stabilize upon beta release."
history:
  - date: "2026-08-26"
    against: "freemocap clone at pinned tag v2.0.0-alpha.21: freemocap-docs/docs/proposals/centroidal-kinematics/ contents (page and plan counts, Lee & Goswami and Sanyal & Goswami citations in 05-bibliography.mdx), freemocap/core/kinematics/inertial/ and online/streaming_kinematics.py, freemocap/core/pipeline/realtime/realtime_aggregator_node.py (CoM/XCoM active, StreamingKinematics.update commented out), freemocap-ui/src/components/viewport3d/renderers/BodyKinematicsRenderer.tsx lane, freemocap.github.io/data/repos.yml (docs_path: null)"
  - date: "2026-08-24"
    against: "FreeMoCap-docs/docs/proposals/centroidal-kinematics/00-overview.mdx in the FreeMoCap clone (v2.0.0-alpha.21), read directly"
draft: false
---

# Design proposals

In-progress design work for `freemocap`: features being designed in the open
before (or while) they're built, not yet-stable documentation of shipped
behavior. Nothing here is vendored into this site yet (`docs_path: null` in
`data/repos.yml`, same as the rest of the core repo's architecture docs, see
[Architecture overview](/build/architecture)), so this page links to the
source directly rather than reproducing it, since a proposal that's still
actively changing is exactly the kind of content most likely to drift out of
sync if it were copied here.

## The Reaction Mass Pendulum and centroidal kinematics

The one substantial proposal in the repo right now: adding a rotational
counterpart to the center-of-mass tracking FreeMoCap already computes. Today
the realtime pipeline computes center of mass (CoM) and extrapolated center
of mass (XCoM) per frame, a point-mass model with no rotational inertia.
This proposal's stated goal is the natural completion of that: model the
body's mass distribution about its center of mass (the *reaction-mass
ellipsoid*) and its centroidal angular momentum, adding real 3D rotational
dynamics on top of the existing point-mass balance metrics, borrowing the
Reaction Mass Pendulum representation from the humanoid-robotics literature
(Lee & Goswami; Sanyal & Goswami) without any of that literature's control
or actuation machinery, since FreeMoCap measures a human, it doesn't
actuate one.

As of the source document's own last-updated status: point-mass inertia,
center of pressure, and the `Centroidal Moment Pivot` are implemented in the
realtime backend and render in the viewport (phases P0 and P1); real
per-segment anthropometric inertia data has landed but the compute using it
hasn't (phase P2); full per-segment orientation and a posthoc/offline
validation path remain planned (phases P3 and P4). At the tag this site
builds against (v2.0.0-alpha.21) the P1 half of that overstates reality:
the inertial modules (`composite_inertia.py`, `ground_reference.py`,
`streaming_kinematics.py`) and the viewport's `BodyKinematicsRenderer` all
exist and are unit-tested, but the aggregator node's per-frame
`StreamingKinematics.update(...)` call is commented out, so `body_kinematics`
stays `None` in every published frame and none of the ellipsoid, CoP, or CMP
output streams or renders yet (CoM and XCoM, phase P0, are unaffected).
Treat this as a live status, not a fixed one, and check the source directly
rather than this summary before relying on which parts are actually
implemented.

Full proposal, six pages plus two phase-1 implementation plans:
[`freemocap-docs/docs/proposals/centroidal-kinematics/`](https://github.com/freemocap/freemocap/tree/main/freemocap-docs/docs/proposals/centroidal-kinematics)
on GitHub.

[← Architecture overview](/build/architecture)
