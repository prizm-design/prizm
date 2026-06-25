---
component: card
slug: card
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmCard.java
---

# PrizmCard (JavaFX)

A PRIZM surface card for thick-client (JavaFX) C3 applications. No stock JavaFX control maps 1:1, so
this is a small composite over `javafx.scene.layout.VBox`: a styled surface with an optional title
and body, plus a slot for arbitrary content.

Mirrors the React `Card` + `CardTitle` + `CardDescription` (`components/ui/card.tsx`).

## Usage

```java
var card = new PrizmCard("Mission", "Sortie 04 — nominal.");
card.addContent(someButton, someField);   // appended below title + body
```

## API

- `setTitle(String)` / `setBody(String)` — set the title and body text.
- `titleLabel()` / `bodyLabel()` — the underlying `Label`s, for further styling.
- `addContent(Node...)` — append arbitrary content.

## Theming

Requires a PRIZM theme on the Scene (`PrizmTheme.apply(...)`). Surface, border, and text colours come
from the tokens and update live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmCard.java`. Styling: `javafx/src/main/resources/prizm/prizm.css`.
