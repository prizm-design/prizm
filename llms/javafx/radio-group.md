---
component: radio-group
slug: radio-group
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmRadioGroup.java
---

# PrizmRadioGroup (JavaFX)

A PRIZM-styled radio group — a set of mutually exclusive options — for
thick-client (JavaFX) C3 applications. JavaFX ships no radio-group container, so
`PrizmRadioGroup` is a composite: a `javafx.scene.layout.VBox` holding
`PrizmRadioGroupItem` options joined to one shared `ToggleGroup`. Styled by the
`.radio-button` rules in `prizm.css`. In spec parity with `RadioGroup` +
`RadioGroupItem` in the React `radio-group` (`components/ui/radio-group.tsx`).

## API

| member           | type                          | notes |
|------------------|-------------------------------|-------|
| `addOption`      | `(String) → PrizmRadioGroupItem` | Add an option; returns the item, already joined to the shared `ToggleGroup`. |
| `getSelected`    | `() → String`                 | The selected option's text, or `null`. |
| `select`         | `(String) → void`             | Select the option with the given text. |
| `getToggleGroup` | `() → ToggleGroup`            | The shared toggle group. |

Constructors: `PrizmRadioGroup()`, `PrizmRadioGroup(String... options)`.

## Usage

```java
var mode = new PrizmRadioGroup("Manual", "Assisted", "Autonomous");
mode.select("Assisted");
mode.getToggleGroup().selectedToggleProperty().addListener(
    (obs, was, now) -> applyMode(mode.getSelected()));

// or build up incrementally
var group = new PrizmRadioGroup();
group.addOption("Primary");
group.addOption("Secondary");
```

## Accessibility

Each `PrizmRadioGroupItem` carries the `RADIO_BUTTON` role; the shared
`ToggleGroup` enforces single-selection and arrow-key navigation, matching the
web `role="radiogroup"` / `role="radio"` behaviour.

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the selected item's dot and ring
turn accent and re-read their colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmRadioGroup.java` (item:
`PrizmRadioGroupItem.java`). Styling:
`javafx/src/main/resources/prizm/prizm.css`.
