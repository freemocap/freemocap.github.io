---
title: Data contracts between components
type: reference
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: "generated live from data/repos.yml's consumes/produces fields, not hand-written"
draft: false
---

import DataContractsTable from '@site/src/components/DataContractsTable';

# Data contracts between components

The reference table for what [the polyrepo map](/build/the-map) draws as a
diagram: every repo that produces or consumes a named data artifact, what
that artifact is called, and (computed, not hand-entered) which repo
actually consumes each thing that gets produced.

<DataContractsTable />

An artifact name here is a contract in the loosest sense: a shared name both
sides agree on, not a versioned schema either side can validate against
independently. If a producer changes an artifact's shape without the
consumer changing to match, nothing in this table would catch it, it's a
map of *who depends on whom*, not a type checker. This table, like
[the polyrepo map](/build/the-map), is generated live from `data/repos.yml`
at page-load time; edit that file, not this page.

[← Architecture overview](/build/architecture)
