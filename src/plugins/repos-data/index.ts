import type { LoadContext, Plugin } from '@docusaurus/types';
import { loadRepos, type Repo } from '../../../data/repos';

// Exposes data/repos.yml to browser-bundled React components (the
// /developers polyrepo tree) via usePluginData. Node APIs like fs aren't
// available in the client bundle, so the YAML has to be read at build
// time, here, rather than imported directly into a page component.
export default function reposDataPlugin(context: LoadContext): Plugin<Repo[]> {
  return {
    name: 'repos-data-plugin',
    async loadContent() {
      return loadRepos(context.siteDir);
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
