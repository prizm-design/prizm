package design.prizm.fx.controls;

import javafx.scene.control.Label;

/**
 * A PRIZM body-text label. Thin subclass of {@link Label} with size / tone /
 * weight presets, styled by the {@code .prizm-text} rules in {@code prizm.css}.
 * Mirrors the React {@code Text} ({@code components/ui/text.tsx}).
 */
public class PrizmText extends Label {

    public enum Size {
        XS,
        SM,
        MD,
        LG
    }

    public enum Tone {
        DEFAULT,
        MUTED,
        SUBTLE
    }

    public enum Weight {
        NORMAL,
        MEDIUM,
        SEMIBOLD
    }

    private Size size = Size.MD;
    private Tone tone = Tone.DEFAULT;
    private Weight weight = Weight.NORMAL;

    public PrizmText() {
        init();
    }

    public PrizmText(String text) {
        super(text);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-text");
        setWrapText(true);
        apply();
    }

    public PrizmText setSize(Size size) {
        this.size = size == null ? Size.MD : size;
        apply();
        return this;
    }

    public PrizmText setTone(Tone tone) {
        this.tone = tone == null ? Tone.DEFAULT : tone;
        apply();
        return this;
    }

    public PrizmText setWeight(Weight weight) {
        this.weight = weight == null ? Weight.NORMAL : weight;
        apply();
        return this;
    }

    private void apply() {
        getStyleClass().removeIf(c -> c.startsWith("prizm-text--"));
        getStyleClass().add("prizm-text--size-" + size.name().toLowerCase());
        getStyleClass().add("prizm-text--tone-" + tone.name().toLowerCase());
        getStyleClass().add("prizm-text--w-" + weight.name().toLowerCase());
    }
}
