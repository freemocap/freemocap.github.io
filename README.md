# FreeMoCap docs

The aggregator site served at [docs.freemocap.org](https://docs.freemocap.org).

One Docusaurus site composed from several sources, so the whole map shares one
shell, one search index, and one version switcher.

## Quick start

```bash
npm install
npm run fetch      # pull sub-repo docs into external/
npm start          # dev server on :3000
```

`npm run build` runs `fetch` then builds. `npm run build:local` skips the fetch
and uses whatever is already in `external/`.

## How it is put together

Four content sources, mounted as separate Docusaurus docs instances:

| Route | Folder | Versioned | Owner |
|---|---|---|---|
| `/` | `docs/` | yes | this repo. Start, tutorials, guides, reference, about |
| `/concepts/` | `concepts/` | **no** | this repo |
| `/build/` | `build-docs/` | yes | this repo, for now (see below) |
| `/skellycam/` | `external/skellycam/docs` | independently | `freemocap/skellycam` |

**`/concepts/` is deliberately unversioned.** Docusaurus versions by copying a
whole folder into a frozen snapshot. That is right for pages describing the
software, since 2.0 install steps genuinely differ from 2.1, and wrong for pages
describing reality, since what triangulation is did not change between releases.
Versioning is set per instance, so unversioned concept pages need their own
instance. Readers never see the seam.

## data/repos.yml

Single source of truth for the polyrepo map. It drives which sub-repos get
fetched, and it is the intended source for the architecture map, the repo
directory, the data contracts table, and the "where it sits" panel on each
repo's docs home. Do not hand-write any of those; change this file.

`docs_path: null` means the repo has no docs site yet. Today that is
SkellyTracker, SkellyForge, SkellyBlender, and all four utilities (SkellyLogs,
SkellyPings, SkellyDocs, SkellySync). The fetch script skips them and says so;
the build does not care. Adding SkellyForge docs later is a one-line change
here.

`ref` pins a git tag. The site builds against pins, not `main`, so a sub-repo
merging a broken doc cannot break the docs site.

## Versioning

Currently one version, `current`, labelled "2.0 (alpha)".

Cut the frozen legacy version **once**, after the V1 port has been reviewed and
before V2 rewrites begin:

```bash
npm run docusaurus docs:version 1.x
```

then add to `docusaurus.config.ts`:

```ts
'1.x': { label: '1.x (legacy)', path: '1.x', banner: 'unmaintained' }
```

Cutting it now would snapshot a version identical to `current`, which would tell
readers something untrue.

## Provenance

Every page declares how it was written, and the declaration is permanent and
reader-facing. Two values:

| `provenance` | Means |
|---|---|
| `ai-generated` | A model wrote this from the code. No human has checked it line by line. |
| `human-checked` | Written or checked by a human, against the version in `reviewed_against`. |

A page moves from one to the other when someone gives it a pass. "Done" means the
label is accurate, not that the label is gone.

`reviewed_against` is what keeps this honest. `human-checked` on a page last read
against `alpha.4` is a claim about history. CI should warn when a page falls more
than N releases behind current; that check is not written yet.

## Prose linting

```bash
vale docs concepts build-docs
```

Google's style package plus three local rules: no em-dashes or en-dashes,
project spellings (`FreeMoCap`, `SkellyCam`, `ChArUco`), and a warning on
assertive adjectives that describe nothing (`powerful`, `seamless`,
`state-of-the-art`).

CI runs it non-blocking. Raise `fail_on_error` to `true` once the corpus is clean.

## Deploy

Every push and pull request runs the `build` job in
`.github/workflows/deploy.yml`: fetch external docs, lint prose, build.
Nothing ships anywhere as a result of that alone.

Publishing is a separate, manual step: trigger `workflow_dispatch` on that
same workflow from the Actions tab ("Run workflow"). The `deploy` job then
downloads the `build` job's artifact and pushes it to docs.freemocap.org via
`SamKirkland/FTP-Deploy-Action`, using a dedicated FTP account scoped to that
subdomain's own document root. Merging a PR never triggers a deploy by
itself.

Required repository secrets: `DOCS_FTP_USERNAME`, `DOCS_FTP_PASSWORD`.

`onBrokenLinks` is set to `throw`. Do not downgrade it. It is the mechanical
enforcement of the no-dead-ends principle, and it is what caught the SkellyCam
link problem described below.

## One-shot scripts

`scripts/port-v1.mjs` and `scripts/scaffold-pages.mjs` have already been run.
They are checked in so the port is reproducible and reviewable, not because they
need running again. `scaffold-pages.mjs` never overwrites an existing file, so it
is safe to re-run when new pages join the sitemap.

## Known issues and things a human has to decide

1. **V2's data model is still stabilizing during alpha.** `reference/
   data-arrays.md`, `reference/recording-structure.md`,
   `tutorials/find-your-data.md`, `tutorials/analyze-in-python.md`, and all of
   `/build/` carry an in-flux banner (`inFlux` frontmatter field) rather than
   being held back: real content today, expected to change before beta.

2. **Curriculum tier reconciliation.** The tutorial tiers (1/2/3) and Skelly
   University's own module numbering (1000/2000/3000) don't map cleanly onto
   each other yet. Known, deliberately unresolved.

3. **SkellyCam's docs use site-absolute `/docs/…` links** that only resolve on
   its standalone site. `fetch-external-docs.mjs` rewrites them on fetch and
   logs the count. That bridges it; the durable fix is relative links in the
   sub-repo. Any repo joining the aggregate will have the same problem.

4. **`/build/` currently lives in this repo.** The core repo's 34 pages in
   `freemocap-docs/docs` are source material being consolidated (15 architecture
   pages collapse to about 6). Once that lands and the core repo owns the
   developer arm, set `docs_path` for `freemocap` in `repos.yml` and delete
   `build-docs/`.

5. **The legacy ground-plane calibration videos aren't in this repo.**
   `docs/tutorials/ground-plane.md` links to two `<video>` tags pointing at
   `static/img/v1/*.mp4` (about 24MB), sourced from the legacy docs repo at
   `freemocap/documentation` under
   `docs/Writerside/images/assets/images/calibration/`. Either copy them into
   `static/img/v1/` or move them to a CDN and update those two tags; committing
   24MB of video into a docs repo is worth avoiding if there's an easy
   alternative.

There is no `docs.freemocap.org/download`, and there should never be one: the
real download page (OS/GPU detection, release selector) lives on the main
site, at `freemocap.org/download` (which itself redirects, 301, to
`freemocap.org/download.html`). This site's navbar Download item links
directly to `freemocap.org/download`, never to a page on this domain.
