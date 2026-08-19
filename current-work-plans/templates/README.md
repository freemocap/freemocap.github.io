# Page Templates

Copy-paste starting points that enforce consistency across the whole docs map. Every reader-facing page should be recognizably one of these shapes, so someone who's read one page knows how to read the next.

| Template | Use for |
|---|---|
| [`tutorial-page.md`](./tutorial-page.md) | Learning-oriented, hand-held, one happy path (the tutorial tiers). |
| [`how-to-page.md`](./how-to-page.md) | Task-oriented "how do I X" pages. |
| [`concept-page.md`](./concept-page.md) | Understanding-oriented explanations (e.g. the data model, triangulation). |
| [`repo-docs-home.md`](./repo-docs-home.md) | The landing page for a single repo's standalone docs (SkellyDocs-scaffolded). |
| [`architecture-page.md`](./architecture-page.md) | The global map / pipeline narrative pages. |

Shared rules for all templates:
- Open with **what this is + who it's for** in the first line (search snippets depend on it).
- Every page carries orientation: breadcrumb, "where am I," and **next steps**. No dead ends.
- Write for the **current** state of v2 only. No "used to be" history in-line.
