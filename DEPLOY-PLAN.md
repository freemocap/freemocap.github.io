# Deploy plan: cutting docs.freemocap.org over to V2

Internal planning doc for org conversations about the actual go-live. Not
meant to ship: delete this file once the cutover is done and stable. The
README's own "Deploy" section covers the steady-state mechanism and stays.

## Status as of 2026-08-26

- `docs-v2` is fully audited, committed, pushed to `origin/docs-v2`.
- `deploy.yml` rewritten: manual `workflow_dispatch` only, FTP to the VPS via
  `SamKirkland/FTP-Deploy-Action`, matching `freemocap_dot_org`'s own proven
  pattern instead of the earlier untested SSH/rsync draft.
- Secrets `DOCS_FTP_USERNAME` and `DOCS_FTP_PASSWORD` are set on
  `freemocap/freemocap.github.io`.
- The `docs-v2` -> `main` PR has not been opened or merged yet.
- GitHub Pages for this repo is still live, still building off `main`'s root.

## The risk that isn't obvious upfront

`workflow_dispatch` only appears in the Actions tab (or `gh workflow run`)
for a workflow that already exists on the **default branch**. Confirmed via
`gh workflow list`: `deploy.yml` doesn't show up yet even though it's already
on `docs-v2`. So the deploy can't be staged or dry-run from the branch before
merging; merging to `main` is a hard prerequisite.

That's a problem, because `main`'s GitHub Pages is currently configured as
legacy build, straight off `main`'s root (confirmed via the Pages API:
`build_type: legacy`, `source: {branch: main, path: /}`). The moment this
merges, GitHub's own `pages-build-deployment` will try to Jekyll-build the
new tree. That tree is raw Docusaurus source (no `.nojekyll`, no root
`index.html`), so this is very likely to break whatever's live at
docs.freemocap.org immediately, before anyone's touched the VPS or DNS.

**Fix:** disable GitHub Pages for `freemocap/freemocap.github.io`
(Settings -> Pages -> Source -> "None") as its own step, independent of when
the PR merges. Pages isn't part of the go-forward story regardless, so
there's no reason to leave this until cutover day. Once it's off, the merge
itself can't trigger a broken auto-build no matter what's in the tree.

## What's actually live right now (checked directly, not assumed)

`docs.freemocap.org/` is **not** a full V1 site today. It's a small
placeholder (24 files on `main`, most recent real commit is literally titled
"brain dump") that says the docs refactor is in progress and links out to
`docs.freemocap.org/documentation/*` for the real legacy content.

That `/documentation/*` content is real and live. Confirmed pages, scraped
directly from the placeholder's own links:

- `/documentation/index_md.html`
- `/documentation/installation.html`
- `/documentation/software-hardware-prerequisites.html`
- `/documentation/multi-camera-calibration.html`
- `/documentation/single-camera-recording.html`
- `/documentation/calibration-troubleshooting.html`
- `/documentation/installation-troubleshooting.html`
- `/documentation/frequently-asked-questions-faq.html`
- `/documentation/code-of-conduct.html`
- `/documentation/contributing-index.html`

There may be more still indexed by search engines or bookmarked that aren't
linked from the placeholder; this list is only what's provably still in use
today, not a full crawl.

### Open question, blocking the redirect plan

`freemocap/documentation`'s own `gh-pages` branch looked like the obvious
source for `/documentation/*`, but its content uses a different, nested URL
scheme (`getting_started/installation/index.html`) that 404s live. Whatever
actually serves the flat, kebab-case URLs above is something else: a
Cloudflare Worker or Pages project, a different repo or branch, or a direct
deploy to the VPS outside of GitHub entirely. Not identifiable from outside
the account.

**Needs an answer before DNS moves:** what actually serves `/documentation/*`
today? That determines whether it silently disappears the moment
docs.freemocap.org points at the new VPS content (meaning the redirects
below need to exist before the DNS flip, not after), or whether it lives on
infrastructure this cutover doesn't touch at all.

## Redirect mapping (V1 flat URL -> V2 page)

Real 301s via `.htaccess` on the VPS, not a client-side JS redirect plugin:
proper SEO signal, works without JS, and the target is already a plain
Apache/Plesk host. Draft mapping, built from the confirmed-live list above
against the actual `docs-v2` file tree:

| V1 URL | V2 target | Notes |
|---|---|---|
| `/documentation/index_md.html` | `/` | site root |
| `/documentation/installation.html` | `/start/install` | exact match |
| `/documentation/software-hardware-prerequisites.html` | `/reference/system-requirements` | or `/tutorials/hardware`, pick one |
| `/documentation/multi-camera-calibration.html` | `/tutorials/calibrate` | or `/tutorials/multi-camera`, pick one |
| `/documentation/single-camera-recording.html` | `/tutorials/single-camera` | exact match |
| `/documentation/calibration-troubleshooting.html` | `/guides/calibration-troubleshooting` | exact match |
| `/documentation/installation-troubleshooting.html` | `/guides/installation-troubleshooting` | exact match |
| `/documentation/frequently-asked-questions-faq.html` | `/guides/faq` | or `/about/faq`, two FAQ pages exist now, pick one |
| `/documentation/code-of-conduct.html` | `/about/code-of-conduct` | exact match |
| `/documentation/contributing-index.html` | `/build/contributing` | exact match |

Three rows need a decision (marked above), the rest are unambiguous. Once
those are picked and the open question above is answered, this becomes an
actual `.htaccess` file to add to `static/` so it ships with every build.

## Cutover sequence

1. **Disable GitHub Pages** for `freemocap/freemocap.github.io` (Settings ->
   Pages -> Source -> "None"). Do this first, independent of merge timing.
2. **Merge** the `docs-v2` -> `main` PR. Safe now that Pages can't try to
   build it.
3. **Trigger the deploy** manually: Actions tab -> "Build and deploy docs" ->
   Run workflow, on `main`. Builds fresh and FTPs to the VPS.
4. **Verify before touching DNS.** Check the VPS is actually serving the
   right content: Plesk's own preview URL for the subscription, or a
   temporary local `/etc/hosts` override pointing `docs.freemocap.org` at
   `198.71.57.235` to test real paths before anyone else can see them.
5. **Flip DNS** for `docs.freemocap.org` from GitHub Pages to the VPS.
   Consider lowering the record's TTL a day or two ahead of this step if
   it's currently high, to shrink propagation lag.
6. **Confirm live and stable.** Pages is already off from step 1, nothing
   further needed on GitHub's side.

## Rollback

Nothing here is destructive to source: `main`'s prior state is still in git
history, and disabling Pages doesn't delete anything, it can be re-enabled
from the same Settings page. If the VPS content is wrong post-cutover, the
fastest fix is re-running step 3 after correcting the source, not re-doing
DNS. If DNS itself needs to revert, point it back at GitHub Pages and
re-enable Pages for the repo; the old placeholder content is still sitting
on `main` until something overwrites it further.

## After cutover

- Delete this file.
- Consider removing the `CNAME` file from `main` if Pages is staying off for
  good (not urgent, inert either way once DNS points elsewhere).
- Two still-open, non-blocking items from the docs-v2 work itself: PRs for
  the `skellydocs`/`skellypings` license fixes sitting in local clones, and
  the curriculum tier reconciliation. Neither blocks this cutover.
