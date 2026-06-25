# PRIZM JavaFX

A parallel JavaFX library for PRIZM, for building **thick-client** operator
applications. Scope is **C3 and its capability packs** (RC3 today) — Enterprise
is web-only and not shipped here.

The design language is shared with the React library, not the code: the colour
tokens are *derived* from the canonical CSS (`styles/tokens/*.css`) and the
components are idiomatic JavaFX implemented to the same `lib/components-api.ts`
spec.

## Layout

```
javafx/
├── build.gradle.kts                       Gradle module (OpenJFX 21, Java 21)
├── settings.gradle.kts
└── src/main/
    ├── java/design/prizm/fx/
    │   └── PrizmTheme.java                 applies/swaps a theme on a Scene
    └── resources/prizm/
        ├── prizm.css                       base control styling (hand-authored)
        └── themes/                         GENERATED — do not edit by hand
            ├── c3-light.css   c3-dark.css      full colour-token themes
            └── rc3-light.css  rc3-dark.css     RC3 pack accent overlays
```

## Themes

The `themes/*.css` files are generated from the repo's canonical token CSS.
Regenerate (from the repo root) after any token change:

```
pnpm generate:javafx-theme
```

Apply a theme to a Scene, and switch it live:

```java
PrizmTheme.apply(scene, PrizmTheme.Mode.DARK);                       // C3 dark
PrizmTheme.apply(scene, PrizmTheme.Mode.DARK, PrizmTheme.Pack.RC3);  // + Ember
```

## Build & run

Requires a **JDK 21** that Gradle can detect. On macOS the simplest is
`brew install --cask temurin@21` (it lands where Gradle auto-detects it).

```
gradle run        # launch the component gallery (showcase of every control)
gradle build      # compile the library
```

The **gallery** (`design.prizm.fx.gallery.PrizmGallery`) is the visual reference
for the library, since the docs site can't render JavaFX — it shows every
JavaFX-ready control in all variants/states, with live theme + pack toggles.
Add a section to its registry as each control ships.

**Air-gap:** OpenJFX is fetched from Maven Central at build time. In a
disconnected build, point `repositories` in `build.gradle.kts` at the internal
Maven mirror. The runtime is bundled into the native app by jpackage; signing /
notarisation and artefact hosting are deferred to the release team.

## Native packaging (jpackage)

jpackage is provided by the badass-runtime plugin, which (like the Foojay
resolver) doesn't support the very newest Gradle. Pin Gradle to a known-good
version via the wrapper first, then add the plugin back:

```
gradle wrapper --gradle-version 8.10.2   # one-time, using your system Gradle
```

Then re-add to `build.gradle.kts`: `id("org.beryx.runtime") version "1.13.1"` in
`plugins {}`, plus the `runtime { ... jpackage { ... } }` block, and run
`./gradlew jpackage` (→ `build/jpackage/`). Using the wrapper (`./gradlew`)
pins the compatible Gradle so the plugin loads.

## Status

Vertical slice built — token pipeline, theme loader (`PrizmTheme`), base
stylesheet, `PrizmButton` / `PrizmInput` / `PrizmCard`, and the runnable
gallery. Verified rendering on JDK 21 (Temurin). Next: more controls, a C3
thick-client shell, and font bundling (Inter) for full typographic parity.
