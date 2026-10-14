---
title: Optimize your capture space
type: tutorial
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): skellycam camera_config.py (manual exposure, default -7), recommend_camera_exposure_setting.py (Auto/Manual/Recommend), opencv_apply_config.py (Linux forced auto-exposure), CameraSettingsModal.tsx (Manual/Auto/Recommend options). Exposure section rewritten and v1 video removed; other sections unchanged."
  - date: "2026-08-26"
    against: "polyrepo-clones pulled 2026-08-26: skellycam camera_config.py (DEFAULT_EXPOSURE=-7) and opencv_apply_config.py, freemocap-ui exposure slider range (EXPOSURE_MIN=-13, EXPOSURE_MAX=-4), skellycam RotationTypes portrait rotation support, link target /tutorials/calibrate"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---

While FreeMoCap can record anywhere that's big enough to capture your entire body on video, some places and set ups give better results than others. The tips below help you configure your space to get the best recordings, whether you're working with high-end gear or simple webcams. 

Start small and simple. You can add more once the basics work.

## Lighting conditions

Lighting is crucial for a camera-based system like FreeMoCap. For best results, use bright environments, such as near open windows during the day. Be cautious: environments that look bright to the eye can register as quite dim to a camera sensor (human eyes are exceptionally good at adapting to different lighting conditions).

A short exposure time means the camera's (digital) shutter stays open for less time on each recorded frame. That gives the subject less time to move during the exposure, reducing motion blur and making it easier to identify the subject's joints in each frame.

### Setting exposure

Exposure is set per camera: expand a camera's row in the camera panel. The default is a manual
setting of `-7`. Lower numbers mean shorter exposure and less blur, but a darker image, so add
light rather than raising the number. `-7` or `-8` works well in a bright room. Choose
**Recommend** to have FreeMoCap pick a setting for your lighting.

Cameras on Linux always use automatic exposure.

## Background considerations

A solid-colored backdrop is not strictly necessary, but using one can improve the quality of recordings. Covering complex visual textures in the camera's field of view makes tracking the human in the scene easier, leading to better outcomes. Start with a simple setup first, and add complexity once you've established that the simple version works.

Visual contrast between the subject and the background helps the subject stand out in recordings. Example: wear dark clothing against a light background.

Similarly, it is better for subjects to wear tight-fitting clothes that expose joints like elbows and knees. While not strictly necessary, it leads to better quality recordings. Consider the machine's perspective: if the subject is wearing baggy pants and the software is asked to identify the knee, it struggles. It may produce an estimate close to the correct position, but tracking the knee is easier if it is visible or if the subject is wearing tight-fitting pants.

## Camera placement and configuration

Camera placement is critical. Ensure that the subject is in full view of each camera. In multi-camera setups, ensure that at least two, preferably three, cameras can see every part of the subject's body at any given time. 

<details>
<summary>Working with small spaces</summary>

Cameras can be rotated 90° to portrait orientation to capture a standing human in a tighter space. You can even mix portrait and landscape views together to better capture your space.

</details>

Ideally, the person should occupy as much of the camera screen as possible, providing more information for the software to track the person. Most testing has been done on low-quality webcams, although successful recordings have been made with GoPros, DSLRs, and mobile phones.

In multi-camera situations, separate the cameras enough to provide different points of view on the subject. If multiple cameras are positioned too close together, they won't add much information to the scene. Separating them by a sufficient angle improves triangulation. Just make sure each camera can share a view of the ChArUco board with another camera during calibration.

High-quality recordings can be ensured by adjusting camera settings for optimal image results, mainly by setting the appropriate exposure for the lighting conditions and having good lighting. A successful calibration is also necessary; see the [multi-camera calibration tutorial](/tutorials/calibrate).
