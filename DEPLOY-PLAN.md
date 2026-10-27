# Go-live checklist for docs.freemocap.org

Internal. Delete this file once the cutover is done and stable. How the deploy
works is in the README; this is only what remains before this site replaces the
current one.

## Where things stand

- The full site is deployed to the Plesk VPS and tested there, through a hosts
  file override only. DNS still points at GitHub Pages, so the current
  placeholder is what everyone else sees.
- GitHub Pages on `main` is still a legacy build off `main`'s root, and the live
  placeholder is served from there.

## Cutover

1. **Switch GitHub Pages to a redirect-only stub. Do not disable it.** Publish
   `github-pages-stub/` as the root of an orphan `gh-pages` branch, then Settings
   -> Pages -> Source -> `gh-pages` (keep the custom domain `docs.freemocap.org`).
   This still stops Pages from Jekyll-building the Docusaurus source on merge,
   and it keeps `freemocap.github.io/*` and every org project site
   (`freemocap.github.io/<repo>/`) redirecting to `docs.freemocap.org`. If Pages
   is disabled outright, github.io root 404s and the project sites start serving
   their old content directly on github.io.
2. **Merge** PR #3. The workflow's manual trigger only appears once `deploy.yml`
   is on `main`.
3. **Run workflow** on `main` (Actions -> "Build and deploy docs").
4. **Check the VPS** through your hosts file override.
5. **Flip DNS** for `docs.freemocap.org` to the VPS. Lower the record's TTL a day
   or two ahead.
6. **Issue the TLS certificate** in Plesk once DNS points at the VPS.

## Redirects

The placeholder links to legacy `/documentation/*` pages. Today these already
work through the client-side redirect pages in `data/redirects.js`, which ship
with the build. The server is nginx, so `.htaccess` does nothing here. For real
301s on every entry in `data/redirects.js`, paste the generated
`nginx-legacy-redirects.conf` (regenerate it with
`node scripts/gen-nginx-redirects.js`) into Plesk (Websites & Domains ->
docs.freemocap.org -> Apache & nginx Settings -> Additional nginx directives),
plus `error_page 404 /404.html;` so a miss shows the site's own 404 page with
search instead of the bare nginx one. Test with the hosts file before DNS moves.
The ten most-linked pages, for reference:

```nginx
location = /documentation/index_md.html { return 301 /; }
location = /documentation/installation.html { return 301 /start/install/; }
location = /documentation/software-hardware-prerequisites.html { return 301 /tutorials/hardware/; }
location = /documentation/multi-camera-calibration.html { return 301 /tutorials/calibrate/; }
location = /documentation/single-camera-recording.html { return 301 /tutorials/single-camera/; }
location = /documentation/calibration-troubleshooting.html { return 301 /guides/calibration-troubleshooting/; }
location = /documentation/installation-troubleshooting.html { return 301 /guides/installation-troubleshooting/; }
location = /documentation/frequently-asked-questions-faq.html { return 301 /about/faq/; }
location = /documentation/code-of-conduct.html { return 301 /about/code-of-conduct/; }
location = /documentation/contributing-index.html { return 301 /build/contributing/; }
```

## Rollback

Disabling Pages deletes nothing and can be re-enabled. To revert the VPS content,
rerun the deploy from the previous good commit. To revert DNS, point it back at
GitHub Pages and re-enable Pages.
