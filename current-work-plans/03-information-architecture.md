# 03 — Information Architecture & Navigation

This is the plan for the thing that actually makes the docs a good boundary object: **how people find their path**. Content matters less than routing if people can't get to it.

## The core problem

People **jump into the middle**. They arrive from a search engine, a Discord link, or a paper citation — rarely at the homepage, rarely at the "start here." So the IA can't rely on a single front door. It has to make **every page** a viable entry point.

## Three navigation directions (all must work)

1. **Top-down** — land on the FreeMoCap home, understand the whole, drill into specifics.
2. **Bottom-up** — land deep in a single component or how-to, and be able to zoom out to see where it fits.
3. **Inside-out** — land on a concept or data type, and branch sideways to every tool/tutorial that touches it.

Every page carries enough orientation to support all three. Concretely, that means each page answers, above the fold: **Where am I? What is this? Where can I go next?**

## The top-level split

First fork the reader hits, kept deliberately small (ethereum.org-style branching entry):

```
FreeMoCap Docs (home)
├── Use it            → User docs        (tutorials, how-tos, data model)
├── Learn the field   → Education        (courses, Skelly University)
└── Build it          → Developer / Architecture (polyrepo map, per-repo)
```

Each door maps to a plan doc: **Use it** and **Learn the field** → [User & Education Docs](./01-user-and-education-docs.md); **Build it** → [Developer & Architecture Docs](./02-developer-and-architecture-docs.md).

Home's whole job is to route, not to explain. Three clear doors + a one-line "not sure? start here" that drops into Tier-0 first-touch.

## Persistent orientation elements (on every page)

- **Breadcrumb** — the path from home to here. Cheap, huge payoff for middle-landers.
- **"You are here" panel** — for component/architecture pages, a small map showing this node and its neighbors, linking to the global map.
- **Audience signposts** — on hub pages, "if you're a [student / artist / athlete / researcher / developer], go here." One artifact, many doorways.
- **Next steps** — every page ends pointing somewhere. No dead ends (principle #6).
- **Global map link** — always reachable, one canonical architecture diagram.

## Funnels, not dumps

Prefer a few strong **hub pages** that route to focused leaf pages, over big everything-pages. Each hub:

- States who it's for and what's downstream.
- Offers a short, ordered path (the happy path) *and* a task index (jump straight to a how-to).
- Doesn't try to teach everything itself.

Hubs we'll likely need: **Docs home**, **User docs home**, **Data model home**, **Education home**, **Developer/architecture home**, and **one hub per pantheon repo**.

## The "boundary object" mechanic, concretely

A single how-to (say, "understand your output data") serves an artist and a clinician differently. Rather than fork the content, fork the **doorway**:

- The page has one canonical body.
- Multiple entry framings link into it ("Artists: get clean motion into Blender" / "Researchers: validate your measurements") each landing on the relevant section.
- Related-links at the bottom branch outward by audience.

This keeps content DRY while making every community feel addressed.

## Cross-repo navigation

Because the docs span many repos scaffolded by SkellyDocs:

- **Unified shell** — shared nav/header/footer so crossing repos never feels like leaving the site.
- **Consistent page shapes** — same section names everywhere (see templates).
- **Up/down links on component docs** — "this consumes X from SkellyCam / produces Y for SkellyForge," each a link.
- **Canonical global map** — one source of truth, embedded/linked from every repo.

## Search & findability

- Assume search is the #1 entry point. Titles and first paragraphs must be self-describing (no "Introduction" as a page title).
- Every page's opening line states what it is and who it's for, so a search snippet is useful.
- Consistent terminology (a glossary/concept index) so the same thing isn't called three names across repos.

## Anti-patterns to design against (from the reference notes)

- **Dead ends** (DeepLabCut) → enforce "next steps" on every page.
- **No obvious start** (MyST) → the three-door home + first-touch fallback.
- **Loops** (MyST) → deliberate hierarchy; cross-links are labeled as sideways, not as the main path.
- **Visual overwhelm / three-column dump** (MyST, Blender) → restrained layout, funnels over walls of links.
- **Inconsistency / staleness** (DeepLabCut) → shared scaffolding + current-state-only writing (principle #9).

## Open IA questions

Parked in [Open Questions](./99-open-questions.md): exact URL/domain structure (one site vs. subdomains per repo), where the global map physically lives, and how education/micro-credential progress is surfaced in-nav.
