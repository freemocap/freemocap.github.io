// Shared by PolyrepoTree, the /developers page, the Developer Docs navbar
// dropdown, and the /build/the-map, data-contracts, and repo-directory
// pages: one Repo shape for every consumer of the repos-data plugin
// (data/repos.yml), instead of separate local copies. Matches the full
// yaml shape (see data/repos.ts's own Repo type) rather than trimming to
// whichever fields the first consumer happened to need, since the runtime
// object always carries every field regardless of what the type declares.
export type RepoTier = 'core' | 'pantheon' | 'utility';

export type Repo = {
  id: string;
  name: string;
  tier: RepoTier;
  emoji: string;
  responsibility: string;
  domain: string;
  repo: string;
  docs_path: string | null;
  ref: string;
  route: string | null;
  consumes: string[];
  produces: string[];
};
