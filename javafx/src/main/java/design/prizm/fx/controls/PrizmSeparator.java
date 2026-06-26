package design.prizm.fx.controls;

import javafx.geometry.Orientation;
import javafx.scene.control.Separator;

/**
 * A PRIZM-styled divider line. Thin subclass of the stock JavaFX
 * {@link Separator}; styling comes from the {@code .prizm-separator} rules in
 * {@code prizm.css} (a 1px {@code -color-border} line, no extra padding).
 * Mirrors the React {@code Separator} ({@code components/ui/separator.tsx}).
 */
public class PrizmSeparator extends Separator {

    public PrizmSeparator() {
        super();
        getStyleClass().add("prizm-separator");
    }

    public PrizmSeparator(Orientation orientation) {
        super(orientation);
        getStyleClass().add("prizm-separator");
    }
}
