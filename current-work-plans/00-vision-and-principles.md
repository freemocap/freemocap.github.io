# 00 — Vision & Principles

## What FreeMoCap is (for the docs' purposes)

FreeMoCap is a tool for studying **human movement using computer vision and machine learning** from ordinary cameras. People arrive from wildly different directions — students, artists, athletes, clinicians, hobbyists, and high-level researchers — with wildly different backgrounds and goals.

The docs' central job is to be a good **boundary object**: a single shared resource that serves all of these communities without watering down for any of them. It does that not by writing one doc for everyone, but by building excellent **funnels, routing, and entry points** so that whoever shows up, whatever their expertise, can find their path.

## The three arms of the docs

1. **User docs** — tutorials and how-tos. Install, record, calibrate, understand the output data model, build analyses on top of it. Tiered from first-touch → beginner → intermediate → advanced. See [User & Education Docs](./01-user-and-education-docs.md).
2. **Education docs** — deeper, course-like material closer to an online university class. Optionally tied to a low-key **micro-credentialing** program (Skelly University). See [User & Education Docs](./01-user-and-education-docs.md).
3. **Developer / architecture docs** — how the software is built, how the polyrepo fits together, and how to contribute. This is a distinct arm, not an appendix to the user docs. See [Developer & Architecture Docs](./02-developer-and-architecture-docs.md).

## Audiences (design for all, assume none)

| Audience | Comes for | Likely entry tier |
|---|---|---|
| Curious first-timer | "What is this / can I try it?" | First-touch |
| Student | Learn a technique or complete a class assignment | Beginner → Education |
| Artist / animator | Get motion into Blender / a project | Beginner → intermediate how-tos |
| Athlete / coach | Measure movement, get usable numbers | Beginner → data model |
| Clinician / applied researcher | Rigor, validity, the output data model | Intermediate → advanced |
| Academic researcher | Methods, accuracy, citation, extension | Advanced → developer |
| Developer / contributor | Understand and extend the code | Developer / architecture |

No one is the "default" reader. The [Information Architecture](./03-information-architecture.md) has to make every one of these feel like the docs were written for them.

## Guiding principles

These are the tie-breakers. When a structure decision is hard, defer to these.

1. **People jump into the middle.** Almost nobody starts at the top of the map. Every page assumes the reader landed there from a search engine and needs to know *where am I, what is this, where do I go next*.
2. **Navigation is a feature, not a byproduct.** Clear high-level structure + always-available orientation. Support top-down (start at FreeMoCap, drill in), bottom-up (start at a sub-Skelly, zoom out), and inside-out (start at a concept, branch to related tools).
3. **One system, many surfaces.** Every repo's docs are scaffolded from SkellyDocs so they share look, navigation, and conventions. A reader should never feel like they crossed into a different project's website.
4. **Each sub-repo stands alone.** Each Skelly documents itself as if it were a standalone tool. The core FreeMoCap docs compose those, they don't replace them.
5. **Funnel, don't dump.** Prefer a few strong entry points that route people, over one giant page that overwhelms them. (This is the DeepLabCut / MyST failure mode we're avoiding — see the reference notes.)
6. **No dead ends.** Every page ends by pointing somewhere: next step, related concept, or "you're done, here's what you can do now."
7. **Consistency over cleverness.** Same page shapes, same section names, same tone across the whole map. Consistency is what makes ArchWiki feel "perfect" and DeepLabCut feel like it came from 30 different students.
8. **Show, don't just tell.** UI-heavy steps get screenshots (the one thing Blender's docs do well). Data and code get runnable examples.
9. **Written for the current state.** Docs describe how v2 works now — not how v1 worked, not the migration story. (Migration lives in a clearly-labeled, dated corner, not woven through.)

## What "good" looks like (from the reference notes)

Steal from the sites Jon likes:

- **[ethereum.org/learn](https://ethereum.org/learn/)** — branching entry points; clean split between beginner/advanced and user/developer.
- **[ArchWiki](https://wiki.archlinux.org/title/Main_page)** — clean, consistent, "perfect" reference feel.
- **[NumPy](https://numpy.org/doc/stable/) / [SciPy](https://docs.scipy.org/doc/scipy/)** — classic scientific/academic docs credibility.
- **[Blender support](https://www.blender.org/support/)** — good coverage and great UI screenshots (but bad funnels — take the screenshots, not the funnel).

Also referenced as "does the job" org-style docs: **[2i2c docs](https://docs.2i2c.org/)** (simple, basic, more org-type than software).

Avoid the failure modes:

- **[DeepLabCut](https://deeplabcut.github.io/DeepLabCut/README.html)** — overwhelming, inconsistent, dead ends, stale, "too many docs."
- **[MyST guide](https://mystmd.org/guide/)** — good coverage but no obvious start, contains loops, three-column layout is visually overwhelming.

Style reference to follow: the **[Google developer documentation style guide](https://developers.google.com/style/)**.

## Success criteria (draft)

- A first-timer can go from landing page → first recording without asking Discord.
- A researcher can find the output data model and its validity/accuracy story in ≤2 clicks.
- A developer can understand the whole polyrepo architecture from any single repo's docs.
- Every page passes the "where am I / where next" test.
