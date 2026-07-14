---
component: indicators
slug: indicators
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3Indicators.java
---

# Rc3Indicators (JavaFX)

The RC3 indicator alphabet for thick-client (JavaFX) C3 apps — small, glanceable
visual primitives for organism row values, designed to read as instruments rather
than HUD ornament. Pack-internal static helpers; pass them into a row's value slot
(e.g. `Rc3PlatformDetail.Extra`'s `Node` value). Mirrors
`components/rc3/indicators.tsx`.

## API (static factories)

| member | returns | notes |
|--------|---------|-------|
| `pipCount(int filled, int total, String suffix, Tone tone)` | `HBox` | Discrete inventory — filled/total pips + count + optional suffix (e.g. `AGM-114`). |
| `capacityBar(double pct, Tone tone, String suffix)` | `HBox` | Continuous percentage — a small track + fill + trailing text. |
| `stateDot(DotState state, String text)` | `HBox` | Three-state status — coloured dot (`ACTIVE` success / `STANDBY` warning / `OFF` muted) + label. |
| `stateText(Tone tone, String text)` | `Label` | Semantic-coloured mono text for binary safety state (e.g. `ARMED`). |
| `Tone` | enum | `SUCCESS / WARNING / DANGER / MUTED`. |
| `DotState` | enum | `ACTIVE / STANDBY / OFF`. |

## Usage

```java
new Rc3PlatformDetail.Extra("Payload", "Munition",
    Rc3Indicators.pipCount(4, 4, "AGM-114", Rc3Indicators.Tone.SUCCESS));
new Rc3PlatformDetail.Extra("Payload", "Status",
    Rc3Indicators.stateText(Rc3Indicators.Tone.DANGER, "ARMED"));
new Rc3PlatformDetail.Extra("Sensors", "EO/IR",
    Rc3Indicators.stateDot(Rc3Indicators.DotState.ACTIVE, "Tracking"));
```

## Theming

Requires a PRIZM theme on the Scene; tones re-read their colours live on theme
swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3Indicators.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
