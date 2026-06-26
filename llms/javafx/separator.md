---
component: separator
slug: separator
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmSeparator.java
---

# PrizmSeparator (JavaFX)

A PRIZM-styled divider line for thick-client (JavaFX) C3 applications. Thin
subclass of the stock `javafx.scene.control.Separator`; the rule is restyled to
a 1px `-color-border` line with no extra padding via the `.prizm-separator`
rules in `prizm.css`.

In spec parity with the React `Separator` (`components/ui/separator.tsx`).

## API

| member        | type                          | notes |
|---------------|-------------------------------|-------|
| `orientation` | `ObjectProperty<Orientation>` | `HORIZONTAL` (default) or `VERTICAL`. Inherited from `Separator`. |

Constructors: `PrizmSeparator()`, `PrizmSeparator(Orientation orientation)`.

## Usage

```java
var divider = new PrizmSeparator();                       // horizontal
var rule = new PrizmSeparator(Orientation.VERTICAL);      // between toolbar items
```

## Theming

Requires a PRIZM theme on the Scene (`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`);
the line re-reads `-color-border` live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmSeparator.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
