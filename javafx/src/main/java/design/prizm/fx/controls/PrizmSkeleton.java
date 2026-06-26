package design.prizm.fx.controls;

import javafx.animation.FadeTransition;
import javafx.scene.layout.Region;
import javafx.util.Duration;

/**
 * A PRIZM loading placeholder — a muted block that pulses. {@link Region} with a
 * {@code bg-muted} fill (via the {@code .prizm-skeleton} rules in {@code prizm.css})
 * and an indefinite opacity pulse, mirroring the web {@code animate-pulse}. Size
 * it via the constructor or {@code setPrefSize}. Mirrors the React {@code Skeleton}
 * ({@code components/ui/skeleton.tsx}).
 */
public class PrizmSkeleton extends Region {

    public PrizmSkeleton() {
        init();
    }

    public PrizmSkeleton(double width, double height) {
        init();
        setMinSize(width, height);
        setPrefSize(width, height);
    }

    private void init() {
        getStyleClass().add("prizm-skeleton");
        var pulse = new FadeTransition(Duration.millis(1000), this);
        pulse.setFromValue(1.0);
        pulse.setToValue(0.4);
        pulse.setCycleCount(FadeTransition.INDEFINITE);
        pulse.setAutoReverse(true);
        pulse.play();
    }
}
