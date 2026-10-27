# FreeMoCap docs

Source for [docs.freemocap.org](https://docs.freemocap.org): one Docusaurus site
composed from several doc sources, so the whole project shares one shell, one
search index and one version switcher. Written against FreeMoCap v2.0.0-alpha.

## Edit the docs

```bash
npm install
npm run fetch      # pull sub-repo docs into external/ (once, and when they change)
npm start          # dev server on :3000
```

1. Branch, edit, open a PR into `main`. CI builds the whole site; a dead internal
   link fails the build on purpose (`onBrokenLinks: 'throw'`), and the prose
   linter only warns.
2. Merge. A push to `main` deploys to the server in about three minutes.

Other commands: `npm run build:local` (build without fetching), `npm run typecheck`,
`npm run lint:prose`.

**Page frontmatter.** Every page declares `provenance` (`ai-generated` or
`human-checked`) and a `history` list, newest first, of `date` and `against` (what
the page was checked against). `inFlux` adds a banner for pages expected to change
before beta. See [How these docs are written](docs/about/how-these-docs-are-written.md).

**Screenshots.** Always run captures through the script so they share one crop, size
and compression, then use the result in the page. Images sit next to their page.
Never commit raw originals. Remaining shots are listed in
[SCREENSHOT-PLAN.md](SCREENSHOT-PLAN.md).

```bash
npm run shot -- raw.png --page docs/tutorials/single-camera.md --id record-controls \
  --crop 0,700,480,350 --app 2.0.0-alpha.25 --os macOS --theme dark
```

```mdx
import shot from './img/record-controls.webp';

<Screenshot src={shot} alt="What the reader should see" caption="Optional" version="2.0.0-alpha.25" />
```

## Architecture

| Route | Folder | Versioned | Owner |
|---|---|---|---|
| `/` | `docs/` | yes (`current` = 2.0 alpha, frozen `1.x`) | this repo: start, tutorials, guides, reference, about |
| `/concepts/` | `concepts/` | no | this repo |
| `/build/` | `build-docs/` | no | this repo, until the core repo owns developer docs |
| `/skellycam/` | `external/skellycam/docs` | independently | `freemocap/skellycam`, fetched at build time |
| `/skellyblender/`, `/skellydocs/`, `/skellyforge/`, `/skellylogs/`, `/skellypings/`, `/skellysync/`, `/skellytracker/` | `stub-docs/` | no | this repo, until each repo has its own docs |

**`/concepts/` is unversioned on purpose.** Docusaurus versions by copying a whole
folder. That suits pages about the software and not pages about reality: what
triangulation is did not change between releases.

**`data/repos.yml` is the single source of truth for the polyrepo map.** It drives
the architecture map, repo directory, data contracts table and which repos get
fetched. Change it, not the generated pages. `docs_path: null` means the repo gets
a stub under `stub-docs/`; setting a path later is a one-line change. `ref` pins the
fetched git ref. Fetched docs refresh only when the site is rebuilt, so after a
sub-repo docs change, re-run the deploy workflow.

**Hosting.**

```
reader -> Cloudflare (proxied A record, SSL Full for this host)
       -> Plesk VPS, nginx serving static files, Let's Encrypt cert (Plesk renews)
GitHub Actions --rsync over SSH--> VPS docs folder
freemocap.github.io/* --301--> docs.freemocap.org/*   (GitHub Pages, redirect only)
```

GitHub Pages stays enabled on `main` with the root `CNAME` file purely so
`freemocap.github.io` and the org's project-site URLs keep redirecting here. Never
delete `CNAME` or disable Pages.

## Deploy

`.github/workflows/deploy.yml`:

- **`build`** runs on every push and PR: fetch, lint, build, upload the site.
- **`deploy`** rsyncs the build to the VPS. It runs on **Run workflow** (Actions
  tab) or on a push to `main` while the repo variable `DEPLOY_ON_PUSH` is `true`.
  It does a dry run first and aborts if more than 400 files would be deleted.
  `DOCS_DEPLOY_DRY_RUN=true` skips the real sync.

Needs secret `DOCS_SSH_KEY` and variable `DOCS_SSH_KNOWN_HOSTS`. The key is locked
server-side with `restrict,command="rrsync <docs folder>"`, so it can only touch the
docs folder. The sync skips `.well-known` (certificate renewal), `.htaccess`,
`error_docs` and `cgi-bin`.

## Redirects and server config

Old URLs live in `data/redirects.js` and work as client-side redirect pages as soon
as the site deploys. For real 301s, regenerate the nginx rules and paste them into
Plesk (Websites & Domains -> docs.freemocap.org -> Apache & nginx Settings ->
Additional nginx directives):

```bash
node scripts/gen-nginx-redirects.js > nginx-legacy-redirects.conf
```

The 404 page is Plesk's `error_docs/not_found.html` in the domain folder, not part
of the build. Proxy mode is off, so `.htaccess` does nothing.

**Rollback.** Point the Cloudflare `docs` record back at `freemocap.github.io`
(CNAME, proxied) and set Pages source to the `legacy-placeholder` branch (allow it
in the `github-pages` environment first).

## Prose linting

Vale with Google's style package plus local rules in `.vale/styles/FreeMoCap` (no
dashes, project spellings, empty assertive adjectives, colons joining sentences).
CI runs it on `docs`, `concepts`, `build-docs` and `stub-docs`, and never blocks.

## Known issues

1. **Tutorial tiers (1/2/3) and Skelly University numbering (1000/2000/3000)** don't
   map onto each other yet.
2. **SkellyCam's docs use site-absolute `/docs/...` links.** The fetch script
   rewrites them and logs the count; the durable fix is relative links in that repo.
3. **`/build/` lives here.** When the core repo owns developer docs, set `docs_path`
   for `freemocap` in `repos.yml` and delete `build-docs/`.
4. **Ground-plane videos are missing.** `docs/tutorials/ground-plane.md` has two
   `<video>` tags for `static/img/v1/*.mp4` (about 24MB). Source:
   `freemocap/documentation`, `docs/Writerside/images/assets/images/calibration/`.
5. **Five old project sites 404** on this domain (`/skellybot/`, `/bs/`,
   `/2025-nsf-pose/`, `/skellybot-analysis/`, `/skellyspeak/`) by choice. Their
   content stays in their own repos.

App and sub-repo problems that need an engineer are in
[ENGINEER-CALLOUTS.md](ENGINEER-CALLOUTS.md). The download page lives at
`freemocap.org/download`; the navbar links there.
