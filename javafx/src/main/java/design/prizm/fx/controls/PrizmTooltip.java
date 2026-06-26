package design.prizm.fx.controls;

import javafx.scene.control.Tooltip;
import javafx.util.Duration;

/**
 * A PRIZM tooltip — a hover label for compact UI elements. Thin subclass of the
 * stock {@link Tooltip}, styled by the {@code .prizm-tooltip} rules in
 * {@code prizm.css} (surface-elevated background, hairline border). Install on a
 * control with {@code control.setTooltip(...)} or {@link Tooltip#install}.
 *
 * <p>The web {@code glass} variant is not ported — liquid glass is a web-only
 * surface treatment (excluded from the JavaFX themes). Mirrors the React
 * {@code Tooltip} ({@code components/ui/tooltip.tsx}).
 */
public class PrizmTooltip extends Tooltip {

    public PrizmTooltip() {
        init();
    }

    public PrizmTooltip(String text) {
        super(text);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-tooltip");
        setShowDelay(Duration.millis(400));
    }
}
