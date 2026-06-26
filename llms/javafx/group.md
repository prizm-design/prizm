---
component: group
slug: group
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmGroup.java
---

# PrizmGroup (JavaFX)

A horizontal grouping of related controls for thick-client (JavaFX) C3
applications — children laid out left-to-right with a gap from the PRIZM
spacing scale, vertically centred. Thin subclass of `javafx.scene.layout.HBox`;
the additions are a PRIZM default gap and the `PrizmGap` convenience. Pure
layout — no painted styling.

In spec parity with the React `Group` (`components/ui/group.tsx`).

## API

| member    | type                                          | notes |
|-----------|-----------------------------------------------|-------|
| `PrizmGap`| `enum { NONE, XXS, XS, SM, MD, LG, XL, XXL }`  | Gap in px: 0 / 4 / 8 / 12 / 16 / 24 / 32 / 48. Shared with `PrizmStack`. |
| `setGap`  | `(PrizmGap) → void`                            | Sets the gap (wraps `HBox.setSpacing`). |

Constructors: `PrizmGroup()`, `PrizmGroup(PrizmGap gap)`,
`PrizmGroup(PrizmGap gap, Node... children)`.

Defaults match the web: gap `XS` (8px) and centre alignment. For other
alignment / justification use the inherited `setAlignment(Pos)`. The web `wrap`
option has no HBox equivalent — use a `FlowPane` if you need wrapping.

## Usage

```java
var actions = new PrizmGroup(PrizmGap.XS,
    new PrizmButton("Save", PrizmButton.Variant.SOLID),
    new PrizmButton("Cancel", PrizmButton.Variant.OUTLINE));
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmGroup.java` (spacing scale:
`PrizmGap.java`).
