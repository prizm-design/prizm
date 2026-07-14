---
component: perception-view
slug: perception-view
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3PerceptionView.java
---

# Rc3PerceptionView (JavaFX)

The operator's live 3D window into what a robot swarm perceives, for a
thick-client (JavaFX) C3 app. A `StackPane` that ships the operator chrome
(coordinate-frame chip, layer legend, per-source provenance + freshness, AOI
registry, holding / lost overlay) and a dependency-free **reference renderer** — a
JavaFX `Canvas` that projects point clouds, occupancy voxels, structural mesh, and
AOIs with a small orbit camera. A `RenderDelegate` lets a vendor 3D engine take
over drawing while RC3 keeps the contract + chrome. RC3 does not fuse / register /
SLAM — an upstream system hands over one consolidated scene. Honours invariant 5.
Mirrors the React `PerceptionView` (`components/rc3/perception-view.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `CoordinateFrame` | enum `ENU / NED / Z_UP / Y_UP` | Scene frame (top chip). |
| `Vec3` / `FrameTransform` / `PerceptionSource` | record | Scene point, rigid transform, contributing platform + freshness. |
| `SceneLayer` | sealed interface | `PointCloudLayer` / `OccupancyLayer` / `MeshLayer`. |
| `AreaOfInterest` / `AoiKind` | record / enum | Operator semantics (objective / hazard / inspect / marker). |
| `PerceptionScene` | record `(frame, sources, layers, aois)` | The consolidated scene. |
| `PerceptionStatus` | enum `LIVE / HOLDING / LOST` | Held / lost raises an overlay. |
| `setScene(PerceptionScene)` | void | |
| `setStatus / setStaleAfterSeconds / setAutoRotate / setBareChrome` | void | Posture, decay threshold, orbit toggle, hide-panels. |
| `setSelectedAoiId / setOnSelectAoi / setOnToggleLayer` | void | Selection + layer-toggle state and optional listeners (interactive by default). |
| `RenderDelegate` | `@FunctionalInterface` | `Node render(PerceptionRenderContext)` — swap in a vendor engine. |

Constructor: `Rc3PerceptionView()`.

## Camera

The reference renderer orbits on mouse-drag, zooms on scroll (and via the
bottom-left +/− buttons), and slowly auto-rotates when `setAutoRotate(true)` (with
a play/pause toggle). Controls are hidden under `bareChrome` or a delegate.

## Usage

```java
var view = new Rc3PerceptionView();
view.setScene(scene);        // PerceptionScene from upstream
view.setAutoRotate(true);
view.setSelectedAoiId("smoke");
// or hand drawing to a vendor engine, keeping the chrome:
view.setRenderDelegate(ctx -> myVendorCanvas(ctx.scene()));
```

## Theming

Requires a PRIZM theme on the Scene. The frame dot + selected-AOI ring are Ember;
chrome panels re-read their colours live on theme swap. **Divergence:** the
Canvas reference renderer's neutral colours are dark-tuned constants (the web
reads live CSS vars); source hues and Ember match the web.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3PerceptionView.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
