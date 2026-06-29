
# FreeMoCap v2 Proposed Architecture

> [!CAUTION]
>
> ""A foolish consistency is the Hobgoblin of Little Minds", ([Ralph Waldo Emerson](https://www.goodreads.com/quotes/353571-a-foolish-consistency-is-the-hobgoblin-of-little-minds-adored))," ([PEP8](https://pep8.org))


## Core freemocap and the sub-skelly repos

The FreeMoCap application software is organized in a `poly-repo` format, whereby the 'core' `freemocap/freemocap` repository houses the main application software, which embodies functionality composed from features housed in a small set of `sub-skelly repositories`

## High level Summary 
Here are the key repos: 

- **freemocap (core)** - Handles 'Pipeline' objects
- **skellycam** - Handles Cameras/Videos (i.e. `ImageSource` objects). Domain is camera device interaction, empirical measurement, and raw images
- **skellytracker** - Handles Image (or Image Sequence) based tracking from a SINGLE camera. Domain is image analysis and computer vision
- **skellyforge** - Handles Aggregated input from MULTIPLE cameras, domain is computational geometry
- **skellyblender** - Handles generation of `.blend` scene, which also produces animation outputs like (.bvh, fbx, .gltf, etc)


### **Potential additional repos:**

> I'm generally leaning 'no' on both of these, but we may find them to be worth the effort at some point to avoid code duplication and 

- **skellytools** ( skellyutils'?) - To house shared general tools, such as the `pubsub` and `shared_memory` classes built for `skellycam`. Could also be a place to swap protocol and/or model definitions between sub-skelly contexts, if necessary. 

- **skellyspec** ('skellyprotocol')**,
    - The strictly typed `numpy record array` methods I developed in `skellycam` would play very well with some existing 'data transfer protocol' methods (e.g. flatbuffers, grpc, etc), which would allow us to externalize some of our core data models into language-agnostic `.json` or `.yaml` files, which would allow very fast data transfer and cross-language support at the cost of a new abstraction layer to maintain. Almost certainly not worth the effort for now, but might be worth it later if we find ourselves wanting to support non-python applications (webdev, rust, R, matlab, etc), as it'd let us auto-generate the main data classes for each language from the protocol definition, vs writing and maintaining each language definition manually (this could also be combined with the `skellytools` repo, which could live as the kind of transport/glue layer between the various sub-repos)

- **skellyui** - To house the UI code (e.g. the kind of thing that currently lives at `freemocap/freemocap-ui` and `skellycam/skellycam-ui`)

### **Proposed deprecations**
- **freemocap/skellyviewer** - responsibilities absorbed by the ThreeJS component of the `ui` along the animation output from `skellyblender`
- **freemocap/skelly_synchronize** - I think this could be absorbed as sub-pipeline of `SkellyCam` because video, or `SkellyForge` because timeseries/signal analysis?
- **freemocap/documentation** - each repo/sub-repo should host its own documentation from a `docs/` folder via GH Pages, which will become sub-pages in the top-level `https://freemocap.github.io` page built from https://github.com/freemocap/freemocap.github.io, which will be re-hosted at https://docs.freemocap.org. We can host high-level docs (tutorial, style guides, etc) through that main page, and repo/sub-repo specific docs will live at (e.g.) `docs.freemocap.org/skellycam`
___

## General repo/sub-repo template
- Each repo should: 
    - Have name  that is either `freemocap` or `skelly[blank]` where `[blank]` is a one-word short description capturing the  repo's role/task in a concise and direct way. Don't be too clever or poetic, think Hemingway.
    - Define an emoji pair representing the subrepo (see https://github.com/freemocap )
    - Internal documentation in a top-level folder called `/docs` (I'm leaning towards `mystmd` for our doc-building method). 
    - A ReadMe.md with roughly the structure defined below
    - (ideally) define some kind of stand alone interface/UI to show off its basic usage outside of core freemocap (e.g. simple cam recorder for skellycam, the webcam-demo for skellytracker, etc)
    - A sub-skelly repo should NOT have `freemocap` or any other sub-skelly as a dependency. If needed, create simple utility functions to do out-of-domain tasks needed for standalone usage (i.e. use a simple webcam demo in `skellytracker` to provide a simple camera interface rather than importing `skellycam`)
        - Those utility functions should NOT be imported into any `core-freemocap` pipelines, if possible


## ReadMe Template
> ```
> 
> [title card] - Including repo name, tagline, repo SVG logo, and GH badges
> 
> [short description] - 1-ish sentence description (reference 'freemocap' in sub-skellies)
> 
> # Overview
> - few sentence description of the thing
> - INCLUDING SOME VISUALIZATION OF WHAT THE REPO DOES (ideally video, but still image is ok)
> 
> # Installation
> [install instructions with `uv` - link to detailed install instructions in documentation page]
> 
> # Usage
> - very basic instructions on how to do a basic task (link to tutorials in internal/fmc-core docs)
> - INCLUDE VISUAL OF EXPECTED OUTPUT, or some other representation of "how you'll know if its working"
> 
> ...etc
> 
> ```
- 

## Repo and Sub-repo Responsibilities

### FreeMoCap - Core
- **Responsibility**: `Pipelines`
- **Domain**: Anything that requires nodes from multiple sub-skellies
- **Standalone**: Core Application 
- **Emojis**: 💀✨ `:skull: :sparkles:`

We can design the v2 FreeMoCap architecture as a Graph/Node structure, whereby the main functionality will derive from `Pipeline` ('Graph'? 'ProcessingGraph'? 'ProcessingPipeline'?) objects, which are worker-based graphs defining processing pipelines to perform the key tasks underlying the freemocap application, namely: Calibration, RealtimeMocap, PostHocMocap, etc. 

Future pipelines may include tasks like - post-processing analysis, batch processing, and other custom pipelines (e.g. for face cameras, image segmentation, custom cleanup, etc), 

Freemocap-level processing pipelines ('core-pipelines') will be composed of `Node` ('graph node',processing node', pipeline node'?) objects, with clearly defined Inputs, Dependencies (e.g. config), and Outputs

Sub-skelly repos will be loosely defined according to their TASK (i.e. the task/role they play in the core pipelines) and DOMAIN (i.e. the data and task type they tend to wrangle)


### SkellyCam
- **Responsibility**: `Cameras` ('video group' handled as `CameraWorker` or `CameraManager` config? Or standalone class?)
- **Domain**: Cameras, Video, Synchronization, Empirical measurement, Raw data generation
- **Standalone**: SkellyCam-UI (simple sync video recorder)
- **Emojis**: 💀📸 `:skull: :camera_with_flash:` 

### SkellyTracker
- **Responsibility**: Image Tracking `Tracker` objects (e.g. `MediapipeTracker`, `)
- **Domain**: Image analysis, computer vision, convolutional neural network (i.e. processing images from a SINGLE camera, producing data that does not rely on info/data from other cameras )
- **Standalone**: Webcam Demo (simple camera/video connection to show Tracker output)
- **Emojis**: 💀🔭 `:skull: :telescope:`

### SkellyForge
- **Responsibility**: 3d Reconstruction (i.e. multi-camera data aggregation)
- **Domain**: 3d geometry, signal processing (gap filling, filtering), kinematic reconstruction
- **Standalone**: Reconstruction UI
- **Emojis**: 💀🛠️ `:skull: :tools:`


