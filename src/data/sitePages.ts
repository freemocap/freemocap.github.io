// Single source of truth for "which pages live under which top-level
// section," consumed by the navbar dropdowns (docusaurus.config.ts), the
// Tutorials flyout (theme/NavbarItem/TutorialsNavbarItem.tsx), and the
// footer sitemap (theme/Footer). sidebars/docs.ts stays separate since
// Docusaurus's sidebar config has its own required shape, but this at least
// stops the navbar and footer from being two more hand-copies of the same
// ~65 links.

export type Page = { to: string; label: string };
export type Tier = { label: string; pages: Page[] };
export type Section = { id: string; label: string; hubPath: string; pages: Page[] };

export const tutorialTiers: Tier[] = [
  {
    label: 'Tier 1: Beginner',
    pages: [
      { to: '/tutorials/hardware', label: 'Choose and set up your cameras' },
      { to: '/tutorials/single-camera', label: 'Record with one camera' },
      { to: '/tutorials/calibrate', label: 'Calibrate your cameras' },
      { to: '/tutorials/multi-camera', label: 'Record with multiple cameras' },
      { to: '/tutorials/find-your-data', label: 'Find and read your output' },
      { to: '/tutorials/blender', label: 'Open your recording in Blender' },
    ],
  },
  {
    label: 'Tier 2: Intermediate',
    pages: [
      { to: '/tutorials/better-calibration', label: 'Get a calibration you can trust' },
      { to: '/tutorials/ground-plane', label: 'Set the ground plane' },
      { to: '/tutorials/choose-a-tracker', label: 'Choose a tracking model' },
      { to: '/tutorials/post-processing', label: 'Filter and fill your data' },
      { to: '/tutorials/capture-environment', label: 'Optimize your capture space' },
    ],
  },
  {
    label: 'Tier 3: Advanced',
    pages: [
      { to: '/tutorials/analyze-in-python', label: 'Analyze your data in Python' },
      { to: '/tutorials/custom-pipeline', label: 'Build a custom pipeline' },
      { to: '/tutorials/batch-processing', label: 'Process many recordings at once' },
    ],
  },
];

export const navSections: Section[] = [
  {
    id: 'start',
    label: 'Get started',
    hubPath: '/start/',
    pages: [
      { to: '/start/install', label: 'Install FreeMoCap' },
      { to: '/start/first-recording', label: 'Make your first recording' },
      { to: '/start/see-your-results', label: 'See what you made' },
      { to: '/start/where-next', label: 'Where to go next' },
    ],
  },
  {
    id: 'tutorials',
    label: 'Tutorials',
    hubPath: '/tutorials/',
    pages: tutorialTiers.flatMap((tier) => tier.pages),
  },
  {
    id: 'guides',
    label: 'How-to',
    hubPath: '/guides/',
    pages: [
      { to: '/guides/installation-troubleshooting', label: 'Fix an installation problem' },
      { to: '/guides/calibration-troubleshooting', label: 'Fix a calibration problem' },
      { to: '/guides/gpu-setup', label: 'Set up GPU acceleration' },
      { to: '/guides/camera-setup', label: 'Connect and configure cameras' },
      { to: '/guides/posthoc-mocap', label: 'Process a recording after the fact' },
      { to: '/guides/blender-export', label: 'Export to Blender' },
      { to: '/guides/export-formats', label: 'Export to FBX, BVH, and glTF' },
      { to: '/guides/yolo-cropping', label: 'Use YOLO cropping' },
      { to: '/guides/report-a-bug', label: 'Report a bug' },
      { to: '/guides/request-a-feature', label: 'Request a feature' },
      { to: '/guides/cite-freemocap', label: 'Cite FreeMoCap' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    hubPath: '/reference/',
    pages: [
      { to: '/reference/recording-structure', label: 'Recording folder structure' },
      { to: '/reference/data-arrays', label: 'Output arrays: shapes, dtypes, units' },
      { to: '/reference/coordinate-conventions', label: 'Coordinate conventions' },
      { to: '/reference/skeleton-models', label: 'Keypoint names and indices by model' },
      { to: '/reference/configuration', label: 'Configuration options' },
      { to: '/reference/rest-api', label: 'REST API' },
      { to: '/reference/websocket-api', label: 'WebSocket API' },
      { to: '/reference/cli', label: 'Command line interface' },
      { to: '/reference/system-requirements', label: 'System requirements' },
    ],
  },
  {
    id: 'concepts',
    label: 'Concepts',
    hubPath: '/concepts/',
    pages: [
      { to: '/concepts/what-is-freemocap', label: 'What is FreeMoCap?' },
      { to: '/concepts/markerless-mocap', label: 'What is markerless motion capture?' },
      { to: '/concepts/how-it-works', label: 'How FreeMoCap works' },
      { to: '/concepts/cameras-and-sync', label: 'Cameras and synchronization' },
      { to: '/concepts/tracking', label: 'Image tracking and pose models' },
      { to: '/concepts/calibration', label: 'Why calibration matters' },
      { to: '/concepts/coordinate-systems', label: 'Coordinate systems and units' },
      { to: '/concepts/data-model', label: 'The FreeMoCap output data model' },
      { to: '/concepts/accuracy-and-limits', label: 'Accuracy, validity, and limits' },
      { to: '/concepts/glossary', label: 'Glossary' },
      { to: '/concepts/triangulation', label: 'Triangulation and 3D reconstruction' },
    ],
  },
  {
    id: 'build',
    label: 'Build',
    hubPath: '/build/',
    pages: [
      { to: '/build/architecture', label: 'Architecture overview' },
      { to: '/build/the-map', label: 'The polyrepo map' },
      { to: '/build/pipeline', label: 'Follow one recording end to end' },
      { to: '/build/data-contracts', label: 'Data contracts between components' },
      { to: '/build/frontend', label: 'Frontend architecture' },
      { to: '/build/backend', label: 'Backend architecture' },
      { to: '/build/repo-directory', label: 'All repositories' },
      { to: '/build/building', label: 'Building and packaging' },
      { to: '/build/proposals/', label: 'Design proposals' },
      { to: '/build/code-style', label: 'Python code style' },
      { to: '/build/contributing', label: 'Contributing to FreeMoCap' },
      { to: '/build/testing', label: 'Testing' },
      { to: '/build/writing-docs', label: 'Contributing to the docs' },
    ],
  },
];

export const aboutSection: Section = {
  id: 'about',
  label: 'About',
  hubPath: '/community/',
  pages: [
    { to: '/community/about', label: 'About FreeMoCap' },
    { to: '/community/faq', label: 'Frequently asked questions' },
    { to: '/community/code-of-conduct', label: 'Code of conduct' },
    { to: '/community/privacy', label: 'Privacy policy' },
    { to: '/community/roadmap', label: 'Roadmap' },
    { to: '/community/how-these-docs-are-written', label: 'How these docs are written' },
  ],
};
