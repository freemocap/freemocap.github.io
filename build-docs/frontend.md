---
title: Frontend architecture
type: explanation
sidebar_position: 6
provenance: ai-generated
inFlux: "Frontend architecture section for FreeMoCap core is a work in progress for version alpha. It will stabilize upon beta release."
history:
  - date: "2026-08-26"
    against: "re-checked against freemocap-ui source at v2.0.0-alpha.21: src/store/store.ts slice list, src/store/persistence-listener.ts and camera-config-listener.ts debounces, src/services/server/ServerContextProvider.tsx and server-context.ts subscription API, BasePanelLayout.tsx and BaseContentRouter.tsx, src/styles/App.css and color.css, i18n/locales and assets/icons counts"
  - date: "2026-08-24"
    against: "FreeMoCap-docs/docs/architecture/frontend-component-architecture.mdx, frontend-state-management.mdx, frontend-styling-system.mdx, frontend-backend-communication.mdx, cross-checked against the frontend's src/store/store.ts and src/store/slices/ in the FreeMoCap clone (v2.0.0-alpha.21)"
draft: false
---

# Frontend architecture

The frontend is a React 19 + TypeScript app rendered inside Electron (or a
plain browser during development). It uses `HashRouter` rather than
`BrowserRouter`, since Electron loads the app over `file://`, where a real
browser route like `/streaming` has no server to resolve it against;
hash-based routes stay entirely client-side.

## Provider hierarchy and layout

The app boots from `main.tsx` and nests providers in a deliberate order,
outermost first: Redux `Provider` (everything below reads from it),
`ServerContextProvider` (websocket connection, frames, keypoints, logs),
`HashRouter`, `AutoUpdateProvider`, `PlaybackProvider`, then the three-panel
layout (`BasePanelLayout`) and its route-to-page mapping
(`BaseContentRouter`). Order matters here because inner providers depend on
outer ones being ready first.

The layout itself is two nested resizable panel groups built on
`react-resizable-panels`: a vertical split (main content on top, a
collapsible console at the bottom), and inside the top panel, a horizontal
split (a collapsible sidebar on the left, page content on the right). Three
top-level routes cover the app: `/streaming` (live camera grid plus an
optional 3D viewport), `/playback` (synced multi-video playback with a 3D
skeleton viewer), and `/active-recording` (pipeline stage status and
processing controls).

## Where state lives: Redux, Context, or a ref

This is the frontend's central architectural decision, and getting it wrong
causes real bugs, not just style complaints:

| Mechanism | Use for | Because |
|---|---|---|
| Redux | config that survives navigation, anything persisted to `localStorage`, state several unrelated components read | Triggers re-renders app-wide; fine for state that changes occasionally |
| React Context | State shared by one subtree (playback, auto-update) | Avoids prop drilling without going global |
| `useRef` | Data that changes at frame rate: camera frames, keypoints, skeleton frames, overlay data | Refs don't trigger re-renders; putting 60fps data in Redux would re-render every subscribed component 60 times a second |

`ServerContextProvider` is where this rule matters most: streaming data lives
in refs and reaches consumers through a subscription pattern
(`subscribeToKeypoints`, `subscribeToSkeleton`, `subscribeToCenterOfMass`,
`subscribeToXcom`, `subscribeToBodyKinematics`) rather than Redux dispatch,
so the Three.js scene can update every frame without React re-rendering
anything.

### Redux store

The store currently registers **13 slices**, more than the project's own
architecture docs describe, reading `store.ts` directly rather than trusting
that count: `cameras`, `recording`, `videos`, `realtime`, `connection`,
`calibration`, `mocap`, `locale`, `pipelines`, `blender`, `recordingStatus`,
`activeRecording`, and `playbackData`. A fourteenth slice directory,
`theme`, exists on disk under `src/store/slices/` but is not imported into
`store.ts`; it manages its own `localStorage` persistence directly instead.

The `connection` slice is not documented in any of this repo's architecture
docs at all. It holds `isConnected`, `serverPid`, `cameraGroups`, and
`realtimePipelines`, populated from an `AppStateMessage` described in its own
source comments as an "authoritative server-state snapshot, pushed on
connect and on change," which the `cameras` and `realtime` slices also
listen for to reconcile their own state. This complements rather than
replaces the plain `ServerContext.isConnected` boolean the architecture docs
describe: `ServerContextProvider` keeps that boolean in React state and also
mirrors every websocket state change into the slice via `wsConnectionChanged`,
so both track the same connection.

Two listener middlewares run on every dispatch: one debounced persistence
layer (300 ms) that writes a selected subset of state to `localStorage`
(recording config, calibration config, mocap config, Blender settings, the
active recording's identity, not camera state or anything ephemeral), and
one debounced auto-apply layer (350 ms) that pushes camera config changes to
the backend automatically when they change.

## Styling: hand-rolled utility classes, not a framework

No Tailwind, no CSS modules, no CSS-in-JS, no `ThemeProvider`. Every class is
global CSS, imported through one master file (`src/styles/App.css`); forget
to `@import` a new style sheet there and its rules simply never load. Colors
are layered CSS custom properties: raw values (`--gray-900`), alpha variants,
then semantic tokens (`--color-bg-primary`, `--color-danger`, and so on) that
generate matching utility classes (`.bg-danger`, `.text-danger-muted`). There
is currently one theme; if a second is ever added, the mechanism would be
swapping custom-property values, not a JavaScript theme object, since none
exists.

## How the frontend talks to the backend

Three channels, each with its own service layer under `src/services/`:

- **REST**, for commands (detect cameras, start recording, run calibration),
  through a `ServerUrls` singleton that centralizes every endpoint URL. Full
  reference: [REST API](/reference/rest-api).
- **The websocket**, for everything that streams. `ServerContextProvider` runs a
  `requestAnimationFrame` loop rather than reacting to each message as it
  arrives, since a message storm (dozens of binary camera frames per tick)
  processed with `await` would starve the main thread before the next batch
  even lands. Each tick: acknowledge the latest frame number first (so the
  backend can pipeline the next batch while this one decodes), dispatch
  buffered JSON payloads, decode binary frames off the main thread in a Web
  Worker, then measure frontend framerate. Full reference:
  [websocket API](/reference/websocket-api).
- **Electron IPC**, for things only a native shell can do (file dialogs,
  native menus, auto-update), bridged through a tRPC proxy so the same call
  site works in a browser during development, where it simply no-ops.

## Directory shape

```
src/
├── app/          Entry point, provider composition
├── layout/       Panel layout, routing, sidebar/console content
├── pages/        StreamingViewPage, PlaybackPage, ActiveRecordingPage
├── components/   Shared and domain components (camera views, control
│                 panels, the Three.js viewport, log terminal, mocap setup)
├── services/     REST, WebSocket, and Electron IPC clients
├── store/        Redux slices, typed hooks, persistence middleware
├── styles/       Design tokens and utility CSS
├── hooks/        Shared custom hooks
├── i18n/         41 locale files
└── assets/       SVG icons (99 files under assets/icons/)
```

[← Architecture overview](/build/architecture)
