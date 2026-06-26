---
component: badge
slug: badge
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmBadge.java
---

# PrizmBadge (JavaFX)

A PRIZM badge — a small status indicator or label, as a rounded pill — for
thick-client (JavaFX) C3 applications. Thin subclass of
`javafx.scene.control.Label` (so it carries text and an optional graphic), styled
by the `.prizm-badge` rules in `prizm.css`.

In spec parity with the React `Badge` (`components/ui/badge.tsx`).

## API

| member       | type                                                          | notes |
|--------------|---------------------------------------------------------------|-------|
| `Variant`    | `enum { SOLID, OUTLINE, SUBTLE, SUCCESS, WARNING, DANGER, INFO }` | Pill style. Default `SUBTLE`. Status variants reuse the composited `-color-<status>-subtle` tints. |
| `setVariant` | `(Variant) → void`                                             | Swap the variant. |

Constructors: `PrizmBadge()`, `PrizmBadge(String text)`,
`PrizmBadge(String text, Variant variant)`.

## Usage

```java
var online = new PrizmBadge("Online", PrizmBadge.Variant.SUCCESS);
var count = new PrizmBadge("3", PrizmBadge.Variant.SOLID);
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmBadge.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
