---
component: calendar
slug: calendar
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmCalendar.java
---

# PrizmCalendar (JavaFX)

A month grid with selection (custom VBox: header nav + day-name row + 7-column day cells; today outlined, selected filled). JavaFX has no standalone month grid. setOnSelect for the callback.

In spec parity with the React `Calendar` (`components/ui/calendar.tsx`). The full
Java API (constructors, enums, methods) is in `lib/javafx-api.ts` under the
`calendar` key and on the components page at `/components/calendar`.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmCalendar.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
