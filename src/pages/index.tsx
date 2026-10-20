import { useEffect } from 'react';
import Layout from '@theme/Layout';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheckSquare,
  FiCode,
  FiCompass,
  FiCopy,
  FiCpu,
  FiDownload,
  FiEye,
  FiFilm,
  FiFilter,
  FiFolder,
  FiGitBranch,
  FiGithub,
  FiGrid,
  FiHardDrive,
  FiHome,
  FiLayers,
  FiPackage,
  FiPlay,
  FiServer,
  FiSliders,
  FiTarget,
  FiTrendingUp,
  FiVideo,
  FiWifi,
  FiZap,
} from 'react-icons/fi';
import {
  ComingSoonSection,
  Hero,
  LinkColumns,
  PathColumns,
  PathGroup,
  SequenceGrid,
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
 * rather than an exhaustive link dump, sized against `tutorialTiers` in
 * `src/data/sitePages.ts`, the Tutorials sidebar's own tier structure,
 * not an independently invented 3/6/9 count:
 *
 * - Get Started mirrors the three-step `/start/` flow exactly (setup,
 *   recording, visualization).
 * - Beginner is exactly Tutorials' "Tier 1: Beginner", same six pages,
 *   same order, same titles as the sidebar labels. An earlier pass
 *   picked a different 6-page tutorials/concepts/guides mix that merely
 *   happened to also total 6; it read as wrong the moment it was shown
 *   next to the real sidebar, so this tier is a literal mirror now, not
 *   a curated-but-different set.
 * - Intermediate is exactly Tutorials' "Tier 2: Intermediate", same
 *   eight pages, same order, same titles as the sidebar labels. That
 *   tier used to be two separate tutorial tiers (a 5-page Intermediate
 *   and a 3-page Advanced); `tutorialTiers` itself was merged into one
 *   8-page Tier 2 (see the comment there) once it was clear the tutorial
 *   Tier 3 and the homepage's own "Advanced" heading were unrelated axes
 *   (tutorial skill progression vs. career-track content from a
 *   different repo) with no business sharing a label, so keeping two
 *   separate tutorial tiers around after their combined page count
 *   became one homepage tier would have just been a second, stale
 *   grouping alongside the real one. Tutorials' sidebar has a "Tier 3:
 *   Advanced" again now, but it isn't the old tutorial Tier 3 come back;
 *   it's two new explainer pages (`/tutorials/specialization-tracks`,
 *   `/tutorials/skelly-university`), unrelated to the merge above, which
 *   still stands.
 * - Advanced drops the single flat grid entirely and instead gives each
 *   of four columns its own PathGroup, FMC Dev first, then the three
 *   specialization tracks (Technology / Science / Art) populated from
 *   real module content in `freemocap/university` (verified via the
 *   GitHub API and raw file content, not guessed). FMC Dev holds this
 *   site's own 9 developer/architecture tiles (build + reference pages),
 *   which used to live inside Technology and read as a mess there: a
 *   visitor couldn't tell a SkellyCam curriculum stub on GitHub from
 *   this site's own audited REST API reference without clicking
 *   through. FMC Dev isn't a specialization track the way the other
 *   three are, it's "the rest of this site's advanced content," kept
 *   visually distinct from the upcoming Skelly University course rather
 *   than folded into whichever track happened to be thematically closest,
 *   and leading (not trailing) because a visitor already on this site
 *   is more likely reaching for more of this site than for an external
 *   curriculum. Each PathGroup carries a one-line `note` under its
 *   heading saying where its tiles actually go (Skelly University's
 *   GitHub vs. this site), since that's exactly the ambiguity FMC Dev
 *   exists to resolve, and Docusaurus's own `Link` already opens the
 *   external ones in a new tab automatically. TierPicker's Advanced box
 *   gets a matching "Dev" chip, first among its own chips, alongside
 *   Technology/Science/Art (`DEV_TRACK` in HomeSections.tsx, kept
 *   separate from `SPECIALIZATION_TRACKS` since it isn't one): unlike
 *   the other three, it navigates in-app to `/developers` rather than
 *   opening GitHub in a new tab. The four PathGroups sit inside a
 *   PathColumns wrapper so they read as parallel side-by-side columns
 *   (four wide down to two, then one, as the viewport narrows), not a
 *   long vertical scroll.
 *
 * Within a Tier, tiles whose destination pages share a sidebar are
 * ordered to match that sidebar exactly, not picked freehand: Beginner
 * and Intermediate's `/tutorials/` tiles follow their tutorial tier's
 * own order; FMC Dev keeps its `/build/` pages in their real sidebar
 * order (autogenerated from each page's own `sidebar_position`, not
 * `src/data/sitePages.ts`'s build list, though today they happen to
 * agree) followed by its `/reference/` pages in reference's order;
 * Technology/Science/Art are already in the university repo's own
 * module numbering; Get Started's own three already happened to match
 * `/start/`'s order.
 *
 * Every page that isn't tiled here is still reachable from its section's
 * own index (`/concepts/`, `/guides/`, `/reference/`) and the sidebar,
 * dropping a tile is not the same as removing a page.
 *
 * Tile `info` arrays are a short table of contents for the destination
 * page. Where the page has real content (checked directly, not guessed)
 * the bullets are its actual headings. Where the page is still a stub,
 * the bullets are a reasonable placeholder for what it will eventually
 * cover, not a claim that it exists yet.
 */
export default function Home() {
  // TierPicker's four boxes (see HomeSections.tsx) link to in-page hash
  // anchors on the Tier sections below. Docusaurus's own hash-scroll
  // already lands correctly (scroll-margin-top on .section handles the
  // sticky navbar), it just jumps instantly. Scoped to this page only,
  // via the html element's own scroll-behavior while Home is mounted,
  // rather than a sitewide custom.css rule that would also change how
  // every doc page's TOC/footnote anchors behave.
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return (
    <Layout
      title="FreeMoCap documentation"
      description="Free and open-source research-grade markerless motion capture with ordinary webcams. Install it, record with it, understand the data, and build on it."
    >
      <Hero />

      <main className="container">
        <TierPicker />

        <Tier id="get-started" label="Get Started">
          <SequenceGrid
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
          <SequenceGrid
            tiles={[
              {
                title: 'Choose and set up your cameras',
                to: '/tutorials/hardware',
                blurb: 'One camera minimum, three recommended, plus a ChArUco board for calibration.',
                info: [
                  'Required equipment (cameras, USB ports)',
                  'Necessary software (FreeMoCap, Blender)',
                ],
                icon: FiHardDrive,
              },
              {
                title: 'Record with one camera',
                to: '/tutorials/single-camera',
                blurb: 'Start with one camera before multi-camera. Simpler, faster, confirms your pipeline works.',
                info: [
                  'Why start with a single camera first',
                  'Installing and launching FreeMoCap',
                  'Camera detection',
                  'Recording',
                  'Moving on to multiple cameras',
                ],
                icon: FiVideo,
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
                title: 'Find and read your output',
                to: '/tutorials/find-your-data',
                blurb: "Every recording lands in its own folder. This is a map of what's actually in there.",
                info: ['Where to look', "What's in each piece", 'Next steps'],
                icon: FiFolder,
              },
              {
                title: 'Open your recording in Blender',
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
            ]}
          />
        </Tier>

        <Tier id="intermediate" label="Intermediate">
          <TileGrid
            tiles={[
              {
                title: 'Get a calibration you can trust',
                to: '/tutorials/better-calibration',
                blurb: 'Habits that make a bad calibration less likely in the first place.',
                info: [
                  'Give the board real variety',
                  "Check your reprojection error, don't just trust that it ran",
                  'Recalibrate when anything physical changes',
                ],
                icon: FiCheckSquare,
              },
              {
                title: 'Set the ground plane',
                to: '/tutorials/ground-plane',
                blurb: 'Sets the 3D world so "up" means up and the ground is where it should be.',
                info: [
                  'What is ground plane calibration?',
                  'How to record a ground plane calibration',
                  'Possible errors',
                ],
                icon: FiCompass,
              },
              {
                title: 'Choose a tracking model',
                to: '/tutorials/choose-a-tracker',
                blurb: 'FreeMoCap runs on several pose estimation backends without changing your pipeline.',
                info: [
                  "If you're not sure, start with MediaPipe",
                  'Matching the backend to your task',
                  "When the built-in options aren't enough",
                ],
                icon: FiTarget,
              },
              {
                title: 'Filter and fill your data',
                to: '/tutorials/post-processing',
                blurb: 'What happens to a recording before it reaches you as output.',
                info: ['Filling gaps', 'Smoothing noise', 'Why this matters for your analysis'],
                icon: FiFilter,
              },
              {
                title: 'Optimize your capture space',
                to: '/tutorials/capture-environment',
                blurb: 'Lighting, background, and camera placement tips that meaningfully improve tracking.',
                info: ['Lighting conditions', 'Background considerations', 'Camera placement and configuration'],
                icon: FiHome,
              },
              {
                title: 'Analyze your data in Python',
                to: '/tutorials/analyze-in-python',
                blurb: 'Load a recording into a notebook and compute the numbers yourself.',
                info: [
                  'Loading your data',
                  'Pulling out a single joint',
                  'Filtering by tracking quality',
                  'A quick trajectory plot',
                ],
                icon: FiCode,
              },
              {
                title: 'Build a custom pipeline',
                to: '/tutorials/custom-pipeline',
                blurb: "FreeMoCap's backend runs on two different pipelines; know the difference before you customize.",
                info: ['Realtime vs. posthoc', 'If you want to go further'],
                icon: FiGitBranch,
              },
              {
                title: 'Process many recordings at once',
                to: '/tutorials/batch-processing',
                blurb: 'FreeMoCap V2 has no built-in batch mode yet, here is what to do in the meantime.',
                info: ['Why this page exists anyway', 'What to do in the meantime'],
                icon: FiCopy,
              },
            ]}
          />
        </Tier>

        <Tier id="advanced" label="Advanced">
          <PathColumns>
            <PathGroup label="FMC Dev" note="Developer pages on this site" variant="dev">
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
                ]}
              />
            </PathGroup>

            <PathGroup label="Technology" note="Upcoming Skelly University course (GitHub stub)" variant="technology">
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


            <PathGroup label="Science" note="Upcoming Skelly University course (GitHub stub)" variant="science">
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

            <PathGroup label="Art" note="Upcoming Skelly University course (GitHub stub)" variant="art">
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

        {/* "Papers, talks, and community" section (canonical name, see
            site-structure naming in src/theme/Footer/index.tsx). Homepage-
            only content, NOT part of the footer. This is the last <main>
            section before </Layout>, so it renders directly above the
            real sitewide footer's footer sitemap section (src/theme/
            Footer/index.tsx, which Layout renders on every page, homepage
            included). The two sit back to back with only a thin divider,
            which reads as one big footer area at a glance, but they're
            different things: this block is page content (its own
            <section>, inside <main>), the footer below it is site chrome.
            Some links here (Community/Project columns) do overlap in
            destination with the footer lower band's socials row and About
            row further down; that's an intentional "recap the essentials
            right where the reader's eye already is" placement, not
            accidental duplication, don't "fix" it without asking first. */}
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
      </main>
    </Layout>
  );
}
