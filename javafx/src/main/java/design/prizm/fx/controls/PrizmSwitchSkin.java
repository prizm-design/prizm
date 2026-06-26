package design.prizm.fx.controls;

import javafx.animation.TranslateTransition;
import javafx.scene.control.ToggleButton;
import javafx.scene.control.skin.ToggleButtonSkin;
import javafx.scene.layout.Region;
import javafx.util.Duration;

/**
 * Skin for {@link PrizmSwitch}: a sliding thumb over the track the control
 * paints from CSS. Extends {@link ToggleButtonSkin} so all toggle behaviour
 * (mouse, SPACE key, accessibility) is inherited; this only adds and animates
 * the thumb (mirrors the way {@code PrizmSliderSkin} adds the accent fill).
 *
 * <p>The thumb is a {@code .prizm-switch__thumb} {@link Region} so it themes via
 * {@code prizm.css}. It sits 2px inside the track and slides {@code 34 - 16 - 2*2
 * = 14px} when selected.
 */
public class PrizmSwitchSkin extends ToggleButtonSkin {

    private static final double TRACK_W = 34;
    private static final double THUMB = 16;
    private static final double INSET = 2;
    private static final double TRAVEL = TRACK_W - THUMB - 2 * INSET; // 14

    private final Region thumb = new Region();

    public PrizmSwitchSkin(ToggleButton control) {
        super(control);
        thumb.getStyleClass().add("prizm-switch__thumb");
        thumb.setMouseTransparent(true);
        getChildren().add(thumb);
        thumb.setTranslateX(control.isSelected() ? TRAVEL : 0);
        control.selectedProperty().addListener((obs, was, now) -> animate(now));
    }

    private void animate(boolean selected) {
        var slide = new TranslateTransition(Duration.millis(150), thumb);
        slide.setToX(selected ? TRAVEL : 0);
        slide.play();
    }

    @Override
    protected void layoutChildren(double x, double y, double w, double h) {
        super.layoutChildren(x, y, w, h);
        thumb.resizeRelocate(x + INSET, y + (h - THUMB) / 2, THUMB, THUMB);
    }
}
