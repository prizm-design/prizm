---
component: comms-health-strip
slug: comms-health-strip
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3CommsHealthStrip.java
---

# Rc3CommsHealthStrip (JavaFX)

A persistent, compact comms/health readout for a thick-client (JavaFX) C3 app. An
`HBox` that shows a single rich row at `PLATFORM` scope (signal bars, id, link
state, battery, GPS) or an aggregated summary at group / swarm / mission scope
(linked count, % healthy, degraded/lost counts, optional per-platform pips).
Honours behavioural invariant 2. Status uses semantic success / warning / danger —
no Ember. Mirrors the React `CommsHealthStrip`
(`components/rc3/comms-health-strip.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `Scope` | enum `PLATFORM / GROUP / SWARM / MISSION` | Single row vs aggregated summary. |
| `LinkStatus` | enum `GOOD / DEGRADED / LOST` | Drives colour + link label (LINK / DEGRADED / LOST). |
| `PlatformLink` | record `(String id, int signal, Integer battery, boolean gpsLock, LinkStatus status)` | One platform's link state; `battery` may be null. |
| `setScope(Scope)` | void | |
| `setPlatform(PlatformLink)` | void | The single platform at `PLATFORM` scope. |
| `setPlatforms(List<PlatformLink>)` | void | Aggregated scopes; pips show at group/swarm when ≤ 12. |

Constructor: `Rc3CommsHealthStrip()`. With no platform set at `PLATFORM` scope it
renders a muted "No platform connected" state.

## Usage

```java
var comms = new Rc3CommsHealthStrip();
comms.setPlatform(new Rc3CommsHealthStrip.PlatformLink(
    "UGV-04", 4, 84, true, Rc3CommsHealthStrip.LinkStatus.GOOD));
```

## Theming

Requires a PRIZM theme on the Scene; status colours re-read live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3CommsHealthStrip.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
