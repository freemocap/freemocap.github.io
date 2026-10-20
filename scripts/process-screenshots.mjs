#!/usr/bin/env node
/**
 * Turns a raw screenshot into the docs-ready WebP and records it in
 * data/media-manifest.json. Run it for every capture so they all go through
 * the same crop, resize and compression.
 *
 *   npm run shot -- <input> --page docs/tutorials/single-camera.md --id record-controls \
 *     [--crop left,top,width,height] [--width 1600] [--app 2.0.0-alpha.25] \
 *     [--os macOS] [--theme dark] [--out <dir>]
 *
 * Output: <page's folder>/img/<id>.webp (or --out/<id>.webp). Originals are
 * never copied into the repo. Source files use sharp, a dev dependency.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const MAX_WIDTH = 1600;
const QUALITY = 80;
const MANIFEST = resolve('data/media-manifest.json');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[++i];
    else args._.push(argv[i]);
  }
  return args;
}

function fail(message) {
  console.error(`process-screenshots: ${message}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input || !args.id || (!args.page && !args.out)) {
  fail('usage: npm run shot -- <input> --page <docs page .md> --id <shot-id> [--crop l,t,w,h] [--width N] [--app VER] [--os OS] [--theme dark|light] [--out DIR]');
}
if (!existsSync(input)) fail(`input not found: ${input}`);
if (!/^[a-z0-9][a-z0-9-]*$/.test(args.id)) fail(`id must be lowercase letters, digits and dashes: ${args.id}`);
if (args.page && !existsSync(args.page)) fail(`page not found: ${args.page}`);

const outDir = args.out ? resolve(args.out) : join(dirname(resolve(args.page)), 'img');
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `${args.id}.webp`);

let image = sharp(input).rotate();
if (args.crop) {
  const [left, top, width, height] = args.crop.split(',').map(Number);
  if ([left, top, width, height].some((n) => !Number.isInteger(n) || n < 0)) fail('--crop needs four whole numbers: left,top,width,height');
  image = image.extract({ left, top, width, height });
}
const width = Math.min(Number(args.width ?? MAX_WIDTH), MAX_WIDTH);
await image.resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(outFile);

const meta = await sharp(outFile).metadata();
const entry = {
  id: args.id,
  page: args.page ?? null,
  file: outFile.replace(`${process.cwd()}/`, ''),
  app: args.app ?? null,
  os: args.os ?? null,
  theme: args.theme ?? null,
  captured: new Date().toISOString().slice(0, 10),
  width: meta.width,
  height: meta.height,
  bytes: statSync(outFile).size,
};

if (!args.out) {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const next = manifest.filter((m) => m.id !== args.id);
  next.push(entry);
  next.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
}
console.log(`${entry.file}  ${entry.width}x${entry.height}  ${(entry.bytes / 1024).toFixed(0)} KB${args.out ? '  (test output, manifest not updated)' : ''}`);
