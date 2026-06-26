---
component: progress
slug: progress
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmProgress.java
---

# PrizmProgress (JavaFX)

A PRIZM determinate progress indicator for thick-client (JavaFX) C3
applications. Thin subclass of the stock `javafx.scene.control.ProgressBar`; the
muted track and accent fill (8px tall) are styled via the `.prizm-progress`
rules in `prizm.css`.

In spec parity with the React `Progress` (`components/ui/progress.tsx`).

## API

| member     | type             | notes |
|------------|------------------|-------|
| `progress` | `DoubleProperty` | `0.0`–`1.0`. `INDETERMINATE_PROGRESS` (-1) renders the animated state. |

Constructors: `PrizmProgress()`, `PrizmProgress(double progress)`.

## Usage

```java
var bar = new PrizmProgress(0.6);          // 60%
bar.setProgress(ProgressBar.INDETERMINATE_PROGRESS); // busy
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmProgress.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
