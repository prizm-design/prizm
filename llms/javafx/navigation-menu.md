---
component: navigation-menu
slug: navigation-menu
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmNavigationMenu.java
---

# PrizmNavigationMenu (JavaFX)

A horizontal row of dropdown triggers — an `HBox` of `MenuButton`s (a `MenuBar`
can't show or animate a trigger chevron). Each trigger carries a chevron graphic
that rotates down→up (150ms) when its dropdown opens, styled by
`.prizm-nav-trigger`; the dropdowns reuse the shared `.context-menu` /
`.menu-item` rules. Add triggers via `addMenu(label, items...)`.

In spec parity with the React `Navigation Menu` (`components/ui/navigation-menu.tsx`). The full
Java API (constructors, enums, methods) is in `lib/javafx-api.ts` under the
`navigation-menu` key and on the components page at `/components/navigation-menu`.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmNavigationMenu.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
