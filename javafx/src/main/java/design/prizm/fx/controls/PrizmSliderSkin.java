package design.prizm.fx.controls;

import javafx.scene.control.Slider;
import javafx.scene.control.skin.SliderSkin;
import javafx.scene.layout.Region;

/**
 * Slider skin that adds an accent-coloured fill from the track start to the
 * thumb — JavaFX's stock slider has no filled portion. The fill is a styled
 * {@code .prizm-slider-fill} {@link Region} so it themes via {@code prizm.css}.
 *
 * <p>Horizontal sliders only (the PRIZM use case).
 */
public class PrizmSliderSkin extends SliderSkin {

    private final Region fill = new Region();

    public PrizmSliderSkin(Slider slider) {
        super(slider);
        fill.getStyleClass().add("prizm-slider-fill");
        fill.setMouseTransparent(true);
        getChildren().add(fill);
        slider.valueProperty().addListener((obs, oldV, newV) -> slider.requestLayout());
    }

    @Override
    protected void layoutChildren(double x, double y, double w, double h) {
        super.layoutChildren(x, y, w, h);
        var track = getSkinnable().lookup(".track");
        var thumb = getSkinnable().lookup(".thumb");
        if (track == null || thumb == null) {
            fill.setVisible(false);
            return;
        }
        fill.setVisible(true);
        var trackBounds = track.getBoundsInParent();
        var thumbBounds = thumb.getBoundsInParent();
        double thumbCenterX = thumbBounds.getMinX() + thumbBounds.getWidth() / 2;
        double fillWidth = Math.max(0, thumbCenterX - trackBounds.getMinX());
        fill.resizeRelocate(trackBounds.getMinX(), trackBounds.getMinY(), fillWidth, trackBounds.getHeight());
        thumb.toFront();
    }
}
