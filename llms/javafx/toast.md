---
component: toast
slug: toast
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmToast.java
---

# PrizmToast (JavaFX)

A PRIZM toast — a transient notification — for thick-client (JavaFX) C3
applications. Two pieces: **`PrizmToast`** is one notification card (status dot +
title + message + ✕), styled by the `.prizm-toast` rules in `prizm.css`;
**`PrizmToaster`** manages a bottom-right stack on a host `StackPane` (slide +
fade in, auto-dismiss after 5s). The toaster is the instance-bound equivalent of
the web `toast` singleton + `ToastProvider` (no global state).

In spec parity with the React `Toast` (`components/ui/toast.tsx`). The web uses a
lucide icon per type; JavaFX has no icon library, so a small semantic-coloured
dot stands in.

## API

`PrizmToast`:

| member    | type                                            | notes |
|-----------|-------------------------------------------------|-------|
| `Variant` | `enum { DEFAULT, INFO, SUCCESS, WARNING, ERROR }` | Colours the leading dot. |

`PrizmToaster`:

| member    | type                                                          | notes |
|-----------|---------------------------------------------------------------|-------|
| ctor      | `PrizmToaster(StackPane host)`                                | Bind to a full-size host (e.g. the scene root wrapped in a StackPane). |
| `show`    | `(Variant, String title, String message[, Duration]) → PrizmToast` | Show; auto-dismiss after the timeout (default 5s). |
| `dismiss` | `(PrizmToast) → void`                                          | Dismiss early (also on the toast's ✕). |

## Usage

```java
var rootStack = new StackPane(appRoot);
var toaster = new PrizmToaster(rootStack);
toaster.show(PrizmToast.Variant.SUCCESS, "Task complete", "Patrol leg logged.");
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmToast.java` (manager:
`PrizmToaster.java`). Styling: `javafx/src/main/resources/prizm/prizm.css`.
