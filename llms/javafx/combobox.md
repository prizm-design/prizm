---
component: combobox
slug: combobox
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmCombobox.java
---

# PrizmCombobox (JavaFX)

A searchable select with typeahead — a custom control (not the stock editable
ComboBox, whose arrow-keys mutate the value). A search field filters a popup
list; the single highlight follows keyboard AND hover, while the check marks
only the committed value and never moves during navigation (Enter / click
commits). Add options via `getSourceItems()`. The non-editable picker is PrizmSelect.

In spec parity with the React `Combobox` (`components/ui/combobox.tsx`). The full
Java API (constructors, enums, methods) is in `lib/javafx-api.ts` under the
`combobox` key and on the components page at `/components/combobox`.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmCombobox.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
