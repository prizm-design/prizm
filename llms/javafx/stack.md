---
component: stack
slug: stack
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmStack.java
---

# PrizmStack (JavaFX)

A vertical spacing primitive for thick-client (JavaFX) C3 applications —
children stacked top-to-bottom with a gap from the PRIZM spacing scale. Thin
subclass of `javafx.scene.layout.VBox`; the additions are a PRIZM default gap
and the `PrizmGap` convenience. Pure layout — no painted styling.

In spec parity with the React `Stack` (`components/ui/stack.tsx`).

## API

| member    | type                                          | notes |
|-----------|-----------------------------------------------|-------|
| `PrizmGap`| `enum { NONE, XXS, XS, SM, MD, LG, XL, XXL }`  | Gap in px: 0 / 4 / 8 / 12 / 16 / 24 / 32 / 48. Shared with `PrizmGroup`. |
| `setGap`  | `(PrizmGap) → void`                            | Sets the gap (wraps `VBox.setSpacing`). |

Constructors: `PrizmStack()`, `PrizmStack(PrizmGap gap)`,
`PrizmStack(PrizmGap gap, Node... children)`.

Defaults match the web: gap `MD` (16px) and stretch alignment
(`setFillWidth(true)`). For other alignments use the inherited
`setAlignment(Pos)` / `setFillWidth(boolean)`.

## Usage

```java
var stack = new PrizmStack(PrizmGap.MD,
    new PrizmCard("Sortie 04", "Two platforms on task."),
    new PrizmCard("Sortie 05", "Standby."));
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmStack.java` (spacing scale:
`PrizmGap.java`).
