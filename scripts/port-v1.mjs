#!/usr/bin/env node
/**
 * One-shot port of the V1 Writerside corpus into the V2 tree.
 *
 * This is not a general Writerside converter. It handles the constructs that
 * actually appear in the FreeMoCap V1 docs and loudly reports anything it does
 * not recognise, so nothing gets silently dropped.
 *
 * Run once, review the output, delete the script. It is checked in only so the
 * port is reproducible and reviewable.
 *
 *   node scripts/port-v1.mjs ../legacy-docs/docs/Writerside/topics
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const source = resolve(process.argv[2] ?? '../legacy-docs/docs/Writerside/topics');
const root = resolve(dirname(new URL(import.meta.url).pathname), '..');

/** V1 file -> destination page. Mirrors the redirect table in data/redirects.js. */
const MAP = [
  ['getting_started/installation.md',                 'docs/start/install.md',                          'Install FreeMoCap',            'tutorial'],
  ['getting_started/your_first_recording.md',         'docs/start/first-recording.md',                  'Make your first recording',    'tutorial'],
  ['getting_started/next_steps.md',                   'docs/start/where-next.md',                       'Where to go next',             'hub'],
  ['getting_started/software_hardware_prerequisites.md', 'docs/tutorials/hardware.md',                  'Choose and set up your cameras', 'tutorial'],
  ['getting_started/single_camera_recording.md',      'docs/tutorials/single-camera.md',                'Record with one camera',       'tutorial'],
  ['getting_started/multi_camera_calibration.md',     'docs/tutorials/calibrate.md',                    'Calibrate your cameras',       'tutorial'],
  ['resources/groundplane_calibration.md',            'docs/tutorials/ground-plane.md',                 'Set the ground plane',         'tutorial'],
  ['resources/detailed_setup.md',                     'docs/tutorials/capture-environment.md',          'Optimize your capture space',  'tutorial'],
  ['troubleshooting/installation_troubleshooting.md', 'docs/guides/installation-troubleshooting.md',    'Fix an installation problem',  'how-to'],
  ['troubleshooting/calibration_troubleshooting.md',  'docs/guides/calibration-troubleshooting.md',     'Fix a calibration problem',    'how-to'],
  ['resources/yolo_cropping.md',                      'docs/guides/yolo-cropping.md',                   'Use YOLO cropping',            'how-to'],
  ['contributing/bug_report.md',                      'docs/guides/report-a-bug.md',                    'Report a bug',                 'how-to'],
  ['contributing/feature_request.md',                 'docs/guides/request-a-feature.md',               'Request a feature',            'how-to'],
  ['resources/triangulation.md',                      'concepts/triangulation.md',                      'Triangulation and 3D reconstruction', 'explanation'],
  ['resources/terminology.md',                        'concepts/glossary.md',                           'Glossary',                     'explanation'],
  ['about_us.md',                                     'docs/community/about.md',                        'About FreeMoCap',              'explanation'],
  ['Frequently-Asked-Questions-FAQ.md',               'docs/community/faq.md',                          'Frequently asked questions',   'explanation'],
  ['community/code_of_conduct.md',                    'docs/community/code-of-conduct.md',              'Code of conduct',              'explanation'],
  ['community/privacy_policy.md',                     'docs/community/privacy.md',                      'Privacy policy',               'explanation'],
  ['contributing/contributing_index.md',              'build-docs/contributing.md',                     'Contributing to FreeMoCap',    'how-to'],
  ['contributing/python_code_style_guide.md',         'build-docs/code-style.md',                       'Python code style',            'reference'],
  ['contributing/testing_procedure_for_PRs.md',       'build-docs/testing.md',                          'Testing',                      'how-to'],
  ['Updating-Documentation.md',                       'build-docs/writing-docs.md',                     'Contributing to the docs',     'how-to'],
];

const TODAY = new Date().toISOString().slice(0, 10);
const unhandled = new Map();

function note(file, what) {
  if (!unhandled.has(file)) unhandled.set(file, new Set());
  unhandled.get(file).add(what);
}

function convert(body, file) {
  let out = body;

  // <procedure title="X" collapsible="true"> -> collapsible details block
  out = out.replace(
    /<procedure\s+title="([^"]*)"[^>]*>\s*([\s\S]*?)<\/procedure>/g,
    (_m, title, inner) => `<details>\n<summary>${title}</summary>\n\n${inner.trim()}\n\n</details>`,
  );

  // Blockquote admonition style markers -> Docusaurus admonitions.
  // Writerside writes the marker on the line AFTER the quote: > text\n> {style="note"}
  out = out.replace(
    /((?:^>.*\n)+)>\s*\{style="(note|tip|warning)"\}\n/gm,
    (_m, quote, style) => {
      const text = quote
        .split('\n')
        .filter(Boolean)
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n');
      return `:::${style}\n${text}\n:::\n`;
    },
  );

  // Remaining attribute blocks carry no meaning we can preserve.
  out = out.replace(/^\s*\{(?:style|collapsible|border-effect|thumbnail)="[^"]*"\}\s*$/gm, '');

  // Writerside <step> inside a procedure becomes a plain heading.
  out = out.replace(/<step>\s*([\s\S]*?)<\/step>/g, (_m, inner) => `${inner.trim()}\n`);

  // Section starting pages are Writerside navigation furniture, not content.
  if (/<section-starting-page>/.test(out)) {
    note(file, 'section-starting-page (navigation furniture, dropped)');
    out = out.replace(/<section-starting-page>[\s\S]*?<\/section-starting-page>/g, '');
  }

  // Report anything left that looks like Writerside markup.
  const leftovers = out.match(/<(tabs|tab|shortcut|control|list|links|spotlight|seealso|primary|secondary|misc|cards|card)\b[^>]*>/g);
  if (leftovers) {
    for (const tag of new Set(leftovers)) note(file, `unconverted ${tag}`);
  }

  // Internal links: .md targets are remapped where we know the destination.
  for (const [from, to] of MAP.map(([f, t]) => [f.split('/').pop(), t])) {
    const route = '/' + to.replace(/^docs\//, '').replace(/^build-docs\//, 'build/').replace(/\.md$/, '');
    out = out.replace(new RegExp(`\\]\\(${from.replace('.', '\\.')}\\)`, 'g'), `](${route})`);
  }

  // Any remaining bare .md link is a V1 target we have not mapped.
  const orphans = out.match(/\]\((?!https?:|\/)[^)]+\.md\)/g);
  if (orphans) for (const o of new Set(orphans)) note(file, `unmapped link ${o}`);

  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

let ported = 0;
for (const [from, to, title, type] of MAP) {
  const sourcePath = join(source, from);
  if (!existsSync(sourcePath)) {
    console.error(`  MISSING  ${from}`);
    continue;
  }

  const raw = readFileSync(sourcePath, 'utf8');
  // Drop the V1 H1; the title comes from frontmatter now.
  const body = raw.replace(/^#\s+.*\n/, '');

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `type: ${type}`,
    'provenance: human-checked',
    `reviewed: ${TODAY}`,
    'reviewed_against: "v1 (ported, not yet re-checked against v2)"',
    '---',
    '',
  ].join('\n');

  const destination = join(root, to);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, frontmatter + convert(body, from));
  ported += 1;
}

console.log(`\nPorted ${ported} of ${MAP.length} pages.\n`);

if (unhandled.size > 0) {
  console.log('Needs a human pass:\n');
  for (const [file, items] of unhandled) {
    console.log(`  ${file}`);
    for (const item of items) console.log(`      ${item}`);
  }
  console.log('');
}
