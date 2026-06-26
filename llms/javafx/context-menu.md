---
component: context-menu
slug: context-menu
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmContextMenu.java
---

# PrizmContextMenu (JavaFX)

A PRIZM right-click action menu for thick-client (JavaFX) C3 applications. Thin
subclass of the stock `javafx.scene.control.ContextMenu`; the popup and items use
the shared `.context-menu` / `.menu-item` rules in `prizm.css` (the same styling
as `PrizmMenu`'s popup).

In spec parity with the React `ContextMenu` (`components/ui/context-menu.tsx`).

## API

| member  | type                        | notes |
|---------|-----------------------------|-------|
| `items` | `ObservableList<MenuItem>`  | Stock JavaFX menu items (same set as `PrizmMenu`). |

Constructors: `PrizmContextMenu()`, `PrizmContextMenu(MenuItem... items)`.

## Usage

```java
var menu = new PrizmContextMenu(
    new MenuItem("Acknowledge"), new SeparatorMenuItem(), new MenuItem("Remove"));

// On a Control:
label.setContextMenu(menu);
// On any other Node (e.g. a PrizmCard / VBox):
card.setOnContextMenuRequested(e -> menu.show(card, e.getScreenX(), e.getScreenY()));
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmContextMenu.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
