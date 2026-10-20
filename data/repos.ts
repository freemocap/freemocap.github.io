import { readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

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

// Shared by docusaurus.config.ts (external docs instances) and the
// repos-data plugin (the /developers polyrepo tree). siteDir comes from
// each caller's own context (Docusaurus's LoadContext, or __dirname in
// the config file itself) rather than assuming the working directory.
export function loadRepos(siteDir: string): Repo[] {
  const filePath = path.join(siteDir, 'data/repos.yml');
  return yaml.load(readFileSync(filePath, 'utf8')) as Repo[];
}
