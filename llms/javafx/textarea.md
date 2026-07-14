---
component: textarea
slug: textarea
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmTextarea.java
---

# PrizmTextarea (JavaFX)

A PRIZM-styled multi-line text input for thick-client (JavaFX) C3 applications.
A thin subclass of `javafx.scene.control.TextArea`, styled by the `.text-area`
rules in `prizm.css`. In spec parity with the React `Textarea`
(`components/ui/textarea.tsx`).

## API

| member         | type             | notes |
|----------------|------------------|-------|
| `promptText`   | `StringProperty` | Placeholder shown when the field is empty. |
| `prefRowCount` | `int`            | Suggested visible height, in rows. |
| `text`         | `StringProperty` | The field value (inherited from `TextArea`). |
| `disabled`     | `BooleanProperty`| Inherited from `Node`; dims the field via `:disabled`. |

Constructors: `PrizmTextarea()`, `PrizmTextarea(String text)`,
`PrizmTextarea(String text, String promptText)`.

## Usage

```java
var notes = new PrizmTextarea("", "Observations…");
notes.setPrefRowCount(4);

var field = new PrizmField("Situation report", notes);
```

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the surface, border, and
focus-ring accent re-read their colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmTextarea.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
