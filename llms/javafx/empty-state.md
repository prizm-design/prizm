---
component: empty-state
slug: empty-state
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmEmptyState.java
---

# PrizmEmptyState (JavaFX)

A PRIZM placeholder for an empty content region in thick-client (JavaFX) C3
applications — an optional icon in a muted circle, a title, an optional
description, and an optional action, centred. No stock JavaFX control maps to
this, so it's a composite over `javafx.scene.layout.VBox` (like `PrizmCard`),
styled by the `.prizm-empty-state` rules in `prizm.css`.

In spec parity with the React `EmptyState` (`components/ui/empty-state.tsx`).

## API

| member           | type             | notes |
|------------------|------------------|-------|
| `setTitle`       | `(String) → void`| The title. |
| `setDescription` | `(String) → void`| Optional supporting text; `null` or `""` hides it. |
| `setIcon`        | `(Node) → void`  | Optional icon shown in a muted circle; `null` removes it. |
| `setAction`      | `(Node) → void`  | Optional action below the text (e.g. a `PrizmButton`); `null` removes it. |

Constructors: `PrizmEmptyState()`, `PrizmEmptyState(String titleText)`.

## Usage

```java
var empty = new PrizmEmptyState("No active tasks");
empty.setDescription("Tasks assigned to this watch will appear here.");
empty.setAction(new PrizmButton("Assign task", PrizmButton.Variant.SOLID));
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmEmptyState.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
