import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import PolyrepoTree from '@site/src/components/PolyrepoTree';
import heroStyles from '@site/src/components/HomeSections.module.css';
import type { Repo } from '@site/src/utils/repo';
import styles from './developers.module.css';

/**
 * The contributor-facing landing page. Sparser and more technical than the
 * user docs homepage on purpose (closer to a NumPy reference page than the
 * ethereum.org-style tile grid at /) since the audience already knows what
 * FreeMoCap is and wants the shape of the codebase, not a beginner funnel.
 */
export default function Developers() {
  const repos = usePluginData('repos-data-plugin') as Repo[];

  return (
    <Layout
      title="Developer documentation"
      description="The FreeMoCap polyrepo: what each repository owns, how they depend on each other, and where to find each one's developer docs."
    >
      <header className={heroStyles.hero}>
        <h1 className={heroStyles.heroTitle}>FreeMoCap</h1>
        <p className={styles.tagline}>Developer documentation for the <a href="https://freemocap.org" target="_blank" rel="noopener noreferrer">FreeMoCap</a> project.</p>
      </header>

      <main className="container">
        <section className={styles.section}>
          
          <PolyrepoTree repos={repos} />
          
          <div className={styles.intro}>
            <p>
              FreeMoCap is a polyrepo where <a href="https://github.com/freemocap/freemocap" target="_blank" rel="noopener noreferrer">freemocap/freemocap</a> is the application, which composes a set of independent libraries rather than containing them. Each one owns a stage of the pipeline: <code>SkellyCam</code> produces synchronized frame packages, <code>SkellyTracker</code> turns those into keypoint observations, <code>SkellyForge</code> turns those into reconstructed points and kinematic models, and <code>SkellyBlender</code> turns those into an animated scene. These are organized into a core layer for the application, a pantheon of supporting repos in parallel below that, and a suite of utility repos that support the whole pipeline, as shown in the tree diagram below. Support repositories in the pantheon layer communicate through the data contract, while utility repos are infrastructure handling logging, docs tooling, telemetry, sync, etc. from which any part of the pipeline can draw.
            </p>
          </div>

          

          <figure className={styles.voltronIntro}>
            <img
              src="/img/developers/skellyvoltron.jpg"
              alt="The FreeMoCap Skelly components drawn as Voltron's five pilots: Skelly Core in the center, with SkellyCam, SkellyTracker, SkellyForge, and SkellyBlender at the four corners."
              className={styles.voltronImage}
            />
            <figcaption className={styles.voltronCaption}>Sort of like this.</figcaption>
          </figure>

          <p className={styles.voltronText}>
            Like the Defender of the Universe, the head and body are the primary core, but it does not function
            without the arms and legs. Splitting a codebase this way trades a single build for independent,
            freely-releasable pieces, at the cost of needing an explicit way (like the tiers and data contracts
            above) to track which versions of each actually work together.
          </p>

          <p className={styles.voltronText}>
            In practice, each entry in FreeMoCap's own repo map connects to a
            specific git tag instead of a branch, so a change merged into one repo can't break the others
            until someone deliberately moves the pin forward. This allows a manifest to decide what's actually
            compatible rather than memory.
          </p>

          <img
            src="/img/developers/voltron-full-skelly.png"
            alt="Image of a fully assembled Voltron."
            className={styles.voltronFullImage}
          />

          <div className={styles.links}>
            <Link to="/build/">Architecture docs</Link>
            <Link to="/build/repo-directory">Full repository directory</Link>
            <Link to="https://github.com/freemocap">GitHub organization</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
