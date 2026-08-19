import Layout from '@theme/Layout';
import {
  AudienceDoorways,
  ComingSoonSection,
  Hero,
  HomeSection,
  LinkColumns,
} from '@site/src/components/HomeSections';

/**
 * The FreeMoCap docs home.
 *
 * Structure copied from ethereum.org/learn: question-headed sections, two or
 * three cards each, then a flat "More on X" list. Home's whole job is to route.
 * It does not teach, and it does not fork by persona; the audience doorways at
 * the bottom link into the same pages the cards above already point at.
 */
export default function Home() {
  return (
    <Layout
      title="FreeMoCap documentation"
      description="Free and open-source research-grade markerless motion capture with ordinary webcams. Install it, record with it, understand the data, and build on it."
    >
      <Hero />

      <main className="container">
        <AudienceDoorways />

        <HomeSection
          heading="Understand FreeMoCap"
          cards={[
            {
              title: 'What is FreeMoCap?',
              description: "What the software does and who it's for.",
              cta: 'Start here',
              to: '/concepts/what-is-freemocap',
            },
            {
              title: 'What is markerless mocap?',
              description: 'Motion capture without suits, markers, or a studio.',
              cta: 'Learn the basics',
              to: '/concepts/markerless-mocap',
            },
            {
              title: 'How FreeMoCap works',
              description:
                'From camera frames to a 3D skeleton.',
              cta: 'See how it works',
              to: '/concepts/how-it-works',
            },
          ]}
          moreLabel="More on the basics"
          more={[
            { label: 'Glossary', to: '/concepts/glossary' },
            { label: 'Accuracy and limits', to: '/concepts/accuracy-and-limits' },
            { label: 'Frequently asked questions', to: '/about/faq' },
            { label: 'Cite FreeMoCap', to: '/guides/cite-freemocap' },
          ]}
        />

        <HomeSection
          heading="How do I record something?"
          cards={[
            {
              title: 'Install FreeMoCap',
              description: 'Get it running on Windows, macOS, or Linux.',
              cta: 'Install',
              to: '/start/install',
            },
            {
              title: 'Make your first recording',
              description: 'One camera, five minutes, a moving skeleton.',
              cta: 'Record something',
              to: '/start/first-recording',
            },
            {
              title: 'Record with multiple cameras',
              description:
                'Calibrate a camera array and capture in real 3D.',
              cta: 'Go multi-camera',
              to: '/tutorials/multi-camera',
            },
          ]}
          moreLabel="More on recording"
          more={[
            { label: 'Hardware and cameras', to: '/tutorials/hardware' },
            { label: 'Calibrate your cameras', to: '/tutorials/calibrate' },
            { label: 'Optimize your capture space', to: '/tutorials/capture-environment' },
            { label: 'Fix an installation problem', to: '/guides/installation-troubleshooting' },
            { label: 'All how-to guides', to: '/guides/' },
          ]}
        />

        <HomeSection
          heading="What do I do with the data?"
          cards={[
            {
              title: 'Your output data',
              description:
                'What FreeMoCap gives you and what every number means.',
              cta: 'Understand your data',
              to: '/concepts/data-model',
            },
            {
              title: 'Analyze it in Python',
              description:
                'Load a recording and compute joint angles, velocities, centre of mass.',
              cta: 'Open a notebook',
              to: '/tutorials/analyze-in-python',
            },
            {
              title: 'Bring it into Blender',
              description:
                'Get a rigged, animated skeleton into a 3D scene.',
              cta: 'Export to Blender',
              to: '/tutorials/blender',
            },
          ]}
          moreLabel="More on your data"
          more={[
            { label: 'Recording folder structure', to: '/reference/recording-structure' },
            { label: 'Array shapes and units', to: '/reference/data-arrays' },
            { label: 'Coordinate conventions', to: '/reference/coordinate-conventions' },
            { label: 'Skeleton models and keypoints', to: '/reference/skeleton-models' },
            { label: 'Export formats', to: '/guides/export-formats' },
          ]}
        />

        <HomeSection
          heading="How FreeMoCap is built"
          cards={[
            {
              title: 'Architecture overview',
              description:
                'A React desktop app, a Python backend, and a pipeline between them.',
              cta: 'See the architecture',
              to: '/build/architecture',
            },
            {
              title: 'The Skelly components',
              description: 'Four standalone libraries, each owning one job.',
              cta: 'Explore the map',
              to: '/build/the-map',
            },
            {
              title: 'Contribute',
              description:
                'Set up a dev environment and make your first change.',
              cta: 'Start contributing',
              to: '/build/contributing',
            },
          ]}
          moreLabel="More on the internals"
          more={[
            { label: 'Follow one recording end to end', to: '/build/pipeline' },
            { label: 'Data contracts', to: '/build/data-contracts' },
            { label: 'REST API', to: '/reference/rest-api' },
            { label: 'WebSocket API', to: '/reference/websocket-api' },
            { label: 'All repositories', to: '/build/repo-directory' },
          ]}
        />

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
      </main>
    </Layout>
  );
}
