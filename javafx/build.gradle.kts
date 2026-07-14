plugins {
    java
    application
    // Resolves the OpenJFX modules and wires them onto the module path.
    id("org.openjfx.javafxplugin") version "0.1.0"
}

group = "design.prizm"
version = "4.0.0-alpha.1"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    // Air-gap note: OpenJFX is fetched from here at build time. In a
    // disconnected build, point this at the internal Maven mirror instead.
    mavenCentral()
}

javafx {
    version = "21.0.4"
    modules = listOf("javafx.controls")
}

application {
    // The runnable gallery — `gradle run` launches it from source.
    mainClass = "design.prizm.fx.gallery.PrizmGallery"
}

// Native packaging (jpackage) is added via the badass-runtime plugin — but that
// plugin (like the Foojay resolver) doesn't support the very newest Gradle, so
// it's wired up only after Gradle is pinned to a known-good version through the
// wrapper. See README "Native packaging" for the two-step setup.

// Launch the App Shell template directly (`gradle runShell`). The javafx
// plugin only wires the OpenJFX module path onto the `run` task, so borrow
// its jvmArgs here rather than re-deriving the module path.
tasks.register<JavaExec>("runShell") {
    group = "application"
    description = "Launch the C3 App Shell template directly."
    mainClass = "design.prizm.fx.templates.PrizmAppShellApp"
    classpath = sourceSets["main"].runtimeClasspath
    doFirst {
        jvmArgs = tasks.named<JavaExec>("run").get().jvmArgs
    }
}
