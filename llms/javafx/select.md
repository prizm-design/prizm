---
component: select
slug: select
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmSelect.java
---

# PrizmSelect (JavaFX)

A PRIZM-styled select — a trigger that opens a popup list of options — for
thick-client (JavaFX) C3 applications. A thin subclass of
`javafx.scene.control.ComboBox<T>`; the trigger and popup are styled by the
`.combo-box` / `.combo-box-popup` rules in `prizm.css`. In spec parity with the
React `Select` (`components/ui/select.tsx`).

> Not to be confused with `PrizmCombobox`, the searchable/filterable control.
> `PrizmSelect` is the plain pick-from-a-list control (a styled `ComboBox`).

## API

| member  | type                  | notes |
|---------|-----------------------|-------|
| `items` | `ObservableList<T>`   | The options — add via `getItems().addAll(...)`. |
| `value` | `ObjectProperty<T>`   | The selected item. |
| `promptText` | `StringProperty` | Placeholder shown when nothing is selected (inherited from `ComboBox`). |

Constructors: `PrizmSelect()`, `PrizmSelect(ObservableList<T> items)`.

## Usage

```java
var priority = new PrizmSelect<String>();
priority.getItems().addAll("Routine", "Priority", "Immediate", "Flash");
priority.setPromptText("Precedence…");
priority.valueProperty().addListener((obs, was, now) -> applyPrecedence(now));
```

## Accessibility

Uses the stock `ComboBox` role and keyboard model — the popup opens on SPACE /
ENTER / arrow, and type-ahead selects. Matches the web `Select` semantics.

## Theming

Requires a PRIZM theme on the Scene. Apply with
`PrizmTheme.apply(scene, PrizmTheme.Mode.DARK)`; the trigger, popup surface, and
the selected-item accent check re-read their colours live on theme swap. (Note
the known limitation: the popup cell's native focus ring could not be removed
via CSS — see the JavaFX notes in `AI_HANDOFF.md`.)

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmSelect.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
