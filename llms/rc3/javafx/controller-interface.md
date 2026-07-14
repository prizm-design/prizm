---
component: controller-interface
slug: controller-interface
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3ControllerInterface.java
---

# Rc3ControllerInterface (JavaFX)

Read-only operator-input visualisation for a thick-client (JavaFX) C3 app — an
`HBox` showing stick wells (with deadzone + position dot), vertical trigger bars,
and button pills. The consumer wires values from their gamepad / WebSocket /
controller pipeline; the strip only displays. The platform marker is Ember;
controls stay neutral. Mirrors the React `ControllerInterface`
(`components/rc3/controller-interface.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `StickState` | record `(double x, double y)` | -1..1 per axis; y positive up. |
| `ControllerButton` | record `(String id, label, boolean pressed, String binding)` | `binding` optional. |
| `setPlatform(String)` | void | Ember-dotted leading cell. |
| `setLeftStick(StickState, String label)` / `setRightStick(...)` | void | |
| `setLeftTrigger(Double, String label)` / `setRightTrigger(...)` | void | 0..1. |
| `setButtons(List<ControllerButton>)` | void | Pressed pills invert. |

Constructor: `Rc3ControllerInterface()`. Renders nothing until at least one input
is set.

## Usage

```java
var ctrl = new Rc3ControllerInterface();
ctrl.setPlatform("UGV-04");
ctrl.setLeftStick(new Rc3ControllerInterface.StickState(-0.3, 0.6), "DRIVE");
ctrl.setLeftTrigger(0.4, "ZOOM");
ctrl.setButtons(List.of(
    new Rc3ControllerInterface.ControllerButton("a", "A", true, "LIGHTS")));
```

## Theming

Requires a PRIZM theme on the Scene; the wells, bars, and pills re-read their
colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3ControllerInterface.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
