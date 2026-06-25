package design.prizm.fx.controls;

import javafx.scene.control.Label;

/**
 * A PRIZM-styled form label. Thin subclass of {@link Label} carrying the
 * {@code prizm-label} style class (medium weight, foreground colour) so it
 * reads as a field label rather than body text. Mirrors the React {@code Label}
 * ({@code components/ui/label.tsx}).
 */
public class PrizmLabel extends Label {

    public PrizmLabel() {
        super();
        getStyleClass().add("prizm-label");
    }

    public PrizmLabel(String text) {
        super(text);
        getStyleClass().add("prizm-label");
    }
}
