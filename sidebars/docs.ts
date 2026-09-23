import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { buildDocsTree } from './sharedDocsTree';

/**
 * The user docs sidebar.
 *
 * Diataxis is the skeleton: start / tutorials / guides / reference are the
 * directory structure. Tiers are a table of contents only. They group pages
 * inside /tutorials/ and never appear in a URL, so a page can be re-tiered
 * without breaking a link.
 *
 * Built from sharedDocsTree.ts, the same source sidebars/concepts.ts uses,
 * so this sidebar and the one shown on /concepts/ pages stay one continuous
 * shape instead of drifting apart.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: buildDocsTree('docs'),
};

export default sidebars;
