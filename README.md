# FreeMoCap docs

The aggregator site for [docs.freemocap.org](https://docs.freemocap.org), written
against FreeMoCap v2.0.0-alpha.

One Docusaurus site composed from several sources, so the whole map shares one
shell, one search index, and one version switcher.

## Quick start

```bash
npm install
npm run fetch      # pull sub-repo docs into external/
npm start          # dev server on :3000
```

`npm run build` runs `fetch` then builds. `npm run build:local` skips the fetch
and uses whatever is already in `external/`. `npm run typecheck` runs `tsc`.

## How it is put together

| Route | Folder | Versioned | Owner |
|---|---|---|---|
| `/` | `docs/` | yes (`current` = 2.0 alpha, plus frozen `1.x`) | this repo. Start, tutorials, guides, reference, about |
| `/concepts/` | `concepts/` | **no** | this repo |
| `/build/` | `build-docs/` | no | this repo, for now (see Known issues) |
| `/skellycam/` | `external/skellycam/docs` | independently | `freemocap/skellycam` |
| `/skellyblender/`, `/skellydocs/`, `/skellyforge/`, `/skellylogs/`, `/skellypings/`, `/skellysync/`, `/skellytracker/` | `stub-docs/` | no | this repo, until each repo has its own docs site |

**`/concepts/` is deliberately unversioned.** Docusaurus versions by copying a
whole folder into a frozen snapshot. That is right for pages describing the
software and wrong for pages describing reality, since what triangulation is did
not change between releases. Versioning is set per instance, so unversioned
concept pages need their own instance.

## data/repos.yml

Single source of truth for the polyrepo map. It drives which sub-repos get
fetched and mounted. Do not hand-write the architecture map, repo directory, or
data contracts table; change this file.

`docs_path: null` means the repo has no docs site yet, so it gets a stub section
under `stub-docs/` instead. The fetch script skips these and says so. Giving a
repo a docs site later is a one-line change here. `ref` pins a git tag or branch
for the fetch.

## Provenance

Every page declares how it was written, in frontmatter, and the declaration is
permanent and reader-facing.

- `provenance`: `ai-generated` (drafted by an AI from source) or `human-checked`
  (a person verified it, even if an AI did the drafting).
- `history`: the audit log, newest first. Each entry has a `date` and an
  `against`, what the page was checked against.
- `inFlux`: a banner message for pages expected to change before beta.

[How these docs are written](docs/about/how-these-docs-are-written.md) is the
reader-facing version of this.

## Prose linting

```bash
npm run lint:prose
```

Google's style package plus local rules in `.vale/styles/FreeMoCap`: no dashes,
project spellings, a warning on empty assertive adjectives, and a warning on
colons that join two full sentences. CI runs Vale on
`docs`, `concepts`, `build-docs` and `stub-docs`, non-blocking
(`fail_on_error: false`). Findings appear as annotations on the run.

## Deploy

`.github/workflows/deploy.yml` has two jobs.

**`build`** runs on every push and pull request: fetch external docs, lint prose,
build, upload the site as an artifact. `onBrokenLinks` is `throw`, so a dead
internal link fails the build. Do not downgrade it.

**`deploy`** publishes that artifact to the Plesk VPS with `rsync` over SSH. It
runs only when:

- someone triggers **Run workflow** on the Actions tab (the workflow file must be
  on `main`), or
- a push lands on `docs-v2` while the repo variable `PREVIEW_DEPLOY` is `true`
  (pre-merge testing; leave it unset otherwise).

Merging never deploys by itself. The job first runs a dry run (aborting if it
would delete more than 400 files), then the real sync. Set the repo variable
`DOCS_DEPLOY_DRY_RUN` to `true` to skip the real sync and only see what would
change.

The SSH key is locked server-side with `restrict,command="rrsync <docs folder>"`
in `authorized_keys`, so it can only read and write inside the
`docs.freemocap.org` folder, even though its user also owns the main
`freemocap.org` site.

Each step explains itself in the run log: the prose linter (Vale) is advisory and
can never block a deploy, and the build and deploy jobs add a plain-language note
when they fail or run as a dry run.

Needs on the repo: secret `DOCS_SSH_KEY` (the private key) and variable
`DOCS_SSH_KNOWN_HOSTS` (the server's pinned host key). The pre-cutover checklist
is in [DEPLOY-PLAN.md](DEPLOY-PLAN.md).

To look at the test server before it goes live, see [PREVIEW.md](PREVIEW.md).

## Screenshots

Shot list: [SCREENSHOT-PLAN.md](SCREENSHOT-PLAN.md). Process every capture through
the script so they all get the same crop, size and compression:

```bash
npm run shot -- raw.png --page docs/tutorials/single-camera.md --id record-controls \
  --crop 0,700,480,350 --app 2.0.0-alpha.25 --os macOS --theme dark
```

That writes `docs/tutorials/img/record-controls.webp` (1600 px wide at most) and
records it in `data/media-manifest.json`. Then use it in the page:

```mdx
import shot from './img/record-controls.webp';

<Screenshot src={shot} alt="What the reader should see" caption="Optional" version="2.0.0-alpha.25" />
```

Images sit next to their page so a frozen version keeps its own screenshots.
Clicking an image zooms it. Never commit the raw originals.

## Known issues

1. **V2's data model is still stabilizing during alpha.** 18 pages, including
   all of `/build/`, carry an `inFlux` banner: real content today, expected to
   change before beta.
2. **Curriculum tier reconciliation.** The tutorial tiers (1/2/3) and Skelly
   University's module numbering (1000/2000/3000) don't map cleanly onto each
   other yet. Deliberately unresolved.
3. **SkellyCam's docs use site-absolute `/docs/…` links** that only resolve on its
   standalone site. `fetch-external-docs.mjs` rewrites them on fetch and logs the
   count. The durable fix is relative links in the sub-repo.
4. **`/build/` lives in this repo.** Once the core repo owns the developer docs,
   set `docs_path` for `freemocap` in `repos.yml` and delete `build-docs/`.
5. **The ground-plane videos are v1 footage.** `docs/tutorials/ground-plane.md` plays
   `groundplane_calibration.mp4` and `groundplane_example.mp4` from `static/img/v1/`.
   The calibration clip shows the board on the floor, which is the same in v2. The
   example clip shows the v1 app's 3D view, so re-record it on v2; see "Clips" in
   [SCREENSHOT-PLAN.md](SCREENSHOT-PLAN.md).

Items that need an engineer to change the app or another repo are tracked in
[ENGINEER-CALLOUTS.md](ENGINEER-CALLOUTS.md).

The real download page lives on the main site at `freemocap.org/download`. This
site's navbar Download item links there; this domain never has its own.
