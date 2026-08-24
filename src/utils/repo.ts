// Shared by PolyrepoTree, the /developers page, and the Developer Docs
// navbar dropdown: one Repo shape for every consumer of the repos-data
// plugin (data/repos.yml), instead of three separate local copies.
export type Repo = {
  id: string;
  name: string;
  tier: 'core' | 'pantheon' | 'utility';
  emoji: string;
  responsibility: string;
  docs_path: string | null;
  route: string | null;
};
