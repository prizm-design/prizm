---
component: dialog
slug: dialog
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmDialog.java
---

# PrizmDialog (JavaFX)

A PRIZM modal dialog for focused tasks in thick-client (JavaFX) C3 applications.
Rather than a separate OS window (whose native chrome and square bounds fight a
rounded card), it's an **in-scene overlay controller** — like `PrizmSheet` /
`PrizmCommand`: a scrim plus a centred card (title, close ✕, body, footer
buttons), styled by the `.prizm-dialog` / `.prizm-dialog-scrim` rules in
`prizm.css`.

In spec parity with the React `Dialog` (`components/ui/dialog.tsx`).

## Showing a dialog

Call `show(host)` with a full-size host `StackPane` (e.g. the scene root wrapped
in a StackPane — the same host the Sheet / Command / Toast overlays use). Because
it lives in the scene, it **inherits the scene theme** — no separate
`PrizmTheme.apply` needed. The scrim, a top-right ✕, `Esc`, and any action button
all dismiss it.

## API

| member       | type                                                              | notes |
|--------------|-------------------------------------------------------------------|-------|
| `setTitle`   | `(String) → void`                                                 | The in-card title. |
| `setBody`    | `(String) → void`                                                 | Body message text. |
| `setBody`    | `(Node) → void`                                                   | Body as an arbitrary node. |
| `addAction`  | `(String, PrizmButton.Variant, Runnable) → PrizmButton`           | Footer button; action runs after dismiss (null just closes). |
| `show / hide`| `(StackPane host) → void` / `() → void`                           | Overlay on / remove from the host. |

Constructors: `PrizmDialog()`, `PrizmDialog(String title, String message)`.

## Usage

```java
var dialog = new PrizmDialog("Remove UGV-04 from the task?",
    "This unassigns the platform from Sortie 04.");
dialog.addAction("Cancel", PrizmButton.Variant.OUTLINE, null);
dialog.addAction("OK", PrizmButton.Variant.SOLID, () -> removePlatform());
dialog.show(rootStack);
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmDialog.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
