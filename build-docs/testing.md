---
title: Testing
type: how-to
provenance: human-checked
inFlux: "This testing page is a stand-in for the core freemocap repo's own developer docs, still being consolidated there; expect it to move once that lands."
history:
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21: freemocap-ui/electron/main/services/menu-builder.ts and src/hooks/useMenuActions.ts (Data > Load Test Data action, freemocap_test_data recording name, 7x5/58mm board config), freemocap/tests/pipelines/conftest.py (test recording contents, canonical path, auto-download URL and cache), MocapPanel.tsx, BlenderSection.tsx and RecordingBrowser.tsx/ImportVideosModal.tsx (current button labels, posthoc stage toggles, MediaPipe-only Blender export)"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
# Testing Steps for FreeMoCap
These steps are primarily made to test:
1. Starting a brand new recording from scratch and making sure it works
2. Reprocessing an existing recording and making sure it works
3. Running the pipeline from all the different stages to make sure that file loading and processing works as intended

## I. Single camera recording  
1. Record and process a single camera recording in full (meaning you get a Blender output)
   - Note: Blender export currently only supports MediaPipe output. Switch the detector to MediaPipe in the Motion Capture panel before processing if you want the `.blend` file.

## II. Sample/test data
1. In the desktop app, use `Data > Load Test Data` in the menu bar. This loads the `freemocap_test_data` recording (3 synchronized videos, 222 frames, filmed with a 7x5 ChArUco board with 58mm squares) and applies the matching board configuration, then process it in full
2. The test recording is looked for at `~/freemocap_data/recordings/freemocap_test_data`. It is not bundled with the installer; if it is missing, running the end-to-end pipeline test suite once (`uv run poe test-pipelines`) downloads it automatically from a freemocap/skellysamples GitHub release and caches it
3. The longer `freemocap_sample_data` recording (roughly 1100 frames, the same recording at full length rather than downsampled) has no download source, so it only works if it is already on disk next to the test data

## III. Record and run a multi-camera recording
1. Record a calibration
2. Make a multi-camera recording
3. Process the recording in full

## IV. Load in an existing session
- Use this to test the pipeline in different stages, to ensure you can run it from any point in the pipeline
- Bonus points if you load an existing session that was processed with a previous version of FreeMoCap, to make sure there are no version-related conflicts when it comes to processing
1. Load the session by entering or browsing to its folder in the Motion Capture panel's recording path field, and check that it loaded correctly (check the Recording ID and the status panel)
2. Re-run the recording with the `Process Selected Recording` button
3. Exercise the pipeline stage toggles in the Motion Capture panel (2D tracking, 3D triangulation, filtering) to check the stages behave as expected on an already-processed session
4. Test the export with the Blender section of the Motion Capture panel (`Process Recording with Blender`, or enable `Export to Blender after mocap processing` before running)

## V. Import video
1. Import any set of videos (can just use existing ones from a synchronized recording) via the `Import Videos` button in the playback view, and run in full

For the automated test suite (pytest backend tests, frontend tests, and the end-to-end pipeline tests used above), see `TESTING.md` at the root of the freemocap repository.
