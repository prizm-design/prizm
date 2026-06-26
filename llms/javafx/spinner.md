---
component: spinner
slug: spinner
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmSpinner.java
---

# PrizmSpinner (JavaFX)

A PRIZM indeterminate loading indicator for thick-client (JavaFX) C3
applications — a muted track ring with a rotating 90° arc. A custom
`javafx.scene.layout.Region` (the stock `ProgressIndicator` renders its
indeterminate state as spinning segments, which don't match the web spinner),
styled by the `.prizm-spinner` rules in `prizm.css`.

In spec parity with the React `Spinner` (`components/ui/spinner.tsx`).

## API

| member    | type                       | notes |
|-----------|----------------------------|-------|
| `Size`    | `enum { SM, MD, LG, XL }`   | Diameter in px: 12 / 16 / 24 / 40. Default `MD`. |
| `setSize` | `(Size) → void`             | Set the diameter from the scale. |

Constructors: `PrizmSpinner()`, `PrizmSpinner(Size size)`.

## Usage

```java
var loading = new PrizmSpinner(PrizmSpinner.Size.LG);
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmSpinner.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
