import Layout from '@theme/Layout';
import {
  FiActivity,
  FiArrowRight,
  FiBook,
  FiBox,
  FiCheckSquare,
  FiCode,
  FiCompass,
  FiCpu,
  FiDatabase,
  FiDownload,
  FiFileText,
  FiFilm,
  FiFolder,
  FiGitBranch,
  FiGithub,
  FiGrid,
  FiHardDrive,
  FiHelpCircle,
  FiHome,
  FiLayers,
  FiList,
  FiMessageCircle,
  FiPackage,
  FiServer,
  FiSliders,
  FiTarget,
  FiTool,
  FiUpload,
  FiVideo,
  FiWifi,
} from 'react-icons/fi';
import {
  AudienceDoorways,
  ComingSoonSection,
  Hero,
  LinkColumns,
  SPECIALIZATION_TRACKS,
  Tier,
  TierPicker,
  TileGrid,
} from '@site/src/components/HomeSections';

/**
 * The FreeMoCap docs home.
 *
 * TierPicker (three big boxes: Beginner / Intermediate / Advanced) is the
 * primary router, right under the hero, matching the curriculum DAG's
 * 1000/2000/3000 progression: don't ask a first-time visitor to pick a
 * specialization before they've recorded anything. Each big box jumps to
 * its matching Tier below.
 *
 * Every page that used to be a plain "more" text link is a tile now too,
 * there's no separate flat-link overflow list inside a Tier section
 * anymore, every link is a small box with a blurb and a "?" tooltip.
 *
 * Tile `info` arrays are a short table of contents for the destination
 * page. Where the page has real content (checked directly, not guessed)
 * the bullets are its actual headings. Where the page is still a stub,
 * the bullets are a reasonable placeholder for what it will eventually
 * cover, not a claim that it exists yet.
 *
 * "Understand FreeMoCap" isn't its own tier content: the hero's own
 * "What is FreeMoCap?" link already covers that ground, so only the two
 * pages under it that said something new (markerless mocap, how it works)
 * are folded into Beginner instead of duplicating the hero.
 *
 * Audience doorways and Skelly University are a different axis (role, not
 * skill level) and live below, unlabeled by tier on purpose.
 */
