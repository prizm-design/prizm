---
component: field
slug: field
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmField.java
---

# PrizmField (JavaFX)

A PRIZM form field for thick-client (JavaFX) C3 applications — a label, a
control, an optional hint, and an optional error, stacked. No stock JavaFX
control maps to this, so `PrizmField` is a small composite over
`javafx.scene.layout.VBox` (like `PrizmCard`), styled by the `.prizm-field`
rules in `prizm.css`. It pairs the label with the control via `setLabelFor`, so
clicking the label focuses the control.

In spec parity with the React `Field` (`components/ui/field.tsx` — `Field` +
`FieldLabel` + `FieldControl` + `FieldDescription` + `FieldError`).

## API

| member           | type             | notes |
|------------------|------------------|-------|
| `setLabel`       | `(String) → void`| The field label text. |
| `setControl`     | `(Node) → void`  | Set/replace the wrapped control; pairs it with the label. |
| `setDescription` | `(String) → void`| Helper / hint text below the control; `null` or `""` hides it. |
| `setError`       | `(String) → void`| Validation error below the field; `null` or `""` clears it. |
| `labelNode`      | `() → PrizmLabel`| The label, for further styling. |

Constructors: `PrizmField()`, `PrizmField(String labelText)`,
`PrizmField(String labelText, Node control)`. The stack always renders in the
order label → control → description → error; empty hint/error lines take no
space.

## Validation

Unlike the web `Field`, `PrizmField` carries **no** validation engine — Base
UI's `validate` / `validationMode` are a web concern. Run validation yourself
and drive the error line with `setError(message)` (pass `null` to clear).

## Usage

```java
var callsign = new PrizmInput("", "e.g. UGV-04");
var field = new PrizmField("Call sign", callsign);
field.setDescription("Used on the platform roster and comms.");

// later, on a failed check:
field.setError("Outside the assigned band (225–400 MHz).");
```

## Theming

Requires a PRIZM theme on the Scene
(`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`). The hint reads as muted
foreground and the error as the danger colour; both re-read live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmField.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
