---
component: alert
slug: alert
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmAlert.java
---

# PrizmAlert (JavaFX)

A PRIZM inline message block for thick-client (JavaFX) C3 applications — an
optional icon, a title, and a description, in one of five status variants. No
stock JavaFX control maps to this, so it's a composite over
`javafx.scene.layout.HBox` (like `PrizmCard`), styled by the `.prizm-alert`
rules in `prizm.css`.

In spec parity with the React `Alert` (`components/ui/alert.tsx` — `Alert` +
`AlertTitle` + `AlertDescription`).

## API

| member       | type                                              | notes |
|--------------|---------------------------------------------------|-------|
| `Variant`    | `enum { DEFAULT, INFO, SUCCESS, WARNING, DANGER }` | Sets the border + title colour. Default `DEFAULT`. |
| `setVariant` | `(Variant) → void`                                 | Swap the variant. |
| `setTitle`   | `(String) → void`                                  | Title (hidden if empty). |
| `setBody`    | `(String) → void`                                  | Description (hidden if empty). |
| `setIcon`    | `(Node) → void`                                    | Optional leading icon; colour it yourself. `null` removes it. |

Constructors: `PrizmAlert()`,
`PrizmAlert(Variant variant, String titleText, String bodyText)`.

## Styling note

Each variant tints the **background + border** and colours the **whole text**,
mirroring the web. JavaFX CSS can't alpha-mix a looked-up colour, so the tints
are precomputed — the status colour composited over the theme background at the
web's 10% (fill) / 30% (border) alphas — and emitted as
`-color-<status>-subtle` / `-color-<status>-border` tokens by the theme
generator (`scripts/generate-javafx-theme.ts`).

## Usage

```java
var alert = new PrizmAlert(PrizmAlert.Variant.WARNING,
    "Low battery", "UAV-11 at 18% — RTB advised.");
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmAlert.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
