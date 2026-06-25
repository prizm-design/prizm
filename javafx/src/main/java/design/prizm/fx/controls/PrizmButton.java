package design.prizm.fx.controls;

import javafx.scene.control.Button;

/**
 * A PRIZM-styled button. Thin subclass of the stock JavaFX {@link Button}:
 * behaviour and accessibility are inherited; PRIZM contributes a typed
 * variant/size API that maps to style classes consumed by {@code prizm.css}.
 *
 * <p>Variants and sizes mirror the React {@code Button} ({@code components/ui/button.tsx})
 * so the two libraries stay in spec parity.
 */
public class PrizmButton extends Button {

    /** Visual style. Mirrors the React Button variants; {@code SOLID} is the default. */
    public enum Variant {
        SOLID,
        OUTLINE,
        GHOST,
        SUBTLE,
        DANGER,
        LINK
    }

    /** Control size. {@code MD} is the default; {@code ICON} is a square 36×36. */
    public enum Size {
        SM,
        MD,
        LG,
        ICON
    }

    private static final String[] VARIANT_CLASSES = {"solid", "outline", "ghost", "subtle", "danger", "link"};
    private static final String[] SIZE_CLASSES = {"sm", "md", "lg", "icon"};

    private Variant variant = Variant.SOLID;
    private Size size = Size.MD;

    public PrizmButton() {
        this("");
    }

    public PrizmButton(String text) {
        super(text);
        applyVariant();
        applySize();
    }

    public PrizmButton(String text, Variant variant) {
        super(text);
        this.variant = variant;
        applyVariant();
        applySize();
    }

    public Variant getVariant() {
        return variant;
    }

    public void setVariant(Variant variant) {
        this.variant = variant;
        applyVariant();
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
        applySize();
    }

    private void applyVariant() {
        getStyleClass().removeAll(VARIANT_CLASSES);
        getStyleClass().add(variant.name().toLowerCase());
    }

    private void applySize() {
        getStyleClass().removeAll(SIZE_CLASSES);
        getStyleClass().add(size.name().toLowerCase());
    }
}
