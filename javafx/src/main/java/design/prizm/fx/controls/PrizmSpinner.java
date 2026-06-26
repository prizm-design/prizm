package design.prizm.fx.controls;

import javafx.animation.Interpolator;
import javafx.animation.RotateTransition;
import javafx.scene.layout.Region;
import javafx.scene.shape.Circle;
import javafx.scene.shape.StrokeLineCap;
import javafx.util.Duration;

/**
 * A PRIZM indeterminate loading indicator — a muted track ring with a rotating
 * 90° arc. JavaFX's stock {@link javafx.scene.control.ProgressIndicator} renders
 * indeterminate as a ring of spinning segments (Modena), which looks nothing
 * like the web spinner, so this is a custom {@link Region}: a track {@link Circle}
 * at 25% opacity plus an arc {@link Circle} (drawn via a stroke dash) rotated
 * continuously. Styled by the {@code .prizm-spinner} rules in {@code prizm.css}.
 * Mirrors the React {@code Spinner} ({@code components/ui/spinner.tsx}).
 */
public class PrizmSpinner extends Region {

    /** Diameter presets, mirroring the web sizes (px). */
    public enum Size {
        SM(12),
        MD(16),
        LG(24),
        XL(40);

        private final double px;

        Size(double px) {
            this.px = px;
        }

        public double px() {
            return px;
        }
    }

    private final Circle track = new Circle();
    private final Circle arc = new Circle();
    private final RotateTransition spin;
    private double diameter;

    public PrizmSpinner() {
        this(Size.MD);
    }

    public PrizmSpinner(Size size) {
        getStyleClass().add("prizm-spinner");

        track.getStyleClass().add("prizm-spinner__track");
        track.setManaged(false);
        track.setFill(null);

        arc.getStyleClass().add("prizm-spinner__arc");
        arc.setManaged(false);
        arc.setFill(null);
        arc.setStrokeLineCap(StrokeLineCap.ROUND);

        getChildren().addAll(track, arc);

        spin = new RotateTransition(Duration.millis(900), arc);
        spin.setByAngle(360);
        spin.setCycleCount(RotateTransition.INDEFINITE);
        spin.setInterpolator(Interpolator.LINEAR);
        spin.play();

        setSize(size);
    }

    /** Set the diameter from the PRIZM size scale. */
    public void setSize(Size size) {
        diameter = size.px();
        setMinSize(diameter, diameter);
        setPrefSize(diameter, diameter);
        setMaxSize(diameter, diameter);

        // ~12.5% of the diameter, matching the web stroke-width 3 on a 24 viewBox.
        double stroke = Math.max(1.5, diameter * 0.125);
        double radius = (diameter - stroke) / 2;
        double circumference = 2 * Math.PI * radius;

        track.setRadius(radius);
        track.setStrokeWidth(stroke);
        arc.setRadius(radius);
        arc.setStrokeWidth(stroke);
        // One quarter-circle dash, then a full-circumference gap → a single 90° arc.
        arc.getStrokeDashArray().setAll(circumference * 0.25, circumference);

        requestLayout();
    }

    @Override
    protected void layoutChildren() {
        double cx = getWidth() / 2;
        double cy = getHeight() / 2;
        track.setCenterX(cx);
        track.setCenterY(cy);
        arc.setCenterX(cx);
        arc.setCenterY(cy);
    }
}
