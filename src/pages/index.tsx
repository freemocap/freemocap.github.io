import Layout from '@theme/Layout';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheckSquare,
  FiCode,
  FiCpu,
  FiDatabase,
  FiDownload,
  FiEye,
  FiFilm,
  FiFilter,
  FiGitBranch,
  FiGithub,
  FiGrid,
  FiLayers,
  FiPackage,
  FiPlay,
  FiServer,
  FiSliders,
  FiTarget,
  FiTrendingUp,
  FiUpload,
  FiVideo,
  FiWifi,
  FiZap,
} from 'react-icons/fi';
import {
  AudienceDoorways,
  ComingSoonSection,
  Hero,
  LinkColumns,
  PathColumns,
  PathGroup,
  Tier,
  TierPicker,
  TileGrid,
} from '@site/src/components/HomeSections';

/**
 * The FreeMoCap docs home.
 *
 * TierPicker (four big boxes: Get Started / Beginner / Intermediate /
 * Advanced) is the primary router, right under the hero. The ordering
 * matches Skelly University's own 1000/2000/3000/4000 module numbering,
 * but the numbers themselves aren't shown on the docs site, just the
 * label order, showing "1000-level" etc. read as too on-the-nose. Don't
 * ask a first-time visitor to pick a specialization before they've
 * recorded anything. Each big box jumps to its matching Tier below.
 *
 * Per PR review feedback, each Tier's tile grid is a short, curated set
 * rather than an exhaustive link dump, sized 3/6/9 and then "a lot" for
 * the three Advanced paths: Get Started mirrors the three-step `/start/`
 * flow exactly (setup, recording, visualization); Beginner is six "do
 * more with what you've got" tiles; Intermediate is the developer-docs
 * architecture tiles plus one reference page, nine total; Advanced drops
 * the single flat grid entirely and instead gives each specialization
 * track (Technology / Science / Art) its own PathGroup, populated from
 * real module content in `freemocap/university` (verified via the GitHub
 * API and raw file content this session, not guessed), because the three
 * tracks don't have the same number of modules and forcing them into one
 * grid would hide that. The three PathGroups sit inside a PathColumns
 * wrapper so they read as parallel side-by-side columns under Advanced,
 * not a third long vertical scroll; the Technology/Science/Art chips
 * themselves only appear once, on TierPicker's Advanced box near the top,
 * not repeated again down here. Every page that isn't tiled here is still
 * reachable from its section's own index (`/concepts/`, `/guides/`,
 * `/reference/`) and the sidebar, dropping a tile is not the same as
 * removing a page.
 *
 * Tile `info` arrays are a short table of contents for the destination
 * page. Where the page has real content (checked directly, not guessed)
 * the bullets are its actual headings. Where the page is still a stub,
 * the bullets are a reasonable placeholder for what it will eventually
 * cover, not a claim that it exists yet.
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

        <Tier id="get-started" label="Get Started">
          <TileGrid
            tiles={[
              {
                title: 'Setup',
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
                title: 'Recording',
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
                title: 'Visualization',
                to: '/start/see-your-results',
                blurb: 'Check whether it worked: a skeleton moving in Blender, matching what you actually did.',
                info: [
                  'The fastest check: did Blender open',
                  'If you want to check without Blender',
                  'What "worked" looks like, and what didn\'t',
                  'Next steps',
                ],
                icon: FiEye,
              },
            ]}
          />
        </Tier>

        <Tier id="beginner" label="Beginner">
          <TileGrid
            tiles={[
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

        <Tier id="intermediate" label="Intermediate">
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
            ]}
          />
        </Tier>

        <Tier id="advanced" label="Advanced">
          <PathColumns>
            <PathGroup label="Technology">
              <TileGrid
                tiles={[
                  {
                    title: 'SkellyCam',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3110-skellycam/3110-skellycam-overview.md',
                    blurb: 'The camera backend: synchronized multi-camera video capture and detection.',
                    info: [
                      "SkellyCam's role in the FreeMoCap pipeline",
                      'Camera detection, configuration, and synchronization',
                      'The FastAPI/Uvicorn backend architecture',
                    ],
                    icon: FiVideo,
                  },
                  {
                    title: 'SkellyTracker',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3120-skellytracker/3120-skellytracker-overview.md',
                    blurb: 'The pose estimation backend: one unified API across multiple tracking models.',
                    info: [
                      "SkellyTracker's role in the FreeMoCap pipeline",
                      'The tracker abstraction pattern',
                      'Available pose estimation backends',
                      '2D keypoint detection fundamentals',
                    ],
                    icon: FiTarget,
                  },
                  {
                    title: 'SkellyForge',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3130-skellyforge/3130-skellyforge-overview.md',
                    blurb: 'Post-processing: filtering, interpolation, and 3D reconstruction of tracked points.',
                    info: [
                      "SkellyForge's role in the FreeMoCap pipeline",
                      'Data post-processing workflows',
                      'Filtering and interpolation techniques',
                      'GUI-based parameter tuning',
                    ],
                    icon: FiFilter,
                  },
                  {
                    title: 'SkellyBlender',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3140-skellyblender/3140-skellyblender-overview.md',
                    blurb: 'The Blender integration: visualizing and working with motion capture data.',
                    info: [
                      'FreeMoCap Blender addon architecture',
                      'Armature creation and animation data',
                      'Export formats (FBX, BVH)',
                      'Blender Python API basics',
                    ],
                    icon: FiBox,
                  },
                  {
                    title: 'FreeMoCap Core',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3100-technology/3150-freemocap-core/3150-core-overview.md',
                    blurb: 'The main application: orchestrates the entire motion capture pipeline.',
                    info: [
                      'FreeMoCap main application architecture',
                      'The Qt-based GUI structure',
                      'Pipeline orchestration logic',
                      'The recording session data model',
                    ],
                    icon: FiCpu,
                  },
                ]}
              />
            </PathGroup>

            <PathGroup label="Science">
              <TileGrid
                tiles={[
                  {
                    title: 'Measurement',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3200-science/3201-measurement.md',
                    blurb: 'Fundamental measurement concepts for motion capture research.',
                    info: [
                      'Measurement principles in motion capture',
                      'Accuracy, precision, and reliability',
                      'Sources of measurement error',
                      'Applying these concepts to motion capture data',
                    ],
                    icon: FiActivity,
                  },
                  {
                    title: 'Data Analysis',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3200-science/3202-data-analysis.md',
                    blurb: 'Signal processing and analysis workflows for motion capture data.',
                    info: [
                      'Data analysis workflows for motion capture',
                      'Basic signal processing concepts',
                      'Filtering and smoothing techniques',
                      'Visualizing and interpreting motion capture data',
                    ],
                    icon: FiBarChart2,
                  },
                  {
                    title: 'Biomechanics',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3200-science/3210-biomechanics/3210-biomechanics-overview.md',
                    blurb: 'The mechanical laws relating to movement and the structure of living organisms.',
                    info: [
                      'Fundamental biomechanics concepts',
                      'Biomechanical analysis of motion capture data',
                      'Analyzing human movement patterns scientifically',
                    ],
                    icon: FiTrendingUp,
                  },
                  {
                    title: 'Neuroscience',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3200-science/3220-neuroscience/3220-neuroscience-overview.md',
                    blurb: 'The neural control of movement and perceptuo-motor processes.',
                    info: [
                      'The neural basis of movement control',
                      'Perceptuo-motor processes',
                      'Connecting motion capture data to neuroscience concepts',
                    ],
                    icon: FiZap,
                  },
                ]}
              />
            </PathGroup>

            <PathGroup label="Art">
              <TileGrid
                tiles={[
                  {
                    title: 'Animation',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3300-art/3310-animation/3310-animation-overview.md',
                    blurb: 'Using motion capture for character animation in Blender and other 3D software.',
                    info: [
                      'Animation workflows using motion capture',
                      'Cleaning and polishing mocap data',
                      'Character rigging and retargeting',
                      'Production-quality animated content',
                    ],
                    icon: FiFilm,
                  },
                  {
                    title: 'Game Dev',
                    to: 'https://github.com/freemocap/university/blob/main/skellyuniversity/modules/3000-specialization/3300-art/3320-gamedev/3320-gamedev-overview.md',
                    blurb: 'Using motion capture for game character animation and interactive applications.',
                    info: [
                      'Game engine requirements for animation',
                      'Real-time animation optimization techniques',
                      'Integrating motion capture into game projects',
                      'Playable characters driven by mocap',
                    ],
                    icon: FiPlay,
                  },
                ]}
              />
            </PathGroup>
          </PathColumns>
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