export default function Home() {
  return (
    <Layout
      title="FreeMoCap documentation"
      description="Free and open-source research-grade markerless motion capture with ordinary webcams. Install it, record with it, understand the data, and build on it."
    >
      <Hero />

      <main className="container">
        <TierPicker />

        <Tier id="beginner" label="Beginner">
          <TileGrid
            tiles={[
              {
                title: 'Install FreeMoCap',
                to: '/start/install',
                blurb: 'Two ways to install: pip for developers, or a packaged app for everyone else.',
                info: [
                  'Quick start: pip install freemocap',
                  'Detailed pip instructions (conda environment, step by step)',
                  'PyApp installer walkthrough (no Windows 11 support yet)',
                  'What to do if installation fails',
                ],
                icon: FiDownload,
              },
              {
                title: 'Make your first recording',
                to: '/start/first-recording',
                blurb: 'Start with one camera before multi-camera. Simpler, faster, confirms your pipeline works.',
                info: [
                  'Why start with a single camera first',
                  'Single-camera recording tutorial',
                  'Multi-camera calibration and recording tutorial',
                ],
                icon: FiVideo,
              },
              {
                title: 'Record with multiple cameras',
                to: '/tutorials/multi-camera',
                blurb: 'Calibrate a camera array and capture real 3D motion instead of a single flat view.',
                info: [
                  'Why multi-camera over single-camera',
                  'Minimum camera count and placement angles',
                  'Running a synchronized recording',
                  'What happens after recording (triangulation)',
                ],
                icon: FiFilm,
              },
              {
                title: 'What is markerless mocap?',
                to: '/concepts/markerless-mocap',
                blurb: 'Motion capture without physical markers, suits, or a dedicated studio.',
                info: [
                  'How markerless differs from marker-based systems',
                  'A brief history of the technique',
                  'Where FreeMoCap fits in the landscape',
                ],
                icon: FiHelpCircle,
              },
              {
                title: 'How FreeMoCap works',
                to: '/concepts/how-it-works',
                blurb: 'The pipeline that turns synced video into a 3D skeleton, in four stages.',
                info: [
                  'Synchronized recording',
                  'Camera calibration',
                  '2D pose estimation',
                  '3D triangulation and reconstruction',
                ],
                icon: FiCpu,
              },
              {
                title: 'Glossary',
                to: '/concepts/glossary',
                blurb: 'Definitions for the terms used throughout these docs.',
                info: [
                  'Capture volume',
                  'Calibration (intrinsics and extrinsics)',
                  'ChArUco board',
                  'MediaPipe and YOLO',
                  'Reprojection error',
                ],
                icon: FiBook,
              },
              {
                title: 'Accuracy and limits',
                to: '/concepts/accuracy-and-limits',
                blurb: 'What was formally validated, and where the system currently falls short.',
                info: [
                  'What was validated (6-camera setup vs. marker-based reference)',
                  'Results across gait, balance, and prosthetic alignment',
                  'Why backend choice changes the outcome',
                  'Known limitations, stated plainly',
                ],
                icon: FiTarget,
              },
              {
                title: 'Frequently asked questions',
                to: '/about/faq',
                blurb: 'Licensing, funding, and what FreeMoCap can and can’t track yet.',
                info: [
                  'How is FreeMoCap free?',
                  'What license does it use?',
                  'How can I contribute?',
                  'Does it work in realtime? (not yet)',
                  'Multi-person or non-human tracking? (not yet)',
                ],
                icon: FiMessageCircle,
              },
              {
                title: 'Cite FreeMoCap',
                to: '/guides/cite-freemocap',
                blurb: 'The citation format and DOI to reference FreeMoCap in a paper.',
                info: [
                  'BibTeX / citation format',
                  'Zenodo DOI',
                  'Citing a specific sub-repo, if relevant',
                ],
                icon: FiFileText,
              },
              {
                title: 'Hardware and cameras',
                to: '/tutorials/hardware',
                blurb: 'One camera minimum, three recommended, plus a printed calibration board.',
                info: [
                  'Required equipment (webcams, USB ports)',
                  'Recommended camera count',
                  'Necessary software (Blender, notebook tools)',
                ],
                icon: FiHardDrive,
              },
              {
                title: 'Calibrate your cameras',
                to: '/tutorials/calibrate',
                blurb: 'Print a ChArUco board and record it so FreeMoCap can place your cameras in space.',
                info: [
                  'Preparing the ChArUco board (5x3 vs. 7x5)',
                  'Setting up and angling your cameras',
                  'Recording calibration videos',
                  'Processing the calibration',
                  'Recording motion capture after calibrating',
                ],
                icon: FiSliders,
              },
              {
                title: 'Optimize your capture space',
                to: '/tutorials/capture-environment',
                blurb: 'Lighting, background, and camera placement tips that meaningfully improve tracking.',
                info: [
                  'Lighting conditions and exposure settings',
                  'Background and clothing contrast',
                  'Camera placement and framing',
                  'Working in small spaces',
                ],
                icon: FiHome,
              },
              {
                title: 'Fix an installation problem',
                to: '/guides/installation-troubleshooting',
                blurb: 'Common installation errors, from environment conflicts to platform-specific issues.',
                info: [
                  'Use a fresh virtual environment',
                  'Check your Python version (3.9–3.12)',
                  'Check your FreeMoCap version',
                  'Common error messages and fixes',
                ],
                icon: FiTool,
              },
              {
                title: 'All how-to guides',
                to: '/guides/',
                blurb: 'Every task-oriented guide in one flat, searchable list.',
                info: [
                  'Installation and calibration troubleshooting',
                  'Export and format guides',
                  'Bug reports and feature requests',
                  'Grows from real Discord questions',
                ],
                icon: FiList,
              },
            ]}
          />
        </Tier>

        <Tier id="intermediate" label="Intermediate">
          <TileGrid
            tiles={[
              {
                title: 'Your output data',
                to: '/concepts/data-model',
                blurb: 'Why the data looks the way it does, and the one thing everyone gets wrong first.',
                info: [
                  'The problem: every tracker has its own format',
                  'How SkellyModels standardizes it',
                  'The array shape and file naming pattern',
                  "Virtual markers aren't tracked points (the gotcha)",
                ],
                icon: FiDatabase,
              },
              {
                title: 'Analyze it in Python',
                to: '/tutorials/analyze-in-python',
                blurb: 'Load a recording into a notebook and compute the numbers yourself.',
                info: [
                  'Loading a recording with skellymodels',
                  'Computing joint angles',
                  'Computing velocity and center of mass',
                  'Plotting a trajectory',
                ],
                icon: FiCode,
              },
              {
                title: 'Bring it into Blender',
                to: '/tutorials/blender',
                blurb: 'Get a rigged, animated skeleton into a 3D scene, automatically or by hand.',
                info: [
                  'Automatic export at the end of a session',
                  'Running the Blender addon manually',
                  'What the rig looks like',
                  'Retargeting to a custom character',
                ],
                icon: FiBox,
              },
              {
                title: 'Recording folder structure',
                to: '/reference/recording-structure',
                blurb: "What every file in a recording's output folder is, and which ones you need.",
                info: [
                  'Raw video and synchronized frames',
                  'Calibration files',
                  'Processed data (parquet, npy)',
                  'Logs and metadata',
                ],
                icon: FiFolder,
              },
              {
                title: 'Array shapes and units',
                to: '/reference/data-arrays',
                blurb: 'Exact array shapes, dtypes, and units, generated straight from the code.',
                info: [
                  'Canonical shape: (frames, markers, 3)',
                  'The tidy long-format parquet schema',
                  '.npy file naming convention',
                  '3d_xyz vs. rigid_3d_xyz',
                ],
                icon: FiGrid,
              },
              {
                title: 'Coordinate conventions',
                to: '/reference/coordinate-conventions',
                blurb: 'Millimetres, right-handed, +Z up, and how that compares to Unity, Unreal, and Blender.',
                info: [
                  'Units, handedness, and up axis',
                  'Ground-plane vs. default calibration origin',
                  'Segment and rotation conventions',
                  'Exporting to Unity, Unreal, and Blender',
                ],
                icon: FiCompass,
              },
              {
                title: 'Skeleton models and keypoints',
                to: '/reference/skeleton-models',
                blurb: 'Every keypoint name and index, for every supported tracking model.',
                info: [
                  'MediaPipe keypoints',
                  'RTMPose keypoints',
                  'YOLO / DeepLabCut keypoints',
                  'Virtual marker definitions per model',
                ],
                icon: FiActivity,
              },
              {
                title: 'Export formats',
                to: '/guides/export-formats',
                blurb: 'Exporting your recording to FBX, BVH, or glTF for other tools.',
                info: [
                  'FBX for most 3D software',
                  'BVH for motion capture pipelines',
                  'glTF for web and real-time engines',
                  'Known limitations per format',
                ],
                icon: FiUpload,
              },
            ]}
          />
        </Tier>

        <Tier id="advanced" label="Advanced" tracks={SPECIALIZATION_TRACKS}>
          <TileGrid
            tiles={[
              {
                title: 'Architecture overview',
                to: '/build/architecture',
                blurb: 'A React desktop app talks to a Python backend, with the sub-skelly libraries underneath.',
                info: [
                  'Frontend: Electron/React desktop app',
                  'Backend: Python FastAPI server',
                  'REST + WebSocket on one port',
                  'The sub-skelly pipeline underneath',
                ],
                icon: FiLayers,
              },
              {
                title: 'The Skelly components',
                to: '/build/the-map',
                blurb: 'Four standalone libraries, each owning one stage of the pipeline.',
                info: [
                  'SkellyCam: camera sync',
                  'SkellyTracker: pose estimation',
                  'SkellyForge: 3D reconstruction',
                  'SkellyBlender: animation export',
                ],
                icon: FiPackage,
              },
              {
                title: 'Contribute',
                to: '/build/contributing',
                blurb: 'Set up a dev environment, follow GitHub Flow, open your first pull request.',
                info: [
                  'Reporting bugs and suggesting features',
                  'Code contributions via GitHub Flow',
                  'Coding style guides',
                  'Testing requirements',
                  'Contributing to the documentation itself',
                ],
                icon: FiGitBranch,
              },
              {
                title: 'Follow one recording e2e',
                to: '/build/pipeline',
                blurb: 'Trace one recording from the first camera frame to the final Blender scene.',
                info: [
                  'Frame capture and synchronization',
                  'Calibration and pose estimation',
                  'Triangulation and post-processing',
                  'Blender scene generation',
                ],
                icon: FiArrowRight,
              },
              {
                title: 'Data contracts',
                to: '/build/data-contracts',
                blurb: 'What each Skelly component expects, and what it hands to the next one.',
                info: [
                  'SkellyCam produces synchronized frame packages',
                  'SkellyTracker produces keypoint observations',
                  'SkellyForge produces reconstructed points and kinematic models',
                  'SkellyBlender consumes kinematic models',
                ],
                icon: FiCheckSquare,
              },
              {
                title: 'REST API',
                to: '/reference/rest-api',
                blurb: 'Endpoints for controlling recordings, calibration, and processing from outside the GUI.',
                info: [
                  'Recording control endpoints',
                  'Calibration endpoints',
                  'Processing and export endpoints',
                  'Authentication, if any',
                ],
                icon: FiServer,
              },
              {
                title: 'WebSocket API',
                to: '/reference/websocket-api',
                blurb: 'Real-time updates for live camera previews and processing status.',
                info: [
                  'Connecting to the WebSocket server',
                  'Live camera frame previews',
                  'Processing status events',
                  'Error and reconnection handling',
                ],
                icon: FiWifi,
              },
              {
                title: 'All repositories',
                to: '/build/repo-directory',
                blurb: 'Every repository in the FreeMoCap org, what it owns, and how they depend on each other.',
                info: [
                  'freemocap: the main application',
                  'skellycam, skellytracker, skellyforge, skellyblender',
                  'skellydocs, skellylogs, skellypings',
                  'The polyrepo dependency map',
                ],
                icon: FiGithub,
              },
            ]}
          />
        </Tier>

        <ComingSoonSection />

        <LinkColumns
          heading="Papers, talks, and community"
          columns={[
            {
              title: 'Cite and read',
              links: [
                { label: 'Cite FreeMoCap', href: '/guides/cite-freemocap' },
                { label: 'Zenodo record', href: 'https://doi.org/10.5281/zenodo.7233714' },
                { label: 'Accuracy and limits', href: '/concepts/accuracy-and-limits' },
              ],
            },
            {
              title: 'Community',
              links: [
                { label: 'Discord', href: 'https://discord.gg/XpRQJnqZxf' },
                { label: 'YouTube', href: 'https://youtube.com/@freemocap' },
                { label: 'freemocap.org', href: 'https://freemocap.org' },
              ],
            },
            {
              title: 'Project',
              links: [
                { label: 'About FreeMoCap', href: '/about/about-us' },
                { label: 'Code of conduct', href: '/about/code-of-conduct' },
                { label: 'How these docs are written', href: '/about/how-these-docs-are-written' },
                { label: 'Roadmap', href: '/about/roadmap' },
              ],
            },
          ]}
        />

        <AudienceDoorways />
      </main>
    </Layout>
  );
}
