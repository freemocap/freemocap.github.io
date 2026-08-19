# 01 — User & Education Docs

Covers the two reader-facing arms: **user docs** (get things done) and **education docs** (learn the field). They share a spine but serve different intents.

## The four tutorial tiers

Tutorials are the backbone of the user docs. They're ordered by reader commitment, not by feature.

### Tier 0 — First-touch
Goal: from "what is this?" to "I made a thing" as fast as possible. Minimum decisions, minimum jargon, one happy path.

- What FreeMoCap is, in one screen.
- Install (the single blessed path).
- Record your first movement (single camera).
- See your result. Celebrate.
- One clear "where to next" fork: *use it more* → Beginner, *understand it* → Education, *build with it* → Developer.

### Tier 1 — Beginner
Goal: a confident solo user doing normal recordings.

- Software & hardware prerequisites.
- Full install + first run.
- Single-camera recording, start to finish.
- Intro to multi-camera + calibration (the easy version).
- Reading your output: where files land, what you got.
- Troubleshooting basics + how to ask for help.

### Tier 2 — Intermediate
Goal: good, reliable, higher-quality captures.

- Multi-camera setup and **calibration optimization** (this is a big one — its own cluster of how-tos).
- Understanding + tuning the tracking pipeline (which tracker, when).
- Post-processing: interpolation and filtering (SkellyForge).
- The **output data model** in depth — what every array/dimension means.
- Exporting to Blender and other downstream targets.

### Tier 3 — Advanced
Goal: research-grade rigor and building on top of FreeMoCap.

- Accuracy, validity, and the limits of markerless mocap.
- **Building analyses on the output data** (the "now what do I do with these numbers" arm — serves athletes, clinicians, researchers).
- Custom pipelines / swapping trackers / advanced config.
- Reproducibility, citation, and data management.
- Bridge into the developer docs (`02`) for anyone who wants to extend the code.

> Note: tiers are a **reader-facing funnel**, not a rigid table of contents. A page can belong to a tier and also be reachable directly from a task-based index (see IA, `03`).

## Tutorials vs. how-tos vs. reference (Diátaxis-ish)

Keep these distinct — it's the cheapest way to avoid the DeepLabCut mush:

- **Tutorials** — learning-oriented, hand-held, one happy path, "follow me." (The tiers above.)
- **How-to guides** — task-oriented, "how do I *X*," assume some context, many small focused pages. (Calibration tricks, export formats, fixing a specific error.)
- **Reference** — information-oriented, dry, complete. (Data model spec, config options, CLI, API.)
- **Explanation / concepts** — understanding-oriented. (What is triangulation, what is a boundary object dataset, why calibration matters.)

Every user-facing page should know which of these four it is. Templates in `templates/` enforce it.

## The output data model (special attention)

This is the hinge between "I recorded something" and "I did science/art/analysis with it." It deserves:

- A **concept page**: what the data model *is* and why it's shaped that way.
- A **reference page**: exact arrays, dimensions, coordinate conventions, units, file layout on disk.
- A **how-to cluster**: load it in Python, plot it, compute common measures, export it.

Treat the data model as a first-class citizen with its own landing page, cross-linked from every tier.

## Education track (Skelly University)

The deeper, course-like material — closer to a university class than a how-to. Distinct from tutorials: tutorials get you *using* the tool; the education track teaches you the *field* (markerless mocap, movement science, the CV/ML underneath).

Design intent:

- Structured as **courses / modules / lessons**, not scattered pages.
- Can stand on its own as learning material even for someone who never installs FreeMoCap.
- Hooks into a **low-key micro-credentialing program** — complete a module, get a Skelly University micro-credential. Keep it lightweight; this is community/education flavor, not accredited coursework.
- Cross-references **Skelly University** (previously discussed) as the home for the micro-credentialing side.

Open items for the education track live in `99-open-questions.md` (what counts as a credential, how progress is tracked, how much lives in-docs vs. in Skelly University).

## Cross-audience routing (inside the user docs)

Because the same how-to serves an artist and a clinician for different reasons, add **"if you're a…"** signposts at the top of hub pages, each linking into the same underlying content with the right framing. This is the boundary-object move: one artifact, many doorways. Details in IA (`03`).
