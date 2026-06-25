package design.prizm.fx.controls;

import javafx.scene.control.Skin;
import javafx.scene.control.Slider;

/**
 * A PRIZM-styled slider. Subclass of {@link Slider} with a custom skin that
 * adds the accent fill before the thumb (JavaFX has no stock filled track);
 * the rest of the styling is in the {@code .slider} rules in {@code prizm.css}.
 * Mirrors the React {@code Slider} ({@code components/ui/slider.tsx}).
 */
public class PrizmSlider extends Slider {

    public PrizmSlider() {
        super();
    }

    public PrizmSlider(double min, double max, double value) {
        super(min, max, value);
    }

    @Override
    protected Skin<?> createDefaultSkin() {
        return new PrizmSliderSkin(this);
    }
}
