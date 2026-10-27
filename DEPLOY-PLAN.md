# Go-live checklist for docs.freemocap.org

Internal. Delete this file once the cutover is done and stable. How the deploy
works is in the README; this is only what remains before this site replaces the
current one.

## Where things stand

- DNS for `docs.freemocap.org` is a proxied Cloudflare A record to the Plesk VPS
  (a Configuration Rule sets SSL to Full for that host), with a Let's Encrypt
  certificate on the origin. The new site is live.
- GitHub Pages for this repo stays enabled on `main` with the custom domain, so
  `freemocap.github.io/*` and every org project site
  (`freemocap.github.io/<repo>/`) keep redirecting to `docs.freemocap.org`. Do
  not disable Pages: github.io root would 404 and the project sites would serve
  their old content directly.
- The root `CNAME` file is what keeps that custom domain set. Never delete it.
  `.nojekyll` stops Pages from Jekyll-building the Docusaurus source.

## Cutover (done except the merge)

1. Merge PR #3. Pushes to `main` deploy to the VPS while `DEPLOY_ON_PUSH` is
   `'true'`.
2. Check `docs.freemocap.org` and a `freemocap.github.io` path afterwards.

Rollback: point the Cloudflare `docs` record back at `freemocap.github.io`
(CNAME, proxied) and set Pages source to the `legacy-placeholder` branch.

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
