---
component: telemetry-hud
slug: telemetry-hud
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3TelemetryHud.java
---

# Rc3TelemetryHud (JavaFX)

Operational UXV telemetry for a thick-client (JavaFX) C3 app — a `StackPane` with
two postures: `STRIP` (an inline bordered row) and `FRAME` (a four-edge overlay
around a centred viewport set via `setContent`). `UxvDomain` drives label
semantics — vertical reads ALT / ELEV / DEPTH; verticalRate reads V/S / DIVE.
Honours invariant 5: a field marked stale dims and shows a STALE age tag. The
platform marker is Ember; battery / fuel use semantic tones. Mirrors the React
`TelemetryHud` (`components/rc3/telemetry-hud.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `UxvDomain` | enum `AERIAL / GROUND / SURFACE / UNDERWATER` | Label semantics. |
| `HudMode` | enum `STRIP / FRAME` | Layout posture (default `STRIP`). |
| `SpeedUnit` | enum `M_S / KM_H / KN` | |
| `VerticalUnit` | enum `M / FT` | |
| `TelemetryField` | enum | Keys for per-field staleness. |
| `setDomain / setMode / setPlatform` | void | |
| `setSpeed(Double, SpeedUnit)` | void | |
| `setVertical(Double, VerticalUnit, String ref)` | void | |
| `setVerticalRate / setHeading / setBattery / setFuel / setRoll / setPitch / setSlope / setAltitudeAboveBottom` | void | Domain-tuned cells (slope is ground-only). |
| `setStale(Map<TelemetryField,Integer>)` | void | Seconds since last fresh; dims + STALE tag. |
| `setContent(Node)` | void | Centred viewport in FRAME mode. |

Constructor: `Rc3TelemetryHud()`.

## Usage

```java
var hud = new Rc3TelemetryHud();
hud.setDomain(Rc3TelemetryHud.UxvDomain.AERIAL);
hud.setPlatform("UAV-11");
hud.setSpeed(18.4, Rc3TelemetryHud.SpeedUnit.M_S);
hud.setVertical(120.0, Rc3TelemetryHud.VerticalUnit.M, "AGL");
hud.setHeading(275);
hud.setBattery(64);
```

## Theming

Requires a PRIZM theme on the Scene. The platform dot is Ember (inlined); tones
re-read live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3TelemetryHud.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
