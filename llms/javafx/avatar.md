---
component: avatar
slug: avatar
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/controls/PrizmAvatar.java
---

# PrizmAvatar (JavaFX)

A PRIZM avatar — a circular image with an initials fallback — for thick-client
(JavaFX) C3 applications. No stock JavaFX control maps to this, so it's a
composite over `javafx.scene.layout.StackPane` (like `PrizmCard`): a muted
circular background with a fallback label and an optional clipped image. Styled
by the `.prizm-avatar` rules in `prizm.css`.

In spec parity with the React `Avatar` (`components/ui/avatar.tsx` — `Avatar` +
`AvatarImage` + `AvatarFallback`).

## API

| member        | type             | notes |
|---------------|------------------|-------|
| `Size`        | `enum { SM, MD, LG, XL }` | Diameter in px: 24 / 32 / 40 / 56. Default `MD`. |
| `setInitials` | `(String) → void`| Fallback text shown when there's no image. |
| `setImage`    | `(Image) → void` | Image clipped to the circle, over the fallback. `null` clears it. |
| `setSize`     | `(Size) → void`  | Set the diameter from the scale. |

Constructors: `PrizmAvatar()`, `PrizmAvatar(Size size)`,
`PrizmAvatar(String initials, Size size)`.

## Usage

```java
var watchOfficer = new PrizmAvatar("AL", PrizmAvatar.Size.LG);
watchOfficer.setImage(new Image("file:operator.png")); // optional
```

## Source

`javafx/src/main/java/design/prizm/fx/controls/PrizmAvatar.java`. Styling:
`javafx/src/main/resources/prizm/prizm.css`.
