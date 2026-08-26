---
title: The polyrepo map
type: explanation
sidebar_position: 3
provenance: ai-generated
inFlux: "Polyrepo map section for FreeMoCap core is a work in progress for version alpha. It will stabilize upon beta release."
history:
  - date: "2026-08-26"
    against: "DataFlowDiagram component (edge/order/terminal-output logic derived from consumes/produces), src/plugins/repos-data and docusaurus.config.ts wiring, data/repos.yml tier/consumes/produces values for all 9 repos, the four linked routes (/developers, /build/data-contracts, /build/repo-directory, /build/architecture), and the freemocap-composes-every-shown-repo claim against pyproject.toml at pinned tag v2.0.0-alpha.21"
  - date: "2026-08-24"
    against: "generated live from data/repos.yml's consumes/produces fields, not hand-written"
draft: false
---

import DataFlowDiagram from '@site/src/components/DataFlowDiagram';

# The polyrepo map

[The developer docs homepage](/developers) shows the polyrepo grouped by
*tier*: one core app, a pantheon of pipeline-stage repos below it,
and a floating set of utility repos any of them can depend on. This page
shows the same repos organized a different way: by *data contract*, which
repo's output is another repo's input, and what that data is actually
called.

The diagram below isn't hand-drawn. It's built at page-load time straight
from `data/repos.yml`'s own `consumes` and `produces` fields, so if a repo's
data contract changes, this page changes with it automatically the next time
the site builds. Nobody edits this page directly; edit `repos.yml` instead.

<DataFlowDiagram />

Reading it left to right: each arrow is one named data artifact, produced by
the repo on its left and consumed by the repo on its right. A repo with
nothing pointing into it is a source (nothing upstream in the polyrepo feeds
it); a repo whose output nothing else consumes is either a terminal output
(the pipeline's actual end product) or a value only the `freemocap` app
itself consumes directly, not another repo.

Two things this diagram deliberately leaves out, both shown instead on
[the developers homepage](/developers): the utility tier (SkellyLogs,
SkellyPings, SkellyDocs, SkellySync), since none of them appear in any
`consumes`/`produces` list, they're infrastructure the pipeline repos use
internally, not stages in this data chain; and `freemocap` itself, which
composes every repo shown here but doesn't produce or consume a named
artifact of its own in `repos.yml`, it's the thing the chain runs inside of,
not a link in it.

For the full field-by-field contract (which repo produces what, and who
consumes it), see [Data contracts between components](/build/data-contracts).
For the complete repo listing including the utility tier, see
[All repositories](/build/repo-directory).

[← Architecture overview](/build/architecture)
