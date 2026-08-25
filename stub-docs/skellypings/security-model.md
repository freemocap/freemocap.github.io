---
title: "Security model"
type: reference
sidebar_position: 5
provenance: ai-generated
reviewed: 2026-08-24
reviewed_against: SkellyPings source read directly (client package, server, infra, maintainer scripts, pyprojects); consumer integration verified in FreeMoCap and SkellyCam clones including their CI workflows and lockfiles
draft: false
---

# Security model

From the README and mirrored in both codebases:

- The endpoint is publicly reachable (Cloud Run allows unauthenticated invocation), but authenticity comes from an HMAC-SHA256 signature computed over the raw request body using a shared secret, compared with `hmac.compare_digest` on the server. The secret never crosses the wire, only the digest does, and a valid signature cannot be forged without it. Rotating means changing one environment variable on Cloud Run and the value baked into clients.
- The secret is stored as a Cloud Run environment variable, not in any repository.
- Consumers inject their copy at CI build time (see below); local development uses a placeholder that fails verification, so dev events simply land in the unverified collection rather than being rejected.
