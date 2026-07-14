---
component: video-tile
slug: video-tile
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3VideoTile.java
---

# Rc3VideoTile (JavaFX)

Frames a single video / sensor feed in a thick-client (JavaFX) C3 app. A
`StackPane` that ships the surface — border, Ember-dotted source label, status
label, recording indicator, reticle, telemetry burn-in, and an unambiguous
no-signal overlay — while the consumer plugs their video node via `setContent`.
Honours invariant 5 (a lost feed reads "NO SIGNAL", never a frozen frame).
Mirrors the React `VideoTile` (`components/rc3/video-tile.tsx`). JavaFX has no
backdrop-blur, so overlay pills use a solid surface fill.

## API

| member | type | notes |
|--------|------|-------|
| `FeedStatus` | enum `LIVE / DEGRADED / LOST` | Corner label + no-signal overlay. |
| `AspectRatio` | enum `R16_9 / R4_3 / R9_16 / R1_1 / AUTO` | Height derives from width (default `R16_9`). |
| `SensorMode` | enum `EO / IR / LL` | Sensor badge cell. |
| `setContent(Node)` | void | The consumer's video / canvas / player. |
| `setSource(String)` / `setStatus(FeedStatus)` | void | |
| `setRecording(boolean)` / `setReticle(boolean)` | void | |
| `setCoordinates(String)` / `setBearing(Integer)` / `setRange(Double)` / `setZoom(Integer)` / `setSensor(SensorMode)` | void | Telemetry burn-in cells. |

Constructors: `Rc3VideoTile()`, `Rc3VideoTile(String source, FeedStatus status)`.

## Usage

```java
var tile = new Rc3VideoTile("FPV · UGV-04", Rc3VideoTile.FeedStatus.LIVE);
tile.setContent(myVideoNode);
tile.setReticle(true);
tile.setBearing(275);
tile.setRange(420.0);
tile.setZoom(4);
```

## Theming

Requires a PRIZM theme on the Scene. The source dot is Ember (inlined); status
tones and pills re-read their colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3VideoTile.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
