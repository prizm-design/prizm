package design.prizm.fx.controls;

import javafx.scene.control.Label;

/**
 * A PRIZM badge — a small status indicator or label, as a rounded pill. Thin
 * subclass of {@link Label} (so it can carry text and an optional graphic),
 * styled by the {@code .prizm-badge} rules in {@code prizm.css}. Mirrors the
 * React {@code Badge} ({@code components/ui/badge.tsx}).
 */
public class PrizmBadge extends Label {

    public enum Variant {
        SOLID,
        OUTLINE,
        SUBTLE,
        SUCCESS,
        WARNING,
        DANGER,
        INFO
    }

    private Variant variant = Variant.SUBTLE;

    public PrizmBadge() {
        init();
    }

    public PrizmBadge(String text) {
        super(text);
        init();
    }

    public PrizmBadge(String text, Variant variant) {
        super(text);
        init();
        setVariant(variant);
    }

    private void init() {
        getStyleClass().add("prizm-badge");
        applyVariant();
    }

    public void setVariant(Variant variant) {
        this.variant = variant == null ? Variant.SUBTLE : variant;
        applyVariant();
    }

    private void applyVariant() {
        getStyleClass().removeAll(
            "prizm-badge--solid",
            "prizm-badge--outline",
            "prizm-badge--subtle",
            "prizm-badge--success",
            "prizm-badge--warning",
            "prizm-badge--danger",
            "prizm-badge--info");
        getStyleClass().add("prizm-badge--" + variant.name().toLowerCase());
    }
}
