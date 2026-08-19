import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

/**
 * Placeholder.
 *
 * The real download page already exists in freemocap/freemocap-docs, with OS
 * detection, GPU detection, R2 file sizes and a release version selector. It is
 * about twenty components. Porting it is a mechanical move, not a rewrite, and
 * it should be lifted wholesale rather than reimplemented here.
 */
export default function Download() {
  return (
    <Layout title="Download FreeMoCap" description="Download and install FreeMoCap.">
      <main className="container margin-vert--xl">
        <h1>Download FreeMoCap</h1>
        <p>
          This page is a placeholder. The working download page, with automatic
          OS and GPU detection and a release selector, lives in the{' '}
          <Link href="https://github.com/freemocap/freemocap/tree/main/freemocap-docs/src/components/download">
            freemocap-docs
          </Link>{' '}
          repo and should be lifted into this site as-is.
        </p>
        <p>
          Until then, follow the <Link to="/start/install">install guide</Link>.
        </p>
      </main>
    </Layout>
  );
}
