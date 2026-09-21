---
title: Triangulation and 3D reconstruction
type: explanation
provenance: human-checked
history:
  - date: "2026-08-26"
    against: "freemocap working tree in polyrepo-clones/freemocap: core/tasks/triangulation/helpers/triangulation_config.py, helpers/default_triangulation_values.py, helpers/outlier_rejection.py, helpers/project_single_camera.py, core/tasks/triangulation/triangulator.py, core/tasks/mocap/mocap_helpers/skeleton_from_mediapipe_observations.py, core/tasks/mocap/posthoc_mocap_task.py, freemocap-ui/src/components/mocap-setup/mocap-triangulation-settings.tsx, freemocap-ui/src/store/slices/mocap/mocap-slice.ts"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
The **triangulation Settings** control how FreeMoCap combines the per-camera 2D skeleton tracks into 3D points. At its simplest, triangulation takes the 2D detections of a given keypoint from every camera that saw it and solves for the 3D position that best matches those views. FreeMoCap also offers an optional reprojection-error-based outlier-rejection step that can substantially improve reconstruction quality on 4+ camera rigs.

![Detail of reprojection Error Outlier Rejection Options](/img/v1/reprojection_filtering_crop_detail.png)

## Top-level parameters

**Minimum Cameras for triangulation**, sets the minimum number of cameras that must have a valid 2D detection of a given keypoint for that keypoint to be included in the 3D output. Points with fewer valid detections than this threshold are left out. This parameter applies to **both** the simple triangulation path and the outlier-rejection path. The default is **2**. Two camera views are the geometric minimum for triangulation, three or more gives a better-conditioned solve, especially when outlier rejection is enabled.

**Single-Camera Recordings** - A recording from a single camera cannot be triangulated at all, so instead FreeMoCap projects each detected keypoint onto a flat plane (the Y = 0 plane): horizontal position comes from the pixel x coordinate, height comes from the pixel y coordinate, and all depth information is discarded. This produces plausible-looking motion and lets the rest of the processing pipeline run unchanged, but it is not true 3D data. Set up a multi-camera system if you care about 3D data.

**Use Outlier Rejection Method?**, a checkbox that toggles the reprojection-error outlier rejection step (described below). It is **on by default**, and leaving it enabled is recommended for any recording with 4+ cameras. For the method to have any effect, the number of cameras in your recording must be *greater than* "Minimum Cameras for triangulation," otherwise there are no camera subsets left to test.

<!-- vale Vale.Terms = NO -->
## Reprojection error outlier rejection
<!-- vale Vale.Terms = YES -->

reprojection error outlier rejection is an optional postprocessing step to the 3D triangulation stage of processing. It retriangulates outlier data with the cameras contributing the most error removed. It is most effective when there is poor skeleton detection in one or more camera views.

### What is reprojection error?
"reprojection error" is the distance between the originally measured point (that is a joint on the 2D skeleton) and the reconstructed 3D point reprojected back onto the original image. The intuition is that if the 3D reconstruction and original 2D track are perfect, then reprojection error is zero. If it isn't, then there is some inaccuracy in either: the original 2D tracks (that is bad skeleton detection from one or more cameras), in the 3D reconstruction (that is bad camera calibration), or a combination of the two.

### How does reprojection error outlier rejection work?
After running the standard triangulation on a marker with all cameras, it calculates the reprojection error. If the error is preceding the target threshold, it iteratively tests subsets of cameras by dropping one or more cameras at a time, up to a configurable maximum. During this process, it tests each combination of cameras and calculates an exponential weight based on the reprojection error for that subset. If any combination within one loop achieves an error below the target threshold, the search stops early to prevent dropping more cameras than necessary. The result is the weighted average 3D point, with points that have lower reprojection error being weighted higher. If no subset of cameras improves on the error of the initial all-camera triangulation, the initial triangulation is returned instead of the weighted result.

Each tested subset is assigned a weight that falls off exponentially with its reprojection error:

$$
w = e^{-5 \cdot \varepsilon / \varepsilon_{\text{target}}}
$$

- *w*, weight assigned to a given camera subset
- *ε*, mean reprojection error for that subset
- *ε<sub>target</sub>*, the user-configurable target error threshold; subsets well below it get weight ≈ 1, subsets near or preceding it get weight ≈ 0
- The factor of 5 sets the sharpness of the decay: a subset with ε = ε<sub>target</sub> gets weight e<sup>−5</sup> ≈ 0.007 (nearly zero)

The final 3D point is the weighted average of the points from each tested subset, normalised by the sum of weights:

$$
\hat{p} = \frac{\sum_i w_i \cdot p_i}{\sum_i w_i}
$$

<!-- vale Google.FirstPerson = NO -->
<!-- The italic "i" below is a math subscript index (camera subset i), not
     the first-person pronoun. -->
- *p̂*, final estimated 3D point
- *p<sub>i</sub>*, 3D point triangulated from camera subset *i*
- *w<sub>i</sub>*, the weight for subset *i*
- Dividing by Σw<sub>i</sub> normalises the result, so well-behaved subsets dominate while noisy ones contribute almost nothing
<!-- vale Google.FirstPerson = YES -->

This smooth blending avoids sharp frame-to-frame jumps that would otherwise occur if the method simply picked the single "best" subset each frame.

### Outlier-rejection sub-options

**Maximum Cameras to Drop**, sets the maximum number of cameras that can be removed during the subset search. The default is **2**. The effective number of cameras used is bounded by both this parameter and "Minimum Cameras for triangulation."

**Target reprojection Error**, the target mean reprojection error (*ε<sub>target</sub>* in the weight formula preceding) used when filtering each marker. Lowering this rejects more outliers; raising it accepts more. Note that in the current implementation this threshold is expressed in undistorted-normalized image coordinates rather than pixels (roughly -1 to 1 across the image plane), which is why its default value of 0.02 looks small next to a typical pixel-space error.

### Code reference
The Outlier REjection method was introduced in [FreeMoCap PR#758](https://github.com/freemocap/freemocap/pull/758). Follow the link to see the code behind the implementation. The current implementation lives in `freemocap/core/tasks/triangulation/helpers/outlier_rejection.py` and `freemocap/core/tasks/triangulation/triangulator.py`.
