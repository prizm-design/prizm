---
component: platform-roster
slug: platform-roster
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3PlatformRoster.java
---

# Rc3PlatformRoster (JavaFX)

A vertical platform list for a thick-client (JavaFX) C3 app — a `VBox` with a
quick-glance link / autonomy / battery row per platform. The active platform is
Ember-marked (left bar + leading dot). Rows are selectable when `onSelect` is set;
otherwise status-only. Honours invariant 3. Mirrors the React `PlatformRoster`
(`components/rc3/platform-roster.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `LinkStatus` | enum `GOOD / DEGRADED / LOST` | Signal-bar colour + link label. |
| `RosterEntry` | record `(String id, LinkStatus link, Integer signal, Integer battery, String autonomy, String klass)` | Optional fields may be null; signal falls back to a status default. |
| `setPlatforms(List<RosterEntry>)` | void | Display order. |
| `setActiveId(String)` | void | Ember-marked row. |
| `setOnSelect(Consumer<String>)` | void | Makes rows interactive. |
| `setLabel(String)` | void | Optional header. |
| `setFillHeight(boolean)` | void | Fit-and-scroll — needs a height-constrained parent. |

Constructor: `Rc3PlatformRoster()`. Renders nothing until platforms are set.

## Usage

```java
var roster = new Rc3PlatformRoster();
roster.setLabel("ECHELON BRAVO");
roster.setActiveId("UGV-04");
roster.setPlatforms(List.of(
    new Rc3PlatformRoster.RosterEntry("UGV-04", Rc3PlatformRoster.LinkStatus.GOOD, 4, 84, "SUPERVISED", "UGV")));
roster.setOnSelect(roster::setActiveId);
```

## Theming

Requires a PRIZM theme on the Scene. The active bar + dot are Ember (inlined);
status tones re-read live on theme swap. `setFillHeight(true)` engages internal
scroll only when the parent gives it a definite height.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3PlatformRoster.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
