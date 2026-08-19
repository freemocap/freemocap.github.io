/**
 * V1 to V2 URL map.
 *
 * Every one of these URLs exists in published papers, Discord history, and
 * YouTube descriptions. All of them must resolve. They redirect to the LIVE V2
 * equivalent rather than to the frozen 1.x version, because the live page is
 * what the reader wants; the version switcher takes them back to 1.x if they
 * are running old software.
 *
 * The legacy site served Writerside HTML at /documentation/<slug>.html. The
 * .html suffix is handled here and duplicated in the nginx config so it works
 * even before the SPA loads.
 */

const v1 = (slug) => `/documentation/${slug}.html`;

module.exports = [
  { from: [v1('index_md'), '/documentation'], to: '/' },

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
  { from: v1('multiprocessing'), to: '/build/backend' },
  { from: v1('contributing-index'), to: '/build/contributing' },
  { from: v1('python-code-style-guide'), to: '/build/code-style' },
  { from: v1('updating-documentation'), to: '/build/writing-docs' },

  // Community
  { from: v1('about-us'), to: '/community/about' },
  { from: v1('frequently-asked-questions-faq'), to: '/community/faq' },
  { from: v1('privacy-policy'), to: '/community/privacy' },
  { from: v1('code-of-conduct'), to: '/community/code-of-conduct' },

  // The interim V2 docs site was served with baseUrl /freemocap/, so its URLs
  // are live and linked. freemocap.org's /download 301 points at
  // docs.freemocap.org/freemocap/download specifically (see the main site's
  // SITE-ARCHITECTURE.md), so this one is load-bearing today, not just archival.
  { from: '/freemocap/download', to: '/download' },
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
  { from: '/freemocap/roadmap', to: '/community/roadmap' },
  { from: '/freemocap/blog', to: '/blog' },

  // Writerside template pages that were deleted before the migration. They had
  // redirect rules in the V1 redirection-rules.xml, so they are still reachable.
  { from: [v1('Starter'), v1('Overview'), v1('Reference'), v1('How-to'), v1('Templates'), v1('Tutorial'), v1('Section-Starting-Page')], to: '/' },
];
