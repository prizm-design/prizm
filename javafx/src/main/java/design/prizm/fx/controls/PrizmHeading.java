package design.prizm.fx.controls;

import javafx.scene.control.Label;

/**
 * A PRIZM heading. Thin subclass of {@link Label} with a semibold, tight type
 * scale, styled by the {@code .prizm-heading} rules in {@code prizm.css}.
 * Mirrors the React {@code Heading} ({@code components/ui/heading.tsx}).
 *
 * <p>JavaFX has no semantic heading tags, so only the visual {@link Size}
 * applies (px: XL4 36, XL3 30, XL2 24, XL 20, LG 18, MD 16; default XL2).
 */
public class PrizmHeading extends Label {

    public enum Size {
        XL4,
        XL3,
        XL2,
        XL,
        LG,
        MD
    }

    private Size size = Size.XL2;

    public PrizmHeading() {
        init();
    }

    public PrizmHeading(String text) {
        super(text);
        init();
    }

    public PrizmHeading(String text, Size size) {
        super(text);
        init();
        setSize(size);
    }

    private void init() {
        getStyleClass().add("prizm-heading");
        setWrapText(true);
        applySize();
    }

    public void setSize(Size size) {
        this.size = size == null ? Size.XL2 : size;
        applySize();
    }

    private void applySize() {
        getStyleClass().removeIf(c -> c.startsWith("prizm-heading--"));
        getStyleClass().add("prizm-heading--" + size.name().toLowerCase());
    }
}
