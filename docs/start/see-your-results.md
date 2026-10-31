---
title: See what you made
type: tutorial
sidebar_position: 4
provenance: ai-generated
draft: false
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): default_paths.py and skellycam default_paths.py folder names (synchronized_videos/, annotated_videos/), posthoc_mocap_task.py (output_data/), default_paths.py (freemocap_data/recordings), PlaybackPage.tsx (Open folder in file explorer), mocap_task_config.py (export_to_blender and auto_open_blend_file default true), BlenderSection.tsx (MediaPipe-only export), mocap-slice.ts (RTMPose default). Not checked against a real recording."
  - date: "2026-08-25"
    against: "freemocap v2.0.0-alpha.21 polyrepo clone (system/default_paths.py, core/pipeline/posthoc/video_node.py, core/blender/export_to_blender.py, core/tasks/mocap/posthoc_mocap_task.py, core/tasks/mocap/mocap_task_config.py, freemocap-ui BlenderSection.tsx), plus site link targets"
  - date: "2026-08-21"
    against: "this site's own find-your-data.md and blender.md"
---

import playback_skeleton from './img/playback-skeleton.webp';
import recording_stages from './img/recording-stages.webp';

# See what you made

## Watch it back

Open the **Playback** tab and select your recording. Check the tracked skeleton against your
movement: points should sit on your joints and move smoothly.

<Screenshot src={playback_skeleton} alt="The Playback tab with a recording selected: three annotated camera views with the tracked skeleton drawn on a person, the 3D viewport on the right, and the playback controls along the bottom" caption="The Playback tab, showing a sample recording." version="2.0.0-alpha.25" />

<Video src="/img/v2/playback-watch.mp4" caption="Playback of the sample recording: the annotated camera views and the 3D viewport." />

## Open it in Blender

If you recorded with the **MediaPipe** tracker and have [Blender](https://www.blender.org)
installed, FreeMoCap creates a Blender scene and opens it when processing finishes. If Blender
doesn't open, see [open your recording in Blender](/tutorials/blender).

The default RTMPose tracker doesn't export to Blender yet. Its data files are still saved.

## Find the files

Recordings are saved in the `freemocap_data/recordings` folder in your home folder, one folder per
recording. In the **Playback** tab, click **Open folder in file explorer** to go straight there.

Inside each recording folder:

- `synchronized_videos/` holds the original videos.
- `annotated_videos/` holds copies with the tracked points drawn on top.
- `output_data/` holds the motion capture data.
- `<recording name>.blend` is the Blender scene, if one was made.

In the **Playback** tab, open a recording's folder detail to see which of these were made.

<Screenshot src={recording_stages} width={480} alt="The Playback list with the sample recording expanded: Synchronized videos, Calibration, Blender input data, Annotated videos and Blender scene, each with a green tick" caption="A fully processed recording, with each output ticked off." version="2.0.0-alpha.25" />

See [find and read your output](/tutorials/find-your-data) for the full layout.

## If something looks wrong

- **Points jump around or disappear:** usually lighting. See
  [optimize your capture space](/tutorials/capture-environment).
- **A multi-camera skeleton is lying down, mirrored, or the wrong size:** usually calibration. See
  [get a calibration you can trust](/tutorials/better-calibration).

A single camera can't give reliable 3D positions, however clean the tracking looks. For real 3D
data, [record with multiple cameras](/tutorials/multi-camera).

## Next steps

- [Where to go next](/start/where-next)
