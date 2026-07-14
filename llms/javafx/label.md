---
component: label
slug: label
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmLabel.java
---

# PrizmLabel (JavaFX)

A PRIZM-styled label — a short caption naming a control — for thick-client
(JavaFX) C3 applications. A thin subclass of `javafx.scene.control.Label`
carrying the `prizm-label` style class (medium weight). In spec parity with the
React `Label` (`components/ui/label.tsx`).

## API

| member     | type                | notes |
|------------|---------------------|-------|
| `labelFor` | `ObjectProperty<Node>` | Associates the label with a control (focus / mnemonic), inherited from `Label`. |
| `text`     | `StringProperty`    | The caption text (inherited from `Label`). |

Constructors: `PrizmLabel()`, `PrizmLabel(String text)`.

## Usage

```java
var input = new PrizmInput();
var label = new PrizmLabel("Call sign");
label.setLabelFor(input);
```

Most of the time you don't create a `PrizmLabel` directly — `PrizmField` builds
one for you and pairs it via `labelFor`.

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the foreground colour re-reads
live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmLabel.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
