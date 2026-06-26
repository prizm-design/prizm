---
component: table
slug: table
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmTable.java
---

# PrizmTable (JavaFX)

A PRIZM-styled data table for thick-client (JavaFX) C3 applications. Thin
generic subclass of the stock `javafx.scene.control.TableView<T>`; the header,
1px row separators, muted hover, and selection are restyled via the
`.prizm-table` rules in `prizm.css`.

In visual parity with the React `Table` (`components/ui/table.tsx`).

## Paradigm note

The web `Table` is **compositional** — you hand-write `TableRow` / `TableCell`
markup. JavaFX is **data-driven** — set `items` (an `ObservableList<T>`) and add
`TableColumn`s with cell-value factories. `PrizmTable` follows the JavaFX model
(the idiomatic thick-client table), so the API differs from the web by design;
only the visual styling is in parity.

## API

| member    | type                              | notes |
|-----------|-----------------------------------|-------|
| `items`   | `ObservableList<T>`               | Row data — `setItems` / `getItems().addAll(...)`. |
| `columns` | `ObservableList<TableColumn<T,?>>`| Add columns with cell-value factories via `getColumns()`. |

Constructors: `PrizmTable()`, `PrizmTable(ObservableList<T> items)`.

## Usage

```java
record Platform(String id, String cls, String status) {}

var table = new PrizmTable<Platform>();
table.getItems().addAll(new Platform("UGV-04", "Ground", "Patrol"));

var id = new TableColumn<Platform, String>("Platform");
id.setCellValueFactory(c -> new ReadOnlyStringWrapper(c.getValue().id()));
table.getColumns().add(id);
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmTable.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
