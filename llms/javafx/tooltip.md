---
component: tooltip
slug: tooltip
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmTooltip.java
---

# PrizmTooltip (JavaFX)

A PRIZM tooltip — a hover label for compact UI elements — for thick-client
(JavaFX) C3 applications. Thin subclass of the stock `javafx.scene.control.Tooltip`,
styled by the `.prizm-tooltip` rules in `prizm.css` (surface-elevated
background, hairline border, soft shadow).

In spec parity with the React `Tooltip` (`components/ui/tooltip.tsx`).

## API

| member      | type                        | notes |
|-------------|-----------------------------|-------|
| `showDelay` | `ObjectProperty<Duration>`  | Hover delay before showing. Default `400ms`. |

Constructors: `PrizmTooltip()`, `PrizmTooltip(String text)`.

The web `glass` variant is **not** ported — liquid glass is a web-only surface
treatment (excluded from the JavaFX themes).

## Usage

```java
var btn = new PrizmButton("UGV-04", PrizmButton.Variant.OUTLINE);
btn.setTooltip(new PrizmTooltip("Ground · Patrol"));
// or for a non-Control node: Tooltip.install(node, new PrizmTooltip("…"));
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmTooltip.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
