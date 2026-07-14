---
component: checkbox
slug: checkbox
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmCheckbox.java
---

# PrizmCheckbox (JavaFX)

A PRIZM-styled checkbox for thick-client (JavaFX) C3 applications. A thin
subclass of `javafx.scene.control.CheckBox`, styled by the `.check-box` rules in
`prizm.css`. In spec parity with the React `Checkbox`
(`components/ui/checkbox.tsx`).

## API

| member          | type              | default | notes |
|-----------------|-------------------|---------|-------|
| `selected`      | `BooleanProperty` | `false` | Checked state; accent fill when selected. |
| `indeterminate` | `BooleanProperty` | `false` | Tri-state indeterminate — enable via `allowIndeterminate`. |
| `disabled`      | `BooleanProperty` | `false` | Inherited from `Node`; dims the box via `:disabled`. |

Constructors: `PrizmCheckbox()`, `PrizmCheckbox(String text)`.

## Usage

```java
var agree = new PrizmCheckbox("Acknowledge brief");
agree.selectedProperty().addListener((obs, was, now) -> setConfirmed(now));

var partial = new PrizmCheckbox("Select all");
partial.setAllowIndeterminate(true);
partial.setIndeterminate(true);
```

## Accessibility

The accessible role is `CHECK_BOX`, matching the web `role="checkbox"`; SPACE
toggles and focus behaviour follow the JavaFX stock control.

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the box turns accent when
selected and re-reads its colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmCheckbox.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
