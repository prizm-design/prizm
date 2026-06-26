---
component: menu
slug: menu
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmMenu.java
---

# PrizmMenu (JavaFX)

A PRIZM action menu — a trigger button that opens a dropdown of items — for
thick-client (JavaFX) C3 applications. JavaFX has no standalone menu control, so
this extends `javafx.scene.control.MenuButton` (the idiomatic trigger-plus-popup).
The trigger is styled by `.prizm-menu`; the popup and items by the shared
`.context-menu` / `.menu-item` rules in `prizm.css`.

In spec parity with the React `Menu` (`components/ui/menu.tsx`).

## API

| member  | type                        | notes |
|---------|-----------------------------|-------|
| `items` | `ObservableList<MenuItem>`  | Add via `getItems()`. |

Constructors: `PrizmMenu()`, `PrizmMenu(String text)`,
`PrizmMenu(String text, MenuItem... items)`.

Holds stock JavaFX items — `MenuItem`, `CheckMenuItem`, `RadioMenuItem`,
`SeparatorMenuItem`, nested `Menu` submenus — which the rules style.
`MenuItem.setAccelerator(...)` is the web's shortcut.

## Usage

```java
var menu = new PrizmMenu("Actions");
var auto = new CheckMenuItem("Auto-RTB on low battery");
menu.getItems().addAll(
    new MenuItem("Acknowledge"), new SeparatorMenuItem(), auto);
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmMenu.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
