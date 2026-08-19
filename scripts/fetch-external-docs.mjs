#!/usr/bin/env node
/**
 * Populate external/ from the sub-repos listed in data/repos.yml.
 *
 * Each repo is shallow-cloned at its pinned ref and its docs_path is copied
 * into external/<id>/. A repo with docs_path: null is skipped and reported.
 * Skipping is normal, not an error: SkellyTracker, SkellyForge and the Blender
 * addon have no docs site yet, and the docs site must build without them.
 *
 * Run: npm run fetch
 */

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const externalDir = join(root, 'external');

const repos = yaml.load(await readFile(join(root, 'data', 'repos.yml'), 'utf8'));

/**
 * Sub-repo docs are written to build standalone, where the repo's own site is
 * served at the root with routeBasePath 'docs'. Aggregated here, the same page
 * lives at /<id>/, so every site-absolute /docs/... link breaks.
 *
 * Rewriting on fetch keeps both true: the sub-repo's standalone build keeps
 * working untouched, and the aggregate resolves. The durable fix is for sub-repo
 * docs to use relative links; until then this bridges it, and every rewrite is
 * logged so the drift is visible rather than silent.
 */
function normalizeLinks(dir, repo) {
  let count = 0;
  for (const file of readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!file.isFile() || !/\.mdx?$/.test(file.name)) continue;
    const path = join(file.parentPath ?? file.path, file.name);
    const before = readFileSync(path, 'utf8');
    const after = before
      .replace(/\]\(\/docs\//g, `](/${repo.id}/`)
      .replace(/\]\(\/roadmap\)/g, '](/about/roadmap)')
      .replace(/\]\(\/download\)/g, '](https://freemocap.org/download)');
    if (after !== before) {
      writeFileSync(path, after);
      count += (before.match(/\]\(\/(?:docs\/|roadmap\)|download\))/g) ?? []).length;
    }
  }
  return count;
}

let rewrites = 0;
const fetched = [];
const skipped = [];
const failed = [];

rmSync(externalDir, { recursive: true, force: true });
mkdirSync(externalDir, { recursive: true });

for (const repo of repos) {
  if (!repo.docs_path) {
    skipped.push(repo);
    continue;
  }

  const scratch = mkdtempSync(join(tmpdir(), `fmc-docs-${repo.id}-`));
  try {
    execFileSync(
      'git',
      ['clone', '--depth', '1', '--branch', repo.ref, repo.repo, scratch],
      { stdio: 'pipe' },
    );

    const source = join(scratch, repo.docs_path);
    if (!existsSync(source)) {
      throw new Error(
        `docs_path "${repo.docs_path}" does not exist in ${repo.repo} at ${repo.ref}`,
      );
    }

    // Copy the docs folder's PARENT, not just the docs folder.
    //
    // Sub-repo .mdx files import siblings of their docs folder with relative
    // paths (skellycam's core pages do `import ... from '../../content.config'`).
    // Copying only docs/ silently breaks those imports at build time. Copying
    // the parent preserves the relative layout the source repo was written
    // against, so a page that builds in its own repo builds here too.
    const docsParent = dirname(source);
    cpSync(docsParent, join(externalDir, repo.id), {
      recursive: true,
      filter: (src) =>
        !/(?:^|[\\/])(?:node_modules|build|\.docusaurus|\.git)(?:[\\/]|$)/.test(src),
    });
    rewrites += normalizeLinks(join(externalDir, repo.id, basename(repo.docs_path)), repo);
    fetched.push(repo);
  } catch (error) {
    failed.push({ repo, error });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

for (const repo of fetched) {
  const mounted = `external/${repo.id}/${basename(repo.docs_path)}`;
  console.log(
    `  fetched  ${repo.name.padEnd(16)} ${repo.repo}@${repo.ref}  ->  ${mounted}`,
  );
}
for (const repo of skipped) {
  console.log(`  skipped  ${repo.name.padEnd(16)} no docs site yet`);
}
for (const { repo, error } of failed) {
  console.error(`  FAILED   ${repo.name.padEnd(16)} ${error.message}`);
}

console.log(
  `\n${fetched.length} fetched, ${skipped.length} skipped, ${failed.length} failed.`,
);
if (rewrites > 0) {
  console.log(
    `${rewrites} site-absolute links rewritten for aggregation. The durable fix\n` +
    `is relative links in the sub-repo's own docs; see the docs plan, section 2.`,
  );
}

// A repo that declares a docs_path and then fails to produce it is a real
// error: something moved and the map is now lying. A repo with no docs_path
// is a known gap and must not fail the build.
if (failed.length > 0) {
  process.exit(1);
}
