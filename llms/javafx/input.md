---
component: input
slug: input
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmInput.java
---

# PrizmInput (JavaFX)

A PRIZM-styled single-line text input for thick-client (JavaFX) C3 applications. Thin subclass of
`javafx.scene.control.TextField`; styling comes from the `.text-field` rules in `prizm.css`.

In spec parity with the React `Input` (`components/ui/input.tsx`). For obscured entry use a
`PasswordField` equivalent (not in the current slice).

## Usage

```java
var search = new PrizmInput("", "Search platforms…");   // text, promptText
search.setDisable(true);                                // dims via :disabled
```

## Theming

Requires a PRIZM theme on the Scene (`PrizmTheme.apply(...)`). The focus ring and prompt text colour
are driven by the accent and `fg-subtle` tokens; both update live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmInput.java`. Styling: `javafx/src/main/resources/prizm/prizm.css`.
