# FreeMoCap docs

The aggregator site served at [docs.freemocap.org](https://docs.freemocap.org).

One Docusaurus site composed from several sources, so the whole map shares one
shell, one search index, and one version switcher. Built against the plan in
`v2-docs-sitemap.md`.

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
| `/` | `docs/` | yes | this repo. Start, tutorials, guides, reference, community |
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
SkellyTracker, SkellyForge, SkellyBlender, and all three utilities. The fetch
script skips them and says so; the build does not care. Adding SkellyForge docs
later is a one-line change here.

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

`.github/workflows/deploy.yml` builds and rsyncs to the VPS, into a timestamped
release directory with a symlink flip, keeping the last five. A failed transfer
never leaves the live site half-written and rolling back is re-pointing the
symlink.

Required secrets: `DOCS_VPS_HOST`, `DOCS_VPS_USER`, `DOCS_VPS_ROOT`,
`DOCS_VPS_SSH_KEY`.

`onBrokenLinks` is set to `throw`. Do not downgrade it. It is the mechanical
enforcement of the no-dead-ends principle, and it is what caught the SkellyCam
link problem described below.

## One-shot scripts

`scripts/port-v1.mjs` and `scripts/scaffold-pages.mjs` have already been run.
They are checked in so the port is reproducible and reviewable, not because they
need running again. `scaffold-pages.mjs` never overwrites an existing file, so it
is safe to re-run when new pages join the sitemap.

## Known issues and things a human has to decide

1. **`/guides/` is a stub list** until the Discord `#help-requests` export lands.
   The how-to library should be derived from questions people actually ask.

2. **Which trajectory is canonical**, `3d_xyz` or `rigid_3d_xyz`. The code
   produces both. The docs have to tell people which to cite, and that is a
   project decision.

3. **The download page is a placeholder.** The working one, with OS and GPU
   detection and a release selector, already exists in
   `freemocap/freemocap-docs/src/components/download`. Lift it wholesale.

4. **`freemocap.org/download` 301s to `docs.freemocap.org/freemocap/download`**
   (see the main site's `SITE-ARCHITECTURE.md`). That path is preserved by a
   redirect here, so nothing breaks on cutover, but the main site's 301 should be
   repointed at `/download` and the redirect kept as archival.

5. **SkellyCam's docs use site-absolute `/docs/…` links** that only resolve on
   its standalone site. `fetch-external-docs.mjs` rewrites 24 of them on fetch
   and logs the count. That bridges it; the durable fix is relative links in the
   sub-repo. Any repo joining the aggregate will have the same problem.

6. **`/build/` currently lives in this repo.** The core repo's 34 pages in
   `freemocap-docs/docs` are source material being consolidated (15 architecture
   pages collapse to about 6). Once that lands and the core repo owns the
   developer arm, set `docs_path` for `freemocap` in `repos.yml` and delete
   `build-docs/`.

7. **`about-us` exists twice**, at `freemocap.org/about-us` and
   `/about/about-us` here. Worth deciding which is canonical.

`/reference/coordinate-conventions` and `/concepts/coordinate-systems` were the other blocked
pages; both are now written (millimetres, right-handed, +Z up after ground-plane calibration).

## A note on the handoff archive

`static/img/v1/*.mp4` (24MB of ground-plane calibration video) is excluded from
the handoff archive to keep it transferable. The files are in the legacy docs
repo at `freemocap/documentation` under `docs/Writerside/images/assets/images/calibration/`.
Copy them into `static/img/v1/` before deploying, or move them to a CDN and
update the two `<video>` tags in `docs/tutorials/ground-plane.md`. Committing
24MB of video into a docs repo is worth avoiding if there is an easy alternative.
