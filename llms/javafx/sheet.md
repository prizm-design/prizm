---
component: sheet
slug: sheet
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmSheet.java
---

# PrizmSheet (JavaFX)

A PRIZM sheet — an edge-anchored sliding panel that opens from any side — for
thick-client (JavaFX) C3 applications. No stock JavaFX control maps to this, so
it's a controller that overlays a host `StackPane`: a scrim plus a panel that
slides in from the chosen `Side` (200ms). Styled by the `.prizm-sheet` /
`.prizm-sheet-scrim` rules in `prizm.css`.

In spec parity with the React `Sheet` (`components/ui/sheet.tsx`).

## API

| member       | type                    | notes |
|--------------|-------------------------|-------|
| `setContent` | `(Node) → void`         | The panel body — compose it yourself. |
| `setSize`    | `(double) → void`       | Panel width (LEFT/RIGHT) or height (TOP/BOTTOM). Default 360 / 280. |
| `show`       | `(StackPane host) → void` | Overlay on a full-size host and slide in. |
| `hide`       | `() → void`             | Slide out and remove (also on scrim click). |
| `getPanel`   | `() → StackPane`        | The panel, for further styling. |

Constructors: `PrizmSheet(Side side)`, `PrizmSheet(Side side, Node content)`.

## Host requirement

`show(host)` needs a **full-size `StackPane`** to overlay — wrap your scene root
in one:

```java
var rootStack = new StackPane(appRoot);
scene = new Scene(rootStack);
```

## Usage

```java
var sheet = new PrizmSheet(Side.RIGHT);
var close = new PrizmButton("Close", PrizmButton.Variant.OUTLINE);
close.setOnAction(e -> sheet.hide());
sheet.setContent(new VBox(12, titleLabel, bodyLabel, close));
sheet.show(rootStack);
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmSheet.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
