---
title: How these docs are written
type: explanation
sidebar_position: 11
provenance: ai-generated
history:
  - date: "2026-08-25"
    against: "this site's own repo state: provenance/reviewed/history frontmatter across docs/, concepts/, build-docs/, stub-docs/; src/theme/DocItem/Content/index.tsx and src/components/ProvenanceBanner (newest-first ordering, the reviewed/reviewed_against fallback, the 'none' handling); .vale.ini and .vale/styles/FreeMoCap (Google package, Dashes/Hype/Spelling rules); skellydocs' AiGeneratedBanner and GenerationType, plus the AiGeneratedBanner tags in polyrepo-clones/freemocap/freemocap-docs (*.mdx, incl. posthoc-mocap.mdx tagged human-generated); the v2.0.0-alpha.21 pin in polyrepo-clones/freemocap/pyproject.toml; the current state of tutorials/batch-processing.md, tutorials/custom-pipeline.md, and about/roadmap.md"
  - date: "2026-08-21"
    against: "none"
draft: false
---

# How these docs are written

Most of this site is drafted with AI assistance, and that's tracked
explicitly rather than hidden. Every page carries provenance metadata in
its frontmatter, this page explains what it means and how content
actually gets written.

## The frontmatter

Every page has:

- **`provenance`**: `ai-generated` (drafted by an AI from source material)
  or `human-checked` (a person has verified it, even if an AI did the
  initial pass).
- **`history`**: the audit log, a list of every time someone actually
  checked this page, newest first. Each entry has a **`date`** and an
  **`against`**, what it was checked against: `none` for new synthesis
  with nothing yet to compare it to, a specific source document, or a
  note like `v1 (ported, not yet re-checked against v2)` when a page is a
  faithful port of older documentation that hasn't been walked through
  against the current software yet. A page that's only ever been checked
  once still gets one entry, not a bare date, so a second check later is
  just another entry rather than an overwrite that loses the first one.
  Pages written before this log existed still carry the single older
  `reviewed` / `reviewed_against` pair instead of a `history` array; the
  banner reads that the same way it would read a one-entry log, so
  nothing about how they render actually changed, they just haven't been
  converted to the list format because there's nothing yet to list.
- **`draft`**: whether the page is considered ready to read, independent
  of provenance, a `human-checked` page can still be a draft.

A page marked `ai-generated` whose latest check was against `v1
(ported...)`, for example, means: an AI adapted real, human-written
FreeMoCap documentation into this site's format, and nobody has yet
confirmed the underlying software still matches what that documentation
describes.

## Where the content actually comes from

Not from nowhere, and not invented to fill a gap. Three real sources,
depending on the page:

1. **Ported from FreeMoCap's V1 documentation** (a Writerside project),
   for pages describing something that hasn't fundamentally changed
   between V1 and V2, calibration mechanics, capture environment advice,
   and similar.
2. **Adapted from the current software's own architecture and guide
   docs**, pulled from the `freemocap` organization's repositories at
   the same pinned release this site already builds against. Several of
   those source docs are themselves AI-drafted (some explicitly marked
   as such, one confirmed human-authored), which is worth knowing before
   treating them as more authoritative than they are.
3. **New synthesis from primary sources**, most notably Cherian, A.
   *Open-Source Development and Validation of a Low-Cost Markerless
   System for Quantitative Motion Analysis* (PhD dissertation,
   Northeastern University, 2026), the validation study behind
   [accuracy, validity, and limits](/concepts/accuracy-and-limits) and
   several other `/concepts/` pages.

## What gets left as a stub, on purpose

A page with no real source behind it stays a stub rather than getting
filled with something plausible-sounding. That's shown up a few concrete
ways across this site: the batch processing page exists to explain that
the feature doesn't exist in the codebase yet, not to walk through steps
for it, a page on building a custom pipeline stays deliberately shallow
because the real depth is internal architecture documentation aimed at a
different audience, and the roadmap page points at the organization's
live GitHub planning boards instead of summarizing plans into prose,
because there's no fixed written roadmap to publish. A stub, or a page
that just says the thing doesn't exist yet, is a more honest state than
invented content.

## Style checking

Prose is checked with [Vale](https://vale.sh) against Google's style
guide plus a small FreeMoCap-specific vocabulary
(`.vale/styles/FreeMoCap/` in the site's repository), banning things
like em dashes and marketing-speak ("seamless," "cutting-edge," and
similar). Not everything it flags gets fixed, false positives on
correct proper nouns and technical terms are common in a domain-specific
corpus, so warnings get judged rather than blindly satisfied.
