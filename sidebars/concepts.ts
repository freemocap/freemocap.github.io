import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { buildDocsTree } from './sharedDocsTree';

/**
 * Same tree as sidebars/docs.ts (see sharedDocsTree.ts), rendered with the
 * Key Concepts branch as real, active-highlighted pages instead of links.
 * Without this, landing on a concepts page swapped the whole sidebar out
 * for this instance's own flat, unrelated page list, an actual dead end
 * (Docusaurus renders a separate sidebar per instance): clicking a Key
 * Concepts entry now feels the same as clicking a tutorial tier entry,
 * because the sidebar itself doesn't change shape either way.
 */
const sidebars: SidebarsConfig = {
  conceptsSidebar: buildDocsTree('concepts'),
};

export default sidebars;
