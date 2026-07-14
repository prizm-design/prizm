---
component: slider
slug: slider
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmSlider.java
---

# PrizmSlider (JavaFX)

A PRIZM-styled slider — drag a thumb along a track to pick a value in a range —
for thick-client (JavaFX) C3 applications. A thin subclass of
`javafx.scene.control.Slider`; a custom skin (`PrizmSliderSkin`) adds the accent
fill from the track start to the thumb, since JavaFX has no stock filled track.
Styled by the `.slider` rules in `prizm.css`. In spec parity with the React
`Slider` (`components/ui/slider.tsx`).

## API

| member      | type             | notes |
|-------------|------------------|-------|
| `value`     | `DoubleProperty` | Current value. |
| `min / max` | `DoubleProperty` | Range bounds. |
| `disabled`  | `BooleanProperty`| Inherited from `Node`; dims the track via `:disabled`. |

Constructors: `PrizmSlider()`, `PrizmSlider(double min, double max, double value)`.

## Usage

```java
var zoom = new PrizmSlider(0, 100, 40);
zoom.valueProperty().addListener((obs, was, now) -> setZoom(now.doubleValue()));

// snap to whole steps
zoom.setMajorTickUnit(10);
zoom.setSnapToTicks(true);
```

## Accessibility

Uses the stock `Slider` role and keyboard model — arrow keys nudge the value,
Home / End jump to the bounds. Matches the web `Slider` semantics.

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the muted track, accent fill,
and accent-ringed thumb re-read their colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmSlider.java` (skin:
`PrizmSliderSkin.java`). Styling:
`javafx/src/main/resources/prizm/prizm.css`.
