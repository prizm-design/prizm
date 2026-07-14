---
component: platform-detail
slug: platform-detail
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3PlatformDetail.java
---

# Rc3PlatformDetail (JavaFX)

The master-detail companion to `Rc3PlatformRoster` for a thick-client (JavaFX) C3
app — a `VBox` card with Comms / Telemetry / Mission sections plus caller extras,
an Ember-dotted header, and a last-contact footer. Each section renders only when
its data is present. Honours invariant 3. Mirrors the React `PlatformDetail`
(`components/rc3/platform-detail.tsx`). Extra values are any `Node` — pass an
`Rc3Indicators` primitive (pipCount / capacityBar / stateDot / stateText) so
payload / sensor state reads as an instrument, or a `String` for plain text.

## API

| member | type | notes |
|--------|------|-------|
| `LinkStatus` | enum `GOOD / DEGRADED / LOST` | |
| `UxvDomain` | enum `AERIAL / GROUND / SURFACE / UNDERWATER` | Vertical label (ALT / ELEV / DEPTH). |
| `MissionStep` | record `(int current, int total, String label)` | `label` optional. |
| `Extra` | record `(String section, String label, Node value)` | Consecutive same-`section` entries group; `value` is any Node (use `Rc3Indicators`) or a String. |
| `setPlatform / setKlass / setDomain / setAutonomy` | void | Header. |
| `setLink / setSignal(Integer) / setBattery(Integer)` | void | Comms section (with signal bars + battery gauge). |
| `setPosition / setHeading(Integer) / setSpeed(Double, unit) / setVertical(Double, unit, ref)` | void | Telemetry section (heading dial). |
| `setMission(MissionStep) / setOperator(String)` | void | Mission section. |
| `setExtras(List<Extra>)` / `setLastContact(String)` | void | |
| `setFillHeight(boolean)` | void | Pins header + footer, scrolls the body. |

Constructors: `Rc3PlatformDetail()`, `Rc3PlatformDetail(String platform)`.

## Usage

```java
var detail = new Rc3PlatformDetail("UGV-04");
detail.setKlass("UGV");
detail.setLink(Rc3PlatformDetail.LinkStatus.GOOD);
detail.setBattery(84);
detail.setHeading(275);
detail.setMission(new Rc3PlatformDetail.MissionStep(6, 12, "RECON LEG B"));
detail.setLastContact("0.3 s ago");
```

## Theming

Requires a PRIZM theme on the Scene. The header dot is Ember (inlined); the
battery gauge, heading dial, and status tones re-read live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3PlatformDetail.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
