/**
 * Old URL to current page map. These URLs are in papers, Discord and YouTube
 * descriptions, so every one must resolve. They point at the current page, not
 * the frozen 1.x one; the version switcher goes back to 1.x.
 *
 * Entries ship as client-side redirect pages. For real 301s, regenerate the
 * nginx rules with scripts/gen-nginx-redirects.js (see the README).
 */

const v1 = (slug) => `/documentation/${slug}.html`;

// SkellyCam's old standalone site (freemocap/skellycam, served under
// docs.freemocap.org/skellycam/) kept its docs under /docs/ and also had
// Spanish and Arabic copies. The README in that repo, and anything shared
// since, links to those URLs. The docs now live aggregated at /skellycam/<slug>
// (English only), so every old URL redirects there. The translations are not
// served here; they stay in skellycam-docs/i18n in that repo.
const skellycamSlugs = [
  'intro', 'community',
  'core', 'core/frame-perfect-sync', 'core/generic-usb-cameras', 'core/precise-timestamps', 'core/real-time-streaming',
  'development', 'development/contributing', 'development/design-philosophy', 'development/translating',
  'getting-started', 'getting-started/advanced-tutorial', 'getting-started/beginner-tutorial',
  'getting-started/installation', 'getting-started/quick-start',
  'technical', 'technical/api-reference', 'technical/architecture', 'technical/frame-synchronization',
  'technical/logging', 'technical/telemetry', 'technical/websocket-protocol',
];
const skellycamLangs = ['', '/es', '/ar'];
const skellycamBlog = ['blog', 'blog/archive', 'blog/tags', 'blog/tags/welcome', 'blog/welcome'];
const skellycamLegacy = skellycamLangs.flatMap((lang) => [
  ...skellycamSlugs.map((slug) => ({ from: `/skellycam${lang}/docs/${slug}`, to: `/skellycam/${slug}` })),
  { from: [`/skellycam${lang}/docs`, ...(lang ? [`/skellycam${lang}`] : [])], to: '/skellycam/intro' },
  { from: skellycamBlog.map((p) => `/skellycam${lang}/${p}`), to: '/skellycam/intro' },
  { from: `/skellycam${lang}/download`, to: 'https://github.com/freemocap/skellycam/releases/latest' },
  { from: `/skellycam${lang}/roadmap`, to: 'https://github.com/orgs/freemocap/projects/34/views/6' },
]);

module.exports = [
  ...skellycamLegacy,

  // No V2 page covers V1's "Max Number of Processes" setting, so it goes home.
  { from: [v1('index_md'), '/documentation', v1('multiprocessing')], to: '/' },

  // Getting started
  { from: v1('getting-started-index'), to: '/start/' },
  { from: v1('installation'), to: '/start/install' },
  { from: v1('your-first-recording'), to: '/start/first-recording' },
  { from: v1('next-steps'), to: '/start/where-next' },

  // Tutorials
  { from: v1('software-hardware-prerequisites'), to: '/tutorials/hardware' },
  { from: v1('single-camera-recording'), to: '/tutorials/single-camera' },
  { from: v1('multi-camera-calibration'), to: '/tutorials/calibrate' },
  { from: v1('groundplane-calibration'), to: '/tutorials/ground-plane' },
  { from: v1('detailed-setup'), to: '/tutorials/capture-environment' },

  // Concepts
  { from: v1('resources-index'), to: '/concepts/' },
  { from: v1('triangulation'), to: '/concepts/triangulation' },
  { from: v1('terminology'), to: '/concepts/glossary' },

  // How-to
  { from: v1('installation-troubleshooting'), to: '/guides/installation-troubleshooting' },
  { from: v1('calibration-troubleshooting'), to: '/guides/calibration-troubleshooting' },
  { from: v1('yolo-cropping'), to: '/guides/yolo-cropping' },
  { from: v1('feature-request'), to: '/guides/request-a-feature' },
  { from: v1('bug-report'), to: '/guides/report-a-bug' },

  // Build
  { from: v1('contributing-index'), to: '/build/contributing' },
  { from: v1('python-code-style-guide'), to: '/build/code-style' },
  { from: v1('updating-documentation'), to: '/build/writing-docs' },

  // About
  { from: v1('about-us'), to: '/about/about-us' },
  { from: v1('frequently-asked-questions-faq'), to: '/about/faq' },
  { from: v1('privacy-policy'), to: '/about/privacy' },
  { from: v1('code-of-conduct'), to: '/about/code-of-conduct' },

  // The interim V2 docs site was served with baseUrl /freemocap/, so its URLs
  // are live and linked. This one used to forward to an internal /download
  // page; there isn't one, the real download page lives on freemocap.org, so
  // it goes straight there instead of bouncing through a page that doesn't exist.
  { from: '/freemocap/download', to: 'https://freemocap.org/download' },
  { from: '/freemocap/docs/intro', to: '/build/' },
  { from: '/freemocap/docs/architecture/overview', to: '/build/architecture' },
  { from: '/freemocap/docs/architecture/backend-recording-structure', to: '/reference/recording-structure' },
  { from: '/freemocap/docs/architecture/api-boundary', to: '/reference/rest-api' },
  { from: '/freemocap/docs/architecture/backend-websocket-server', to: '/reference/websocket-api' },
  { from: '/freemocap/docs/guides/gpu-setup', to: '/guides/gpu-setup' },
  { from: '/freemocap/docs/guides/camera-setup', to: '/guides/camera-setup' },
  { from: '/freemocap/docs/guides/posthoc-mocap', to: '/guides/posthoc-mocap' },
  { from: '/freemocap/docs/guides/blender-export', to: '/guides/blender-export' },
  { from: '/freemocap/docs/development/building', to: '/build/building' },
  { from: '/freemocap/docs/development/testing', to: '/build/testing' },
  { from: '/freemocap/roadmap', to: '/about/roadmap' },
  { from: '/freemocap/blog', to: '/blog' },

  // Bare roots that exist as folders on disk but have no page of their own, so
  // nginx answers 403 instead of 404. Each was a live URL on the old site (the
  // old /skellycam/ and /freemocap/ were separate GitHub Pages project sites).
  { from: '/skellycam', to: '/skellycam/intro' },
  { from: '/freemocap', to: '/' },
  { from: '/1.x', to: '/1.x/start/' },
  { from: ['/freemocap/docs', '/freemocap/docs/development'], to: '/build/' },
  { from: '/freemocap/docs/architecture', to: '/build/architecture' },
  { from: '/freemocap/docs/guides', to: '/guides/' },

  // Writerside template pages that were deleted before the migration. They had
  // redirect rules in the V1 redirection-rules.xml, so they are still reachable.
  { from: [v1('Starter'), v1('Overview'), v1('Reference'), v1('How-to'), v1('Templates'), v1('Tutorial'), v1('Section-Starting-Page')], to: '/' },

  // The About section briefly lived at /community/ during V2 development.
  // SkellyCam's fetched docs still link to /community/roadmap (its docs are
  // a separate repo; see the site-absolute-links note in README.md), and the
  // URL may already be shared elsewhere, so it redirects rather than 404s.
  { from: '/community/', to: '/about/' },
  { from: '/community/about', to: '/about/about-us' },
  { from: '/community/faq', to: '/about/faq' },
  { from: '/community/code-of-conduct', to: '/about/code-of-conduct' },
  { from: '/community/privacy', to: '/about/privacy' },
  { from: '/community/roadmap', to: '/about/roadmap' },
  { from: '/community/how-these-docs-are-written', to: '/about/how-these-docs-are-written' },
];
