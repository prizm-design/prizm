---
component: popover
slug: popover
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmPopover.java
---

# PrizmPopover (JavaFX)

A PRIZM popover — a floating contextual panel anchored to a trigger — for
thick-client (JavaFX) C3 applications. Built on `javafx.scene.control.PopupControl`,
so its content inherits the owner scene's PRIZM theme (like Tooltip /
ContextMenu). Styled by the `.prizm-popover` rules in `prizm.css` (surface-elevated
card, hairline border, soft shadow). Auto-hides on focus loss and auto-fixes to
stay on screen.

In spec parity with the React `Popover` (`components/ui/popover.tsx`).

## API

| member       | type                | notes |
|--------------|---------------------|-------|
| `setContent` | `(Node) → void`     | The body — compose it yourself (e.g. a `VBox` of labels). |
| `show`       | `(Node owner) → void` | Show anchored below the owner. Inherited `show(owner, x, y)` for custom placement. |

Constructors: `PrizmPopover()`, `PrizmPopover(Node content)`.

The web `glass` variant is **not** ported (glass is web-only).

## Usage

```java
var content = new VBox(4, titleLabel, descriptionLabel);
var popover = new PrizmPopover(content);

var trigger = new PrizmButton("Details", PrizmButton.Variant.OUTLINE);
trigger.setOnAction(e -> { if (!popover.isShowing()) popover.show(trigger); });
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmPopover.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
