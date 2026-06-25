---
component: button
slug: button
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmButton.java
---

# PrizmButton (JavaFX)

A PRIZM-styled button for thick-client (JavaFX) C3 applications. Thin subclass of
`javafx.scene.control.Button` — behaviour, keyboard, and accessibility are inherited; PRIZM adds a
typed variant/size API that maps to style classes consumed by `prizm.css`.

In spec parity with the React `Button` (`components/ui/button.tsx`).

## Variants (`PrizmButton.Variant`, default `SOLID`)

| variant   | When to use |
|-----------|-------------|
| `SOLID`   | Primary action. One per context. |
| `OUTLINE` | Secondary action alongside a `SOLID` button. |
| `GHOST`   | Tertiary action, in toolbars. |
| `SUBTLE`  | Quieter than outline; repeated actions in dense UIs. |
| `DANGER`  | Destructive actions. |
| `LINK`    | Inline navigation styled as a link. |

## Sizes (`PrizmButton.Size`, default `MD`)

`SM` (dense), `MD` (default), `LG` (hero), `ICON` (square 36×36 — pair with an accessible name).

## Usage

```java
var save = new PrizmButton("Save", PrizmButton.Variant.SOLID);
var cancel = new PrizmButton("Cancel", PrizmButton.Variant.OUTLINE);
cancel.setSize(PrizmButton.Size.SM);
```

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the button re-reads its colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmButton.java`. Styling: `javafx/src/main/resources/prizm/prizm.css`.
