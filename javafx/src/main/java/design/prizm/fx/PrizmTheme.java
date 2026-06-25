package design.prizm.fx;

import java.io.IOException;
import javafx.scene.Scene;
import javafx.scene.text.Font;

/**
 * Applies a PRIZM theme to a JavaFX {@link Scene}.
 *
 * <p>A theme is three stylesheets layered in order: the generated colour-token
 * sheet ({@code prizm/themes/c3-<mode>.css}), an optional extension-pack
 * overlay ({@code prizm/themes/rc3-<mode>.css}) whose accent tokens win, and
 * the hand-authored control stylesheet ({@code prizm/prizm.css}) that consumes
 * the tokens. Switching theme is just calling {@code apply} again with
 * different arguments — every styled control re-reads its looked-up colours
 * live, no rebuild of the scene graph required.
 *
 * <p>Scope is C3 and its extension packs; Enterprise is not shipped for JavaFX.
 */
public final class PrizmTheme {

    /** Light or dark mode. Dark is the operator-canonical default for C3. */
    public enum Mode {
        LIGHT,
        DARK
    }

    /** Extension-pack overlay. {@code NONE} is plain C3. */
    public enum Pack {
        NONE,
        RC3
    }

    private PrizmTheme() {}

    // Bundled fonts, registered on first use so "Inter" / "JetBrains Mono"
    // resolve in the stylesheets. Static Inter weights (variable-font support in
    // JavaFX is weak) + the JetBrains Mono variable. Missing files no-op, so a
    // control simply falls back to the system family rather than failing.
    private static final String[] BUNDLED_FONTS = {
        "/prizm/fonts/Inter-Regular.ttf",
        "/prizm/fonts/Inter-Medium.ttf",
        "/prizm/fonts/Inter-SemiBold.ttf",
        "/prizm/fonts/Inter-Bold.ttf",
        "/prizm/fonts/JetBrainsMono-VariableFont_wght.ttf",
    };

    static {
        for (var path : BUNDLED_FONTS) {
            try (var in = PrizmTheme.class.getResourceAsStream(path)) {
                if (in != null) {
                    Font.loadFont(in, 12);
                }
            } catch (IOException ignored) {
                // Unreadable font file — fall back to the system family.
            }
        }
    }

    private static String url(String resource) {
        var found = PrizmTheme.class.getResource(resource);
        if (found == null) {
            throw new IllegalStateException("PRIZM stylesheet not found on classpath: " + resource);
        }
        return found.toExternalForm();
    }

    /** Apply C3 in the given mode with no pack overlay. */
    public static void apply(Scene scene, Mode mode) {
        apply(scene, mode, Pack.NONE);
    }

    /**
     * Apply C3 in the given mode, optionally overlaying an extension pack.
     * The pack overlay is added after the base theme so its accent overrides
     * take precedence; the control stylesheet is added last.
     */
    public static void apply(Scene scene, Mode mode, Pack pack) {
        var sheets = scene.getStylesheets();
        sheets.clear();
        var m = mode == Mode.DARK ? "dark" : "light";
        sheets.add(url("/prizm/themes/c3-" + m + ".css"));
        if (pack == Pack.RC3) {
            sheets.add(url("/prizm/themes/rc3-" + m + ".css"));
        }
        sheets.add(url("/prizm/prizm.css"));
    }
}
