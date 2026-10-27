#!/usr/bin/env node
/**
 * Create every page in the sitemap that does not exist yet.
 *
 * Existing files are never overwritten, so this is safe to re-run as pages get
 * written. Stubs carry real frontmatter and an explicit note about their source
 * material, so nobody has to go back to the plan document to find out what a
 * page is supposed to contain.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');

// [path, title, type, sidebar_position, source note]
const PAGES = [
  // ---- start ----------------------------------------------------------
  ['docs/start/index.md', 'Get started with FreeMoCap', 'hub', 1, 'NEW. The short unbranching path: install, record, see the result, choose a direction.'],
  ['docs/start/see-your-results.md', 'See what you made', 'tutorial', 4, 'NEW. Where the files landed and how to confirm it worked.'],

  // ---- tutorials ------------------------------------------------------
  ['docs/tutorials/index.md', 'Tutorials', 'hub', 1, 'NEW. Three tier groups, each an ordered path.'],
  ['docs/tutorials/multi-camera.md', 'Record with multiple cameras', 'tutorial', 20, 'Port from V1 multi_camera_calibration.md plus the V2 posthoc-mocap guide.'],
  ['docs/tutorials/find-your-data.md', 'Find and read your output', 'tutorial', 21, 'Port from V2 architecture/backend-recording-structure.mdx.'],
  ['docs/tutorials/blender.md', 'Open your recording in Blender', 'tutorial', 22, 'Port from V2 guides/blender-export.mdx.'],
  ['docs/tutorials/better-calibration.md', 'Get a calibration you can trust', 'tutorial', 30, 'Port from V1 calibration_troubleshooting.md, reframed from fixing to preventing.'],
  ['docs/tutorials/choose-a-tracker.md', 'Choose a tracking model', 'tutorial', 32, 'NEW, plus V2 architecture/tracking-integration.mdx. MediaPipe vs RTMPose vs YOLOX.'],
  ['docs/tutorials/post-processing.md', 'Filter and fill your data', 'tutorial', 33, 'NEW. SkellyForge interpolation and filtering.'],
  ['docs/tutorials/analyze-in-python.md', 'Analyze your data in Python', 'tutorial', 40, 'NEW. Load the parquet, compute joint angles, velocities, centre of mass.'],
  ['docs/tutorials/custom-pipeline.md', 'Build a custom pipeline', 'tutorial', 41, 'Port from V2 architecture/backend-pipeline-architecture.mdx.'],
  ['docs/tutorials/batch-processing.md', 'Process many recordings at once', 'tutorial', 42, 'NEW.'],

  // ---- guides ---------------------------------------------------------
  ['docs/guides/index.md', 'How-to guides', 'hub', 1, 'NEW. Flat, tagged index. Grows from the Discord #help-requests export.'],
  ['docs/guides/gpu-setup.md', 'Set up GPU acceleration', 'how-to', 10, 'Port from V2 guides/gpu-setup.mdx and skellytracker GPU_SETUP_GUIDE.md.'],
  ['docs/guides/camera-setup.md', 'Connect and configure cameras', 'how-to', 11, 'Port from V2 guides/camera-setup.mdx.'],
  ['docs/guides/posthoc-mocap.md', 'Process a recording after the fact', 'how-to', 12, 'Port from V2 guides/posthoc-mocap.mdx.'],
  ['docs/guides/blender-export.md', 'Export to Blender', 'how-to', 13, 'Port from V2 guides/blender-export.mdx.'],
  ['docs/guides/export-formats.md', 'Export to FBX, BVH, and glTF', 'how-to', 14, 'NEW. Source: skellyforge/skellymodels/bvh_exporter.'],
  ['docs/guides/cite-freemocap.md', 'Cite FreeMoCap', 'how-to', 15, 'NEW. Source: CITATION.cff and the Zenodo DOI.'],

  // ---- reference ------------------------------------------------------
  ['docs/reference/index.md', 'Reference', 'hub', 1, 'NEW.'],
  ['docs/reference/recording-structure.md', 'Recording folder structure', 'reference', 10, 'Port from V2 architecture/backend-recording-structure.mdx.'],
  ['docs/reference/data-arrays.md', 'Output arrays: shapes, dtypes, units', 'reference', 11, 'GENERATED from skellyforge/skellymodels. See scripts/generate-data-reference.mjs.'],
  ['docs/reference/coordinate-conventions.md', 'Coordinate conventions', 'reference', 12, 'BLOCKED. Needs a human who knows the units, origin, axis convention and handedness. Not derivable from code.'],
  ['docs/reference/skeleton-models.md', 'Keypoint names and indices by model', 'reference', 13, 'GENERATED from skellyforge/skellymodels/tracker_info/*.yaml.'],
  ['docs/reference/configuration.md', 'Configuration options', 'reference', 14, 'NEW.'],
  ['docs/reference/rest-api.md', 'REST API', 'reference', 15, 'Port from V2 architecture/api-boundary.mdx and notes/api-notes.mdx.'],
  ['docs/reference/websocket-api.md', 'WebSocket API', 'reference', 16, 'Port from V2 architecture/backend-websocket-server.mdx.'],
  ['docs/reference/cli.md', 'Command line interface', 'reference', 17, 'NEW.'],
  ['docs/reference/system-requirements.md', 'System requirements', 'reference', 18, 'Port from V1 software_hardware_prerequisites.md.'],

  // ---- community ------------------------------------------------------
  ['docs/community/index.md', 'Community', 'hub', 1, 'NEW.'],
  ['docs/community/roadmap.md', 'Roadmap', 'explanation', 10, 'Port from the V2 roadmap page, which pulls live from GitHub issues.'],
  ['docs/community/how-these-docs-are-written.md', 'How these docs are written', 'explanation', 11, 'NEW. The provenance policy. Every banner links here.'],

  // ---- university -----------------------------------------------------
  ['docs/university/index.md', 'Skelly University', 'hub', 99, 'Reserved namespace. Coming soon.'],

  // ---- concepts (unversioned instance) --------------------------------
  ['concepts/index.md', 'Concepts', 'hub', 1, 'NEW.'],
  ['concepts/what-is-freemocap.md', 'What is FreeMoCap?', 'explanation', 2, 'Port from V1 index.md and V2 intro.mdx.'],
  ['concepts/markerless-mocap.md', 'What is markerless motion capture?', 'explanation', 3, 'NEW.'],
  ['concepts/how-it-works.md', 'How FreeMoCap works', 'explanation', 4, 'NEW. The pipeline in plain language, for readers who will never open the code.'],
  ['concepts/cameras-and-sync.md', 'Cameras and synchronization', 'explanation', 5, 'NEW. SkellyCam domain.'],
  ['concepts/tracking.md', 'Image tracking and pose models', 'explanation', 6, 'NEW. SkellyTracker domain.'],
  ['concepts/calibration.md', 'Why calibration matters', 'explanation', 7, 'NEW.'],
  ['concepts/coordinate-systems.md', 'Coordinate systems and units', 'explanation', 9, 'BLOCKED alongside /reference/coordinate-conventions.'],
  ['concepts/data-model.md', 'The FreeMoCap output data model', 'explanation', 10, 'NEW. The hinge between recording something and doing science with it. Highest-value page on the site.'],
  ['concepts/accuracy-and-limits.md', 'Accuracy, validity, and limits', 'explanation', 11, 'NEW. The page a reviewer looks for and most open-source mocap projects never write.'],

  // ---- build ----------------------------------------------------------
  ['build-docs/index.md', 'Build with FreeMoCap', 'hub', 1, 'NEW.'],
  ['build-docs/architecture.md', 'Architecture overview', 'explanation', 2, 'Port from V2 architecture/overview.mdx.'],
  ['build-docs/the-map.md', 'The polyrepo map', 'explanation', 3, 'GENERATED from data/repos.yml.'],
  ['build-docs/pipeline.md', 'Follow one recording end to end', 'explanation', 4, 'Port from V2 architecture/backend-pipeline-architecture.mdx.'],
  ['build-docs/data-contracts.md', 'Data contracts between components', 'reference', 5, 'GENERATED from data/repos.yml.'],
  ['build-docs/frontend.md', 'Frontend architecture', 'explanation', 6, 'Consolidate the four V2 frontend-*.mdx pages.'],
  ['build-docs/backend.md', 'Backend architecture', 'explanation', 7, 'Consolidate V2 backend-overview, backend-pubsub, backend-websocket-server, backend-calibration, backend-mocap.'],
  ['build-docs/repo-directory.md', 'All repositories', 'reference', 8, 'GENERATED from data/repos.yml.'],
  ['build-docs/building.md', 'Building and packaging', 'how-to', 11, 'Port from V2 development/building.mdx.'],
  ['build-docs/proposals/index.md', 'Design proposals', 'hub', 20, 'Port from V2 docs/proposals/.'],
];

const TODAY = new Date().toISOString().slice(0, 10);
let created = 0;
let skipped = 0;

for (const [path, title, type, position, note] of PAGES) {
  const destination = join(root, path);
  if (existsSync(destination)) {
    skipped += 1;
    continue;
  }

  const body = `---
title: "${title}"
type: ${type}
sidebar_position: ${position}
provenance: ai-generated
reviewed: ${TODAY}
reviewed_against: "none"
draft: false
---

# ${title}

:::warning This page is a stub
Nothing here has been written yet. It exists so the structure is navigable and
so links to it resolve.

**Planned source:** ${note}
:::

## What goes here

See the V2 documentation plan, section 5, for this page's role in the sitemap.
`;

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, body);
  created += 1;
}

console.log(`Created ${created} stubs, left ${skipped} existing pages alone.`);
