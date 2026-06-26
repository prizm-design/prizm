---
component: command
slug: command
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmCommand.java
---

# PrizmCommand (JavaFX)

An inline command palette, shown as-is rather than behind a trigger (matching the
web example): a `VBox` with a search row, a scrollable list of grouped two-line
items (icon box + title + subtitle), and a footer with keyboard hints and a live
result count. Items filter live by title, subtitle, and keywords; Up/Down move the
active row and Enter runs it. Add sections with `addGroup(heading)`, then entries
with `Group.add(icon, title, subtitle, keywords, action)`; `PrizmCommand.icon(svg)`
builds a stroked lucide glyph in the standard icon box.

In spec parity with the React `Command` (`components/ui/command.tsx`). The full
Java API (constructors, enums, methods) is in `lib/javafx-api.ts` under the
`command` key and on the components page at `/components/command`.

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmCommand.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
