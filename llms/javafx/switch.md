---
component: switch
slug: switch
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmSwitch.java
---

# PrizmSwitch (JavaFX)

A PRIZM-styled switch — a sliding on/off toggle for settings that take effect
immediately — for thick-client (JavaFX) C3 applications. JavaFX ships no stock
switch, so `PrizmSwitch` is a `javafx.scene.control.ToggleButton` (for its
`selected` property, keyboard, and toggle behaviour) restyled as a track +
sliding thumb by `PrizmSwitchSkin` and the `.prizm-switch` rules in `prizm.css`.

It carries no label text of its own — pair it with a `PrizmLabel` or wrap it in a
`PrizmField`, like the web. In spec parity with the React `Switch`
(`components/ui/switch.tsx`).

## API

| member     | type              | notes |
|------------|-------------------|-------|
| `selected` | `BooleanProperty` | On/off state (inherited from `ToggleButton`); the thumb slides on change. |
| `disabled` | `BooleanProperty` | Inherited from `Node`; dims the track via `:disabled`. |

Constructors: `PrizmSwitch()`, `PrizmSwitch(boolean selected)`.

## Usage

```java
var glass = new PrizmSwitch(true);
glass.selectedProperty().addListener((obs, was, now) -> applyGlass(now));

var field = new PrizmField("Auto-RTB on low battery", new PrizmSwitch());
```

## Accessibility

The accessible role is `TOGGLE_BUTTON` — JavaFX has no `SWITCH` role. The web
equivalent uses `role="switch"`; the behaviour (toggle, SPACE key, focus) is the
same.

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the track turns accent when
selected and re-reads its colours live on theme swap. The track is 34×20 with a
16px thumb.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmSwitch.java` (skin:
`PrizmSwitchSkin.java`). Styling: `javafx/src/main/resources/prizm/prizm.css`.
