package design.prizm.fx.rc3;

/**
 * Shared constants for the RC3 (Robotics &amp; Autonomy) extension pack — the
 * JavaFX counterpart to the {@code components/rc3/} organisms on the web.
 *
 * <p>RC3 organisms layer identity + domain-specific instruments on top of C3
 * without forking the foundations. Activate the pack accent on a Scene with
 * {@code PrizmTheme.apply(scene, mode, PrizmTheme.Pack.RC3)} — that swaps the
 * looked-up {@code -color-accent} tokens to Ember. Organism styling itself lives
 * in {@code prizm/rc3.css}, which is always on the classpath (its rules only
 * match {@code .rc3-*} classes), so an organism renders correctly whether or not
 * the pack accent is active.
 *
 * <p>The signature hue {@link #EMBER} is inlined as a constant here — exactly as
 * the web organisms inline it — so identity marks (the top rule, the signature
 * dot, the active-row marker) render honestly regardless of the activation
 * attribute. Semantic state (danger, success) always uses the theme tokens, not
 * Ember.
 */
public final class Rc3 {

    private Rc3() {}

    /**
     * The RC3 signature colour, "Ember" — {@code oklch(71% 0.195 32)} converted
     * to sRGB. Matches the web constant in {@code components/rc3/*.tsx} and the
     * dark-mode {@code --prizm-rc3-400} accent. Used for identity marks only.
     */
    public static final String EMBER = "#ff684d";
}
